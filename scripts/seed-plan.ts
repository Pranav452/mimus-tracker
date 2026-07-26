// Generates Mimansha's day-by-day plan: 22 Jul → exams.
// Her constraints (21 Jul): finish Law (15 ch) + max DT before Aug;
// Income Tax is her weakest → heaviest revision weight; exams per EXAM_DATES.
//
// Each item may declare the chapters it covers (`ch`). Those links let
// lib/plan-sync.ts auto-tick the item when she logs a matching daily topic.
// Multi-chapter grind days (AS sweeps, recaps) deliberately have no links —
// they're ticked by hand, since one logged topic doesn't finish them.
//
// Re-run safe, but note: re-seeding REBUILDS all items, so manual ticks are
// lost. Auto-ticks are restored automatically by the sync at the end.
import { config } from "dotenv";
config({ path: ".env.local" });

import { eq } from "drizzle-orm";
import * as schema from "../lib/db/schema";
import { syncPlanProgress } from "../lib/plan-sync";
import { db } from "../lib/db";
const STUDENT_ID = 1;

// ICAI Group I timetable for Sept 2026 (confirmed with Pranav)
const EXAM_DATES = {
  accounts: "2026-09-01",
  law: "2026-09-03",
  tax: "2026-09-06",
};

type Kind = "study" | "revise" | "practice" | "test" | "exam";
type Item = { d: string; t: string; s?: string; k: Kind; ch?: string[] };
const P: Item[] = [];
const add = (d: string, t: string, k: Kind, s?: string, ch?: string[]) =>
  P.push({ d, t, k, s, ch });

// chapter shorthands (must match seeded names exactly — validated below)
const C = {
  prelim: "Introduction — Preliminary Law",
  incorp: "Incorporation of Companies",
  prospectus: "Prospectus and Allotment of Shares",
  shares: "Shares and Debentures",
  deposits: "Acceptance of Deposits by Companies",
  charge: "Registration of Charge",
  mgmt: "Management and Administration",
  dividends: "Declaration of Dividends",
  accountsOfCo: "Accounts of Companies",
  audit: "Audit and Auditors",
  foreignCo: "Companies Incorporated outside India",
  llp: "Limited Liability Partnership Act, 2008",
  genClauses: "General Clauses Act, 1897",
  fema: "Foreign Exchange Management Act, 1999",
  interpretation: "Interpretation of Statutes",

  basics: "Basics of Income Tax",
  residential: "Residential Status",
  salary: "Income from Salary",
  houseProp: "Income from House Property",
  pgbp: "Profits and Gains from Business or Profession",
  capGains: "Capital Gains",
  otherSources: "Income from Other Sources",
  setOff: "Set off and Carry Forward of Losses",
  deductions: "Deductions",
  advanceTax: "Advance Tax, TDS and TCS",
  returnOfIncome: "Return of Income",
  clubbing: "Clubbing of Income",
  computation: "Computation of Total Income",

  gstIntro: "Introduction to GST",
  supply: "Supply under GST",
  charge2: "Charge of GST (Levy, Composition, RCM)",
  placeOfSupply: "Place of Supply",
  timeOfSupply: "Time of Supply",
  valueOfSupply: "Value of Supply",
  exemptions: "Exemptions from GST",
  itc: "Input Tax Credit",
  registration: "Registration",
  invoice: "Tax Invoice, Credit and Debit Notes",
  records: "Accounts and Records",
  eway: "E-way Bill",
  payment: "Payment of Tax",
  gstTds: "TDS and TCS under GST",
  returns: "Returns",

  buyback: "Buyback of Shares",
  finalAccounts: "Company Final Accounts",
  investment: "Investment Accounts (AS 13)",
  cashFlow: "Cash Flow Statement (AS 3)",
  consolidation: "Consolidation",
  amalgamation: "Amalgamation",
  reconstruction: "Internal Reconstruction",
  branch: "Branch Accounts",
};

