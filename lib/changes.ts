// What changed between Mimansha's last attempt (2025, Finance (No.2) Act 2024)
// and the Sept 2026 attempt (Finance Act 2025 + GST 2.0).
// Researched 21 Jul 2026 — ICAI applicability: Income-tax Act 1961 as amended
// by FA 2025 (AY 2026-27); Income-tax Act 2025 applies only from May 2027 exams.

export type ChangeItem = {
  topic: string;
  was: string; // last attempt (2025)
  now: string; // this attempt (Sept 2026)
  note?: string; // exam angle
  priority: "high" | "medium" | "low";
};

export type ChangeSection = {
  id: string;
  title: string;
  emoji: string;
  intro: string;
  items: ChangeItem[];
};

export const CHANGES_UPDATED = "21 July 2026";

export const CHANGE_SECTIONS: ChangeSection[] = [
  {
    id: "meta",
    title: "The big picture",
    emoji: "🧭",
    intro:
      "What law applies to your Sept 2026 attempt — read this first so you don't over-study.",
    items: [
      {
        topic: "Which Income-tax law?",
        was: "Income-tax Act, 1961 (as amended by Finance (No. 2) Act, 2024) — AY 2025-26",
        now: "STILL the Income-tax Act, 1961 — now as amended by Finance Act, 2025 — AY 2026-27",
        note: "The brand-new Income-tax Act, 2025 is NOT applicable to you. ICAI applies it only from May 2027 exams. Your 1961-Act concepts all carry over — only the amended numbers/provisions below change.",
        priority: "high",
      },
      {
        topic: "Exam pattern",
        was: "30% MCQs + 70% descriptive in Law and Tax; same in Sept 2026",
        now: "Unchanged — pattern and syllabus structure are the same as your last attempt",
        note: "Your prep carries over. Focus energy on amendments + practice, not re-learning.",
        priority: "medium",
      },
    ],
  },
  {
    id: "income-tax",
    title: "Income Tax (Finance Act, 2025)",
    emoji: "💰",
    intro:
      "Your weak area + the most changed area = highest-yield revision. New regime got a full re-write of slabs and rebate.",
    items: [
      {
        topic: "New regime slab rates — Sec 115BAC",
        was: "0–3L nil · 3–7L 5% · 7–10L 10% · 10–12L 15% · 12–15L 20% · above 15L 30%",
        now: "₹4L intervals: 0–4L nil · 4–8L 5% · 8–12L 10% · 12–16L 15% · 16–20L 20% · 20–24L 25% (new slab!) · above 24L 30%",
        note: "Every total-income computation question under the new regime uses these. Practice 3–4 full computations with the new slabs.",
        priority: "high",
      },
      {
        topic: "Rebate u/s 87A (new regime)",
        was: "Income up to ₹7,00,000 → rebate up to ₹25,000",
        now: "Income up to ₹12,00,000 → rebate up to ₹60,000 (+ marginal relief just above ₹12L)",
        note: "Zero tax up to ₹12L income under new regime. Old regime rebate unchanged (₹5L / ₹12,500). Marginal relief near ₹12L is a favourite exam twist.",
        priority: "high",
      },
      {
        topic: "Standard deduction (salary)",
        was: "₹75,000 new regime / ₹50,000 old regime (set by FA (No.2) 2024)",
        now: "Unchanged — ₹75,000 new / ₹50,000 old",
        note: "Just confirm you're using the 75k figure in new-regime salary computations.",
        priority: "medium",
      },
      {
        topic: "TDS 194A — interest (banks/post office)",
        was: "₹40,000 (₹50,000 senior citizens)",
        now: "₹50,000 (₹1,00,000 senior citizens)",
        priority: "high",
      },
      {
        topic: "TDS 194 — dividend",
        was: "₹5,000",
        now: "₹10,000",
        priority: "high",
      },
      {
        topic: "TDS 194I — rent",
        was: "₹2,40,000 per year",
        now: "₹6,00,000 per year (₹50,000 per month equivalent)",
        priority: "high",
      },
      {
        topic: "TDS 194J — professional/technical fees",
        was: "₹30,000",
        now: "₹50,000",
        priority: "high",
      },
      {
        topic: "Updated return u/s 139(8A)",
        was: "Within 24 months from end of relevant AY",
        now: "Extended to 48 months (with higher additional tax in years 3–4)",
        note: "Direct hit on your 'Return of Income' chapter — likely MCQ.",
        priority: "high",
      },
      {
        topic: "NPS for minor child — Sec 80CCD",
        was: "Not available",
        now: "Contribution to NPS Vatsalya (minor child) eligible within the 80CCD(1B) ₹50,000 limit",
        note: "New deduction — examiners love brand-new provisions.",
        priority: "medium",
      },
      {
        topic: "Sec 54EC bonds",
        was: "NHAI/REC etc.",
        now: "List expanded with new notified bonds",
        priority: "low",
      },
      {
        topic: "Perquisite limits (specified employee)",
        was: "Salary threshold ₹50,000 for specified-employee perquisites",
        now: "Thresholds raised (specified employee limit hiked)",
        note: "Check the amended figures in the ICAI Statutory Update for salary perquisites.",
        priority: "medium",
      },
    ],
  },
  {
    id: "gst",
    title: "GST 2.0 (rate rationalisation)",
    emoji: "🧾",
    intro:
      "The GST Council (3 Sep 2025) scrapped the 12% and 28% slabs — effective 22 Sep 2025 and examinable in your attempt.",
    items: [
      {
        topic: "Rate structure",
        was: "0% · 5% · 12% · 18% · 28% (+ cess)",
        now: "Just three: 5% (essentials, insurance, EVs) · 18% (standard — electronics, cement, vehicles, apparel) · 40% (sin & luxury — aerated drinks, premium cars)",
        note: "Any 'Charge of GST' or 'Value of Supply' numerical will use the new rates. Re-do your rate-based numericals.",
        priority: "high",
      },
      {
        topic: "Exemptions & insurance",
        was: "Individual health & life insurance taxable at 18%",
        now: "Individual health & life insurance moved to nil/5% band per rate notification",
        note: "Check the ICAI study guidelines list — exemptions chapter is affected.",
        priority: "medium",
      },
      {
        topic: "Amendment cutoff",
        was: "—",
        now: "ICAI examines CGST/IGST as amended by FA 2025, incl. notifications in force for the attempt",
        note: "Do one pass of ICAI's Statutory Update PDF for Sept 2026 the week before exams.",
        priority: "medium",
      },
    ],
  },
  {
    id: "law",
    title: "Corporate & Other Laws",
    emoji: "⚖️",
    intro:
      "Law changed the least — your last-attempt prep mostly stands. Watch these.",
    items: [
      {
        topic: "Decriminalisation trend",
        was: "Several Companies Act defaults = fine/imprisonment",
        now: "More offences shifted to civil penalty (adjudication) route",
        note: "For penalty-based MCQs, prefer 'penalty' over 'imprisonment' where amendments apply.",
        priority: "medium",
      },
      {
        topic: "Corporate Laws (Amendment) Bill, 2026",
        was: "—",
        now: "Still a BILL (proposed: small-company limits ₹20cr/₹200cr, LLP changes) — NOT law, NOT examinable for Sept 2026",
        note: "Don't waste time on it. Only enacted law as at the ICAI cutoff is tested.",
        priority: "low",
      },
    ],
  },
];

