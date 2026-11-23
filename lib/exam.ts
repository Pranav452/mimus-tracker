// The attempt she is preparing for. One place, so the planner seed, the home
// countdown and the copy can never disagree about the dates.
// Source: ICAI Intermediate Examination January 2027 guide (2–5 PM IST).
export const ATTEMPT = "January 2027";

export const EXAMS = [
  { key: "accounts", paper: "Accounts", date: "2027-01-02" },
  { key: "law", paper: "Law", date: "2027-01-04" },
  { key: "tax", paper: "Tax", date: "2027-01-06" },
] as const;

export const DAILY_HABIT_TITLE = "Daily 5 + today's flashcards";

/** The next paper still ahead of `today` (YYYY-MM-DD, IST), with days to go. */
export function nextExam(today: string) {
  const t = Date.parse(`${today}T00:00:00+05:30`);
  for (const e of EXAMS) {
    const days = Math.round((Date.parse(`${e.date}T00:00:00+05:30`) - t) / 86_400_000);
    if (days >= 0) return { ...e, days };
  }
  return null;
}
