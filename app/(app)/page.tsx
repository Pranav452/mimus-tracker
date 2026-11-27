import Link from "next/link";
import Image from "next/image";
import TopBar from "@/components/TopBar";
import { requireUser, todayIST } from "@/lib/auth";
import {
  getPapersWithProgress,
  getRecentAttempts,
  getAllChapters,
  getReferenceCounts,
} from "@/lib/queries";
import { db } from "@/lib/db";
import { dailyTopics, planItems } from "@/lib/db/schema";
import { and, asc, eq } from "drizzle-orm";
import { findNightTest } from "@/lib/night-test";
import {
  nextExam,
  DAILY_HABIT_TITLE,
  NIGHT_TEST_SIZE,
  PLAN_START,
  DAYS_OFF,
  DAY_NOTES,
} from "@/lib/exam";
import NightTestButton from "@/components/NightTestButton";
import TodayLog from "@/components/TodayLog";
import { ChevronRightIcon, SparkleIcon } from "@/components/icons";

const soft: Record<string, string> = {
  green: "bg-green-soft",
  blue: "bg-blue-soft",
  lav: "bg-lav-soft",
};

const kindTag: Record<string, { label: string; cls: string }> = {
  study: { label: "Study", cls: "bg-blue-soft text-blue" },
  revise: { label: "Revise", cls: "bg-lav-soft text-lav" },
  practice: { label: "Practice", cls: "bg-green-soft text-green" },
  test: { label: "Test", cls: "bg-accent-soft text-accent" },
  exam: { label: "EXAM", cls: "bg-red-soft text-red" },
  holiday: { label: "Day off", cls: "bg-accent-soft text-accent" },
};

// plan rows with no chapter of their own ("DT rapid revision: all 13 chapters")
// still deserve somewhere to study from: the paper they belong to
function paperOf(title: string): { slug: string; label: string } | null {
  if (/^(DT|GST|Tax)\b/.test(title)) return { slug: "tax", label: "Taxation" };
  if (/^Law\b/.test(title)) return { slug: "law", label: "Law" };
  if (/^Accounts\b/.test(title)) return { slug: "accounts", label: "Accounts" };
  return null;
}

const short = (name: string) => name.split("—")[0].trim();

