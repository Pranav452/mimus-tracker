// The attempt she is preparing for. One place, so the planner seed, the home
// countdown and the copy can never disagree about the dates.
// Source: ICAI Intermediate Examination January 2027 guide (2–5 PM IST).
export const ATTEMPT = "January 2027";

export const EXAMS = [
  { key: "accounts", paper: "Accounts", date: "2027-01-02" },
  { key: "law", paper: "Law", date: "2027-01-04" },
  { key: "tax", paper: "Tax", date: "2027-01-06" },
] as const;

// First day of the plan. Topics logged before it never tick a plan row.
export const PLAN_START = "2026-12-01";

// Days with nothing scheduled. The home screen swaps the plan for the message.
export const DAYS_OFF: Record<string, { title: string; body: string }> = {
  "2026-12-09": {
    title: "Happy Birthday, Mimansha 🎂",
    body: "Day off. No plan, no test — go and enjoy it.",
  },
};

// A line shown at the top of the home screen on a given day.
export const DAY_NOTES: Record<string, string> = {
  "2026-12-08": "Tomorrow is your birthday 🎂 mwah 💋",
};

// the row that closes every study day: log what was done, then the night test
export const DAILY_HABIT_TITLE = "Log the day + night test";
export const NIGHT_TEST_PREFIX = "Night test";
export const NIGHT_TEST_SIZE = 10;

/** The next paper still ahead of `today` (YYYY-MM-DD, IST), with days to go. */
export function nextExam(today: string) {
  const t = Date.parse(`${today}T00:00:00+05:30`);
  for (const e of EXAMS) {
    const days = Math.round((Date.parse(`${e.date}T00:00:00+05:30`) - t) / 86_400_000);
    if (days >= 0) return { ...e, days };
  }
  return null;
}
