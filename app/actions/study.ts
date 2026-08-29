"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import {
  dailyTopics,
  chapterProgress,
  attempts,
  attemptAnswers,
  questions,
  flashcards,
} from "@/lib/db/schema";
import { requireUser, logActivity, todayIST } from "@/lib/auth";
import { and, eq } from "drizzle-orm";
import { getAllChapters, getTestWithQuestions } from "@/lib/queries";
import { syncPlanProgress } from "@/lib/plan-sync";
import {
  generateFlashcards,
  evaluateWrittenAnswer,
  evaluateWrittenPhoto,
} from "@/lib/ai";

export async function addDailyTopic(chapterId: number, note?: string) {
  const user = await requireUser();
  await db.insert(dailyTopics).values({
    userId: user.id,
    chapterId,
    forDate: todayIST(),
    note: note || null,
  });
  await logActivity(user.id, "topic");
  // studying a topic bumps its progress to at least in_progress
  await db
    .insert(chapterProgress)
    .values({ userId: user.id, chapterId, status: "in_progress" })
    .onConflictDoNothing({
      target: [chapterProgress.userId, chapterProgress.chapterId],
    });
  await syncPlanProgress(user.id);
  revalidatePath("/topics");
  revalidatePath("/planner");
  revalidatePath("/");
}

export async function removeDailyTopic(topicId: number) {
  const user = await requireUser();
  await db
    .delete(dailyTopics)
    .where(and(eq(dailyTopics.id, topicId), eq(dailyTopics.userId, user.id)));
  // recompute so any item this topic had ticked is released
  await syncPlanProgress(user.id);
  revalidatePath("/topics");
  revalidatePath("/planner");
}

export async function setChapterStatus(
  chapterId: number,
  status: "not_started" | "in_progress" | "done"
) {
  const user = await requireUser();
  await db
    .insert(chapterProgress)
    .values({ userId: user.id, chapterId, status, updatedAt: new Date() })
    .onConflictDoUpdate({
      target: [chapterProgress.userId, chapterProgress.chapterId],
      set: { status, updatedAt: new Date() },
    });
  await logActivity(user.id, "course");
  revalidatePath("/courses");
}

export type SubmitPayload = {
  testId: number;
  timeTakenSeconds: number;
  answers: {
    questionId: number;
    selectedIndex: number | null;
    textAnswer?: string | null;
    bookmarked: boolean;
    timeSpentSeconds?: number | null;
  }[];
};

export async function submitAttempt(payload: SubmitPayload) {
  const user = await requireUser();
  const data = await getTestWithQuestions(payload.testId);
  if (!data) throw new Error("Test not found");

  let score = 0;
  let maxScore = 0;
  let correct = 0;
  let incorrect = 0;
  let unattempted = 0;

  const rows = data.questions.map((q) => {
    maxScore += q.marks;
    const ans = payload.answers.find((a) => a.questionId === q.id);

    // Written answers are not machine-markable at submit time. They are stored
    // unscored and marked afterwards from the results screen, so a descriptive
    // paper reads as "awaiting marking" instead of scoring zero.
    if (q.kind === "descriptive") {
      const written = ans?.textAnswer?.trim() || null;
      if (!written) unattempted++;
      return {
        questionId: q.id,
        selectedIndex: null,
        isCorrect: null,
        marksAwarded: 0,
        bookmarked: ans?.bookmarked ?? false,
        textAnswer: written,
        scored: false,
        timeSpentSeconds: ans?.timeSpentSeconds ?? null,
      };
    }

    const sel = ans?.selectedIndex ?? null;
    let isCorrect: boolean | null = null;
    let awarded = 0;
    if (sel === null) {
      unattempted++;
    } else if (sel === q.correctIndex) {
      isCorrect = true;
      awarded = q.marks;
      correct++;
    } else {
      isCorrect = false;
      awarded = -q.negativeMarks;
      incorrect++;
    }
    score += awarded;
    return {
      questionId: q.id,
      selectedIndex: sel,
      isCorrect,
      marksAwarded: awarded,
      bookmarked: ans?.bookmarked ?? false,
      textAnswer: null,
      scored: true,
      timeSpentSeconds: ans?.timeSpentSeconds ?? null,
    };
  });

  const attempted = correct + incorrect;
  const accuracy = attempted > 0 ? (correct / attempted) * 100 : 0;

  const [attempt] = await db
    .insert(attempts)
    .values({
      testId: payload.testId,
      userId: user.id,
      submittedAt: new Date(),
      timeTakenSeconds: payload.timeTakenSeconds,
      score,
      maxScore,
      correctCount: correct,
      incorrectCount: incorrect,
      unattemptedCount: unattempted,
      accuracy,
    })
    .returning();

  if (rows.length > 0) {
    await db
      .insert(attemptAnswers)
      .values(rows.map((r) => ({ ...r, attemptId: attempt.id })));
  }
  await logActivity(user.id, "test");
  revalidatePath("/tests");
  revalidatePath("/analytics");
  return attempt.id;
}

