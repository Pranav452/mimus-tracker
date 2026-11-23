// Generates Mimansha's day-by-day plan for the JANUARY 2027 attempt:
// 23 Nov 2026 → exams on 2 / 4 / 6 Jan 2027.
//
// Why it is shaped this way — her September result was Accounts 55, Law 49,
// Taxation 35 (139/300; needs 150 and 40 in each paper). Tax failed the paper
// minimum by 5 and dragged the aggregate. Her own app history explains it:
// she never attempted a single practice question on the five heads of income,
// Computation, TDS, ITC, Registration or Returns, never opened either Tax mock,
// and wrote two descriptive answers in the whole attempt — in a paper that is
// 70% written. Where she DID practise, she scored 85%+. So this plan is not
// "study harder"; it is: Tax every morning, written answers every week, and
// real papers at 2 PM.
//
// Each item may declare the chapters it covers (`ch`). Those links let
// lib/plan-sync.ts auto-tick the item when she logs a matching daily topic.
// Topics logged before this plan's first day are ignored by the sync, so last
// attempt's history cannot tick anything here.
//
// Re-run safe, but note: re-seeding REBUILDS all items, so manual ticks are
// lost. Auto-ticks are restored automatically by the sync at the end.
// The September plan this replaces is in git history and backups/.
import { config } from "dotenv";
config({ path: ".env.local" });

import { eq } from "drizzle-orm";
import * as schema from "../lib/db/schema";
import { syncPlanProgress } from "../lib/plan-sync";
import { db } from "../lib/db";
import { EXAMS, DAILY_HABIT_TITLE } from "../lib/exam";
const STUDENT_ID = 1;

// exam dates live in lib/exam.ts so the home countdown reads the same ones
const EXAM_DATES = Object.fromEntries(EXAMS.map((e) => [e.key, e.date])) as Record<
  (typeof EXAMS)[number]["key"],
  string
>;
const PLAN_START = "2026-11-23";

type Kind = "study" | "revise" | "practice" | "test" | "exam";
type Item = {
  d: string;
  t: string;
  s?: string;
  k: Kind;
  ch?: string[]; // drives auto-ticking
  ref?: string[]; // extra chapters shown as reference material on the home screen
  test?: number; // an in-app test this row points at
};
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
  as9: "AS 9 — Revenue Recognition",
  as10: "AS 10 — Property, Plant and Equipment",
  as11: "AS 11 — The Effects of Changes in Foreign Exchange Rates",
  as12: "AS 12 — Accounting for Government Grants",
  as15: "AS 15 — Employee Benefits",
  as16: "AS 16 — Borrowing Costs",
  as17: "AS 17 — Segment Reporting",
  as18: "AS 18 — Related Party Disclosures",
  as19: "AS 19 — Leases",
  as20: "AS 20 — Earnings per Share",
  as22: "AS 22 — Accounting for Taxes on Income",
  as24: "AS 24 — Discontinuing Operations",
  as25: "AS 25 — Interim Financial Reporting",
  as26: "AS 26 — Intangible Assets",
  as28: "AS 28 — Impairment of Assets",
  as29: "AS 29 — Provisions, Contingent Liabilities and Contingent Assets",
};

type Row = [string, string, Kind, string | null, string[]];
const D = (mmdd: string) => (mmdd.startsWith("01-") ? `2027-${mmdd}` : `2026-${mmdd}`);

