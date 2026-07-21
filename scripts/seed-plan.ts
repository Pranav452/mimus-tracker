// Generates Mimansha's day-by-day plan: 22 Jul → exams.
// Her constraints (21 Jul): finish Law (15 ch) + max DT before Aug;
// Income Tax is her weakest → heaviest revision weight; exams per EXAM_DATES.
// Re-run safe: wipes and re-inserts all plan items for the student.
import { config } from "dotenv";
config({ path: ".env.local" });

import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { eq } from "drizzle-orm";
import * as schema from "../lib/db/schema";

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql, { schema });
const STUDENT_ID = 1;

// ICAI Group I timetable for Sept 2026 (confirmed with Pranav)
const EXAM_DATES = {
  accounts: "2026-09-01",
  law: "2026-09-03",
  tax: "2026-09-06",
};

type Item = { d: string; t: string; s?: string; k: "study" | "revise" | "practice" | "test" | "exam" };
const P: Item[] = [];
const add = (d: string, t: string, k: Item["k"], s?: string) => P.push({ d, t, k, s });

// ---- Phase 1 · 22–31 Jul: Law complete + DT max (evening test daily) ----
const lawPairs: [string, string?][] = [
  ["Preliminary Law (intro)", "Incorporation of Companies"],
  ["Prospectus & Allotment of Shares", "Shares and Debentures"],
  ["Acceptance of Deposits", "Registration of Charges"],
  ["Management & Administration", undefined], // heavy chapter, alone
  ["Declaration of Dividends (quick revise — done 20 Jul)", "Accounts of Companies"],
  ["Audit and Auditors", undefined],
  ["Companies Incorporated outside India", "LLP Act, 2008"],
  ["General Clauses Act, 1897", "Interpretation of Statutes"],
  ["FEMA (quick revise — done 20 Jul)", "Law: weak-spot sweep of the 15"],
  ["Law: full-syllabus rapid recap day", undefined],
];
const dtDaily = [
  "DT: Salary (with ₹75k std deduction + new perquisite limits)",
  "DT: House Property",
  "DT: PGBP — part 1 (depreciation, 43B)",
  "DT: PGBP — part 2 + presumptive (44AD/ADA)",
  "DT: Capital Gains (54EC new bonds, all exemptions)",
  "DT: Other Sources + Clubbing",
  "DT: Set-off & Carry Forward",
  "DT: Basics + Residential Status (quick — you know this)",
  "DT: TDS/TCS + Advance Tax with NEW FA-2025 thresholds",
  "DT: Deductions + Return revisit (87A ₹12L/₹60k, 139(8A) 48 months)",
];
const jul = (n: number) => `2026-07-${String(n).padStart(2, "0")}`;
for (let i = 0; i < 10; i++) {
  const d = jul(22 + i);
  const [a, b] = lawPairs[i];
  add(d, `Law: ${a}`, "study", "morning block");
  if (b) add(d, `Law: ${b}`, "study", "midday block");
  add(d, dtDaily[i], "study", "afternoon block — weakest subject, don't skip");
  add(d, "Attempt tonight's test in the app", "test", "Pranav publishes it from your logged topics");
}

// ---- Phase 2 · 1–14 Aug: Income Tax deep revision + GST 2.0 pass ----
const aug = (n: number) => `2026-08-${String(n).padStart(2, "0")}`;
const itLoop = [
  "IT revision: full computation drills — new regime slabs (₹4L steps)",
  "IT revision: Salary + HP mixed problems",
  "IT revision: PGBP problem marathon",
  "IT revision: Capital Gains + exemptions drills",
  "IT revision: OS, Clubbing, Set-off mixed MCQs",
  "IT revision: Deductions 80C→80U speed sheet",
  "IT revision: TDS/TCS thresholds memorise (NEW figures) + Returns",
];
const gstPairs = [
  "GST: Intro + Supply",
  "GST: Charge (new 5/18/40 rates!) + Composition/RCM",
  "GST: Place + Time of Supply",
  "GST: Value of Supply + Exemptions (insurance now exempt)",
  "GST: ITC (full chapter — scoring)",
  "GST: Registration + Invoice/Credit-Debit notes",
  "GST: E-way bill, Accounts & Records, Payment, TDS/TCS, Returns",
];
for (let i = 0; i < 14; i++) {
  const d = aug(1 + i);
  add(d, itLoop[i % 7], "revise", "Income Tax priority block");
  if (i % 2 === 0) add(d, gstPairs[i / 2], "study", "GST with 2.0 rates");
  else add(d, "Practice: chapter quiz in app on today's topics", "practice");
  if (i % 3 === 2) add(d, "Timed test in app (Tax mix)", "test");
}
add(aug(14), "Read the 'What changed' page fully — lock the new figures", "revise");