// Compact one-string brief injected into AI prompts (chat + question generation)
export const AMENDMENTS_BRIEF = `Applicable law for her Sept 2026 CA Inter attempt (her 2nd attempt; last one was under 2025 law):
- Income-tax Act 1961 as amended by FINANCE ACT 2025 (AY 2026-27). The new Income-tax Act 2025 is NOT applicable (only from May 2027 exams).
- New regime slabs (115BAC): 0-4L nil, 4-8L 5%, 8-12L 10%, 12-16L 15%, 16-20L 20%, 20-24L 25%, >24L 30%. Rebate 87A: up to ₹12L income, max ₹60,000, with marginal relief (old regime unchanged: ₹5L/₹12,500). Standard deduction ₹75,000 new regime / ₹50,000 old.
- TDS thresholds raised: 194A interest ₹50k (₹1L senior), 194 dividend ₹10k, 194I rent ₹6L/yr, 194J professional fees ₹50k. Updated return 139(8A): 48 months.
- 80CCD(1B): NPS Vatsalya (minor child) now eligible within ₹50k limit.
- GST 2.0 effective 22-Sep-2025 and examinable: slabs now 5% / 18% / 40% only (12% & 28% abolished); individual health/life insurance exempted/nil.
- Corporate Laws (Amendment) Bill 2026 is NOT examinable (still a bill).
Always use these amended figures in answers and questions. If she references old figures (₹7L rebate, 12%/28% GST), gently correct with the new ones.`;