// Tax papers set before May 2026 use the old slabs and the old GST rates —
// they are worse than useless for her. Only May 2026, Sept 2026 and the
// January 2027 MTPs are scheduled for Tax. Accounts and Law papers age fine.
const ROWS: Row[] = [
  // ============ PHASE 1 · 23 Nov – 13 Dec · Tax from zero ============
  ["11-23", "Post-mortem: the Sept 2026 Tax paper with ICAI's MCQ key", "practice", "Mark every question you could not do in the hall. That list is the real syllabus — send it to Pranav.", []],
  ["11-23", "DT: Basics + Residential Status", "study", "Warm-up — you know the frame. 6(1A) is Indian citizens only.", [C.basics, C.residential]],

  ["11-24", "DT: Salary — allowances, perquisites, retirement benefits", "study", "New limits: specified employee ₹4,00,000 (Rule 3C), medical travel ₹8,00,000 (Rule 3D)", [C.salary]],
  ["11-24", "Accounts: Buyback + Internal Reconstruction", "study", "Both notes are in Explanations — read, then one sum each", [C.buyback, C.reconstruction]],

  ["11-25", "DT: Salary — three full problems, written out", "practice", "By hand, with working notes. This is where the marks are.", []],
  ["11-25", "DT: House Property", "study", "Old regime: ₹2L / ₹30k interest. New regime: no interest on self-occupied.", [C.houseProp]],
  ["11-25", "Law: Preliminary + Incorporation", "revise", "Small company is now ₹10 crore / ₹100 crore — unlearn 4/40", [C.prelim, C.incorp]],

  ["11-26", "DT: PGBP part 1 — admissible, inadmissible, depreciation", "study", "The biggest chapter in the paper. Take the whole morning.", [C.pgbp]],
  ["11-26", "Accounts: Amalgamation", "study", "Purchase consideration → goodwill or capital reserve", [C.amalgamation]],

  ["11-27", "DT: PGBP part 2 — 40(a), 40A(3), 43B, presumptive 44AD/ADA/AE", "study", "40A(3): cash above ₹10,000 disallows the WHOLE expense", []],
  ["11-27", "Law: Prospectus + Shares & Debentures", "revise", "Ch 4 rapid sheet in Explanations", [C.prospectus, C.shares]],

  ["11-28", "DT: Capital Gains part 1 — computation, 50C, 111A / 112 / 112A", "study", "112A: 12.5% above ₹1.25 lakh. 111A: 20%.", [C.capGains]],
  ["11-28", "Accounts: Consolidation part 1", "study", "Cost of control, minority interest, pre vs post-acquisition", [C.consolidation]],

  ["11-29", "DT: Capital Gains part 2 — exemptions 54 to 54F", "study", "54EC: ₹50 lakh, land or building only", []],
  ["11-29", "DT: Income from Other Sources", "study", "56(2)(x) gifts, 115BB winnings at 30%", [C.otherSources]],
  ["11-29", "Written test: Salary + HP + PGBP — 3 answers by hand, 60 min", "test", "From the ICAI RTP. Mark against the suggested answer: provision → working → conclusion.", []],

  ["11-30", "DT: Clubbing + Set-off & Carry Forward", "study", null, [C.clubbing, C.setOff]],
  ["11-30", "Accounts: Consolidation part 2 — two full sums", "practice", "No notes, full working", []],

  ["12-01", "DT: Deductions — 80C to 80U, and what the new regime switches off", "study", null, [C.deductions]],
  ["12-01", "Law: Deposits + Registration of Charge", "revise", "10% / 25% / 35% limits · 30 / 60 / 120 days", [C.deposits, C.charge]],

  ["12-02", "DT: Advance Tax, TDS and TCS — the new thresholds", "study", "194A ₹50k · 194 ₹10k · 194-I ₹6L · 194J ₹50k", [C.advanceTax]],
  ["12-02", "Accounts: Branch Accounts", "study", "Stock & Debtors note is in Explanations", [C.branch]],

  ["12-03", "DT: Return of Income + Computation of Total Income", "study", "One full computation in each regime", [C.returnOfIncome, C.computation]],
  ["12-03", "Law: Management & Administration", "revise", "Ch 7 rapid sheet — AGM 9-6-15-3, EGM 10-21-45-90", [C.mgmt]],
  ["12-03", "App test: Residential, Set-off, Return (12 Qs, 30 min)", "test", "Already in Tests — never attempted", []],

  ["12-04", "DT: two full computations, timed — 25 min each", "practice", "By hand. Speed on computations is worth 10 marks.", []],
  ["12-04", "App mock: Income Tax Part 1 & 2 (30 Qs, 90 min)", "test", "Already in Tests — all 13 DT chapters", []],
  ["12-04", "Law: Dividends + Accounts of Companies", "revise", "CSR: any one of three triggers", [C.dividends, C.accountsOfCo]],

  ["12-05", "GST: Introduction + Supply + Charge (composition, RCM)", "study", "Rates are 5 / 18 / 40 only", [C.gstIntro, C.supply, C.charge2]],
  ["12-05", "Accounts: Company Final Accounts", "study", "Schedule III formats + managerial remuneration", [C.finalAccounts]],

  ["12-06", "GST: Exemptions + Place of Supply", "study", null, [C.exemptions, C.placeOfSupply]],
  ["12-06", "PYQ: Income-tax section of the ICAI May 2026 paper — 90 min", "test", "By hand, clock running. Then mark it honestly against ICAI's suggested answers.", []],
  ["12-06", "Law: Audit and Auditors", "revise", null, [C.audit]],

  ["12-07", "GST: Time of Supply + Value of Supply", "study", "Late invoice flips the time-of-supply test", [C.timeOfSupply, C.valueOfSupply]],
  ["12-07", "Accounts: Cash Flow + Investment Accounts", "study", null, [C.cashFlow, C.investment]],

  ["12-08", "GST: Input Tax Credit part 1 — conditions, 180 days, blocked credits", "study", "The highest-scoring GST chapter — never practised last time", [C.itc]],
  ["12-08", "Law: Foreign Companies + LLP", "revise", null, [C.foreignCo, C.llp]],

  ["12-09", "GST: ITC part 2 — apportionment and reversals + Registration", "study", "Thresholds: ₹40L goods / ₹20L services / ₹10L special category", [C.registration]],
  ["12-09", "Accounts: AS 1, 2, 4, 5, 7", "study", "AS 5: no retrospective restatement — that is Ind AS", [C.as1, C.as2, C.as4, C.as5, C.as7]],

  ["12-10", "GST: Tax Invoice + E-way Bill + Accounts & Records", "study", "Credit notes: 30 November, not the September return", [C.invoice, C.eway, C.records]],
  ["12-10", "Law: General Clauses + Interpretation of Statutes", "revise", "Interpretation note is in Explanations", [C.genClauses, C.interpretation]],

  ["12-11", "GST: Payment of Tax + Returns + TDS/TCS", "study", "TCS by e-commerce operators is 0.5%", [C.payment, C.returns, C.gstTds]],
  ["12-11", "Accounts: AS 9, 10, 11, 12", "study", null, [C.as9, C.as10, C.as11, C.as12]],

  ["12-12", "App mock: GST full syllabus (28 Qs, 75 min)", "test", "Already in Tests — all 15 GST chapters", []],
  ["12-12", "PYQ: GST section of the ICAI May 2026 paper — 90 min", "test", "By hand, clock running", []],
  ["12-12", "Law: FEMA", "revise", "Residence turns on PURPOSE of leaving, not day-count", [C.fema]],

  ["12-13", "Morning: write your threshold sheet by hand — slabs, 87A, TDS, GST", "revise", "One page. It stays with you till 6 January.", []],
  ["12-13", "FULL MOCK 1 — Taxation: ICAI MTP Series I (Jan 2027), 2–5 PM", "test", "Exam conditions, same slot as the real paper. First pass of all three papers ends today.", []],

  // ============ PHASE 2 · 14 – 24 Dec · Second pass + papers ============
  ["12-14", "Tax mock review — redo every question you lost marks on", "revise", "Send Pranav the marks. Under 45? We re-plan this week.", []],
  ["12-14", "Accounts: AS 15, 16, 17, 18", "study", null, [C.as15, C.as16, C.as17, C.as18]],
  ["12-14", "App: Speed Set 2 (15 Qs, 15 min)", "test", "Already in Tests", []],

  ["12-15", "DT pass 2: Salary + House Property — four problems", "practice", null, []],
  ["12-15", "Accounts: AS 19, 20, 22, 24", "study", "AS 22: timing differences only", [C.as19, C.as20, C.as22, C.as24]],
  ["12-15", "Law: two answers by hand — chapters 1 to 4", "practice", "Provision → analysis → conclusion. Photograph and mark in the app.", []],

  ["12-16", "DT pass 2: PGBP + Capital Gains — four problems", "practice", null, []],
  ["12-16", "Accounts: AS 25, 26, 28, 29", "study", null, [C.as25, C.as26, C.as28, C.as29]],
  ["12-16", "App: Speed Set 3 (15 Qs, 15 min)", "test", "Already in Tests", []],

  ["12-17", "Morning: Accounts formats + AS one-pager", "revise", null, []],
  ["12-17", "FULL MOCK — Accounts: ICAI May 2026 paper, 2–5 PM", "test", "Exam conditions", []],

  ["12-18", "Accounts mock review", "revise", "Which sum ran out of time? That chapter gets a slot next week.", []],
  ["12-18", "GST pass 2: ITC + Registration — problems", "practice", null, []],
  ["12-18", "Law: two answers by hand — chapters 5 to 8", "practice", "Photograph and mark in the app", []],

  ["12-19", "DT pass 2: Deductions, TDS, Set-off, Clubbing", "practice", "MCQs + two written problems", []],
  ["12-19", "Accounts: Consolidation + Amalgamation — one full sum each", "practice", null, []],
  ["12-19", "App: Speed Set 5 (15 Qs, 15 min)", "test", "Already in Tests", []],

  ["12-20", "Morning: Law rapid sheets + flashcards", "revise", null, []],
  ["12-20", "FULL MOCK — Law: the 100-mark paper in the app, 2–5 PM", "test", "Write every answer by hand, then photograph each one to get it marked", []],

  ["12-21", "Law mock review — rewrite your three weakest answers", "revise", "Law was 49: the MCQs are fine, the written 70 is where it leaks", []],
  ["12-21", "GST pass 2: Supply, Charge, Exemptions, Time / Place / Value", "practice", null, []],

  ["12-22", "DT: two full computations, timed", "practice", null, []],
  ["12-22", "GST pass 2: Invoice, Returns, Payment, E-way", "practice", null, []],
  ["12-22", "Accounts: Internal Reconstruction + Branch — one full sum each", "practice", null, []],

  ["12-23", "Morning: threshold sheet + ITC rules", "revise", null, []],
  ["12-23", "FULL MOCK 2 — Taxation: ICAI MTP Series II (Jan 2027), 2–5 PM", "test", "Target: 50+. This is the one that tells us if January is on.", []],

  ["12-24", "Tax mock review + patch", "revise", null, []],
  ["12-24", "Accounts: Buyback, Cash Flow, Final Accounts — one sum each", "practice", null, []],
  ["12-24", "Law: two answers by hand — chapters 9 to 12", "practice", "Photograph and mark in the app", []],

  // ============ PHASE 3 · 25 Dec – 1 Jan · Exam rehearsal ============
  ["12-25", "Law: FEMA, General Clauses, Interpretation — three answers by hand", "practice", null, []],
  ["12-25", "DT rapid revision: all 13 chapters — flashcards + threshold sheet", "revise", null, []],

  ["12-26", "Morning: AS recap", "revise", null, []],
  ["12-26", "FULL MOCK — Accounts: ICAI MTP Series I (Jan 2027), 2–5 PM", "test", "From here the mocks fall on alternate days — the same rhythm as exam week", []],

  ["12-27", "Accounts mock review", "revise", null, []],
  ["12-27", "GST rapid revision: all 15 chapters — flashcards", "revise", null, []],
  ["12-27", "Read ICAI's January 2027 Statutory Update — Papers 2 and 3", "revise", "The final word on amendments up to 30 June 2026", []],

  ["12-28", "Morning: Law rapid sheets", "revise", null, []],
  ["12-28", "FULL MOCK — Law: ICAI May 2026 paper, 2–5 PM", "test", "Exam conditions", []],

  ["12-29", "Law mock review", "revise", null, []],
  ["12-29", "Tax: your three weakest chapters from the mocks — redo", "practice", null, []],

  ["12-30", "Morning: threshold sheet", "revise", null, []],
  ["12-30", "FULL MOCK 3 — Taxation: the Sept 2026 paper, sat properly, 2–5 PM", "test", "The paper that beat you by 5 marks. Take it back.", []],

  ["12-31", "Tax mock review — morning only", "revise", null, []],
  ["12-31", "Accounts final: Part A — one sum per chapter, all formats", "revise", null, []],

  ["01-01", "Accounts final: AS one-pager + formats", "revise", "Nothing new today. Stop by 6 PM, sleep early.", []],

  // ============ Exams ============
  ["01-02", "📝 EXAM — Paper 1: Advanced Accounting (2–5 PM)", "exam", "Reach by 1 PM. Calculator, admit card, ID.", []],
  ["01-03", "Law: rapid sheets + flashcards — all 15 chapters", "revise", null, []],
  ["01-03", "Law: reread your three mock scripts for structure", "revise", "Provision → analysis → conclusion, every single answer", []],
  ["01-04", "📝 EXAM — Paper 2: Corporate & Other Laws (2–5 PM)", "exam", null, []],
  ["01-05", "Tax: threshold sheet + one full computation + ITC rules", "revise", "Light. Stop by 6 PM.", []],
  ["01-05", "Tax: flashcards — the five heads, then GST", "revise", null, []],
  ["01-06", "📝 EXAM — Paper 3: Taxation (2–5 PM)", "exam", "The last one — and this time you have done the work 💛", []],
];

