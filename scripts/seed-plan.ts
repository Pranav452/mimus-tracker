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

  as1: "AS 1 — Disclosure of Accounting Policies",
  as2: "AS 2 — Valuation of Inventory",
  as4: "AS 4 — Events occurring after Balance Sheet date",
  as5: "AS 5 — Net Profit or Loss for the Period, Prior Period Items and Changes in Accounting Policies",
  as7: "AS 7 — Construction Contracts",
  as10: "AS 10 — Property, Plant and Equipment",
  as11: "AS 11 — The Effects of Changes in Foreign Exchange Rates",
  as12: "AS 12 — Accounting for Government Grants",
  as15: "AS 15 — Employee Benefits",
  as16: "AS 16 — Borrowing Costs",
  as19: "AS 19 — Leases",
  as20: "AS 20 — Earnings per Share",
  as22: "AS 22 — Accounting for Taxes on Income",
  as24: "AS 24 — Discontinuing Operations",
  as25: "AS 25 — Interim Financial Reporting",
  as26: "AS 26 — Intangible Assets",
  as28: "AS 28 — Impairment of Assets",
  as29: "AS 29 — Provisions, Contingent Liabilities and Contingent Assets",
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
// History stops at 9 Aug — from 10 Aug the plan is rebuilt below. Past items
// are deliberately KEPT: syncPlanProgress assigns each logged topic to the
// nearest-by-date item covering it, so deleting them would make July topics
// jump onto September items and tick them green on day one.
for (let i = 0; i < 9; i++) {
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

// ---- REBUILT 10 Aug, around her own sequencing ----
// She said: 4 Law chapters on 10 Aug and Law is done; DT+IDT in the next
// ~10 days; Accounts from the 20th; revision/mocks alongside rather than
// after. Physical past papers reach her on the 13th.
//
// Chapters are linked ONLY where she has no topic logged yet. Anything she
// has already logged (Company Final Accounts, AS 9/17/18, the 10 Tax
// chapters, 11 Law chapters) is scheduled as unlinked revision, otherwise
// the nearest-date rule would tick the new item the moment it is seeded.
//
// The known risk, stated plainly: Accounts is the FIRST exam (1 Sept) and
// under her sequencing it is learned last, 20–28 Aug, with no second pass.
// Mitigation below = three Accounts anchors pulled into the Tax fortnight
// (15, 17, 19 Aug) and the Accounts mock on the 29th. If she slips, the AS
// sweep is the place to cut — not Part A.
type Row = [string, string, Kind, string | null, string[]];
const REBUILD: Row[] = [
  // 10 Aug — Law's last 4 chapters
  ["2026-08-10", "Law: Prospectus & Allotment of Shares", "study", "Law's last 4 — fast pass", [C.prospectus]],
  ["2026-08-10", "Law: Shares and Debentures", "study", null, [C.shares]],
  ["2026-08-10", "Law: Accounts of Companies + Interpretation of Statutes", "study", "Law first pass DONE after this ✅", [C.accountsOfCo, C.interpretation]],
  ["2026-08-10", "Attempt tonight's test in the app", "test", null, []],

  // 11–14 Aug — Direct Tax sweep
  ["2026-08-11", "DT: Residential Status (fast — you know the frame)", "study", null, [C.residential]],
  ["2026-08-11", "DT: Salary — ₹75k std deduction + new perquisite limits", "study", null, [C.salary]],
  ["2026-08-11", "Attempt tonight's test in the app", "test", null, []],
  ["2026-08-12", "DT: House Property", "study", null, [C.houseProp]],
  ["2026-08-12", "DT: PGBP part 1 — depreciation, 43B", "study", null, [C.pgbp]],
  ["2026-08-13", "DT: PGBP part 2 + presumptive (44AD/ADA)", "study", "same chapter, second sitting", []],
  ["2026-08-13", "DT: Capital Gains — exemptions + 54EC bonds", "study", null, [C.capGains]],
  ["2026-08-13", "Papers arrive: mark the 5 most-repeated questions per paper", "practice", "30 min, no solving — just see what gets asked", []],
  ["2026-08-14", "DT: Other Sources + Computation of Total Income", "study", null, [C.otherSources, C.computation]],
  ["2026-08-14", "Timed half-paper: Law (90 min, no notes)", "test", "your first real clock — Law is the only finished paper", []],

  // 15–19 Aug — GST sweep, with Accounts anchors
  ["2026-08-15", "GST: Intro + Charge (5/18/40 rates, composition, RCM)", "study", null, [C.gstIntro, C.charge2]],
  ["2026-08-15", "Accounts anchor: Buyback of Shares", "study", "Accounts is the FIRST exam — don't start it cold on the 20th", [C.buyback]],
  ["2026-08-16", "GST: Exemptions + Input Tax Credit", "study", "ITC is the highest-scoring GST chapter", [C.exemptions, C.itc]],
  ["2026-08-16", "Attempt tonight's test in the app", "test", null, []],
  ["2026-08-17", "GST: Registration + Tax Invoice, Credit & Debit Notes", "study", null, [C.registration, C.invoice]],
  ["2026-08-17", "Accounts anchor: Cash Flow Statement (AS 3)", "study", null, [C.cashFlow]],
  ["2026-08-18", "GST: Payment of Tax + Returns + TDS/TCS under GST", "study", null, [C.payment, C.returns, C.gstTds]],
  ["2026-08-18", "Attempt tonight's test in the app", "test", null, []],
  ["2026-08-19", "GST: E-way Bill + Accounts and Records", "study", "Tax first sweep DONE after this ✅", [C.eway, C.records]],
  ["2026-08-19", "Timed half-paper: Taxation — DT section (90 min)", "test", null, []],
  ["2026-08-19", "One-page threshold sheet: TDS, 87A, slabs, GST rates", "revise", "write it by hand, keep it with you till the exam", []],

  // 20–28 Aug — Accounts sprint
  ["2026-08-20", "Accounts: Internal Reconstruction", "study", null, [C.reconstruction]],
  ["2026-08-20", "Accounts: Investment Accounts (AS 13)", "study", null, [C.investment]],
  ["2026-08-21", "Accounts: Company Final Accounts — formats + managerial remuneration", "revise", "you did this on 20 Jul — this is the second pass", []],
  ["2026-08-21", "Accounts: Branch Accounts", "study", null, [C.branch]],
  ["2026-08-22", "Accounts: Amalgamation", "study", null, [C.amalgamation]],
  ["2026-08-22", "Attempt tonight's test in the app", "test", null, []],
  ["2026-08-23", "Accounts: Consolidation — part 1", "study", "heaviest chapter in the paper", [C.consolidation]],
  ["2026-08-24", "Accounts: Consolidation — part 2, problem drill", "practice", "no notes, full working", []],
  ["2026-08-24", "30-min Tax problem set (keep it warm)", "practice", null, []],
  ["2026-08-25", "AS sweep: AS 1, 2, 4, 5, 7", "study", null, [C.as1, C.as2, C.as4, C.as5, C.as7]],
  ["2026-08-25", "Attempt tonight's test in the app", "test", null, []],
  ["2026-08-26", "AS sweep: AS 10, 11, 12, 15, 16", "study", null, [C.as10, C.as11, C.as12, C.as15, C.as16]],
  ["2026-08-27", "AS sweep: AS 19, 20, 22, 24", "study", null, [C.as19, C.as20, C.as22, C.as24]],
  ["2026-08-27", "30-min Law recall drill (sections language)", "practice", null, []],
  ["2026-08-28", "AS sweep: AS 25, 26, 28, 29 + quick recap of AS 9/17/18", "study", null, [C.as25, C.as26, C.as28, C.as29]],

  // 29–31 Aug — mock, patch, taper
  ["2026-08-29", "Full mock: Advanced Accounting (3 hrs, exam conditions)", "test", "2–5 PM, same slot as the real paper", []],
  ["2026-08-30", "Mock review — patch only what you actually lost marks on", "revise", null, []],
  ["2026-08-31", "Accounts final: formats + AS one-pager. Light day, sleep early.", "revise", "nothing new today — the exam is tomorrow", []],

  // Exams and gap days
  [EXAM_DATES.accounts, "📝 EXAM — Paper 1: Advanced Accounting (2–5 PM)", "exam", "reach by 1 PM, carry calculator", []],
  ["2026-09-02", "Law high-yield recap: Dividends, Deposits, Audit, LLP, FEMA", "revise", null, []],
  [EXAM_DATES.law, "📝 EXAM — Paper 2: Corporate & Other Laws (2–5 PM)", "exam", null, []],
  ["2026-09-04", "DT: full computation drill + threshold sheet", "revise", null, []],
  ["2026-09-05", "GST: rates (5/18/40) + ITC recheck. Light evening, sleep early.", "revise", null, []],
  [EXAM_DATES.tax, "📝 EXAM — Paper 3: Taxation (2–5 PM)", "exam", "you've got this 💛", []],
];
for (const [d, t, k, s, ch] of REBUILD) add(d, t, k, s ?? undefined, ch);

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