// Recomputes an attempt's totals from its rows. Called after a written answer is
// marked, since descriptive marks land after submission.
async function recomputeAttempt(attemptId: number) {
  const rows = await db
    .select({
      marksAwarded: attemptAnswers.marksAwarded,
      isCorrect: attemptAnswers.isCorrect,
      selectedIndex: attemptAnswers.selectedIndex,
    })
    .from(attemptAnswers)
    .where(eq(attemptAnswers.attemptId, attemptId));

  const score = rows.reduce((s, r) => s + (r.marksAwarded ?? 0), 0);
  const correct = rows.filter((r) => r.isCorrect === true).length;
  const incorrect = rows.filter((r) => r.isCorrect === false).length;
  const attempted = correct + incorrect;
  await db
    .update(attempts)
    .set({
      score,
      correctCount: correct,
      incorrectCount: incorrect,
      accuracy: attempted > 0 ? (correct / attempted) * 100 : 0,
    })
    .where(eq(attempts.id, attemptId));
}

/** Mark a written answer by hand — she reads the model answer and awards herself. */
export async function scoreWritten(
  attemptId: number,
  questionId: number,
  marks: number
) {
  const user = await requireUser();
  const [attempt] = await db
    .select()
    .from(attempts)
    .where(and(eq(attempts.id, attemptId), eq(attempts.userId, user.id)));
  if (!attempt) throw new Error("Attempt not found");

  const [q] = await db.select().from(questions).where(eq(questions.id, questionId));
  if (!q) throw new Error("Question not found");
  const awarded = Math.max(0, Math.min(q.marks, marks));

  await db
    .update(attemptAnswers)
    .set({ marksAwarded: awarded, scored: true })
    .where(
      and(
        eq(attemptAnswers.attemptId, attemptId),
        eq(attemptAnswers.questionId, questionId)
      )
    );
  await recomputeAttempt(attemptId);
  revalidatePath(`/results/${attemptId}`);
  return awarded;
}

/** Mark a written answer with AI, against the stored model answer. */
export async function evaluateWritten(attemptId: number, questionId: number) {
  const user = await requireUser();
  const [attempt] = await db
    .select()
    .from(attempts)
    .where(and(eq(attempts.id, attemptId), eq(attempts.userId, user.id)));
  if (!attempt) throw new Error("Attempt not found");

  const [q] = await db.select().from(questions).where(eq(questions.id, questionId));
  if (!q) throw new Error("Question not found");

  const [ans] = await db
    .select()
    .from(attemptAnswers)
    .where(
      and(
        eq(attemptAnswers.attemptId, attemptId),
        eq(attemptAnswers.questionId, questionId)
      )
    );
  if (!ans?.textAnswer?.trim()) {
    throw new Error("Nothing written to evaluate — award marks by hand instead.");
  }

  const { marks, feedback } = await evaluateWrittenAnswer({
    question: q.text,
    modelAnswer: q.modelAnswer ?? "",
    keyPoints: q.keyPoints ?? [],
    maxMarks: q.marks,
    answer: ans.textAnswer,
  });

  const awarded = Math.max(0, Math.min(q.marks, marks));
  await db
    .update(attemptAnswers)
    .set({ marksAwarded: awarded, aiFeedback: feedback, scored: true })
    .where(eq(attemptAnswers.id, ans.id));
  await recomputeAttempt(attemptId);
  revalidatePath(`/results/${attemptId}`);
  return { marks: awarded, feedback };
}

