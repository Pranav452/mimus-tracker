// "Daily 5" — five questions, five minutes, built from the chapters on today's
// plan. It draws ONLY from questions already in the bank (hand-reviewed tests,
// mocks and the authored chapter bank) and never generates new ones on the fly:
// an unreviewed question with a wrong key teaches wrong law, and she is resitting
// a paper she missed by five marks.
//
// What gets picked, in order of preference:
//   1. questions from today's chapters she got wrong or skipped last time
//   2. ones she has never seen
//   3. ones she got right but took over a minute on
// One slot is always held for a "comeback" — her most recent wrong answer from
// any chapter — so mistakes return until they stop being mistakes.
import { db } from "./db";
import {
  attemptAnswers,
  attempts,
  planItems,
  questions,
  tests,
} from "./db/schema";
import { and, asc, eq, isNotNull, isNull, like } from "drizzle-orm";

const SIZE = 5;
const TITLE_PREFIX = "Daily 5";

type History = { correct: boolean; skipped: boolean; secs: number | null; at: number };

const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 160);

export async function findDailyFive(today: string) {
  const [existing] = await db
    .select({ id: tests.id })
    .from(tests)
    .where(and(eq(tests.scheduledFor, today), like(tests.title, `${TITLE_PREFIX}%`)))
    .limit(1);
  return existing?.id ?? null;
}

export async function getOrCreateDailyFive(userId: number, today: string) {
  const existing = await findDailyFive(today);
  if (existing) return existing;

  const [items, bank, answered] = await Promise.all([
    db.select().from(planItems).where(eq(planItems.userId, userId)),
    db
      .select()
      .from(questions)
      .where(
        and(
          eq(questions.kind, "mcq"),
          isNull(questions.sourceQuestionId), // originals only, never copies
          isNotNull(questions.chapterId),
          isNotNull(questions.correctIndex)
        )
      ),
    db
      .select({
        questionId: questions.id,
        sourceId: questions.sourceQuestionId,
        isCorrect: attemptAnswers.isCorrect,
        selectedIndex: attemptAnswers.selectedIndex,
        secs: attemptAnswers.timeSpentSeconds,
        at: attempts.submittedAt,
      })
      .from(attemptAnswers)
      .innerJoin(attempts, eq(attemptAnswers.attemptId, attempts.id))
      .innerJoin(questions, eq(attemptAnswers.questionId, questions.id))
      .where(eq(attempts.userId, userId))
      .orderBy(asc(attempts.submittedAt)),
  ]);

  // her latest result per ORIGINAL question (a copy's history counts for its source)
  const history = new Map<number, History>();
  for (const a of answered) {
    history.set(a.sourceId ?? a.questionId, {
      correct: a.isCorrect === true,
      skipped: a.selectedIndex === null,
      secs: a.secs,
      at: a.at ? new Date(a.at).getTime() : 0,
    });
  }

  // which chapters matter today, nearest first
  const dayMs = 86_400_000;
  const t0 = Date.parse(`${today}T00:00:00+05:30`);
  const tier = new Map<number, number>();
  for (const it of items) {
    const age = Math.round((t0 - Date.parse(`${String(it.onDate)}T00:00:00+05:30`)) / dayMs);
    if (age < 0) continue; // not studied yet
    const rank = age === 0 ? 0 : age <= 7 ? 1 : 2;
    for (const c of it.chapterIds ?? []) {
      if (!tier.has(c) || tier.get(c)! > rank) tier.set(c, rank);
    }
  }

  const weight = (id: number) => {
    const h = history.get(id);
    if (!h) return 2; // never seen
    if (!h.correct) return 3; // wrong or skipped last time
    if ((h.secs ?? 0) > 60) return 1.5; // right, but slow
    return 0.2; // right and fast — leave it alone unless nothing else is left
  };

  // one candidate per distinct question text (mocks reuse some questions)
  const seen = new Set<string>();
  const pool = bank
    .filter((q) => {
      const k = norm(q.text);
      if (seen.has(k)) return false;
      seen.add(k);
      return true;
    })
    .map((q) => ({
      q,
      tier: tier.get(q.chapterId!) ?? 3,
      w: weight(q.id),
      r: Math.random(),
    }))
    .sort((a, b) => a.tier - b.tier || b.w - a.w || a.r - b.r);

  const picked: typeof pool = [];
  const perChapter = new Map<number, number>();
  const take = (c: (typeof pool)[number]) => {
    picked.push(c);
    perChapter.set(c.q.chapterId!, (perChapter.get(c.q.chapterId!) ?? 0) + 1);
  };

  // the comeback slot: her most recent miss, wherever it came from
  const comeback = pool
    .filter((c) => {
      const h = history.get(c.q.id);
      return h && !h.correct;
    })
    .sort((a, b) => history.get(b.q.id)!.at - history.get(a.q.id)!.at)[0];

  // spread across chapters first (max 2 each), then relax if the bank is thin
  for (const cap of [2, SIZE]) {
    for (const c of pool) {
      if (picked.length >= SIZE - (comeback ? 1 : 0)) break;
      if (picked.includes(c) || c === comeback) continue;
      if ((perChapter.get(c.q.chapterId!) ?? 0) >= cap) continue;
      take(c);
    }
  }
  if (comeback) take(comeback);
  if (picked.length === 0) throw new Error("The question bank is empty.");

  // shuffle so the comeback is not always last
  picked.sort(() => Math.random() - 0.5);

  const label = new Date(`${today}T00:00:00+05:30`).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    timeZone: "Asia/Kolkata",
  });
  const [test] = await db
    .insert(tests)
    .values({
      title: `${TITLE_PREFIX} — ${label}`,
      paperId: null,
      scheduledFor: today,
      durationMinutes: SIZE,
      status: "published",
      createdBy: userId,
    })
    .returning();

  await db.insert(questions).values(
    picked.map((c, i) => ({
      testId: test.id,
      chapterId: c.q.chapterId,
      section: TITLE_PREFIX,
      seq: i,
      kind: "mcq" as const,
      text: c.q.text,
      options: c.q.options,
      correctIndex: c.q.correctIndex,
      marks: 1,
      negativeMarks: 0,
      explanation: c.q.explanation,
      sourceQuestionId: c.q.id,
    }))
  );
  return test.id;
}