function fmtDate(d: string | Date | null) {
  if (!d) return "";
  return new Date(d).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

const chip =
  "text-[12px] font-semibold rounded-full px-2.5 py-1 bg-surface border border-line";

export default async function HomePage() {
  const user = await requireUser();
  const today = todayIST();
  // one round of queries, all in parallel — the syllabus and the per-chapter
  // counts come from the in-process cache
  const [papers, allAttempts, loggedRows, todaysPlan, nightId, chapters, refs] =
    await Promise.all([
      getPapersWithProgress(user.id),
      getRecentAttempts(user.id, 100),
      db
        .select({ id: dailyTopics.id, chapterId: dailyTopics.chapterId })
        .from(dailyTopics)
        .where(and(eq(dailyTopics.userId, user.id), eq(dailyTopics.forDate, today)))
        .orderBy(asc(dailyTopics.id)),
      db
        .select()
        .from(planItems)
        .where(and(eq(planItems.userId, user.id), eq(planItems.onDate, today)))
        .orderBy(asc(planItems.sort)),
      findNightTest(today),
      getAllChapters(),
      getReferenceCounts(),
    ]);

  const chapterById = new Map(chapters.map((c) => [c.id, c]));
  const attemptByTest = new Map<number, (typeof allAttempts)[number]>();
  for (const a of allAttempts) if (!attemptByTest.has(a.testId)) attemptByTest.set(a.testId, a);
  const attempts = allAttempts.slice(0, 3);
  const nightAttempt = nightId ? attemptByTest.get(nightId) : undefined;

  const exam = nextExam(today);
  const dayOff = DAYS_OFF[today];
  const dayNote = DAY_NOTES[today];
  const planStartLabel =
    today < PLAN_START
      ? new Date(`${PLAN_START}T00:00:00+05:30`).toLocaleDateString("en-IN", {
          weekday: "long",
          day: "numeric",
          month: "long",
          timeZone: "Asia/Kolkata",
        })
      : null;
  const planRows = todaysPlan
    .filter((i) => i.title !== DAILY_HABIT_TITLE)
    .map((i) => ({
      ...i,
      refs: [...new Set([...(i.chapterIds ?? []), ...(i.refChapterIds ?? [])])]
        .map((id) => chapterById.get(id))
        .filter((c): c is NonNullable<typeof c> => !!c),
    }));
  const plannedChapters = [
    ...new Map(planRows.flatMap((r) => r.refs).map((c) => [c.id, c])).values(),
  ];
  const logged = loggedRows
    .map((l) => ({ ...l, chapter: chapterById.get(l.chapterId) }))
    .filter((l) => l.chapter)
    .map((l) => ({ id: l.id, chapterId: l.chapterId, name: short(l.chapter!.name) }));
  const loggedCount = new Set(logged.map((l) => l.chapterId)).size;
  const lawChanged = plannedChapters.some(
    (c) => c.paperSlug === "tax" || c.paperSlug === "law"
  );
  const todayLabel = new Date(`${today}T00:00:00+05:30`).toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
    timeZone: "Asia/Kolkata",
  });

  return (
    <main className="fade-up">
      <TopBar />

      <section className="px-5">
        <div className="flex items-end justify-between gap-3">
          <h1 className="font-display text-[30px] leading-tight">
            Hello, <span className="italic text-muted">{user.name}</span>
          </h1>
          {exam && (
            <span className="mb-1.5 text-[11px] font-bold bg-accent-soft text-accent rounded-full px-2.5 py-1 whitespace-nowrap">
              {exam.days === 0
                ? `${exam.paper} today`
                : `${exam.days} day${exam.days === 1 ? "" : "s"} to ${exam.paper}`}
            </span>
          )}
        </div>

        {dayNote && (
          <div className="mt-4 rounded-3xl p-5 bg-gradient-to-br from-[#f3c98f] to-[#d9b8e8] border border-line">
            <p className="font-display text-[24px] leading-snug text-white drop-shadow-sm">
              {dayNote}
            </p>
          </div>
        )}

        {dayOff && (
          <div className="mt-4 rounded-3xl p-6 text-center bg-gradient-to-br from-[#f3c98f] to-[#d9b8e8] border border-line">
            <p className="font-display text-[30px] leading-tight text-white drop-shadow-sm">
              {dayOff.title}
            </p>
            <p className="mt-2 text-sm text-white/95">{dayOff.body}</p>
          </div>
        )}

        {/* 1 — what to study today, with something to study it from */}
        {!dayOff && (
        <div className="mt-4 rounded-3xl bg-surface border border-line p-5">
          <p className="text-xs font-bold uppercase tracking-wide text-muted">
            Today&apos;s plan · {todayLabel}
          </p>

          {planRows.length > 0 ? (
            <ul className="mt-3 space-y-5">
              {planRows.map((i) => {
                const tag = kindTag[i.kind];
                const testAttempt = i.testId ? attemptByTest.get(i.testId) : undefined;
                const paper = i.refs.length === 0 && !i.testId ? paperOf(i.title) : null;
                return (
                  <li key={i.id}>
                    <div className="flex items-start gap-2.5">
                      <span
                        className={`mt-[7px] w-2 h-2 rounded-full shrink-0 ${
                          i.done ? "bg-green" : "bg-line"
                        }`}
                      />
                      <div className="min-w-0 flex-1">
                        <p
                          className={`text-[15px] font-semibold leading-snug ${
                            i.done ? "line-through text-muted" : ""
                          }`}
                        >
                          {i.title}
                        </p>
                        {i.subtitle && (
                          <p className="text-xs text-muted leading-snug mt-0.5">
                            {i.subtitle}
                          </p>
                        )}
                      </div>
                      {tag && (
                        <span
                          className={`shrink-0 text-[10px] font-bold rounded-full px-2 py-0.5 ${tag.cls}`}
                        >
                          {tag.label}
                        </span>
                      )}
                    </div>

                    {i.refs.length > 0 && (
                      <div className="mt-2.5 ml-[18px] space-y-2">
                        {i.refs.map((c) => {
                          const base = `/courses/${c.paperSlug}/${c.id}`;
                          const nCards = refs.cards.get(c.id) ?? 0;
                          const nQuiz = refs.quiz.get(c.id) ?? 0;
                          return (
                            <div key={c.id} className="rounded-2xl bg-surface-2 px-3.5 py-3">
                              <p className="text-[13px] font-semibold leading-snug">
                                {c.name}
                              </p>
                              <div className="mt-2 flex flex-wrap gap-1.5">
                                {refs.notes.has(c.id) && (
                                  <Link href={base} className={chip}>
                                    Notes
                                  </Link>
                                )}
                                {nCards > 0 && (
                                  <Link href={`${base}?tab=cards`} className={chip}>
                                    Flashcards · {nCards}
                                  </Link>
                                )}
                                {nQuiz > 0 && (
                                  <Link href={`${base}?tab=quiz`} className={chip}>
                                    Practice Qs · {nQuiz}
                                  </Link>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {i.testId && (
                      <Link
                        href={testAttempt ? `/results/${testAttempt.id}` : `/exam/${i.testId}`}
                        className="mt-2.5 ml-[18px] flex items-center justify-between rounded-2xl bg-surface-2 px-3.5 py-3 text-[13px] font-semibold"
                      >
                        {testAttempt
                          ? `Done — ${testAttempt.score}/${testAttempt.maxScore} · Review`
                          : "Open this test"}
                        <ChevronRightIcon className="w-4 h-4 text-muted" />
                      </Link>
                    )}

                    {paper && (
                      <Link
                        href={`/courses/${paper.slug}`}
                        className="mt-2.5 ml-[18px] flex items-center justify-between rounded-2xl bg-surface-2 px-3.5 py-3 text-[13px] font-semibold"
                      >
                        {paper.label} chapters — notes, flashcards, practice
                        <ChevronRightIcon className="w-4 h-4 text-muted" />
                      </Link>
                    )}
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="mt-3 text-sm text-muted">
              {planStartLabel
                ? `Your plan starts on ${planStartLabel}.`
                : "Nothing planned for today."}
            </p>
          )}

          <div className="mt-4 flex items-center justify-between text-sm font-semibold text-muted">
            <Link href="/planner" className="underline underline-offset-4">
              Full plan
            </Link>
            {lawChanged && (
              <Link href="/changes" className="underline underline-offset-4">
                What changed for January
              </Link>
            )}
          </div>
        </div>

        )}

        {/* 2 — tonight: log the day, then the test on it */}
        {!dayOff && (
        <div className="mt-3 rounded-3xl bg-surface border border-line p-5">
          <p className="text-xs font-bold uppercase tracking-wide text-muted">Tonight</p>

          <p className="mt-3 font-semibold text-[15px]">1 · Log what you studied</p>
          <p className="text-xs text-muted mt-0.5 mb-3">
            Tap what you actually did — it ticks your plan and decides tonight&apos;s test.
          </p>
          <TodayLog
            suggestions={plannedChapters.map((c) => ({ chapterId: c.id, name: short(c.name) }))}
            logged={logged}
          />

          <p className="mt-5 font-semibold text-[15px]">2 · Night test</p>
          <p className="text-xs text-muted mt-0.5 mb-3">
            {nightAttempt
              ? "Done for today. Go through the ones you missed."
              : loggedCount > 0
                ? `${NIGHT_TEST_SIZE} questions on the ${loggedCount} chapter${
                    loggedCount === 1 ? "" : "s"
                  } you logged, plus one you got wrong before.`
                : "Log first — otherwise it is built from today's plan."}
          </p>
          {nightAttempt ? (
            <Link
              href={`/results/${nightAttempt.id}`}
              className="flex items-center justify-between rounded-2xl bg-green-soft border border-green/30 px-4 py-3.5"
            >
              <span className="font-semibold text-[15px]">
                Night test — {nightAttempt.score}/{nightAttempt.maxScore}
              </span>
              <span className="text-sm font-semibold underline underline-offset-4">
                Review
              </span>
            </Link>
          ) : (
            <NightTestButton size={NIGHT_TEST_SIZE} />
          )}
        </div>
        )}

        <div className="mt-3 grid grid-cols-2 gap-3">
          {[
            { href: "/explanations", icon: "📖", title: "Explanations", sub: "Notes with worked sums" },
            { href: "/courses", icon: "🗂️", title: "Courses", sub: "Every chapter" },
            { href: "/planner", icon: "🗓️", title: "Planner", sub: "Road to January" },
            { href: "/analytics", icon: "📈", title: "Analytics", sub: "Weak and strong chapters" },
          ].map((t) => (
            <Link
              key={t.href}
              href={t.href}
              className="rounded-2xl px-4 py-4 bg-surface border border-line"
            >
              <p className="text-xl">{t.icon}</p>
              <p className="font-semibold mt-1.5">{t.title}</p>
              <p className="text-xs text-muted mt-0.5">{t.sub}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mt-8 px-5">
        <h2 className="text-xl font-bold">Your courses</h2>
        <p className="text-sm text-muted">Courses you&apos;ve worked on recently</p>
      </section>
      <div className="mt-4 flex gap-3 overflow-x-auto no-scrollbar px-5">
        {papers.map((p) => (
          <Link
            key={p.id}
            href={`/courses/${p.slug}`}
            className={`shrink-0 w-56 rounded-3xl p-5 ${soft[p.color] ?? "bg-surface-2"} border border-line`}
          >
            <div className="flex items-start justify-between">
              <div className="w-14 h-14 rounded-2xl overflow-hidden bg-surface/70">
                <Image src={p.image} alt="" width={56} height={56} className="object-cover w-full h-full" />
              </div>
              <span className="text-[11px] font-bold bg-surface rounded-full px-2.5 py-1">
                {p.tag}
              </span>
            </div>
            <p className="mt-5 font-bold text-lg leading-snug">{p.name}</p>
            <div className="mt-4 pt-3 border-t border-dashed border-foreground/15 flex items-center justify-between text-sm">
              <span className="text-muted">
                {p.doneChapters}/{p.totalChapters} chapters
              </span>
              <ChevronRightIcon className="w-4 h-4 text-muted" />
            </div>
          </Link>
        ))}
      </div>

      <section className="mt-8 px-5">
        <h2 className="text-xl font-bold">Recent done tests</h2>
        <p className="text-sm text-muted">See your performance on recent tests</p>
        <div className="mt-4 space-y-3">
          {attempts.length === 0 && (
            <div className="rounded-3xl bg-surface border border-line p-6 text-center">
              <Image
                src="/assets/05-empty-no-data.png"
                alt=""
                width={120}
                height={120}
                className="mx-auto mb-3 rounded-2xl"
              />
              <p className="font-semibold">No tests yet</p>
              <p className="text-sm text-muted">
                Your tests will appear here once they&apos;re published.
              </p>
            </div>
          )}
          {attempts.map((a) => (
            <Link
              key={a.id}
              href={`/results/${a.id}`}
              className="block rounded-3xl bg-surface border border-line p-5"
            >
              <span className="inline-flex items-center gap-1.5 text-xs text-muted bg-surface-2 rounded-lg px-2.5 py-1">
                📅 {fmtDate(a.submittedAt)}
              </span>
              <p className="mt-3 font-bold text-lg">{a.title}</p>
              <div className="mt-3 pt-3 border-t border-dashed border-line flex gap-5 text-sm">
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-green" />
                  Marks: <b>{a.score}</b>
                  <span className="text-muted">/{a.maxScore}</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-accent" />
                  Accuracy: <b>{(a.accuracy ?? 0).toFixed(1)}%</b>
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      <Link href="/chat" className="mx-5 mt-6 mb-4 flex items-center gap-3 rounded-3xl p-5 bg-gradient-to-br from-[#f3c98f] to-[#d9b8e8] border border-line">
        <SparkleIcon className="w-8 h-8 text-white" strokeWidth={1.4} />
        <div>
          <p className="font-bold text-white drop-shadow-sm">Have any doubts?</p>
          <p className="text-sm text-white/90">
            Ask Mimus anything — AS, sections, GST, numericals.
          </p>
        </div>
      </Link>

      <p className="text-center text-xs text-muted pb-4">
        Made with ❤️ for Mimansha
      </p>
    </main>
  );
}
