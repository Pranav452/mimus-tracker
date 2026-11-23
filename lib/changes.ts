// The law that applies to Mimansha's JANUARY 2027 attempt (Group I: 2, 4, 6 Jan).
// Same Finance Act as September 2026 (FA 2025, AY 2026-27) — but the amendment
// cut-off moves from 28 Feb 2026 to 30 June 2026, and January 2027 is the LAST
// attempt under the Income-tax Act, 1961 (the 2025 Act is examined from May 2027).
//
// Re-verified 23 Nov 2026 against ICAI's January 2027 exam guide and the MCA
// gazette. One figure here was WRONG for the September attempt and is corrected:
// small company limits are ₹10 crore / ₹100 crore (G.S.R. 880(E), 1 Dec 2025),
// not ₹4 crore / ₹40 crore. Lesson: never assert a threshold from memory —
// check it against a primary source dated after the model's knowledge cut-off.

export type ChangeItem = {
  topic: string;
  was: string; // the older position
  now: string; // what applies in January 2027
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

export const CHANGES_UPDATED = "23 November 2026";

export const CHANGE_SECTIONS: ChangeSection[] = [
  {
    id: "meta",
    title: "The big picture",
    emoji: "🧭",
    intro:
      "What law applies in January 2027 — almost exactly what you studied for September, with three things to fix.",
    items: [
      {
        topic: "January vs September — what actually moved",
        was: "Sept 2026: amendments notified up to 28 February 2026",
        now: "Jan 2027: amendments notified up to 30 June 2026 — four more months of notifications are examinable",
        note: "The Finance Act is the SAME (FA 2025, AY 2026-27), so every slab, rebate and TDS figure you learnt still stands. Read ICAI's January 2027 Statutory Update for Papers 2 and 3 once it is on the BoS site — that PDF is the final word on the extra four months.",
        priority: "high",
      },
      {
        topic: "Last attempt under the 1961 Act",
        was: "—",
        now: "From May 2027, ICAI examines the new Income-tax Act, 2025. January 2027 is the final attempt on the Act you already know.",
        note: "A real reason to finish it this time: clearing in January means never having to relearn income tax under new section numbers.",
        priority: "medium",
      },
      {
        topic: "Which Income-tax law?",
        was: "Income-tax Act, 1961 (as amended by Finance (No. 2) Act, 2024) — AY 2025-26",
        now: "STILL the Income-tax Act, 1961 — now as amended by Finance Act, 2025 — AY 2026-27",
        note: "The brand-new Income-tax Act, 2025 is NOT applicable to you. ICAI applies it only from May 2027 exams. Your 1961-Act concepts all carry over — only the amended numbers/provisions below change.",
        priority: "high",
      },
      {
        topic: "Exam pattern",
        was: "30 marks MCQ + 70 marks descriptive in every paper",
        now: "Unchanged for January 2027 — MCQs of 1 or 2 marks, no negative marking, no reasoning needed",
        note: "70 of every 100 marks are WRITTEN. Scoring well on MCQs and still missing the paper means the written 70 is where the marks are being lost.",
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
        topic: "Perquisite limits — Rules 3C and 3D",
        was: "Specified employee: salary above ₹50,000 · Medical travel abroad exempt only if gross total income up to ₹2,00,000",
        now: "Specified employee: salary above ₹4,00,000 (Rule 3C) · Medical travel abroad: gross total income up to ₹8,00,000 (Rule 3D)",
        note: "CBDT Notification 133/2025 (18 Aug 2025). Both old figures had stood for decades, so every older question bank and most notes still carry them.",
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
        note: "For January 2027 the GST cut-off is 30 June 2026. Do one pass of ICAI's January 2027 Statutory Update the week before the exam.",
        priority: "medium",
      },
    ],
  },
  {
    id: "law",
    title: "Corporate & Other Laws",
    emoji: "⚖️",
    intro:
      "Law changed the least — but one headline figure moved, and our September notes had it wrong.",
    items: [
      {
        topic: "Small company — section 2(85)",
        was: "Paid-up capital up to ₹4 crore AND turnover up to ₹40 crore",
        now: "Paid-up capital up to ₹10 CRORE AND turnover up to ₹100 CRORE",
        note: "MCA G.S.R. 880(E), in force from 1 December 2025 — so this already applied in September. Unlearn 4/40. Both limits must be met, and a holding company, subsidiary, section 8 company or company under a special Act can never be a small company.",
        priority: "high",
      },
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
        now: "Still a BILL — not law, not examinable in January 2027. Do not confuse it with the small-company change above, which IS in force.",
        note: "Don't waste time on it. Only enacted law as at the ICAI cutoff is tested.",
        priority: "low",
      },
    ],
  },
];