for (const [d, t, k, s, ch] of ROWS) add(D(d), t, k, s ?? undefined, ch);

// ── Reference material ──────────────────────────────────────────────────────
// Every row should open onto something to study from. Rows that own a chapter
// already do; practice and second-pass rows ("DT pass 2: Salary + House
// Property") name their chapters in the title, so read them from there instead
// of annotating ninety rows by hand. These never drive auto-ticking.
type Key = keyof typeof C;
const TAX: [RegExp, Key[]][] = [
  [/Basics/, ["basics"]],
  [/Residential/, ["residential"]],
  [/Salary/, ["salary"]],
  [/House Property|\bHP\b/, ["houseProp"]],
  [/PGBP/, ["pgbp"]],
  [/Capital Gains/, ["capGains"]],
  [/Other Sources|IFOS/, ["otherSources"]],
  [/five heads/, ["salary", "houseProp", "pgbp", "capGains", "otherSources"]],
  [/Deductions/, ["deductions"]],
  [/\bTDS\b/, ["advanceTax"]],
  [/Set-off/, ["setOff"]],
  [/Clubbing/, ["clubbing"]],
  [/\bReturn\b/, ["returnOfIncome"]],
  [/computation/i, ["computation"]],
  [/\bITC\b/, ["itc"]],
  [/Registration/, ["registration"]],
  [/\bSupply\b/, ["supply"]],
  [/\bCharge\b/, ["charge2"]],
  [/Exemptions/, ["exemptions"]],
  [/Time \/ Place \/ Value/, ["timeOfSupply", "placeOfSupply", "valueOfSupply"]],
  [/Invoice/, ["invoice"]],
  [/\bReturns\b/, ["returns"]],
  [/Payment/, ["payment"]],
  [/E-way/, ["eway"]],
];
const ACCOUNTS: [RegExp, Key[]][] = [
  [/Consolidation/, ["consolidation"]],
  [/Amalgamation/, ["amalgamation"]],
  [/Internal Reconstruction/, ["reconstruction"]],
  [/Branch/, ["branch"]],
  [/Buyback/, ["buyback"]],
  [/Cash Flow/, ["cashFlow"]],
  [/Final Accounts/, ["finalAccounts"]],
  [/Investment/, ["investment"]],
];
const LAW: [RegExp, Key[]][] = [
  [/chapters 1 to 4/, ["prelim", "incorp", "prospectus", "shares"]],
  [/chapters 5 to 8/, ["deposits", "charge", "mgmt", "dividends"]],
  [/chapters 9 to 12/, ["accountsOfCo", "audit", "foreignCo", "llp"]],
  [/FEMA/, ["fema"]],
  [/General Clauses/, ["genClauses"]],
  [/Interpretation/, ["interpretation"]],
];
for (const p of P) {
  if ((p.ch ?? []).length > 0 || p.k === "exam") continue;
  const table = /^(DT|GST|Tax|Written test)\b/.test(p.t)
    ? TAX
    : /^Accounts:/.test(p.t)
      ? ACCOUNTS
      : /^Law:/.test(p.t)
        ? LAW
        : null;
  if (!table) continue;
  const keys = [...new Set(table.filter(([re]) => re.test(p.t)).flatMap(([, k]) => k))];
  if (keys.length > 0) p.ref = keys.map((k) => C[k]);
}