/**
 * Mark from a photo of the answer sheet she actually handwrote. The image is
 * sent straight to the examiner and never stored — only the transcript, marks
 * and feedback are kept.
 */
export async function evaluateWrittenFromPhoto(
  attemptId: number,
  questionId: number,
  imageDataUrl: string
) {
  const user = await requireUser();
  if (!/^data:image\/(jpeg|png|webp);base64,/.test(imageDataUrl)) {
    throw new Error("That doesn't look like a photo — try again.");
  }

  const [attempt] = await db
    .select()
    .from(attempts)
    .where(and(eq(attempts.id, attemptId), eq(attempts.userId, user.id)));
  if (!attempt) throw new Error("Attempt not found");

  const [q] = await db.select().from(questions).where(eq(questions.id, questionId));
  if (!q) throw new Error("Question not found");

  const { transcript, marks, feedback } = await evaluateWrittenPhoto({
    question: q.text,
    modelAnswer: q.modelAnswer ?? "",
    keyPoints: q.keyPoints ?? [],
    maxMarks: q.marks,
    imageDataUrl,
  });

  const awarded = Math.max(0, Math.min(q.marks, marks));
  await db
    .update(attemptAnswers)
    .set({
      textAnswer: transcript,
      marksAwarded: awarded,
      aiFeedback: feedback,
      scored: true,
    })
    .where(
      and(
        eq(attemptAnswers.attemptId, attemptId),
        eq(attemptAnswers.questionId, questionId)
      )
    );
  await recomputeAttempt(attemptId);
  revalidatePath(`/results/${attemptId}`);
  return { marks: awarded, feedback, transcript };
}

export async function getOrGenerateFlashcards(chapterId: number) {
  await requireUser();
  const existing = await db
    .select()
    .from(flashcards)
    .where(eq(flashcards.chapterId, chapterId));
  if (existing.length > 0) return existing;

  const all = await getAllChapters();
  const ch = all.find((c) => c.id === chapterId);
  if (!ch) throw new Error("Chapter not found");
  const cards = await generateFlashcards({
    paperName: ch.paperName,
    chapterName: ch.name,
    count: 12,
  });
  if (cards.length === 0) return [];
  const inserted = await db
    .insert(flashcards)
    .values(cards.map((c) => ({ chapterId, front: c.front, back: c.back })))
    .returning();
  return inserted;
}

export async function generateChapterQuiz(chapterId: number) {
  const user = await requireUser();
  const all = await getAllChapters();
  const ch = all.find((c) => c.id === chapterId);
  if (!ch) throw new Error("Chapter not found");
  const { generateMCQs } = await import("@/lib/ai");
  const generated = await generateMCQs({
    paperName: ch.paperName,
    chapters: [{ id: ch.id, name: ch.name }],
    count: 8,
    difficulty: "practice level, mixed easy and medium",
  });
  if (generated.length === 0) throw new Error("Generation failed");
  await db.insert(questions).values(
    generated.map((q, i) => ({
      testId: null,
      chapterId,
      seq: i,
      text: q.text,
      options: q.options,
      correctIndex: q.correctIndex,
      marks: 1,
      negativeMarks: 0,
      explanation: q.explanation,
    }))
  );
  await logActivity(user.id, "course");
  revalidatePath(`/courses`);
}
