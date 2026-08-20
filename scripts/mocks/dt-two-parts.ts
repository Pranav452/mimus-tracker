// Direct tax mock in the two parts Pranav asked for.
// Seed with: npx tsx scripts/mock-test.ts --mock=dt-two-parts
import type { Mock } from "../mock-test";

export const MOCK: Mock = {
  title: "MOCK — Income Tax, Part 1 & Part 2",
  paperName: "Paper 3, Section A — Income-tax Law",
  durationMinutes: 90,
  scheduledFor: "2026-08-20",
  marks: 2,
  negativeMarks: 0, // ICAI does not negatively mark MCQs
  notes: `Use the Income-tax Act, 1961 as amended by the FINANCE ACT 2025, for AY 2026-27. The new Income-tax Act, 2025 is NOT applicable to this attempt — never use it.

Figures that must be current: new regime slabs u/s 115BAC — nil up to ₹4 lakh, 5 percent ₹4-8 lakh, 10 percent ₹8-12 lakh, 15 percent ₹12-16 lakh, 20 percent ₹16-20 lakh, 25 percent ₹20-24 lakh, 30 percent above ₹24 lakh; rebate u/s 87A up to ₹12 lakh total income with a maximum of ₹60,000 and marginal relief; standard deduction ₹75,000 in the new regime and ₹50,000 in the old; TDS thresholds as raised — s.194A ₹50,000 (₹1 lakh for senior citizens), s.194 dividend ₹10,000, s.194-I rent ₹6 lakh a year, s.194J professional fees ₹50,000; updated return u/s 139(8A) within 48 months from the end of the relevant ASSESSMENT year.

Stay strictly inside the ICAI CA Intermediate syllabus. Mix the question types roughly half and half:
- DIRECT: section numbers, time limits, exact conditions and thresholds.
- CASE-BASED: a short factual scenario with amounts in ₹, requiring a computation or a conclusion.`,
  sections: [
    {
      name: "Part 1 — Residence, deductions and procedure",
      count: 15,
      chapters: [
        "Residential Status",
        "Deductions",
        "Return of Income",
        "Advance Tax, TDS and TCS",
        "Set off and Carry Forward of Losses",
        "Clubbing of Income",
      ],
      notes: `Cover: residential status u/s 6 — the 182-day and 60-day-plus-365-day basic conditions, the employment and crew-member exception where 60 days becomes 182, the visiting-PIO rule with the ₹15 lakh and 120-day test, deemed residency u/s 6(1A) which applies to INDIAN CITIZENS ONLY and needs income other than foreign sources exceeding ₹15 lakh plus non-liability to tax anywhere else, RNOR u/s 6(6), and scope of total income u/s 5. Deductions under Chapter VI-A — 80C, 80CCD including 80CCD(1B) and NPS Vatsalya, 80D, 80DD, 80DDB, 80E, 80EEB, 80G with the qualifying-amount computation, 80GG, 80TTA and 80TTB — and which of these are unavailable under the new regime. Return of income u/ss 139-140A — due dates, belated return u/s 139(4) and revised return u/s 139(5) BOTH now closing on 31 December of the assessment year, updated return u/s 139(8A) within 48 months of the end of the assessment year, defective return u/s 139(9), fee u/s 234F and interest u/s 234A. Advance tax u/ss 207-211 with the four instalments and their percentages, the ₹10,000 threshold, s.44AD single-instalment position, and interest u/ss 234B and 234C; TDS and TCS with the current thresholds and rates. Set off and carry forward u/ss 70-80 — intra-head and inter-head restrictions, the ₹2 lakh house-property cap, speculation u/s 73 and specified business u/s 73A, capital losses u/s 74, the carry-forward period for each head, s.80 requiring a timely return, and s.79. Clubbing u/ss 60-64 — transfer of income without transfer of asset, revocable transfers, spouse's remuneration from a concern in which the individual has substantial interest, assets transferred to a spouse or son's wife, minor's income u/s 64(1A) with the ₹1,500 exemption, and cross transfers.`,
    },
    {
      name: "Part 2 — The five heads of income",
      count: 15,
      chapters: [
        "Income from Salary",
        "Income from House Property",
        "Profits and Gains from Business or Profession",
        "Capital Gains",
        "Income from Other Sources",
      ],
      notes: `Cover: salary u/ss 15-17 — basis of charge, allowances and their exemptions u/s 10, perquisites and their valuation including rent-free accommodation and motor car, gratuity, leave encashment, pension and commutation, retrenchment and VRS, standard deduction of ₹75,000 in the new regime, and s.16 deductions. House property u/ss 22-27 — annual value and its determination, let out versus self-occupied, standard deduction of 30 percent, interest u/s 24(b) with the ₹2 lakh and ₹30,000 limits and pre-construction interest in five instalments, unrealised rent and arrears u/s 25A, co-ownership and deemed ownership. PGBP u/ss 28-44 — admissible and inadmissible expenses, depreciation u/s 32 including additional depreciation and the block concept, s.40(a) disallowances for TDS default, s.40A(3) cash payments, s.43B on actual-payment items including the MSME clause, and presumptive taxation u/ss 44AD, 44ADA and 44AE with their turnover limits and the higher limits where receipts are largely non-cash. Capital gains u/ss 45-55 — capital asset and its exclusions, short versus long term and the holding periods, transfer u/s 2(47), computation with indexation where available, s.50 on depreciable assets, s.50C, s.111A, s.112 and s.112A with the ₹1.25 lakh threshold, and exemptions u/ss 54, 54B, 54D, 54EC with its ₹50 lakh cap, and 54F. Income from other sources u/ss 56-59 — dividend, interest, casual income taxed at 30 percent u/s 115BB, gifts u/s 56(2)(x) with the ₹50,000 threshold and the relative and occasion exceptions, and deductions u/s 57.`,
    },
  ],
};