// rows that are an in-app test get a button straight to it
const TEST_LINKS: [string, number][] = [
  ["App test: Residential, Set-off, Return", 14],
  ["App mock: Income Tax Part 1 & 2", 17],
  ["App mock: GST full syllabus", 16],
  ["App: Speed Set 2", 25],
  ["App: Speed Set 3", 26],
  ["App: Speed Set 5", 28],
  ["the 100-mark paper in the app", 13],
];
for (const [needle, id] of TEST_LINKS) {
  const row = P.find((p) => p.t.includes(needle));
  if (!row) throw new Error(`No plan row matches test link "${needle}"`);
  row.test = id;
}

// The daily habit that closes every study day: log what was actually done, then
// the night test built from it. Both live on the home screen.
{
  const end = Date.parse("2027-01-01T00:00:00+05:30");
  for (
    let t = Date.parse(`${PLAN_START}T00:00:00+05:30`);
    t <= end;
    t += 86_400_000
  ) {
    const d = new Date(t).toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });
    add(d, DAILY_HABIT_TITLE, "practice", "Tap what you studied, then 10 questions on it — both are on the home screen");
  }
}

async function main() {
  const chapters = await db.select().from(schema.chapters);
  const idByName = new Map(chapters.map((c) => [c.name, c.id]));

  // fail loudly on a typo rather than silently dropping the link
  const unknown = [...new Set(P.flatMap((p) => [...(p.ch ?? []), ...(p.ref ?? [])]))].filter(
    (n) => !idByName.has(n)
  );
  if (unknown.length > 0) {
    throw new Error(`Unknown chapter name(s):\n  ${unknown.join("\n  ")}`);
  }
  // a resit plan that silently skips a chapter is how a paper gets failed twice
  const planned = new Set(P.flatMap((p) => p.ch ?? []));
  const skipped = chapters.map((c) => c.name).filter((n) => !planned.has(n));
  if (skipped.length > 0) {
    throw new Error(`Chapter(s) with no plan item:\n  ${skipped.join("\n  ")}`);
  }

  // stable sort by date so the daily-habit rows (appended last) sit at the end
  // of each day rather than at the end of the plan
  const order = new Map(P.map((p, i) => [p, i]));
  P.sort((x, y) => x.d.localeCompare(y.d) || order.get(x)! - order.get(y)!);

  // a linked test that has since been deleted would be a dead button
  const testIds = new Set((await db.select({ id: schema.tests.id }).from(schema.tests)).map((t) => t.id));
  const dead = P.filter((p) => p.test && !testIds.has(p.test));
  if (dead.length > 0) throw new Error(`Linked test missing: ${dead.map((p) => `${p.t} → #${p.test}`).join("; ")}`);
  if (process.argv.includes("--show-refs")) {
    for (const p of P.filter((p) => p.ref || p.test))
      console.log(`  ${p.d.slice(5)} ${p.t}\n        → ${p.test ? `test #${p.test}` : p.ref!.join(" · ")}`);
  }
  const bare = P.filter((p) => !(p.ch ?? []).length && !p.ref && !p.test && p.k !== "exam" && p.t !== DAILY_HABIT_TITLE);
  console.log(`${bare.length} row(s) have no chapter or test attached (papers, reviews, sheets).`);

  await db.delete(schema.planItems).where(eq(schema.planItems.userId, STUDENT_ID));
  await db.insert(schema.planItems).values(
    P.map((p, i) => ({
      userId: STUDENT_ID,
      onDate: p.d,
      title: p.t,
      subtitle: p.s ?? null,
      kind: p.k,
      chapterIds: (p.ch ?? []).map((n) => idByName.get(n)!),
      refChapterIds: (p.ref ?? []).map((n) => idByName.get(n)!),
      testId: p.test ?? null,
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
