import Link from "next/link";
import Image from "next/image";
import TopBar from "@/components/TopBar";
import { requireUser, todayIST } from "@/lib/auth";
import {
  getPapersWithProgress,
  getRecentAttempts,
  getTopicsForDate,
  getAllChapters,
} from "@/lib/queries";
import { db } from "@/lib/db";
import { attempts as attemptsTable, planItems } from "@/lib/db/schema";
import { and, asc, eq, isNotNull } from "drizzle-orm";
import { findDailyFive } from "@/lib/daily-five";
import { nextExam, DAILY_HABIT_TITLE } from "@/lib/exam";
import DailyFiveButton from "@/components/DailyFiveButton";
import { BookIcon, ChevronRightIcon, SparkleIcon, PlusIcon } from "@/components/icons";

const soft: Record<string, string> = {
  green: "bg-green-soft",
  blue: "bg-blue-soft",
  lav: "bg-lav-soft",
};

function fmtDate(d: string | Date | null) {
  if (!d) return "";
  return new Date(d).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export default async function HomePage() {
  const user = await requireUser();
  const today = todayIST();
  const [papers, attempts, topics, todaysPlan, dailyId, chapters] = await Promise.all([
    getPapersWithProgress(user.id),
    getRecentAttempts(user.id, 3),
    getTopicsForDate(user.id, today),
    db
      .select()
      .from(planItems)
      .where(and(eq(planItems.userId, user.id), eq(planItems.onDate, today)))
      .orderBy(asc(planItems.sort)),
    findDailyFive(today),
    getAllChapters(),
  ]);

  // has she already taken today's five?
  const [dailyAttempt] = dailyId
    ? await db
        .select()
        .from(attemptsTable)
        .where(
          and(
            eq(attemptsTable.testId, dailyId),
            eq(attemptsTable.userId, user.id),
            isNotNull(attemptsTable.submittedAt)
          )
        )
        .limit(1)
    : [];

  const exam = nextExam(today);
  const planRows = todaysPlan.filter((i) => i.title !== DAILY_HABIT_TITLE);
  const todaysChapters = [...new Set(todaysPlan.flatMap((i) => i.chapterIds ?? []))]
    .map((id) => chapters.find((c) => c.id === id))
    .filter((c): c is NonNullable<typeof c> => !!c);
  const todayLabel = new Date(`${today}T00:00:00+05:30`).toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
    timeZone: "Asia/Kolkata",
  });

  return (
    <main className="fade-up">
      <TopBar />

      <section className="px-5 pt-2">
        <h1 className="font-display text-[44px] leading-[1.05]">
          Hello
          <br />
          <span className="italic text-muted">{user.name}</span>
        </h1>

        <div className="mt-6 rounded-3xl bg-surface border border-line p-5">
          <div className="flex items-center justify-between gap-3">
            <p className="text-xs font-bold uppercase tracking-wide text-muted">
              Today · {todayLabel}
            </p>
            {exam && (
              <span className="text-[11px] font-bold bg-accent-soft text-accent rounded-full px-2.5 py-1 whitespace-nowrap">
                {exam.days === 0
                  ? `${exam.paper} today`
                  : `${exam.days} day${exam.days === 1 ? "" : "s"} to ${exam.paper}`}
              </span>
            )}
          </div>

          {planRows.length > 0 ? (
            <ul className="mt-3 space-y-2.5">
              {planRows.map((i) => (
                <li key={i.id} className="flex gap-2.5">
                  <span
                    className={`mt-[7px] w-2 h-2 rounded-full shrink-0 ${
                      i.done ? "bg-green" : "bg-line"
                    }`}
                  />
                  <div className="min-w-0">
                    <p
                      className={`text-[15px] font-semibold leading-snug ${
                        i.done ? "line-through text-muted" : ""
                      }`}
                    >
                      {i.title}
                    </p>
                    {i.subtitle && !i.done && (
                      <p className="text-xs text-muted leading-snug mt-0.5">
                        {i.subtitle}
                      </p>
                    )}
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-3 text-sm text-muted">Nothing planned for today.</p>
          )}

          <div className="mt-4">
            {dailyAttempt ? (
              <Link
                href={`/results/${dailyAttempt.id}`}
                className="flex items-center justify-between rounded-2xl bg-green-soft border border-green/30 px-4 py-3.5"
              >
                <span className="font-semibold text-[15px]">
                  Daily 5 done — {dailyAttempt.score}/{dailyAttempt.maxScore}
                </span>
                <span className="text-sm font-semibold underline underline-offset-4">
                  Review
                </span>
              </Link>
            ) : (
              <DailyFiveButton />
            )}
          </div>

          {todaysChapters.length > 0 && (
            <div className="mt-4">
              <p className="text-xs font-bold uppercase tracking-wide text-muted mb-2">
                Flashcards for today
              </p>
              <div className="flex flex-wrap gap-1.5">
                {todaysChapters.map((c) => (
                  <Link
                    key={c.id}
                    href={`/courses/${c.paperSlug}/${c.id}?tab=cards`}
                    className="text-xs font-semibold bg-lav-soft text-lav rounded-full px-3 py-1.5"
                  >
                    {c.name.split("—")[0].trim()}
                  </Link>
                ))}
              </div>
            </div>
          )}

          <Link
            href="/planner"
            className="mt-4 block text-center text-sm font-semibold text-muted underline underline-offset-4"
          >
            Open the full plan
          </Link>
        </div>

        <Link
          href="/explanations"
          className="mt-3 flex items-center justify-center gap-2 h-14 rounded-full bg-surface-2 border border-line font-semibold text-[15px]"
        >
          <BookIcon className="w-5 h-5" strokeWidth={2} />
          Explanations
        </Link>

        <Link
          href="/courses"
          className="mt-3 flex items-center justify-between rounded-2xl px-5 py-4 bg-surface border border-line"
        >
          <div>
            <p className="font-semibold">Your courses</p>
            <p className="text-sm text-muted">Chapters, quizzes &amp; flashcards</p>
          </div>
          <ChevronRightIcon className="w-5 h-5 text-muted" />
        </Link>

        <Link
          href="/analytics"
          className="mt-3 flex items-center justify-between rounded-2xl px-5 py-4 bg-gradient-to-r from-[#f6e6d8] via-[#e7e3f0] to-[#dcebf3] border border-line"
        >
          <div>
            <p className="font-semibold">See your Analytics</p>
            <p className="text-sm text-muted">Check how&apos;s your performance</p>
          </div>
          <ChevronRightIcon className="w-5 h-5 text-muted" />
        </Link>

        <Link
          href="/topics"
          className="mt-3 flex items-center justify-between rounded-2xl px-5 py-4 bg-surface border border-line"
        >
          <div>
            <p className="font-semibold">Today&apos;s study plan</p>
            <p className="text-sm text-muted">
              {topics.length > 0
                ? `${topics.length} topic${topics.length > 1 ? "s" : ""} logged — nice!`
                : "Tell Mimus what you're studying today"}
            </p>
          </div>
          <span className="w-9 h-9 rounded-full bg-accent-soft flex items-center justify-center">
            <PlusIcon className="w-5 h-5 text-accent" strokeWidth={2.2} />
          </span>
        </Link>

        <div className="mt-3 grid grid-cols-2 gap-3">
          <Link
            href="/planner"
            className="rounded-2xl px-4 py-4 bg-surface border border-line"
          >
            <p className="text-xl">🗓️</p>
            <p className="font-semibold mt-1.5">Planner</p>
            <p className="text-xs text-muted mt-0.5">Road to January</p>
          </Link>
          <Link
            href="/changes"
            className="rounded-2xl px-4 py-4 bg-surface border border-line"
          >
            <p className="text-xl">🔁</p>
            <p className="font-semibold mt-1.5">What changed</p>
            <p className="text-xs text-muted mt-0.5">The law for January</p>
          </Link>
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
