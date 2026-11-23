// Hand-written question bank — Income-tax, the chapters she never practised
// before the September 2026 attempt (five heads, computation, TDS).
// Law: Income-tax Act 1961 as amended by Finance Act 2025, AY 2026-27.
//
// Convention: the CORRECT option is always written FIRST. seed-bank.ts shuffles
// the options deterministically, so the key cannot drift from the answer.
import type { BankQuestion } from "../seed-bank";

const SALARY = "Income from Salary";
const HP = "Income from House Property";
const PGBP = "Profits and Gains from Business or Profession";
const CG = "Capital Gains";
const OS = "Income from Other Sources";
const COMP = "Computation of Total Income";
const TDS = "Advance Tax, TDS and TCS";
const DED = "Deductions";

export const BANK: BankQuestion[] = [
  // ───────────── Salary ─────────────
  {
    chapter: SALARY,
    text: "Mr. A has opted OUT of the new regime (old regime). His gross salary for PY 2025-26 is ₹9,00,000 and he paid professional tax of ₹2,400. What is his income chargeable under the head 'Salaries'?",
    options: ["₹8,47,600", "₹8,25,000", "₹8,50,000", "₹8,22,600"],
    explanation:
      "Section 16 in the OLD regime: standard deduction ₹50,000 u/s 16(ia) plus professional tax ₹2,400 u/s 16(iii) = ₹52,400, so ₹9,00,000 − ₹52,400 = ₹8,47,600. ₹8,25,000 is the NEW-regime answer (₹75,000 standard deduction, and professional tax is not deductible there). ₹8,22,600 mixes the two regimes — the classic slip.",
  },
  {
    chapter: SALARY,
    text: "Mr. B, covered by the Payment of Gratuity Act, retires after 20 years and 7 months of service. His last drawn salary (basic + DA) is ₹52,000 per month and he receives gratuity of ₹7,00,000. How much of the gratuity is taxable?",
    options: [
      "₹70,000",
      "₹1,00,000",
      "Nil — gratuity up to ₹20 lakh is fully exempt",
      "₹1,54,000",
    ],
    explanation:
      "Section 10(10)(ii): exempt = least of (a) ₹7,00,000 received, (b) 15/26 × last drawn salary × completed years, a fraction above 6 months counting as a full year → 15/26 × 52,000 × 21 = ₹6,30,000, (c) ₹20,00,000. Exempt ₹6,30,000, taxable ₹70,000. ₹1,00,000 ignores the 7 months (uses 20 years); ₹1,54,000 uses 15/30, which is the formula for employees NOT covered by the Act.",
  },
  {
    chapter: SALARY,
    text: "A non-government employee encashes accumulated earned leave at retirement. What is the monetary ceiling on the exemption u/s 10(10AA) for AY 2026-27?",
    options: ["₹25,00,000", "₹3,00,000", "₹20,00,000", "₹10,00,000"],
    explanation:
      "The ceiling for non-government employees is ₹25,00,000 (raised from ₹3,00,000 by notification in 2023). The exemption is the least of: the ceiling, actual amount received, 10 months' average salary, and cash equivalent of leave at max 30 days per year of service. Leave encashed DURING service is fully taxable; ₹20 lakh is the gratuity ceiling, not this one.",
  },
  {
    chapter: SALARY,
    text: "A private-sector employee is given unfurnished rent-free accommodation OWNED by the employer in a city with a population of 45 lakh (2011 census). His 'salary' for this purpose is ₹12,00,000. What is the taxable value of the perquisite?",
    options: ["₹1,20,000", "₹1,80,000", "₹90,000", "₹60,000"],
    explanation:
      "Rule 3(1), as revised with effect from 1 September 2023: 10% of salary where population exceeds 40 lakh; 7.5% where it exceeds 15 lakh but not 40 lakh; 5% otherwise. 10% × ₹12,00,000 = ₹1,20,000. ₹1,80,000 uses the pre-2023 rate of 15% — every older book and question bank still has it.",
  },
  {
    chapter: SALARY,
    text: "For AY 2026-27, an employee who is neither a director nor has a substantial interest in the company is a 'specified employee' for taxing certain perquisites only if his income under the head 'Salaries' (excluding non-monetary benefits) exceeds:",
    options: ["₹4,00,000", "₹50,000", "₹2,00,000", "₹8,00,000"],
    explanation:
      "Rule 3C (CBDT Notification 133/2025) prescribes ₹4,00,000 for section 17(2)(iii)(c), replacing the ₹50,000 figure that had stood for decades. ₹8,00,000 is the companion Rule 3D limit — the gross total income ceiling for the exemption on medical travel abroad (earlier ₹2,00,000). Expect both new numbers to be tested.",
  },
  {
    chapter: SALARY,
    text: "An employer provides a car (engine 1.4 litres) with a chauffeur to an employee, used partly for official and partly for personal purposes. The employer owns the car and bears all running and maintenance expenses. What is the taxable perquisite for the full year?",
    options: ["₹32,400", "₹21,600", "₹39,600", "₹10,800"],
    explanation:
      "Rule 3(2): car up to 1.6 litres, mixed use, expenses borne by the employer — ₹1,800 per month, plus ₹900 per month for the chauffeur. (1,800 + 900) × 12 = ₹32,400. ₹21,600 forgets the chauffeur; ₹39,600 uses the ₹2,400 rate that applies only above 1.6 litres.",
  },
  {
    chapter: SALARY,
    text: "Mr. P, a private-sector employee who also receives gratuity, commutes 60% of his pension and receives ₹6,00,000. How much of the commuted pension is taxable?",
    options: ["₹2,66,667", "₹1,00,000", "₹4,00,000", "Nil"],
    explanation:
      "Section 10(10A): first gross up to the FULL commuted value — ₹6,00,000 ÷ 60% = ₹10,00,000. Where gratuity is also received, 1/3 of the full value is exempt = ₹3,33,333. Taxable = ₹6,00,000 − ₹3,33,333 = ₹2,66,667. ₹1,00,000 uses the 1/2 fraction (for those NOT receiving gratuity); ₹4,00,000 takes 1/3 of the amount received instead of the full value. Government employees get full exemption.",
  },
  {
    chapter: SALARY,
    text: "During PY 2025-26 an employer contributes ₹5,00,000 to an employee's recognised provident fund (within 12% of salary) and ₹3,50,000 to his NPS account. Ignoring accretions, how much is taxable as a perquisite u/s 17(2)(vii)?",
    options: ["₹1,00,000", "Nil", "₹8,50,000", "₹3,50,000"],
    explanation:
      "Section 17(2)(vii): the AGGREGATE of the employer's contributions to recognised provident fund, NPS and approved superannuation fund in excess of ₹7,50,000 in a year is a taxable perquisite. ₹5,00,000 + ₹3,50,000 = ₹8,50,000; the excess ₹1,00,000 is taxable (and the annual accretion on that excess is taxable too u/s 17(2)(viia)).",
  },

  // ───────────── House Property ─────────────
  {
    chapter: HP,
    text: "A let-out house has municipal value ₹3,00,000, fair rent ₹3,40,000, standard rent ₹3,20,000 and actual rent received ₹3,60,000 (no vacancy). The owner paid municipal taxes of ₹30,000 and interest on the housing loan of ₹1,50,000. What is the income from house property?",
    options: ["₹81,000", "₹53,000", "₹1,02,000", "₹72,000"],
    explanation:
      "Expected rent = higher of municipal value and fair rent (₹3,40,000), capped at standard rent = ₹3,20,000. Gross annual value = higher of expected rent and actual rent = ₹3,60,000. Less municipal taxes paid by owner ₹30,000 → NAV ₹3,30,000. Less 30% of NAV ₹99,000 and interest ₹1,50,000 → ₹81,000. ₹53,000 uses expected rent as GAV; ₹1,02,000 forgets municipal taxes; ₹72,000 takes 30% on GAV instead of NAV.",
  },
  {
    chapter: HP,
    text: "Which statement about deduction of municipal taxes from gross annual value is correct?",
    options: [
      "Deductible only when actually paid by the owner during the previous year, even if they relate to an earlier year",
      "Deductible on accrual basis for the year to which they relate, whether paid or not",
      "Deductible even when borne by the tenant, since the property is the owner's",
      "Deductible only up to 30% of the gross annual value",
    ],
    explanation:
      "Proviso to section 23(1): municipal taxes are deducted in the year in which they are ACTUALLY PAID BY THE OWNER — irrespective of the year to which they relate. Taxes borne by the tenant, or merely due but unpaid, are not deductible. The 30% figure is the separate standard deduction u/s 24(a) on NAV.",
  },
  {
    chapter: HP,
    text: "Mr. C owns three houses, all occupied by him and his family for residence. For AY 2026-27 how are they treated?",
    options: [
      "Any two, at his option, have nil annual value; the third is deemed to be let out",
      "Only one can have nil annual value; the other two are deemed to be let out",
      "All three have nil annual value since none is actually let",
      "All three are deemed let out because he owns more than one house",
    ],
    explanation:
      "Section 23(2) and 23(4): the annual value of up to TWO houses can be taken as nil, at the assessee's option; any further house is deemed to be let out and taxed on its expected rent. Under the old regime the interest deduction for the two self-occupied houses together is capped at ₹2,00,000 (₹30,000 in the lower-limit cases).",
  },
  {
    chapter: HP,
    text: "For a LET-OUT property, interest payable for PY 2025-26 on the housing loan is ₹3,00,000 and the pre-construction interest instalment for the year is ₹60,000. What is the deduction u/s 24(b)?",
    options: ["₹3,60,000", "₹2,00,000", "₹3,00,000", "₹2,60,000"],
    explanation:
      "For a let-out (or deemed let-out) property there is NO ceiling on interest u/s 24(b): ₹3,00,000 + ₹60,000 = ₹3,60,000. The ₹2,00,000 limit applies only to self-occupied property. Do not confuse it with section 71(3A), which separately caps the SET-OFF of house property loss against other heads at ₹2,00,000 — that is a set-off rule, not a limit on the deduction.",
  },
  {
    chapter: HP,
    text: "In PY 2025-26 Mr. D receives arrears of rent of ₹1,00,000 relating to a house he had sold in 2023. How much is taxable in PY 2025-26?",
    options: [
      "₹70,000, under 'Income from house property'",
      "₹1,00,000, under 'Income from other sources'",
      "Nil — he no longer owns the property",
      "₹1,00,000, under 'Income from house property'",
    ],
    explanation:
      "Section 25A: arrears of rent (and unrealised rent recovered later) are taxed as income from house property in the YEAR OF RECEIPT, whether or not the assessee still owns the property, after a flat 30% deduction. ₹1,00,000 − ₹30,000 = ₹70,000.",
  },
  {
    chapter: HP,
    text: "A resident individual who pays tax under the NEW regime has a loss of ₹1,50,000 from a let-out house property and salary income of ₹10,00,000. How is the loss treated in the current year?",
    options: [
      "It cannot be set off against the salary income",
      "It is fully set off against salary, as it is within ₹2,00,000",
      "Only ₹75,000 can be set off against salary",
      "It is set off against salary and the balance carried forward for 8 years",
    ],
    explanation:
      "Section 115BAC(2): under the new regime, a loss under the head 'Income from house property' cannot be set off against income under any other head. (Interest on a self-occupied house is not deductible at all in the new regime.) The ₹2,00,000 inter-head set-off u/s 71(3A) is an old-regime rule.",
  },
  {
    chapter: HP,
    text: "A self-occupied house is co-owned by two brothers in equal, definite shares; both are in the old regime and each pays interest of ₹2,40,000 on his share of the loan. What interest can EACH claim u/s 24(b)?",
    options: ["₹2,00,000", "₹1,00,000", "₹2,40,000", "₹30,000"],
    explanation:
      "Section 26: where shares are definite and ascertainable, each co-owner is assessed separately on his share, and the self-occupied interest ceiling of ₹2,00,000 applies to EACH co-owner individually — it is not split between them. So each claims ₹2,00,000 (assuming the loan conditions for the higher limit are met).",
  },

  // ───────────── PGBP ─────────────
  {
    chapter: PGBP,
    text: "A trader pays ₹32,000 in cash in a single day to a transport operator for hire of a goods carriage. How much is disallowed u/s 40A(3)?",
    options: ["Nil", "₹32,000", "₹22,000", "₹12,000"],
    explanation:
      "The general limit u/s 40A(3) is ₹10,000 per person per day, but for payments made for plying, hiring or leasing GOODS CARRIAGES the limit is ₹35,000. ₹32,000 is within it, so nothing is disallowed. Where the limit IS crossed, the whole payment is disallowed — never just the excess.",
  },
  {
    chapter: PGBP,
    text: "X Ltd. buys goods from a registered SMALL enterprise (a manufacturer) on 10 March 2026 on written credit terms of 45 days. The bill is paid on 30 April 2026; X Ltd. files its return in October 2026. When is the purchase deductible?",
    options: [
      "In PY 2026-27, the year of actual payment",
      "In PY 2025-26, because it was paid before the due date of the return",
      "In PY 2025-26 on accrual, as the goods were received that year",
      "It is never deductible, since the MSMED time limit was breached",
    ],
    explanation:
      "Section 43B(h): a sum payable to a micro or small enterprise beyond the time limit in section 15 of the MSMED Act (45 days with a written agreement, 15 days without) is deductible only in the year of ACTUAL PAYMENT. Due date was 24 April 2026; payment on 30 April is late, so it is disallowed in PY 2025-26 and allowed in PY 2026-27. The relief for payment before the return due date does NOT apply to clause (h).",
  },
  {
    chapter: PGBP,
    text: "Mr. E, a resident trader, has a turnover of ₹2.40 crore in PY 2025-26, of which 4% was received in cash and the rest through banking channels. What is his income under section 44AD?",
    options: [
      "₹14,59,200",
      "₹19,20,000",
      "₹14,40,000",
      "He is not eligible — turnover exceeds ₹2 crore",
    ],
    explanation:
      "The ₹2 crore limit rises to ₹3 crore where cash receipts do not exceed 5% of turnover — so he is eligible. Income = 6% on digital receipts (96% × ₹2.40 cr = ₹2,30,40,000 → ₹13,82,400) + 8% on cash receipts (₹9,60,000 → ₹76,800) = ₹14,59,200. Applying 8% or 6% to the whole turnover gives the two wrong figures.",
  },
  {
    chapter: PGBP,
    text: "Dr. F, a resident medical practitioner, has gross receipts of ₹60 lakh in PY 2025-26, entirely through banking channels. Under section 44ADA her presumptive income is:",
    options: [
      "₹30,00,000",
      "₹3,60,000",
      "₹4,80,000",
      "Not available — receipts exceed ₹50 lakh",
    ],
    explanation:
      "Section 44ADA: 50% of gross receipts for specified professionals. The ₹50 lakh limit rises to ₹75 lakh where cash receipts do not exceed 5% of gross receipts, so ₹60 lakh qualifies. 50% × ₹60,00,000 = ₹30,00,000. The 6% and 8% rates belong to section 44AD (business), not 44ADA.",
  },
  {
    chapter: PGBP,
    text: "A transporter owns 2 heavy goods vehicles of 15 tonnes gross weight each for the whole year, and 3 other goods vehicles for 8 months and 10 days. Under section 44AE his income is:",
    options: ["₹5,62,500", "₹5,40,000", "₹3,82,500", "₹6,30,000"],
    explanation:
      "Section 44AE: heavy goods vehicle — ₹1,000 per tonne of gross vehicle weight per month or PART of a month; other vehicles — ₹7,500 per month or part. Heavy: 1,000 × 15 × 12 × 2 = ₹3,60,000. Others: 8 months 10 days counts as 9 months → 7,500 × 9 × 3 = ₹2,02,500. Total ₹5,62,500. Available only if he owns not more than 10 goods carriages at any time in the year.",
  },
  {
    chapter: PGBP,
    text: "Mr. S, an individual manufacturer who has opted out of the new regime (old regime), buys new machinery for ₹20,00,000 and puts it to use on 15 November 2025. The block rate is 15%. What is the total depreciation for PY 2025-26?",
    options: ["₹3,50,000", "₹7,00,000", "₹1,50,000", "₹5,50,000"],
    explanation:
      "Put to use for less than 180 days, so both normal and additional depreciation are halved. Normal: 15% × 50% × ₹20,00,000 = ₹1,50,000. Additional u/s 32(1)(iia): 20% × 50% = ₹2,00,000 (the other half is allowed next year). Total ₹3,50,000. Additional depreciation is NOT available under the new regime — which is why the question fixes the old regime.",
  },
  {
    chapter: PGBP,
    text: "A firm pays ₹10,00,000 to a resident contractor in PY 2025-26 without deducting tax at source, although section 194C applied. What is disallowed in computing business income?",
    options: ["₹3,00,000", "₹10,00,000", "Nil", "₹1,00,000"],
    explanation:
      "Section 40(a)(ia): for payments to RESIDENTS on which tax was deductible but not deducted (or deducted and not paid by the return due date), 30% of the sum is disallowed — ₹3,00,000 — and allowed in the year the tax is eventually paid. The 100% disallowance is u/s 40(a)(i), for payments to non-residents.",
  },
  {
    chapter: PGBP,
    text: "An employer deducts ₹2,00,000 from employees' salaries as their provident fund contribution for March 2026 and deposits it after the due date under the PF law, but before the due date for filing the return. The treatment is:",
    options: [
      "Taxable as the employer's income u/s 2(24)(x), with no deduction",
      "Deductible u/s 43B since it was paid before the return due date",
      "Deductible in the year of payment",
      "Neither income nor deductible — it is the employees' money",
    ],
    explanation:
      "Employees' contributions are first the employer's income u/s 2(24)(x); the deduction u/s 36(1)(va) is available ONLY if deposited by the due date under the relevant fund's law. Section 43B's 'before the return due date' relief covers the EMPLOYER'S own contribution, not the employees' share — a distinction settled by the Supreme Court in Checkmate Services and by statute.",
  },
  {
    chapter: PGBP,
    text: "A company spends ₹5,00,000 on corporate social responsibility activities required by section 135 of the Companies Act, 2013. In computing business income this expenditure is:",
    options: [
      "Not deductible u/s 37(1)",
      "Fully deductible as it is a statutory obligation",
      "Deductible to the extent of 50%",
      "Deductible only if paid by account payee cheque",
    ],
    explanation:
      "Explanation 2 to section 37(1) deems CSR expenditure u/s 135 of the Companies Act NOT to be incurred for the purposes of business, so it is disallowed under section 37. (It may still qualify under a specific section such as 35 or 80G if its conditions are independently met.)",
  },
  {
    chapter: PGBP,
    text: "A partnership firm has a book profit of ₹10,00,000 for PY 2025-26 and the deed authorises remuneration to working partners. What is the maximum remuneration deductible u/s 40(b)?",
    options: ["₹7,80,000", "₹6,00,000", "₹9,00,000", "₹5,40,000"],
    explanation:
      "Section 40(b)(v), as amended from AY 2025-26: on the first ₹6,00,000 of book profit — ₹3,00,000 or 90% of book profit, whichever is higher → 90% × 6,00,000 = ₹5,40,000; on the balance ₹4,00,000 — 60% = ₹2,40,000. Total ₹7,80,000. The older slab (first ₹3,00,000 at 90%, ₹1,50,000 floor) no longer applies. Interest to partners stays capped at 12% p.a.",
  },

  // ───────────── Capital Gains ─────────────
  {
    chapter: CG,
    text: "Which of the following is a SHORT-TERM capital asset when sold in PY 2025-26?",
    options: [
      "Unlisted shares held for 20 months",
      "Listed equity shares held for 14 months",
      "Land held for 25 months",
      "Units of an equity-oriented fund held for 13 months",
    ],
    explanation:
      "Section 2(42A): only two holding periods now exist — 12 months for listed securities, units of equity-oriented funds and zero-coupon bonds; 24 months for everything else. Unlisted shares need more than 24 months, so 20 months is short-term. The old 36-month period was removed by the Finance (No. 2) Act, 2024.",
  },
  {
    chapter: CG,
    text: "A resident individual sells in November 2025 a plot of land acquired in 2015. How is the long-term capital gain taxed u/s 112?",
    options: [
      "At the lower of 12.5% without indexation or 20% with indexation",
      "At 20% with indexation only",
      "At 12.5% without indexation only",
      "At slab rates, since indexation has been withdrawn",
    ],
    explanation:
      "For land or building acquired BEFORE 23 July 2024, a resident individual or HUF computes tax both ways — 12.5% without indexation and 20% with indexation — and pays the LOWER (proviso to section 112). For assets acquired on or after 23 July 2024, and for all other assessees, it is 12.5% without indexation only.",
  },
  {
    chapter: CG,
    text: "Mr. G bought 500 listed equity shares in 2016 at ₹100 each. Their fair market value on 31 January 2018 was ₹300. He sells them in PY 2025-26 at ₹280 each (STT paid). What is the long-term capital gain u/s 112A?",
    options: ["Nil", "₹90,000", "Loss of ₹10,000", "₹15,000"],
    explanation:
      "Section 55(2)(ac): cost of acquisition = higher of (a) actual cost ₹100 and (b) the LOWER of FMV on 31.1.2018 (₹300) and sale price (₹280) = ₹280. Cost ₹280, sale ₹280 → gain nil. The grandfathering rule can reduce a gain to nil but never manufactures a loss — hence not ₹10,000 loss. ₹90,000 ignores grandfathering altogether.",
  },
  {
    chapter: CG,
    text: "A resident individual earns a short-term capital gain of ₹2,00,000 in December 2025 on listed equity shares (STT paid). Ignoring cess, the tax u/s 111A is:",
    options: ["₹40,000", "₹30,000", "₹25,000", "₹9,375"],
    explanation:
      "Section 111A: 20% for transfers on or after 23 July 2024 → ₹2,00,000 × 20% = ₹40,000. ₹30,000 uses the old 15% rate. ₹9,375 wrongly applies the ₹1,25,000 exemption and 12.5% rate — those belong to section 112A (LONG-term gains), not 111A.",
  },
  {
    chapter: CG,
    text: "Mrs. H sells a residential house and earns a long-term capital gain of ₹1.80 crore. Within the time allowed she buys TWO residential houses in India for ₹90 lakh each. She has never used this option before. The exemption u/s 54 is:",
    options: [
      "₹1.80 crore",
      "₹90 lakh — only one house qualifies",
      "Nil — investment in two houses is not permitted",
      "₹1.25 crore",
    ],
    explanation:
      "Section 54: where the capital gain does not exceed ₹2 crore, the assessee may, ONCE in a lifetime, invest in two residential houses in India. Gain ₹1.80 crore ≤ ₹2 crore and it is her first use, so the full ₹1.80 crore is exempt. Separately, the cost of the new asset counted for sections 54 and 54F is capped at ₹10 crore.",
  },
  {
    chapter: CG,
    text: "Mr. I sells gold (a long-term capital asset) for a net consideration of ₹50 lakh, with a capital gain of ₹20 lakh, and invests ₹30 lakh in a new residential house. He owns no other house. What is the taxable capital gain after section 54F?",
    options: ["₹8,00,000", "Nil", "₹20,00,000", "₹12,00,000"],
    explanation:
      "Section 54F exempts the gain in the proportion that the amount INVESTED bears to the NET CONSIDERATION: ₹20 lakh × 30/50 = ₹12 lakh exempt, so ₹8 lakh is taxable. Under section 54 only the gain needs to be invested; under 54F the whole net consideration must be invested for full exemption — the difference examiners test.",
  },
  {
    chapter: CG,
    text: "A building is sold for ₹50 lakh. The value adopted by the stamp valuation authority is ₹54 lakh. The full value of consideration u/s 50C is:",
    options: ["₹50 lakh", "₹54 lakh", "₹52 lakh", "₹55 lakh"],
    explanation:
      "Section 50C: the stamp duty value replaces the actual consideration only if it exceeds 110% of the consideration. 110% × ₹50 lakh = ₹55 lakh; ₹54 lakh is within it, so the actual ₹50 lakh stands. Had the stamp value been ₹56 lakh, the whole ₹56 lakh would be adopted — not just the excess.",
  },
  {
    chapter: CG,
    text: "A block of assets has an opening WDV of ₹5,00,000. An asset costing ₹2,00,000 is added, and during the year ALL the assets in the block are sold for ₹9,00,000. Some assets had been held for 10 years. The result is:",
    options: [
      "Short-term capital gain of ₹2,00,000",
      "Long-term capital gain of ₹2,00,000",
      "Business income of ₹2,00,000 as balancing charge",
      "Short-term capital gain of ₹4,00,000",
    ],
    explanation:
      "Section 50: on depreciable assets the gain is ALWAYS short-term, whatever the holding period. Sale ₹9,00,000 − (opening WDV ₹5,00,000 + additions ₹2,00,000) = ₹2,00,000 STCG. No depreciation is allowed for the year since the block has ceased to exist.",
  },
  {
    chapter: CG,
    text: "A jeweller converts a capital asset (gold held as investment) into stock-in-trade in PY 2024-25 and sells that stock in PY 2025-26. The capital gain is:",
    options: [
      "Taxable in PY 2025-26, taking the fair market value on the date of conversion as consideration",
      "Taxable in PY 2024-25, the year of conversion",
      "Taxable in PY 2025-26, taking the actual sale price as consideration",
      "Not taxable — conversion is not a transfer",
    ],
    explanation:
      "Section 45(2): conversion of a capital asset into stock-in-trade IS a transfer, but the capital gain is charged in the year the stock is actually SOLD, using the fair market value on the date of conversion as full value of consideration. The difference between the sale price and that FMV is business income.",
  },
  {
    chapter: CG,
    text: "A father bought a plot in 2012 and gifted it to his son in 2024. The son sells it in 2025. For the son's capital gain computation:",
    options: [
      "Cost is the father's cost, and the holding period includes the father's — so it is long-term",
      "Cost is the stamp value on the date of gift, and the holding period starts from the gift",
      "Cost is nil, since the son paid nothing",
      "No capital gain arises, because a gifted asset is exempt on sale",
    ],
    explanation:
      "A gift is not a transfer for the donor u/s 47(iii). For the donee, section 49(1) deems the cost to be the cost to the PREVIOUS OWNER, and section 2(42A) includes the previous owner's holding period. So the asset is long-term and the father's 2012 cost is used.",
  },
  {
    chapter: CG,
    text: "In October 2025 a domestic company buys back shares from Mr. J for ₹5,00,000; he had acquired them for ₹3,00,000. In Mr. J's hands:",
    options: [
      "₹5,00,000 is taxed as dividend, and a capital loss of ₹3,00,000 arises",
      "₹2,00,000 is taxed as capital gain",
      "The receipt is exempt, since the company pays buyback tax",
      "₹2,00,000 is taxed as dividend",
    ],
    explanation:
      "For buybacks on or after 1 October 2024, the amount received is deemed DIVIDEND u/s 2(22)(f), taxed in full in the shareholder's hands with no deduction for cost. The consideration for capital gains purposes is taken as nil, so the cost of ₹3,00,000 becomes a CAPITAL LOSS available for set-off and carry forward. The company no longer pays buyback tax u/s 115QA.",
  },

  // ───────────── Other Sources ─────────────
  {
    chapter: OS,
    text: "Mr. K buys a flat for ₹40 lakh; the stamp duty value is ₹43 lakh. What is taxable in his hands u/s 56(2)(x)?",
    options: ["Nil", "₹3,00,000", "₹2,50,000", "₹43,00,000"],
    explanation:
      "Section 56(2)(x): the difference is taxed only if the stamp value exceeds the consideration by more than the HIGHER of ₹50,000 and 10% of the consideration. 10% of ₹40 lakh = ₹4 lakh; the difference of ₹3 lakh is within it, so nothing is taxable. The same 10% tolerance appears in sections 50C and 43CA.",
  },
  {
    chapter: OS,
    text: "On the occasion of her marriage Ms. L receives cash gifts of ₹3,00,000 from friends and former colleagues, none of whom is a relative. How much is taxable under 'Income from other sources'?",
    options: ["Nil", "₹3,00,000", "₹2,00,000", "₹2,50,000"],
    explanation:
      "Section 56(2)(x) does not apply to any sum received by an individual on the occasion of his or her OWN marriage — from anyone, relative or not, without limit. So the whole ₹3,00,000 is exempt. (Gifts on other occasions from non-relatives are fully taxable once the aggregate exceeds ₹50,000.)",
  },
  {
    chapter: OS,
    text: "Mrs. M receives a family pension of ₹1,20,000 in PY 2025-26 and pays tax under the NEW regime. The amount taxable is:",
    options: ["₹95,000", "₹1,05,000", "₹80,000", "₹1,20,000"],
    explanation:
      "Section 57(iia): deduction = lower of 1/3 of the pension (₹40,000) and ₹25,000 in the new regime → ₹25,000. Taxable ₹95,000. In the OLD regime the cap is ₹15,000, giving ₹1,05,000. Family pension is taxed under 'Other sources', never under 'Salaries' — there is no employer-employee relationship with the recipient.",
  },
  {
    chapter: OS,
    text: "Mr. N earns dividend of ₹1,00,000. He paid interest of ₹30,000 on money borrowed to buy the shares and ₹5,000 as collection commission. His taxable dividend income is:",
    options: ["₹80,000", "₹65,000", "₹70,000", "₹1,00,000"],
    explanation:
      "Proviso to section 57: against dividend income, ONLY interest expense is deductible, and only up to 20% of the dividend. 20% × ₹1,00,000 = ₹20,000 → taxable ₹80,000. Commission, remuneration and any other expense are not deductible at all.",
  },
  {
    chapter: OS,
    text: "A resident individual in the NEW (default) regime has lottery winnings of ₹2,00,000 as his ONLY income for PY 2025-26. The tax payable (including cess) is:",
    options: ["₹62,400", "Nil — income is below the basic exemption limit", "₹60,000", "₹10,400"],
    explanation:
      "Section 115BB: winnings from lotteries, crossword puzzles, races, card games and the like are taxed at a flat 30% with NO basic exemption and NO deductions; and in the new regime the section 87A rebate is limited to tax at slab rates, so it gives nothing against this. 30% × ₹2,00,000 = ₹60,000 + 4% cess = ₹62,400. Winnings from ONLINE games are taxed the same way under section 115BBJ, on net winnings.",
  },
  {
    chapter: OS,
    text: "In PY 2025-26 Mr. O receives interest of ₹4,00,000 on enhanced compensation for land compulsorily acquired, relating to several earlier years. How much is taxable in PY 2025-26?",
    options: ["₹2,00,000", "₹4,00,000", "Nil — it is spread back to the years of accrual", "₹2,80,000"],
    explanation:
      "Section 145B(1) taxes interest on compensation or enhanced compensation in the year of RECEIPT, and section 57(iv) allows a flat 50% deduction — nothing else. 50% × ₹4,00,000 = ₹2,00,000 taxable under 'Income from other sources'.",
  },

  // ───────────── Computation of Total Income ─────────────
  {
    chapter: COMP,
    text: "A resident individual (aged 40) has a total income of exactly ₹12,00,000 for AY 2026-27, all taxable at normal rates, under the NEW regime. His tax liability is:",
    options: ["Nil", "₹62,400", "₹60,000", "₹83,200"],
    explanation:
      "New regime slabs: ₹4-8 lakh at 5% = ₹20,000; ₹8-12 lakh at 10% = ₹40,000; total ₹60,000. Rebate u/s 87A covers tax up to ₹60,000 where total income does not exceed ₹12,00,000 → tax nil. The rebate is given before cess, so there is no cess either.",
  },
  {
    chapter: COMP,
    text: "A resident individual has a total income of ₹12,10,000 for AY 2026-27 under the NEW regime, all at normal rates. What is his tax liability including cess?",
    options: ["₹10,400", "₹63,960", "Nil", "₹1,560"],
    explanation:
      "Tax on ₹12,10,000 = ₹60,000 + 15% × ₹10,000 = ₹61,500. No rebate, as income exceeds ₹12 lakh — but MARGINAL RELIEF applies: tax cannot exceed the income above ₹12,00,000, i.e. ₹10,000. Add 4% cess → ₹10,400. ₹63,960 forgets marginal relief; it would leave him worse off than someone earning exactly ₹12 lakh.",
  },
  {
    chapter: COMP,
    text: "Compute the tax (including cess) on a total income of ₹16,00,000 for AY 2026-27 under the NEW regime, all at normal rates.",
    options: ["₹1,24,800", "₹1,20,000", "₹1,56,000", "₹93,600"],
    explanation:
      "₹0-4 lakh nil; ₹4-8 lakh at 5% = ₹20,000; ₹8-12 lakh at 10% = ₹40,000; ₹12-16 lakh at 15% = ₹60,000. Total ₹1,20,000 + 4% cess ₹4,800 = ₹1,24,800. Learn the cumulative figures: ₹20,000 at 8L, ₹60,000 at 12L, ₹1,20,000 at 16L, ₹2,00,000 at 20L, ₹3,00,000 at 24L.",
  },
  {
    chapter: COMP,
    text: "A resident individual in the NEW regime has normal income of ₹8,00,000 and a short-term capital gain u/s 111A of ₹3,00,000 (total income ₹11,00,000) for AY 2026-27. His tax including cess is:",
    options: ["₹62,400", "Nil", "₹83,200", "₹20,800"],
    explanation:
      "From AY 2026-27 the section 87A rebate in the new regime is NOT available against tax on income charged at special rates such as section 111A or 112. Tax on normal income ₹8,00,000 = ₹20,000, fully wiped out by the rebate. Tax on STCG = 20% × ₹3,00,000 = ₹60,000, with no rebate. Add 4% cess → ₹62,400. 'Nil' assumes the rebate covers everything because total income is under ₹12 lakh — the trap.",
  },
  {
    chapter: COMP,
    text: "A resident individual aged 62 has a total income of ₹7,00,000 for AY 2026-27 under the OLD regime. His tax including cess is:",
    options: ["₹52,000", "₹54,600", "₹50,000", "₹41,600"],
    explanation:
      "Old regime, senior citizen (60 to below 80): exemption ₹3,00,000. ₹3-5 lakh at 5% = ₹10,000; ₹5-7 lakh at 20% = ₹40,000; total ₹50,000 + 4% cess = ₹52,000. No rebate, as income exceeds ₹5 lakh. ₹54,600 uses the ordinary ₹2,50,000 exemption; ₹41,600 uses the super-senior ₹5,00,000 exemption (80 and above). The new regime has NO higher exemption for seniors.",
  },
  {
    chapter: COMP,
    text: "An individual in the NEW regime has a total income of ₹60 lakh for AY 2026-27. At what rate is surcharge levied, and what is the maximum surcharge rate in the new regime?",
    options: [
      "10% on this income; the maximum is 25%",
      "15% on this income; the maximum is 37%",
      "10% on this income; the maximum is 37%",
      "No surcharge below ₹1 crore; the maximum is 25%",
    ],
    explanation:
      "Surcharge: 10% above ₹50 lakh, 15% above ₹1 crore, 25% above ₹2 crore. In the NEW regime the top rate is capped at 25%; the 37% rate above ₹5 crore survives only in the old regime. Surcharge on dividend income and on gains u/s 111A, 112 and 112A never exceeds 15%.",
  },
  {
    chapter: COMP,
    text: "In which order is the tax liability of an individual built up?",
    options: [
      "Tax on total income → rebate u/s 87A → surcharge → health and education cess",
      "Tax on total income → cess → rebate u/s 87A → surcharge",
      "Tax on total income → surcharge → cess → rebate u/s 87A",
      "Rebate u/s 87A → tax on total income → cess → surcharge",
    ],
    explanation:
      "Compute tax on total income at slab and special rates, deduct the section 87A rebate, add surcharge (with marginal relief) and then add 4% health and education cess on tax plus surcharge. Total income is first rounded to the nearest ₹10 (section 288A), as is the final tax (section 288B).",
  },

  // ───────────── Advance Tax, TDS and TCS ─────────────
  {
    chapter: TDS,
    text: "A company pays rent of ₹45,000 per month (₹5,40,000 a year) to a resident for an office building in PY 2025-26. Is tax deductible u/s 194-I?",
    options: [
      "No — the rent does not exceed ₹50,000 per month",
      "Yes, at 10%, since annual rent exceeds ₹2,40,000",
      "Yes, at 2%",
      "Yes, at 10%, but only on the excess over ₹2,40,000",
    ],
    explanation:
      "From 1 April 2025 the section 194-I threshold is ₹50,000 PER MONTH or part of a month (earlier ₹2,40,000 per year). ₹45,000 a month is below it, so no TDS. Where it applies: 10% for land, building and furniture; 2% for plant and machinery — and on the whole rent, not the excess.",
  },
  {
    chapter: TDS,
    text: "A salaried individual (not liable to tax audit) pays rent of ₹60,000 per month for his residence throughout PY 2025-26 to a resident landlord. What tax must he deduct u/s 194-IB?",
    options: ["₹14,400", "₹36,000", "₹72,000", "Nil — individuals need not deduct tax on rent"],
    explanation:
      "Section 194-IB: an individual or HUF not covered by section 194-I who pays rent exceeding ₹50,000 a month must deduct tax at 2% (reduced from 5% with effect from 1 October 2024), once, in the last month of the year or tenancy. ₹60,000 × 12 × 2% = ₹14,400. No TAN is required.",
  },
  {
    chapter: TDS,
    text: "A company pays ₹80,000 to a resident as fees for technical services in PY 2025-26. Tax deductible u/s 194J is:",
    options: ["₹1,600", "₹8,000", "₹600", "Nil"],
    explanation:
      "Section 194J: threshold ₹50,000 (raised from ₹30,000 from 1 April 2025). Rate is 2% for fees for TECHNICAL services (not being professional services), royalty for sale or distribution of films, and call centres; 10% for professional services. 2% × ₹80,000 = ₹1,600 — on the whole amount once the threshold is crossed, not on the excess.",
  },
  {
    chapter: TDS,
    text: "A company pays a contractor (a partnership firm) five bills of ₹25,000 each during PY 2025-26. Tax deductible u/s 194C is:",
    options: ["₹2,500", "₹1,250", "₹500", "Nil — no single bill exceeds ₹30,000"],
    explanation:
      "Section 194C applies if a single payment exceeds ₹30,000 OR the aggregate in the year exceeds ₹1,00,000. Aggregate is ₹1,25,000, so tax is deductible on the whole ₹1,25,000. Rate: 1% where the payee is an individual or HUF, 2% for any other payee — a firm → 2% = ₹2,500.",
  },
  {
    chapter: TDS,
    text: "In PY 2025-26 a partnership firm credits a partner with remuneration of ₹3,00,000 and interest on capital of ₹50,000. Tax to be deducted is:",
    options: ["₹35,000 u/s 194T", "Nil — payments to partners are outside TDS", "₹30,000 u/s 192", "₹5,000 u/s 194A"],
    explanation:
      "Section 194T, effective 1 April 2025: a firm paying salary, remuneration, commission, bonus or interest to a partner must deduct tax at 10% if the aggregate exceeds ₹20,000 in the year. 10% × ₹3,50,000 = ₹35,000. Before this section, payments to partners carried no TDS at all — sections 192 and 194A do not apply to them.",
  },
  {
    chapter: TDS,
    text: "Mr. Q, a resident aged 65, has only pension and interest income, with tax payable for the year of ₹40,000 after TDS. Is he liable to pay advance tax?",
    options: [
      "No — a resident senior citizen with no business or professional income is exempt",
      "Yes — the tax payable is ₹10,000 or more",
      "Yes, but in a single instalment by 15 March",
      "No — advance tax applies only above ₹50,000",
    ],
    explanation:
      "Advance tax is payable when the liability is ₹10,000 or more (section 208), but section 207(2) exempts a RESIDENT individual aged 60 or more who has no income under 'Profits and gains of business or profession'. Instalments for others: 15% by 15 June, 45% by 15 September, 75% by 15 December, 100% by 15 March.",
  },
  {
    chapter: TDS,
    text: "A resident individual remits ₹12,00,000 abroad under the Liberalised Remittance Scheme in PY 2025-26 for a purpose other than education or medical treatment. TCS u/s 206C(1G) is:",
    options: ["₹40,000", "₹2,40,000", "₹1,00,000", "₹10,000"],
    explanation:
      "From 1 April 2025 the threshold is ₹10,00,000 (raised from ₹7,00,000). For purposes other than education or medical treatment the rate is 20% on the amount EXCEEDING the threshold: 20% × ₹2,00,000 = ₹40,000. Education or medical remittances attract 5% above ₹10 lakh, and education funded by a loan from a specified financial institution attracts no TCS.",
  },
  {
    chapter: TDS,
    text: "A listed company pays a dividend of ₹9,500 to a resident individual shareholder by bank transfer in PY 2025-26. Tax deductible u/s 194 is:",
    options: ["Nil", "₹950", "₹450", "₹1,900"],
    explanation:
      "Section 194: no tax is deductible where the dividend paid to a resident individual in the year does not exceed ₹10,000 (raised from ₹5,000 from 1 April 2025) and is paid by a mode other than cash. Above the threshold, 10% applies on the whole dividend.",
  },
  {
    chapter: TDS,
    text: "A seller with turnover of ₹15 crore sells goods worth ₹80 lakh to one buyer in PY 2025-26. Must the seller collect TCS u/s 206C(1H)?",
    options: [
      "No — section 206C(1H) ceased to apply from 1 April 2025",
      "Yes, at 0.1% on ₹30 lakh",
      "Yes, at 0.1% on ₹80 lakh",
      "Yes, at 1% on ₹30 lakh",
    ],
    explanation:
      "The Finance Act, 2025 switched off TCS on sale of goods u/s 206C(1H) with effect from 1 April 2025. Only the buyer-side provision survives — section 194Q, TDS at 0.1% on purchases exceeding ₹50 lakh by a buyer whose turnover exceeded ₹10 crore in the preceding year.",
  },
  {
    chapter: TDS,
    text: "A buyer whose turnover was ₹12 crore in the preceding year purchases goods worth ₹70 lakh from a resident seller in PY 2025-26. Tax deductible u/s 194Q is:",
    options: ["₹2,000", "₹7,000", "₹20,000", "Nil"],
    explanation:
      "Section 194Q: a buyer with turnover above ₹10 crore in the immediately preceding year deducts 0.1% on purchases from a resident seller EXCEEDING ₹50 lakh in the year: 0.1% × ₹20,00,000 = ₹2,000. Note it is on the excess over ₹50 lakh — unlike most TDS sections, which apply to the whole amount.",
  },

  // ───────────── Deductions ─────────────
  {
    chapter: DED,
    text: "Mr. R, a private-sector employee in the NEW regime, has salary (basic + DA) of ₹10,00,000. His employer contributes ₹1,50,000 to his NPS account. The deduction u/s 80CCD(2) is:",
    options: ["₹1,40,000", "₹1,00,000", "₹1,50,000", "Nil — Chapter VI-A is not available in the new regime"],
    explanation:
      "Section 80CCD(2) is one of the few Chapter VI-A deductions that SURVIVES in the new regime. The limit is 14% of salary (basic + DA) for all employers under the new regime; in the old regime it is 10% for non-government employers. 14% × ₹10,00,000 = ₹1,40,000. It is over and above the ₹1,50,000 ceiling of section 80CCE.",
  },
];
