import { requireUser, todayIST } from "@/lib/auth";
import { logout } from "@/app/actions/auth";
import {
  getActivity,
  getRecentAttempts,
  getPapersWithProgress,
} from "@/lib/queries";
import { db, attemptAnswers, attempts } from "@/lib/db";
import { and, eq, isNotNull, sql } from "drizzle-orm";
import { LogoutIcon } from "@/components/icons";
import ActivityCalendar from "./ActivityCalendar";

export default async function ProfilePage() {
  const user = await requireUser();
  const [activity, recentAttempts, papers, [quizStats]] = await Promise.all([
    getActivity(user.id),
    getRecentAttempts(user.id, 100),
    getPapersWithProgress(user.id),
    db
      .select({
        solved: sql<number>`count(*)::int`,
      })
      .from(attemptAnswers)
      .innerJoin(attempts, eq(attemptAnswers.attemptId, attempts.id))
      .where(
        and(eq(attempts.userId, user.id), isNotNull(attemptAnswers.selectedIndex))
      ),
  ]);

  // streak: consecutive days with any activity, ending today or yesterday (IST)
  const activeDays = [...new Set(activity.map((a) => String(a.onDate)))].sort().reverse();
  let streak = 0;
  const today = todayIST();
  const cursor = new Date(`${today}T00:00:00+05:30`);
  if (activeDays.length > 0 && activeDays[0] !== today) {
    cursor.setDate(cursor.getDate() - 1); // allow streak ending yesterday
  }
  for (;;) {
    const key = cursor.toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });
    if (activeDays.includes(key)) {
      streak++;
      cursor.setDate(cursor.getDate() - 1);
    } else break;
  }

  const coursesStarted = papers.filter((p) => p.doneChapters > 0).length;

  return (
    <main className="fade-up px-5">
      <header className="pt-safe py-4">
        <span className="text-xs font-bold bg-accent-soft text-accent rounded-full px-3 py-1.5">
          Premium Plan ›
        </span>
      </header>

      <section className="flex items-center gap-4">
        <span className="w-16 h-16 rounded-full bg-gradient-to-br from-[#e8b98a] via-[#cfd8b8] to-[#8fb8a8]" />
        <div className="flex-1">
          <h1 className="font-bold text-xl">{user.name}</h1>
          <p className="text-sm text-muted">{user.email}</p>
        </div>
        <form action={logout}>
          <button
            aria-label="Log out"
            className="w-11 h-11 rounded-full bg-surface border border-line flex items-center justify-center"
          >
            <LogoutIcon className="w-5 h-5" />
          </button>
        </form>
      </section>

      <section className="mt-6 rounded-3xl bg-surface border border-line p-5">
        <h2 className="font-bold">Learning Activity</h2>
        <ActivityCalendar
          activity={activity.map((a) => ({ date: String(a.onDate), kind: a.kind }))}
          streak={streak}
        />
      </section>

      <section className="mt-6">
        <h2 className="font-bold text-lg mb-3">Overview Metrics</h2>
        <div className="grid grid-cols-2 gap-3">
          <div className="rounded-3xl bg-surface border border-line p-4">
            <p className="text-xs text-muted">🔥 Current streak</p>
            <p className="font-display text-3xl mt-1">
              {streak} <span className="text-base text-muted">days</span>
            </p>
          </div>
          <div className="rounded-3xl bg-surface border border-line p-4">
            <p className="text-xs text-muted">📋 Tests attempted</p>
            <p className="font-display text-3xl mt-1">{recentAttempts.length}</p>
          </div>
          <div className="rounded-3xl bg-surface border border-line p-4">
            <p className="text-xs text-muted">📚 Courses active</p>
            <p className="font-display text-3xl mt-1">
              {coursesStarted}
              <span className="text-base text-muted">/{papers.length}</span>
            </p>
          </div>
          <div className="rounded-3xl bg-surface border border-line p-4">
            <p className="text-xs text-muted">🧠 Questions solved</p>
            <p className="font-display text-3xl mt-1">{quizStats?.solved ?? 0}</p>
          </div>
        </div>
      </section>

      <p className="text-center text-xs text-muted py-8">
        Mimus · made with ❤️ for {user.name}
      </p>
    </main>
  );
}
