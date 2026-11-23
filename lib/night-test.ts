// The night test — ten questions, ten minutes, on what she actually studied.
//
// She logs the day's chapters on the home screen; this builds the test from
// them. It draws ONLY from questions already in the bank (hand-reviewed tests,
// mocks and the authored chapter bank) and never generates new ones on the fly:
// an unreviewed question with a wrong key teaches wrong law, and she is resitting
// a paper she missed by five marks.
//
// Which chapters, nearest first:
//   0. chapters she logged today
//   1. today's plan (in case she has not logged yet)
//   2. anything logged or planned in the last week
//   3. earlier in this plan      4. everything else
// Within a chapter: wrong or skipped last time, then never seen, then right but
// slow. One slot is always held for a "comeback" — her most recent wrong answer
// from any chapter — so mistakes return until they stop being mistakes.
//
// NOT server-only: scripts import this too.
import { db } from "./db";
import {
  attemptAnswers,
  attempts,
  dailyTopics,
  planItems,
  questions,
  tests,
} from "./db/schema";
import { and, asc, eq, isNotNull, isNull, like } from "drizzle-orm";
import { NIGHT_TEST_PREFIX, NIGHT_TEST_SIZE } from "./exam";

const SIZE = NIGHT_TEST_SIZE;

type History = { correct: boolean; skipped: boolean; secs: number | null; at: number };

const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, "").slice(0, 160);

export async function findNightTest(today: string) {
  const [existing] = await db
    .select({ id: tests.id })
    .from(tests)
    .where(and(eq(tests.scheduledFor, today), like(tests.title, `${NIGHT_TEST_PREFIX}%`)))
    .limit(1);
  return existing?.id ?? null;
}

export async function getOrCreateNightTest(userId: number, today: string) {
  const existing = await findNightTest(today);
  if (existing) return existing;

  const [items, topics, bank, answered] = await Promise.all([
    db.select().from(planItems).where(eq(planItems.userId, userId)),
    db
      .select({ chapterId: dailyTopics.chapterId, forDate: dailyTopics.forDate })
      .from(dailyTopics)
      .where(eq(dailyTopics.userId, userId)),
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

  const dayMs = 86_400_000;
  const t0 = Date.parse(`${today}T00:00:00+05:30`);
  const ageOf = (d: unknown) =>
    Math.round((t0 - Date.parse(`${String(d)}T00:00:00+05:30`)) / dayMs);
  const tier = new Map<number, number>();
  const rank = (chapterId: number, r: number) => {
    if (!tier.has(chapterId) || tier.get(chapterId)! > r) tier.set(chapterId, r);
  };
  for (const t of topics) {
    const age = ageOf(t.forDate);
    if (age < 0) continue;
    rank(t.chapterId, age === 0 ? 0 : age <= 7 ? 2 : 3);
  }
  for (const it of items) {
    const age = ageOf(it.onDate);
    if (age < 0) continue; // not reached yet
    const r = age === 0 ? 1 : age <= 7 ? 2 : 3;
    for (const c of [...(it.chapterIds ?? []), ...(it.refChapterIds ?? [])]) rank(c, r);
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
      tier: tier.get(q.chapterId!) ?? 4,
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
  const slots = SIZE - (comeback ? 1 : 0);

  // share the test evenly between tonight's chapters, then relax if the bank
  // for them is thin (some AS chapters have only one or two questions)
  const tonight = [...tier.values()].filter((r) => r === Math.min(...tier.values())).length;
  const fair = Math.max(2, Math.ceil(slots / Math.max(1, tonight)));
  for (const cap of [fair, SIZE]) {
    for (const c of pool) {
      if (picked.length >= slots) break;
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
      title: `${NIGHT_TEST_PREFIX} — ${label}`,
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
      section: NIGHT_TEST_PREFIX,
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