// ---- Phase 3 · 15–24 Aug: Accounts + keep IT warm ----
const acctDays = [
  "Accounts: Buyback (revise — strong already) + Internal Reconstruction",
  "Accounts: Company Final Accounts + managerial remuneration",
  "Accounts: Amalgamation",
  "Accounts: Consolidation — part 1",
  "Accounts: Consolidation — part 2 + Investment A/cs (AS 13)",
  "Accounts: Cash Flow (AS 3) + Branch Accounts",
  "AS sweep: AS 1, 2, 4, 5, 7, 9, 10",
  "AS sweep: AS 11, 12, 15, 16, 17, 18 (17/18 done 20 Jul — quick)",
  "AS sweep: AS 19, 20, 22, 24, 25, 26",
  "AS sweep: AS 28, 29 + full AS one-pager recap",
];
for (let i = 0; i < 10; i++) {
  const d = aug(15 + i);
  add(d, acctDays[i], "revise", "Accounts block");
  add(d, "30-min IT problem set (keep the muscle warm)", "practice", "non-negotiable — weakest subject");
  if (i % 3 === 1) add(d, "Timed test in app", "test");
}

// ---- Phase 4 · 25–31 Aug: mocks + weak loops ----
const mockWeek: [string, string, Item["k"]][] = [
  [aug(25), "Full mock: Advanced Accounting (3 hrs, exam conditions)", "test"],
  [aug(26), "Mock review + patch weak Accounts topics", "revise"],
  [aug(27), "Full mock: Corporate & Other Laws (3 hrs)", "test"],
  [aug(28), "Mock review + Law section-writing practice (sections language)", "revise"],
  [aug(29), "Full mock: Taxation (3 hrs)", "test"],
  [aug(30), "Mock review + IT weak-loop + GST rate recheck", "revise"],
  [aug(31), "Light day: 'What changed' page + formula/threshold sheets only", "revise"],
];
for (const [d, t, k] of mockWeek) add(d, t, k);

// ---- Exams ----
add(EXAM_DATES.accounts, "📝 EXAM — Paper 1: Advanced Accounting (2–5 PM)", "exam", "reach by 1 PM, carry calculator");
add("2026-09-02", "Gap day: Law high-yield recap (Dividends, Deposits, Audit, LLP)", "revise");
add(EXAM_DATES.law, "📝 EXAM — Paper 2: Corporate & Other Laws (2–5 PM)", "exam");
add("2026-09-04", "Gap day 1: Income Tax — full computation drill + thresholds sheet", "revise");
add("2026-09-05", "Gap day 2: GST rates recheck (5/18/40) + ITC + light evening, sleep early", "revise");
add(EXAM_DATES.tax, "📝 EXAM — Paper 3: Taxation (2–5 PM)", "exam", "you've got this 💛");

async function main() {
  await db.delete(schema.planItems).where(eq(schema.planItems.userId, STUDENT_ID));
  await db.insert(schema.planItems).values(
    P.map((p, i) => ({
      userId: STUDENT_ID,
      onDate: p.d,
      title: p.t,
      subtitle: p.s ?? null,
      kind: p.k,
      sort: i,
    }))
  );
  console.log(`Seeded ${P.length} plan items from 2026-07-22 to ${EXAM_DATES.tax}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
