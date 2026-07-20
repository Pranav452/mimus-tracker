import "server-only";
import { db } from "@/lib/db";
import {
  papers,
  parts,
  chapters,
  chapterProgress,
  tests,
  questions,
  attempts,
  attemptAnswers,
  dailyTopics,
  activityLog,
  users,
} from "@/lib/db/schema";
import { and, desc, eq, inArray, isNotNull, sql } from "drizzle-orm";

export type ChapterRow = {
  id: number;
  number: number;
  name: string;
  partId: number;
  partLabel: string;
  partName: string | null;
  paperId: number;
  paperName: string;
  paperSlug: string;
};

export async function getAllChapters(): Promise<ChapterRow[]> {
  return db
    .select({
      id: chapters.id,
      number: chapters.number,
      name: chapters.name,
      partId: parts.id,
      partLabel: parts.label,
      partName: parts.name,
      paperId: papers.id,
      paperName: papers.name,
      paperSlug: papers.slug,
    })
    .from(chapters)
    .innerJoin(parts, eq(chapters.partId, parts.id))
    .innerJoin(papers, eq(parts.paperId, papers.id))
    .orderBy(papers.number, parts.sort, chapters.number);
}

export async function getPapers() {
  return db.select().from(papers).orderBy(papers.number);
}

export async function getPapersWithProgress(userId: number) {
  const allPapers = await getPapers();
  const chapterRows = await getAllChapters();
  const progress = await db
    .select()
    .from(chapterProgress)
    .where(eq(chapterProgress.userId, userId));
  return allPapers.map((p) => {
    const chs = chapterRows.filter((c) => c.paperId === p.id);
    const done = chs.filter((c) =>
      progress.find((pr) => pr.chapterId === c.id && pr.status === "done")
    ).length;
    return { ...p, totalChapters: chs.length, doneChapters: done };
  });
}

export async function getPublishedTests(userId: number) {
  const rows = await db
    .select({
      id: tests.id,
      title: tests.title,
      scheduledFor: tests.scheduledFor,
      durationMinutes: tests.durationMinutes,
      paperId: tests.paperId,
      paperName: papers.name,
      paperSlug: papers.slug,
      createdAt: tests.createdAt,
    })
    .from(tests)
    .leftJoin(papers, eq(tests.paperId, papers.id))
    .where(eq(tests.status, "published"))
    .orderBy(desc(tests.createdAt));

  const myAttempts = await db
    .select()
    .from(attempts)
    .where(and(eq(attempts.userId, userId), isNotNull(attempts.submittedAt)))
    .orderBy(desc(attempts.submittedAt));

  return rows.map((t) => ({
    ...t,
    attempt: myAttempts.find((a) => a.testId === t.id) ?? null,
  }));
}

export async function getRecentAttempts(userId: number, limit = 10) {
  return db
    .select({
      id: attempts.id,
      testId: attempts.testId,
      score: attempts.score,
      maxScore: attempts.maxScore,
      accuracy: attempts.accuracy,
      submittedAt: attempts.submittedAt,
      title: tests.title,
      paperSlug: papers.slug,
      paperName: papers.name,
    })
    .from(attempts)
    .innerJoin(tests, eq(attempts.testId, tests.id))
    .leftJoin(papers, eq(tests.paperId, papers.id))
    .where(and(eq(attempts.userId, userId), isNotNull(attempts.submittedAt)))
    .orderBy(desc(attempts.submittedAt))
    .limit(limit);
}

export async function getTestWithQuestions(testId: number) {
  const [test] = await db.select().from(tests).where(eq(tests.id, testId));
  if (!test) return null;
  const qs = await db
    .select()
    .from(questions)
    .where(eq(questions.testId, testId))
    .orderBy(questions.seq, questions.id);
  return { test, questions: qs };
}

export async function getAttemptDetail(attemptId: number, userId: number) {
  const [attempt] = await db
    .select()
    .from(attempts)
    .where(and(eq(attempts.id, attemptId), eq(attempts.userId, userId)));
  if (!attempt) return null;
  const [test] = await db.select().from(tests).where(eq(tests.id, attempt.testId));
  const qs = await db
    .select()
    .from(questions)
    .where(eq(questions.testId, attempt.testId))
    .orderBy(questions.seq, questions.id);
  const answers = await db
    .select()
    .from(attemptAnswers)
    .where(eq(attemptAnswers.attemptId, attemptId));
  return { attempt, test, questions: qs, answers };
}

