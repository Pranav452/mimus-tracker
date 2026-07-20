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
import { generateFlashcards } from "@/lib/ai";

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
  revalidatePath("/topics");
  revalidatePath("/");
}

export async function removeDailyTopic(topicId: number) {
  const user = await requireUser();
  await db
    .delete(dailyTopics)
    .where(and(eq(dailyTopics.id, topicId), eq(dailyTopics.userId, user.id)));
  revalidatePath("/topics");
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
  answers: { questionId: number; selectedIndex: number | null; bookmarked: boolean }[];
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
