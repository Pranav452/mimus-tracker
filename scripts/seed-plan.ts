// Generates Mimansha's day-by-day plan for the JANUARY 2027 attempt:
// 1 Dec 2026 → exams on 2 / 4 / 6 Jan 2027. 9 Dec (her birthday) is a day off.
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
import { EXAMS, DAILY_HABIT_TITLE, PLAN_START, DAYS_OFF } from "../lib/exam";
const STUDENT_ID = 1;

// exam dates live in lib/exam.ts so the home countdown reads the same ones
const EXAM_DATES = Object.fromEntries(EXAMS.map((e) => [e.key, e.date])) as Record<
  (typeof EXAMS)[number]["key"],
  string
>;


type Kind = "study" | "revise" | "practice" | "test" | "exam" | "holiday";
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
  // She has sat these papers before, so the first pass is a fast BRUSH-UP of all
  // 72 chapters, not a first reading: three sittings a day — Tax every morning
  // (the paper that failed), Accounts and Law after lunch and in the evening.
  // Then papers. 9 December is her birthday: a full day off, nothing scheduled.

  // ============ PHASE 1 · 1 – 13 Dec · Brush up everything ============
  ["12-01", "DT: Basics + Residential Status", "study", "Morning. You know the frame — 6(1A) is Indian citizens only.", [C.basics, C.residential]],
  ["12-01", "DT: Salary — allowances, perquisites, retirement benefits", "study", "Morning. New limits: specified employee ₹4,00,000 (Rule 3C), medical travel ₹8,00,000 (Rule 3D)", [C.salary]],
  ["12-01", "Accounts: Buyback + Internal Reconstruction", "revise", "Afternoon. Both notes are in Explanations — read, then one sum each", [C.buyback, C.reconstruction]],
  ["12-01", "Law: Preliminary + Incorporation", "revise", "Evening. Small company is now ₹10 crore / ₹100 crore — unlearn 4/40", [C.prelim, C.incorp]],

  ["12-02", "DT: House Property + Other Sources", "study", "Morning. Old regime: ₹2L / ₹30k interest. New regime: no interest on self-occupied.", [C.houseProp, C.otherSources]],
  ["12-02", "DT: Salary + House Property — three full problems, written out", "practice", "Afternoon. By hand, with working notes. This is where the marks are.", []],
  ["12-02", "Accounts: Amalgamation", "revise", "Evening. Purchase consideration → goodwill or capital reserve. One full sum.", [C.amalgamation]],

  ["12-03", "DT: PGBP — admissible, inadmissible, depreciation, 40A(3), 43B, presumptive", "study", "Morning — all of it. The biggest chapter in the paper. 40A(3): cash above ₹10,000 disallows the WHOLE expense.", [C.pgbp]],
  ["12-03", "Law: Prospectus + Shares and Debentures", "revise", "Afternoon. The rapid sheet for chapter 4 is in Explanations", [C.prospectus, C.shares]],
  ["12-03", "Accounts: Cash Flow + Company Final Accounts", "revise", "Evening. Your strongest two — one sum each and move on", [C.cashFlow, C.finalAccounts]],

  ["12-04", "DT: Capital Gains — computation, 112A / 111A, exemptions 54 to 54F", "study", "Morning. 112A: 12.5% above ₹1.25 lakh. 54EC: ₹50 lakh, land or building only.", [C.capGains]],
  ["12-04", "Written test: Salary + HP + PGBP — 3 answers by hand, 60 min", "test", "Afternoon. From the ICAI RTP. Mark against the suggested answer: provision → working → conclusion.", []],
  ["12-04", "Law: Deposits + Registration of Charge", "revise", "Evening. Numbers chapter — do the flashcards twice", [C.deposits, C.charge]],

  ["12-05", "DT: Clubbing, Set-off, Deductions", "study", "Morning. Three short chapters, all MCQ-heavy", [C.clubbing, C.setOff, C.deductions]],
  ["12-05", "App test: Residential, Set-off, Return (12 Qs, 30 min)", "test", "Straight after the morning block. Already in Tests — never attempted", []],
  ["12-05", "Accounts: Consolidation", "study", "Afternoon. Minority interest, cost of control, unrealised profit — two full sums", [C.consolidation]],
  ["12-05", "Law: Management & Administration + Dividends", "revise", "Evening. The chapter 7 rapid sheet is in Explanations", [C.mgmt, C.dividends]],

  ["12-06", "DT: TDS / Advance tax, Return of Income, Computation of Total Income", "study", "Morning. 139(4)/(5): 31 December. Updated return: 48 months.", [C.advanceTax, C.returnOfIncome, C.computation]],
  ["12-06", "App mock: Income Tax Part 1 & 2 (30 Qs, 90 min)", "test", "Afternoon. Already in Tests — all 13 DT chapters", []],
  ["12-06", "Accounts: Branch + Investment Accounts", "revise", "Evening. Investment Accounts was 0/2 last time — do the columns slowly", [C.branch, C.investment]],

  ["12-07", "DT: two full computations, timed — 25 min each", "practice", "Morning, first hour. By hand. Speed on computations is worth 10 marks.", []],
  ["12-07", "GST: Introduction, Supply, Charge (levy, composition, RCM)", "study", "Morning. GST 2.0 rates: 5 / 18 / 40", [C.gstIntro, C.supply, C.charge2]],
  ["12-07", "Law: Accounts of Companies + Audit and Auditors", "revise", "Afternoon. CSR thresholds and auditor rotation — flashcards", [C.accountsOfCo, C.audit]],
  ["12-07", "Accounts: AS 1, 2, 4, 5", "revise", "Evening. Flashcards first, then one numerical on AS 2", [C.as1, C.as2, C.as4, C.as5]],

  ["12-08", "GST: Place, Time and Value of Supply", "study", "Morning. You scored 3/3 here — keep it quick", [C.placeOfSupply, C.timeOfSupply, C.valueOfSupply]],
  ["12-08", "GST: Exemptions + Input Tax Credit", "study", "Afternoon. ITC is the heaviest GST chapter — blocked credits, 180 days, 30 November", [C.exemptions, C.itc]],
  ["12-08", "Law: Companies Incorporated outside India + LLP", "revise", "Evening. Short ones. Then close the books — tomorrow is yours.", [C.foreignCo, C.llp]],

  ["12-09", "🎂 Happy Birthday, Mimansha — day off", "holiday", "No plan, no test, no guilt. Back on the 10th.", []],

  ["12-10", "GST: Registration, Tax Invoice, Accounts and Records, E-way Bill", "study", "Morning. Thresholds and time limits — make them flashcard-fast", [C.registration, C.invoice, C.records, C.eway]],
  ["12-10", "Accounts: AS 7, 9, 10, 11", "revise", "Afternoon. One numerical each on AS 7 and AS 11", [C.as7, C.as9, C.as10, C.as11]],
  ["12-10", "Law: General Clauses, Interpretation of Statutes, FEMA", "revise", "Evening. Interpretation was 1/3 — the note is in Explanations", [C.genClauses, C.interpretation, C.fema]],

  ["12-11", "GST: Payment of Tax, TDS / TCS, Returns", "study", "Morning. GST syllabus closes here", [C.payment, C.gstTds, C.returns]],
  ["12-11", "App mock: GST full syllabus (28 Qs, 75 min)", "test", "Afternoon. Already in Tests — all 15 GST chapters", []],
  ["12-11", "Accounts: AS 12, 15, 16, 17, 18", "revise", "Evening. AS 16 was 1/2 — do the capitalisation numerical", [C.as12, C.as15, C.as16, C.as17, C.as18]],

  ["12-12", "Morning: write your threshold sheet by hand — slabs, 87A, TDS, GST", "revise", "One page. It stays with you till 6 January.", []],
  ["12-12", "GST: ITC + Registration — problems by hand", "practice", "Morning, after the sheet", []],
  ["12-12", "Accounts: AS 19, 20, 22, 24", "revise", "Afternoon. One numerical each on leases, EPS and deferred tax", [C.as19, C.as20, C.as22, C.as24]],
  ["12-12", "Law: two answers by hand — chapters 1 to 4", "practice", "Evening. Provision → analysis → conclusion. Photograph and mark in the app.", []],

  ["12-13", "Accounts: AS 25, 26, 28, 29", "revise", "Morning. AS 25 and AS 29 both cost you marks — flashcards twice. Every chapter has now been touched.", [C.as25, C.as26, C.as28, C.as29]],
  ["12-13", "FULL MOCK 1 — Taxation: ICAI MTP Series I (Jan 2027), 2–5 PM", "test", "Exam conditions, same slot as the real paper.", []],
  ["12-13", "Mark the Tax mock tonight", "revise", "Evening. Send Pranav the marks. Under 45? We re-plan this week.", []],

  // ============ PHASE 2 · 14 – 23 Dec · Second pass + papers ============
  ["12-14", "Tax mock review — redo every question you lost marks on", "revise", "Morning", []],
  ["12-14", "Accounts: Consolidation + Amalgamation — one full sum each", "practice", "Afternoon. No notes, full working", []],
  ["12-14", "Law: two answers by hand — chapters 5 to 8", "practice", "Evening. Photograph and mark in the app", []],
  ["12-14", "App: Speed Set 2 (15 Qs, 15 min)", "test", "Already in Tests", []],

  ["12-15", "DT pass 2: Salary + House Property — four problems", "practice", "Morning", []],
  ["12-15", "FULL MOCK — Accounts: ICAI May 2026 paper, 2–5 PM", "test", "Exam conditions", []],
  ["12-15", "Law: two answers by hand — chapters 9 to 12", "practice", "Evening, after a break. Photograph and mark in the app", []],

  ["12-16", "Accounts mock review", "revise", "Morning. Which sum ran out of time? That chapter gets a slot this week.", []],
  ["12-16", "DT pass 2: PGBP + Capital Gains — four problems", "practice", "Afternoon", []],
  ["12-16", "Law: FEMA, General Clauses, Interpretation — three answers by hand", "practice", "Evening", []],
  ["12-16", "App: Speed Set 3 (15 Qs, 15 min)", "test", "Already in Tests", []],

  ["12-17", "GST pass 2: ITC + Registration — problems", "practice", "Morning", []],
  ["12-17", "DT pass 2: Deductions, TDS, Set-off, Clubbing", "practice", "Afternoon. MCQs + two written problems", []],
  ["12-17", "Law: rapid sheets + flashcards — all 15 chapters", "revise", "Evening. Tomorrow is the Law mock.", []],
  ["12-17", "App mock: Law Part I MCQs (20 Qs, 30 marks)", "test", "After the rapid sheets. Already in Tests — never attempted", []],

  ["12-18", "Morning: Law flashcards — the chapters you hesitated on last night", "revise", null, []],
  ["12-18", "FULL MOCK — Law: the 100-mark paper in the app, 2–5 PM", "test", "Write every answer by hand, then photograph each one to get it marked", []],
  ["12-18", "GST pass 2: Supply, Charge, Exemptions, Time / Place / Value", "practice", "Evening — MCQs only, keep it light", []],

  ["12-19", "Law mock review — rewrite your three weakest answers", "revise", "Morning. Law was 49: the MCQs are fine, the written 70 is where it leaks", []],
  ["12-19", "PYQ: Income-tax section of the ICAI May 2026 paper — 90 min", "test", "Afternoon. By hand, clock running. Then mark it honestly against ICAI's suggested answers.", []],
  ["12-19", "Accounts: Internal Reconstruction + Branch — one full sum each", "practice", "Evening", []],
  ["12-19", "App: Speed Set 5 (15 Qs, 15 min)", "test", "Already in Tests", []],

  ["12-20", "GST pass 2: Invoice, Returns, Payment, E-way", "practice", "Morning", []],
  ["12-20", "PYQ: GST section of the ICAI May 2026 paper — 90 min", "test", "Afternoon. By hand, clock running", []],
  ["12-20", "Accounts: Buyback, Cash Flow, Final Accounts — one sum each", "practice", "Evening", []],

  ["12-21", "DT: two full computations, timed", "practice", "Morning", []],
  ["12-21", "Accounts: AS numericals — AS 7, 11, 16, 19, 20, 22", "practice", "Afternoon. One each. These are the AS that come as sums.", []],
  ["12-21", "Tax: threshold sheet + ITC rules — from memory", "revise", "Evening. Write it without looking, then check. Tax mock tomorrow.", []],

  ["12-22", "Tax: your three weakest chapters from mock 1 — redo", "practice", "Morning", []],
  ["12-22", "FULL MOCK 2 — Taxation: ICAI MTP Series II (Jan 2027), 2–5 PM", "test", "Target: 50+. This is the one that tells us if January is on.", []],
  ["12-22", "Mark the Tax mock tonight", "revise", "Evening. Send Pranav the marks.", []],

  ["12-23", "Tax mock review + patch", "revise", "Morning", []],
  ["12-23", "Accounts: AS flashcards — all 21 standards", "revise", "Afternoon. Every card. Mark the ones you miss.", []],
  ["12-23", "Accounts formats — final accounts, cash flow, consolidation, by hand", "revise", "Evening. Accounts mock tomorrow.", []],

  // ============ PHASE 3 · 24 Dec – 1 Jan · Exam rehearsal ============
  ["12-24", "Morning: Accounts — the AS cards you missed yesterday", "revise", null, []],
  ["12-24", "FULL MOCK — Accounts: ICAI MTP Series I (Jan 2027), 2–5 PM", "test", "From here the mocks fall on alternate days — the same rhythm as exam week", []],
  ["12-24", "Accounts mock: mark it tonight", "revise", "Evening", []],

  ["12-25", "Accounts mock review", "revise", "Morning", []],
  ["12-25", "Read ICAI's January 2027 Statutory Update — Papers 2 and 3", "revise", "Afternoon. The final word on amendments up to 30 June 2026", []],
  ["12-25", "Law: rapid sheets — all 15 chapters", "revise", "Evening. Law mock tomorrow.", []],

  ["12-26", "Morning: Law flashcards", "revise", null, []],
  ["12-26", "FULL MOCK — Law: ICAI May 2026 paper, 2–5 PM", "test", "Exam conditions", []],
  ["12-26", "Law mock: mark it tonight", "revise", "Evening", []],

  ["12-27", "Law mock review — rewrite your two weakest answers", "revise", "Morning", []],
  ["12-27", "DT rapid revision: all 13 chapters — flashcards + threshold sheet", "revise", "Afternoon", []],
  ["12-27", "GST rapid revision: all 15 chapters — flashcards", "revise", "Evening. Tax mock tomorrow.", []],

  ["12-28", "Morning: threshold sheet", "revise", null, []],
  ["12-28", "FULL MOCK 3 — Taxation: the Sept 2026 paper, sat properly, 2–5 PM", "test", "The paper that beat you by 5 marks. Take it back.", []],
  ["12-28", "Mark the Tax mock tonight", "revise", "Evening. Send Pranav the marks.", []],

  ["12-29", "Tax mock review", "revise", "Morning", []],
  ["12-29", "Accounts final: Part A — one sum per chapter, all formats", "revise", "Afternoon and evening. Accounts is four days away.", []],

  ["12-30", "Morning: Accounts AS one-pager", "revise", null, []],
  ["12-30", "FULL MOCK — Accounts: the ICAI Sept 2026 paper, 2–5 PM", "test", "You scored 55 on this in the hall. See what the same paper gives you now.", []],
  ["12-30", "Accounts mock: mark it tonight", "revise", "Evening", []],

  ["12-31", "Accounts mock review — every sum that ran over time", "revise", "Morning", []],
  ["12-31", "Accounts: your three weakest chapters from the mocks — one sum each", "practice", "Afternoon", []],
  ["12-31", "Law: flashcards — a light hour", "revise", "Evening. Keeps Law warm for the 4th.", []],

  ["01-01", "Accounts final: AS one-pager + formats", "revise", "Nothing new today. Stop by 6 PM, sleep early.", []],

  // ============ EXAMS ============
  ["01-02", "📝 EXAM — Paper 1: Advanced Accounting (2–5 PM)", "exam", "Reach by 1 PM. Calculator, admit card, ID.", []],
  ["01-03", "Law: rapid sheets + flashcards — all 15 chapters", "revise", null, []],
  ["01-03", "Law: reread your mock scripts for structure", "revise", "Provision → analysis → conclusion, every single answer", []],
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
  if ((p.ch ?? []).length > 0 || p.k === "exam" || p.k === "holiday") continue;
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
  ["App mock: Law Part I MCQs", 11],
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
    if (d in DAYS_OFF) continue; // a day off is a day off — no log, no test
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
  const bare = P.filter((p) => !(p.ch ?? []).length && !p.ref && !p.test && p.k !== "exam" && p.k !== "holiday" && p.t !== DAILY_HABIT_TITLE);
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