// ---- Phase 1 · 22–31 Jul: Law complete + DT max (evening test daily) ----
const lawDays: { a: [string, string[]]; b?: [string, string[]] }[] = [
  { a: ["Preliminary Law (intro)", [C.prelim]], b: ["Incorporation of Companies", [C.incorp]] },
  { a: ["Prospectus & Allotment of Shares", [C.prospectus]], b: ["Shares and Debentures", [C.shares]] },
  { a: ["Acceptance of Deposits", [C.deposits]], b: ["Registration of Charge", [C.charge]] },
  { a: ["Management & Administration", [C.mgmt]] }, // heavy chapter, alone
  { a: ["Declaration of Dividends (quick revise — done 20 Jul)", [C.dividends]], b: ["Accounts of Companies", [C.accountsOfCo]] },
  { a: ["Audit and Auditors", [C.audit]] },
  { a: ["Companies Incorporated outside India", [C.foreignCo]], b: ["LLP Act, 2008", [C.llp]] },
  { a: ["General Clauses Act, 1897", [C.genClauses]], b: ["Interpretation of Statutes", [C.interpretation]] },
  { a: ["FEMA (quick revise — done 20 Jul)", [C.fema]], b: ["Weak-spot sweep of the 15", []] },
  { a: ["Full-syllabus rapid recap day", []] },
];
const dtDaily: [string, string[]][] = [
  ["DT: Salary (with ₹75k std deduction + new perquisite limits)", [C.salary]],
  ["DT: House Property", [C.houseProp]],
  ["DT: PGBP — part 1 (depreciation, 43B)", [C.pgbp]],
  ["DT: PGBP — part 2 + presumptive (44AD/ADA)", []], // same chapter as part 1
  ["DT: Capital Gains (54EC new bonds, all exemptions)", [C.capGains]],
  ["DT: Other Sources + Clubbing", [C.otherSources, C.clubbing]],
  ["DT: Set-off & Carry Forward", [C.setOff]],
  ["DT: Basics + Residential Status (quick — you know this)", [C.basics, C.residential]],
  ["DT: TDS/TCS + Advance Tax with NEW FA-2025 thresholds", [C.advanceTax]],
  ["DT: Deductions + Return revisit (87A ₹12L/₹60k, 139(8A) 48 months)", [C.deductions, C.returnOfIncome]],
];
const jul = (n: number) => `2026-07-${String(n).padStart(2, "0")}`;
for (let i = 0; i < 10; i++) {
  const d = jul(22 + i);
  const day = lawDays[i];
  add(d, `Law: ${day.a[0]}`, "study", "morning block", day.a[1]);
  if (day.b) add(d, `Law: ${day.b[0]}`, "study", "midday block", day.b[1]);
  const [dtTitle, dtCh] = dtDaily[i];
  add(d, dtTitle, "study", "afternoon block — weakest subject, don't skip", dtCh);
  add(d, "Attempt tonight's test in the app", "test", "Pranav publishes it from your logged topics");
}