// per-chapter accuracy across all submitted attempts — powers suggestions
export async function getChapterAccuracy(userId: number) {
  const rows = await db
    .select({
      chapterId: questions.chapterId,
      total: sql<number>`count(*)::int`,
      correct: sql<number>`sum(case when ${attemptAnswers.isCorrect} then 1 else 0 end)::int`,
    })
    .from(attemptAnswers)
    .innerJoin(attempts, eq(attemptAnswers.attemptId, attempts.id))
    .innerJoin(questions, eq(attemptAnswers.questionId, questions.id))
    .where(
      and(
        eq(attempts.userId, userId),
        isNotNull(attempts.submittedAt),
        isNotNull(questions.chapterId),
        isNotNull(attemptAnswers.selectedIndex)
      )
    )
    .groupBy(questions.chapterId);
  return rows.filter((r) => r.chapterId !== null) as {
    chapterId: number;
    total: number;
    correct: number;
  }[];
}

export async function getActivity(userId: number) {
  return db
    .select()
    .from(activityLog)
    .where(eq(activityLog.userId, userId))
    .orderBy(desc(activityLog.onDate));
}

export async function getTopicsForDate(userId: number, forDate: string) {
  return db
    .select({
      id: dailyTopics.id,
      note: dailyTopics.note,
      chapterId: dailyTopics.chapterId,
      chapterName: chapters.name,
      paperName: papers.name,
      paperSlug: papers.slug,
    })
    .from(dailyTopics)
    .innerJoin(chapters, eq(dailyTopics.chapterId, chapters.id))
    .innerJoin(parts, eq(chapters.partId, parts.id))
    .innerJoin(papers, eq(parts.paperId, papers.id))
    .where(and(eq(dailyTopics.userId, userId), eq(dailyTopics.forDate, forDate)))
    .orderBy(dailyTopics.createdAt);
}

export async function getRecentTopics(userId: number, limit = 40) {
  return db
    .select({
      id: dailyTopics.id,
      forDate: dailyTopics.forDate,
      note: dailyTopics.note,
      chapterId: dailyTopics.chapterId,
      chapterName: chapters.name,
      paperName: papers.name,
      paperSlug: papers.slug,
    })
    .from(dailyTopics)
    .innerJoin(chapters, eq(dailyTopics.chapterId, chapters.id))
    .innerJoin(parts, eq(chapters.partId, parts.id))
    .innerJoin(papers, eq(parts.paperId, papers.id))
    .where(eq(dailyTopics.userId, userId))
    .orderBy(desc(dailyTopics.forDate), desc(dailyTopics.createdAt))
    .limit(limit);
}

export async function getChapterQuiz(chapterId: number) {
  return db
    .select()
    .from(questions)
    .where(and(eq(questions.chapterId, chapterId), sql`${questions.testId} is null`))
    .orderBy(questions.id);
}

export async function getUserProgressMap(userId: number) {
  const rows = await db
    .select()
    .from(chapterProgress)
    .where(eq(chapterProgress.userId, userId));
  return new Map(rows.map((r) => [r.chapterId, r.status]));
}

export async function getSectionPerformance(attemptId: number) {
  const rows = await db
    .select({
      section: questions.section,
      marks: questions.marks,
      isCorrect: attemptAnswers.isCorrect,
      selectedIndex: attemptAnswers.selectedIndex,
      marksAwarded: attemptAnswers.marksAwarded,
    })
    .from(attemptAnswers)
    .innerJoin(questions, eq(attemptAnswers.questionId, questions.id))
    .where(eq(attemptAnswers.attemptId, attemptId));
  return rows;
}

export async function getDraftTests() {
  return db
    .select({
      id: tests.id,
      title: tests.title,
      status: tests.status,
      scheduledFor: tests.scheduledFor,
      durationMinutes: tests.durationMinutes,
      paperName: papers.name,
      createdAt: tests.createdAt,
      questionCount: sql<number>`(select count(*)::int from ${questions} where ${questions.testId} = ${tests.id})`,
    })
    .from(tests)
    .leftJoin(papers, eq(tests.paperId, papers.id))
    .orderBy(desc(tests.createdAt));
}

// admin view: what the student(s) logged for a given day
export async function getStudentTopicsForDate(forDate: string) {
  return db
    .select({
      id: dailyTopics.id,
      note: dailyTopics.note,
      chapterId: dailyTopics.chapterId,
      chapterName: chapters.name,
      paperName: papers.name,
      studentName: users.name,
    })
    .from(dailyTopics)
    .innerJoin(users, eq(dailyTopics.userId, users.id))
    .innerJoin(chapters, eq(dailyTopics.chapterId, chapters.id))
    .innerJoin(parts, eq(chapters.partId, parts.id))
    .innerJoin(papers, eq(parts.paperId, papers.id))
    .where(and(eq(dailyTopics.forDate, forDate), eq(users.role, "student")))
    .orderBy(dailyTopics.createdAt);
}

export async function getChaptersByIds(ids: number[]) {
  if (ids.length === 0) return [];
  return db.select().from(chapters).where(inArray(chapters.id, ids));
}