// Compact one-string brief injected into AI prompts (chat + question generation)
export const AMENDMENTS_BRIEF = `Applicable law for her JANUARY 2027 CA Inter attempt (Group I: Advanced Accounting 2 Jan, Corporate & Other Laws 4 Jan, Taxation 6 Jan 2027). Amendments notified up to 30 June 2026 are examinable.
- Income-tax Act 1961 as amended by FINANCE ACT 2025 (AY 2026-27). The new Income-tax Act 2025 is NOT applicable (only from May 2027 exams) — never use its section numbers.
- New regime slabs (115BAC): 0-4L nil, 4-8L 5%, 8-12L 10%, 12-16L 15%, 16-20L 20%, 20-24L 25%, >24L 30%. Rebate 87A: up to ₹12L income, max ₹60,000, with marginal relief (old regime unchanged: ₹5L/₹12,500). Standard deduction ₹75,000 new regime / ₹50,000 old. HRA, 80C-80U (except 80CCD(2), 80JJAA) and self-occupied house interest are NOT available in the new regime.
- TDS thresholds raised: 194A interest ₹50k (₹1L senior), 194 dividend ₹10k, 194I rent ₹6L/yr, 194J professional fees ₹50k. Updated return 139(8A): 48 months from the end of the relevant ASSESSMENT year. Belated return 139(4) and revised return 139(5): by 31 December of the assessment year.
- Perquisites: 'specified employee' salary limit ₹4,00,000 (Rule 3C) and gross total income limit ₹8,00,000 for medical travel abroad (Rule 3D) — the old ₹50,000 / ₹2,00,000 figures are superseded.
- Capital gains: s.112A LTCG on STT-paid equity taxed at 12.5% above ₹1.25 lakh; s.111A STCG at 20%; other LTCG 12.5% without indexation. s.54EC cap ₹50 lakh, land or building only.
- 80CCD(1B): NPS Vatsalya (minor child) eligible within the ₹50k limit. s.40A(3): a cash payment above ₹10,000 disallows the WHOLE expense, not the excess. s.6(1A) deemed residency applies to Indian CITIZENS only (not PIOs) with non-foreign income above ₹15 lakh.
- GST 2.0 effective 22-Sep-2025 and examinable: slabs now 5% / 18% / 40% only (12% & 28% abolished); individual health/life insurance exempt. Credit notes s.34 and ITC s.16(4): 30 NOVEMBER following the financial year (not the September return). TCS by e-commerce operators s.52: 0.5% (not 1%). TDS s.51: 2% where the contract value exceeds ₹2.5 lakh.
- Companies Act: SMALL COMPANY u/s 2(85) = paid-up capital up to ₹10 CRORE and turnover up to ₹100 CRORE (G.S.R. 880(E), in force 1-Dec-2025). The ₹4cr/₹40cr, ₹2cr/₹20cr and ₹50L/₹2cr figures are all superseded — never use them. Registered office u/s 12 within 30 DAYS of incorporation (INC-22). Commencement declaration u/s 10A in INC-20A within 180 days. OPC: no capital or turnover ceiling; member/nominee a natural person, Indian citizen, resident 120 days. Buyback s.68: 25% of capital+free reserves AND 25% of paid-up equity per year, 2:1 debt-equity, 10% by board alone, one-year gap.
- Corporate Laws (Amendment) Bill 2026 is NOT examinable (still a bill).
- Paper 1 uses ICAI Accounting Standards (AS 1-29), NOT Ind AS. Where they diverge the AS answer is correct: AS 5 policy changes are not restated retrospectively; AS 22 works on timing differences (no deferred tax on a revaluation surplus); AS 24 is a disclosure standard (no single net-of-tax line).
Always use these figures in answers and questions. If she quotes an old figure, correct it gently and say which notification changed it.`;