// ---- Phase 2 · 1–14 Aug: Income Tax deep revision + GST 2.0 pass ----
const aug = (n: number) => `2026-08-${String(n).padStart(2, "0")}`;
const itLoop: [string, string[]][] = [
  ["IT revision: full computation drills — new regime slabs (₹4L steps)", [C.computation]],
  ["IT revision: Salary + HP mixed problems", [C.salary, C.houseProp]],
  ["IT revision: PGBP problem marathon", [C.pgbp]],
  ["IT revision: Capital Gains + exemptions drills", [C.capGains]],
  ["IT revision: OS, Clubbing, Set-off mixed MCQs", [C.otherSources, C.clubbing, C.setOff]],
  ["IT revision: Deductions 80C→80U speed sheet", [C.deductions]],
  ["IT revision: TDS/TCS thresholds memorise (NEW figures) + Returns", [C.advanceTax, C.returnOfIncome]],
];
const gstPairs: [string, string[]][] = [
  ["GST: Intro + Supply", [C.gstIntro, C.supply]],
  ["GST: Charge (new 5/18/40 rates!) + Composition/RCM", [C.charge2]],
  ["GST: Place + Time of Supply", [C.placeOfSupply, C.timeOfSupply]],
  ["GST: Value of Supply + Exemptions (insurance now exempt)", [C.valueOfSupply, C.exemptions]],
  ["GST: ITC (full chapter — scoring)", [C.itc]],
  ["GST: Registration + Invoice/Credit-Debit notes", [C.registration, C.invoice]],
  ["GST: E-way bill, Accounts & Records, Payment, TDS/TCS, Returns", [C.eway, C.records, C.payment, C.gstTds, C.returns]],
];
for (let i = 0; i < 14; i++) {
  const d = aug(1 + i);
  const [itTitle, itCh] = itLoop[i % 7];
  add(d, itTitle, "revise", "Income Tax priority block", itCh);
  if (i % 2 === 0) {
    const [gTitle, gCh] = gstPairs[i / 2];
    add(d, gTitle, "study", "GST with 2.0 rates", gCh);
  } else {
    add(d, "Practice: chapter quiz in app on today's topics", "practice");
  }
  if (i % 3 === 2) add(d, "Timed test in app (Tax mix)", "test");
}
add(aug(14), "Read the 'What changed' page fully — lock the new figures", "revise");

// ---- Phase 3 · 15–24 Aug: Accounts + keep IT warm ----
const acctDays: [string, string[]][] = [
  ["Accounts: Buyback (revise — strong already) + Internal Reconstruction", [C.buyback, C.reconstruction]],
  ["Accounts: Company Final Accounts + managerial remuneration", [C.finalAccounts]],
  ["Accounts: Amalgamation", [C.amalgamation]],
  ["Accounts: Consolidation — part 1", [C.consolidation]],
  ["Accounts: Consolidation — part 2 + Investment A/cs (AS 13)", [C.investment]],
  ["Accounts: Cash Flow (AS 3) + Branch Accounts", [C.cashFlow, C.branch]],
  ["AS sweep: AS 1, 2, 4, 5, 7, 9, 10", []],
  ["AS sweep: AS 11, 12, 15, 16, 17, 18 (17/18 done 20 Jul — quick)", []],
  ["AS sweep: AS 19, 20, 22, 24, 25, 26", []],
  ["AS sweep: AS 28, 29 + full AS one-pager recap", []],
];
for (let i = 0; i < 10; i++) {
  const d = aug(15 + i);
  const [aTitle, aCh] = acctDays[i];
  add(d, aTitle, "revise", "Accounts block", aCh);
  add(d, "30-min IT problem set (keep the muscle warm)", "practice", "non-negotiable — weakest subject");
  if (i % 3 === 1) add(d, "Timed test in app", "test");
}

// ---- Phase 4 · 25–31 Aug: mocks + weak loops ----
const mockWeek: [string, string, Kind][] = [
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
  const chapters = await db.select().from(schema.chapters);
  const idByName = new Map(chapters.map((c) => [c.name, c.id]));

  // fail loudly on a typo rather than silently dropping the link
  const unknown = [...new Set(P.flatMap((p) => p.ch ?? []))].filter(
    (n) => !idByName.has(n)
  );
  if (unknown.length > 0) {
    throw new Error(`Unknown chapter name(s):\n  ${unknown.join("\n  ")}`);
  }

  await db.delete(schema.planItems).where(eq(schema.planItems.userId, STUDENT_ID));
  await db.insert(schema.planItems).values(
    P.map((p, i) => ({
      userId: STUDENT_ID,
      onDate: p.d,
      title: p.t,
      subtitle: p.s ?? null,
      kind: p.k,
      chapterIds: (p.ch ?? []).map((n) => idByName.get(n)!),
      sort: i,
    }))
  );
  const linked = P.filter((p) => (p.ch ?? []).length > 0).length;
  console.log(
    `Seeded ${P.length} plan items (${linked} chapter-linked) → ${EXAM_DATES.tax}`
  );

  const ticked = await syncPlanProgress(STUDENT_ID);
  console.log(`Auto-ticked ${ticked} item(s) from her logged topics.`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
