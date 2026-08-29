// Shared builder for the six Advanced Accounting speed sets — 15 MCQs, 30
// marks, 15 minutes (her 1-minute-per-question drill, enforced by the clock).
// Chapter mixes rotate so the six sets cover the paper without repeating.
import type { Mock } from "../mock-test";

const NOTES = `This is Paper 1 — ADVANCED ACCOUNTING (CA Intermediate, new scheme). Use ICAI's Accounting Standards framework (AS 1 to AS 29) — NOT Ind AS, which is a Final topic. Buyback follows sections 68-70 of the Companies Act, 2013 (both 25% ceilings, 2:1 debt-equity, CRR at nominal value). Amalgamation follows AS 14 (merger vs purchase; pooling vs purchase method). Cash flow follows AS 3.

Style: mirror recent ICAI Part I MCQs — mostly SHORT NUMERICALS and case-lines (2-3 sentences, amounts in ₹), some direct conceptual one-liners. Every question must be solvable by a prepared student in about ONE MINUTE: numericals need at most 2-3 quick steps, never a full ledger. Put every qualifying fact in the stem so exactly one option is defensible. Distractors must be the standard wrong-step answers (e.g. forgetting the CRR, using face value instead of issue price), not random numbers.`;

const partA = (chapters: string[], count: number) => ({
  name: "Company Accounts",
  count,
  chapters,
  notes:
    "Numerical bias: computations of purchase consideration, CRR, capital reduction pots, loading, goodwill/capital reserve, minority interest, cash flows by activity.",
});
const partB = (chapters: string[], count: number) => ({
  name: "Accounting Standards",
  count,
  chapters,
  notes:
    "Test recognition/measurement rules with tiny numericals or one-line cases; include the classic AS traps (prior period vs change in estimate, borrowing cost eligibility, segment thresholds, contingency vs provision).",
});

export function buildSet(
  n: number,
  date: string,
  a: string[],
  b: string[]
): Mock {
  return {
    title: `SPEED SET ${n}/6 — Accounts MCQ (30 marks, 15 min)`,
    paperName: "Paper 1 — Advanced Accounting",
    durationMinutes: 15,
    scheduledFor: date,
    marks: 2,
    negativeMarks: 0,
    notes: NOTES,
    sections: [partA(a, 8), partB(b, 7)],
  };
}
