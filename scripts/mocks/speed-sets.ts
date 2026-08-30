// Shared builder for the six Advanced Accounting speed sets — 15 MCQs, 30
// marks, 15 minutes (her 1-minute-per-question drill, enforced by the clock).
// Chapter mixes rotate so the six sets cover the paper without repeating.
import type { Mock } from "../mock-test";

const NOTES = `This is Paper 1 — ADVANCED ACCOUNTING (CA Intermediate, new scheme). Use ICAI's Accounting Standards framework (AS 1 to AS 29) — NOT Ind AS, which is a Final topic. Where AS and Ind AS diverge (AS 5 policy changes have no retrospective restatement; AS 22 works on timing differences; AS 24 is a disclosure standard), the AS treatment is the correct answer and an Ind-AS-style option makes an excellent distractor. Buyback follows sections 68-70 of the Companies Act, 2013 (both 25% ceilings, 2:1 debt-equity, CRR at nominal value). Amalgamation follows AS 14. Cash flow follows AS 3.

DIFFICULTY — this matters most: the student found plain single-step questions too easy and scored full marks at speed. Set the difficulty at the HARDEST end of genuine ICAI Part I MCQs:
- Numericals must need THREE OR FOUR chained steps, not one formula (e.g. compute purchase consideration THEN goodwill; strip loading THEN find shortage THEN split it; compute CRR when the buyback is financed partly from a fresh issue).
- Combine two concepts in one stem where natural (buyback + its cash flow classification; revaluation + subsequent depreciation; post-acquisition profit + unrealised stock profit).
- Include one deliberately EXCESS fact per numerical — data the solver must recognise as irrelevant.
- Every distractor must be the exact result of a SPECIFIC wrong method (skipping a step, using face instead of issue price, forgetting the exclusion) — never a random number.
- Direct recall questions are allowed only for genuinely fine distinctions (exceptions, provisos, AS-vs-Ind-AS divergences), never for definitions.
A very well-prepared student should still finish in about a minute a question but should have to THINK on every single one; a mediocre student should get 8/15.`;

const partA = (chapters: string[], count: number) => ({
  name: "Company Accounts",
  count,
  chapters,
  notes:
    "All numerical, multi-step: purchase consideration then goodwill/capital reserve; CRR with a partial fresh issue; capital reduction pots with both fills and write-offs; loading, shortage and its split; minority interest with post-acquisition profits and unrealised stock profit; cash flow with misclassification traps.",
});
const partB = (chapters: string[], count: number) => ({
  name: "Accounting Standards",
  count,
  chapters,
  notes:
    "Two-to-three-step numericals and judgment cases on recognition and measurement: prior period vs change in estimate vs change in policy; borrowing cost with investment income offset and cessation; NRV with completion and selling costs; segment 10% and 75% tests combined; provision vs contingency with probability shifts; deferred tax where the timing/permanent distinction decides; lease classification at the boundary. Include an Ind-AS-style treatment as a distractor where AS diverges.",
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
