import Link from "next/link";
import { todayIST } from "@/lib/auth";
import { getStudentTopicsForDate, getDraftTests } from "@/lib/queries";
import { db, users, attempts, tests } from "@/lib/db";
import { and, desc, eq, isNotNull } from "drizzle-orm";
import TestRowActions from "./TestRowActions";

export default async function AdminDashboard() {
  const today = todayIST();
  const [topics, allTests, students] = await Promise.all([
    getStudentTopicsForDate(today),
    getDraftTests(),
    db.select().from(users).where(eq(users.role, "student")),
  ]);
  const recentAttempts = await db
    .select({
      id: attempts.id,
      score: attempts.score,
      maxScore: attempts.maxScore,
      accuracy: attempts.accuracy,
      submittedAt: attempts.submittedAt,
      title: tests.title,
    })
    .from(attempts)
    .innerJoin(tests, eq(attempts.testId, tests.id))
    .where(isNotNull(attempts.submittedAt))
    .orderBy(desc(attempts.submittedAt))
    .limit(5);

  return (
    <main className="px-5 fade-up space-y-7">
      <section>
        <h1 className="font-display text-3xl">
          Tonight&apos;s <span className="italic text-muted">prep</span>
        </h1>
        <p className="text-sm text-muted mt-1">
          What {students.map((s) => s.name).join(", ") || "your student"} studied
          today —{" "}
          {new Date(`${today}T00:00:00+05:30`).toLocaleDateString("en-IN", {
            day: "numeric",
            month: "long",
          })}
        </p>
        <div className="mt-4 rounded-3xl bg-surface border border-line divide-y divide-line overflow-hidden">
          {topics.length === 0 && (
            <p className="p-5 text-sm text-muted">
              Nothing logged yet today. Topics she adds show up here.
            </p>
          )}
          {topics.map((t) => (
            <div key={t.id} className="px-5 py-4">
              <p className="font-semibold text-[15px]">{t.chapterName}</p>
              <p className="text-xs text-muted mt-0.5">
                {t.paperName}
                {t.note ? ` · “${t.note}”` : ""}
              </p>
            </div>
          ))}
        </div>
        {topics.length > 0 && (
          <Link
            href={`/admin/create?chapters=${[...new Set(topics.map((t) => t.chapterId))].join(",")}`}
            className="mt-3 flex items-center justify-center h-13 py-3.5 rounded-full bg-foreground text-background font-semibold"
          >
            ✨ Make tonight&apos;s test from these
          </Link>
        )}
      </section>

      <section>
        <h2 className="font-bold text-lg mb-3">Tests</h2>
        <div className="space-y-3">
          {allTests.length === 0 && (
            <p className="rounded-3xl bg-surface border border-line p-5 text-sm text-muted">
              No tests yet — create your first one.
            </p>
          )}
          {allTests.map((t) => (
            <div key={t.id} className="rounded-3xl bg-surface border border-line p-5">
              <div className="flex items-center justify-between gap-3">
                <div className="min-w-0">
                  <p className="font-bold truncate">{t.title}</p>
                  <p className="text-xs text-muted mt-0.5">
                    {t.questionCount} Qs · {t.durationMinutes} min
                    {t.paperName ? ` · ${t.paperName}` : ""}
                    {t.scheduledFor
                      ? ` · for ${new Date(String(t.scheduledFor)).toLocaleDateString("en-IN", { day: "numeric", month: "short" })}`
                      : ""}
                  </p>
                </div>
                <span
                  className={`shrink-0 text-[11px] font-bold rounded-full px-2.5 py-1 ${
                    t.status === "published"
                      ? "bg-green-soft text-green"
                      : "bg-accent-soft text-accent"
                  }`}
                >
                  {t.status}
                </span>
              </div>
              <TestRowActions testId={t.id} status={t.status} />
            </div>
          ))}
        </div>
      </section>

      <section className="pb-6">
        <h2 className="font-bold text-lg mb-3">Recent attempts</h2>
        <div className="space-y-2.5">
          {recentAttempts.length === 0 && (
            <p className="rounded-3xl bg-surface border border-line p-5 text-sm text-muted">
              No attempts yet.
            </p>
          )}
          {recentAttempts.map((a) => (
            <div
              key={a.id}
              className="flex items-center justify-between rounded-2xl bg-surface border border-line px-4 py-3.5"
            >
              <div>
                <p className="font-semibold text-[15px]">{a.title}</p>
                <p className="text-xs text-muted">
                  {new Date(a.submittedAt!).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                  })}
                </p>
              </div>
              <p className="text-sm">
                <b>{a.score}</b>
                <span className="text-muted">/{a.maxScore}</span>{" "}
                <span className="text-green font-semibold ml-2">
                  {(a.accuracy ?? 0).toFixed(0)}%
                </span>
              </p>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
