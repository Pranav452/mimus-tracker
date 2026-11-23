// Hand-written question bank — GST, the chapters she never practised before the
// September 2026 attempt (ITC, registration, exemptions, returns, payment).
// Law: CGST/IGST Acts and rules as in force for January 2027 (cut-off 30 June
// 2026); GST 2.0 rates — 5%, 18%, 40% only.
//
// Convention: the CORRECT option is always written FIRST. seed-bank.ts shuffles
// the options deterministically, so the key cannot drift from the answer.
import type { BankQuestion } from "../seed-bank";

const ITC = "Input Tax Credit";
const REG = "Registration";
const EXEMPT = "Exemptions from GST";
const CHARGE = "Charge of GST (Levy, Composition, RCM)";
const RETURNS = "Returns";
const PAYMENT = "Payment of Tax";
const TDSTCS = "TDS and TCS under GST";
const RECORDS = "Accounts and Records";
const INTRO = "Introduction to GST";
const EWAY = "E-way Bill";

export const BANK: BankQuestion[] = [
  // ───────────── Input Tax Credit ─────────────
  {
    chapter: ITC,
    text: "A consultancy company buys a 5-seater car for use by its directors and a goods truck for delivering its products. On which is input tax credit available?",
    options: [
      "Only on the truck",
      "On both",
      "Only on the car",
      "On neither — motor vehicles are always blocked",
    ],
    explanation:
      "Section 17(5)(a) blocks credit on motor vehicles for transport of PERSONS with seating capacity up to 13 (including the driver), unless used for further supply of such vehicles, passenger transport or driving training. Vehicles for transport of GOODS are not blocked at all. So the truck qualifies and the car does not; insurance and repairs follow the vehicle.",
  },
  {
    chapter: ITC,
    text: "A factory is obliged under the Factories Act to provide a canteen for its workers and engages an outdoor caterer. Is credit of the GST charged by the caterer available?",
    options: [
      "Yes — the supply is obligatory for the employer under a law",
      "No — outdoor catering is blocked u/s 17(5)(b) in all cases",
      "Yes, but only to the extent of 50%",
      "No — credit is never available on employee welfare",
    ],
    explanation:
      "Section 17(5)(b) blocks food and beverages, outdoor catering, health services, life and health insurance and similar items — but the proviso restores credit where it is OBLIGATORY for an employer to provide them to employees under any law for the time being in force. A canteen mandated by the Factories Act is the textbook case.",
  },
  {
    chapter: ITC,
    text: "A tax invoice is dated 10 February 2026. The recipient files its annual return for FY 2025-26 on 20 December 2026. What is the last date to take credit on this invoice?",
    options: ["30 November 2026", "20 December 2026", "20 October 2026", "31 March 2027"],
    explanation:
      "Section 16(4): credit must be taken by 30 November following the end of the financial year to which the invoice pertains, or the date of furnishing the annual return, WHICHEVER IS EARLIER. 30 November 2026 comes before 20 December 2026. The '20 October' date reflects the old rule tied to the September return, replaced from 1 October 2022.",
  },
  {
    chapter: ITC,
    text: "A registered person's purchase register shows eligible credit of ₹5,00,000 for the month, but his GSTR-2B reflects only ₹4,20,000 because two suppliers have not filed GSTR-1. How much credit can he take in GSTR-3B?",
    options: ["₹4,20,000", "₹5,00,000", "₹4,41,000", "₹4,62,000"],
    explanation:
      "Section 16(2)(aa) with rule 36(4): credit can be taken only to the extent the invoices have been furnished by the suppliers and are reflected in GSTR-2B. There is no longer any provisional credit — the earlier 20%, 10% and 5% buffers (which give the other figures) were withdrawn from 1 January 2022.",
  },
  {
    chapter: ITC,
    text: "A registered person makes taxable supplies of ₹80 lakh and exempt supplies of ₹20 lakh in a month. Common input tax credit, not attributable to either exclusively, is ₹1,00,000. How much must be reversed under rule 42?",
    options: ["₹20,000", "₹80,000", "Nil", "₹25,000"],
    explanation:
      "Section 17(2) with rule 42: common credit attributable to exempt supplies = common credit × exempt turnover ÷ total turnover = ₹1,00,000 × 20/100 = ₹20,000, to be reversed. The balance ₹80,000 is eligible. ₹25,000 divides by the taxable turnover instead of the total.",
  },
  {
    chapter: ITC,
    text: "A person becomes liable to registration and applies within 30 days. Under section 18(1)(a), on the day immediately preceding the date he became liable, he can take credit of tax paid on:",
    options: [
      "Inputs held in stock and inputs contained in semi-finished or finished goods held in stock",
      "Inputs and capital goods held on that day",
      "Capital goods only",
      "All inward supplies received in the preceding one year",
    ],
    explanation:
      "Section 18(1)(a) and (b) — new registration, compulsory or voluntary — allow credit only on INPUTS in stock, in semi-finished goods and in finished goods; capital goods are excluded. Credit on capital goods (reduced by 5 percentage points per quarter) comes only u/s 18(1)(c) and (d) — switching from composition, or an exempt supply becoming taxable. In every case the invoice must not be more than one year old.",
  },
  {
    chapter: ITC,
    text: "A banking company opts for the special scheme u/s 17(4). How much of its eligible input tax credit can it avail each month?",
    options: ["50%", "100%", "75%", "Only credit attributable to taxable supplies, computed under rule 42"],
    explanation:
      "Section 17(4): a banking company, financial institution or NBFC engaged in accepting deposits or extending loans may either follow the normal apportionment u/s 17(2) or opt to avail 50% of eligible credit every month, the rest lapsing. Once exercised, the option cannot be withdrawn during the remaining part of the financial year.",
  },
  {
    chapter: ITC,
    text: "Which statement about utilisation of input tax credit is correct?",
    options: [
      "CGST credit can never be used to pay SGST, and SGST credit can never be used to pay CGST",
      "SGST credit must be used against IGST before CGST credit is used against IGST",
      "IGST credit can be used only against IGST liability",
      "CGST credit must be exhausted before any IGST credit is used",
    ],
    explanation:
      "Section 49(5) with 49A: IGST credit is used FIRST — against IGST, then CGST and SGST in any order — and must be exhausted before CGST or SGST credit is touched. CGST credit pays CGST then IGST; SGST credit pays SGST then IGST, and only after CGST credit is unavailable for IGST. Cross-utilisation between CGST and SGST is never allowed.",
  },

  // ───────────── Registration ─────────────
  {
    chapter: REG,
    text: "Mr. A, a trader dealing EXCLUSIVELY in goods in Maharashtra, has an aggregate turnover of ₹35 lakh in the financial year, all intra-State. Is he liable to register?",
    options: [
      "No — the threshold for a supplier exclusively of goods there is ₹40 lakh",
      "Yes — the threshold is ₹20 lakh",
      "Yes — every supplier of goods must register",
      "No — the threshold is ₹50 lakh",
    ],
    explanation:
      "Section 22 with the notified relaxation: ₹40 lakh for a person engaged EXCLUSIVELY in supply of goods (in States that adopted it, Maharashtra included); ₹20 lakh for services or a mix of goods and services; ₹10 lakh for Manipur, Mizoram, Nagaland and Tripura. Add even one taxable service and his limit falls to ₹20 lakh. The ₹40 lakh limit is not available for ice cream, pan masala, tobacco and certain other notified goods.",
  },
  {
    chapter: REG,
    text: "Ms. B makes inter-State taxable supplies of GOODS worth ₹5 lakh in a year and has no other turnover. Is registration required?",
    options: [
      "Yes — inter-State taxable supply of goods requires compulsory registration regardless of turnover",
      "No — her turnover is below ₹40 lakh",
      "No — her turnover is below ₹20 lakh",
      "Only if she also supplies through an e-commerce operator",
    ],
    explanation:
      "Section 24(i): a person making any inter-State taxable supply must register irrespective of the threshold. A notification relaxes this for inter-State supply of SERVICES (the ₹20 lakh / ₹10 lakh limit applies), but NOT for goods. Other section 24 cases: casual and non-resident taxable persons, persons paying under reverse charge, e-commerce operators, and TDS deductors.",
  },
  {
    chapter: REG,
    text: "Compute aggregate turnover for the registration threshold: taxable intra-State supplies ₹18 lakh; exempt supplies ₹4 lakh; exports ₹3 lakh; inward supplies on which tax is paid under reverse charge ₹2 lakh.",
    options: ["₹25 lakh", "₹27 lakh", "₹18 lakh", "₹21 lakh"],
    explanation:
      "Section 2(6): aggregate turnover includes ALL taxable supplies, exempt supplies, exports and inter-State supplies of persons with the same PAN, computed on an all-India basis. It EXCLUDES the value of inward supplies on which tax is payable under reverse charge, and the GST and cess themselves. 18 + 4 + 3 = ₹25 lakh.",
  },
  {
    chapter: REG,
    text: "Mr. C became liable to registration on 1 August and applied on 20 September; registration was granted on 25 September. What is the effective date of registration?",
    options: ["25 September", "1 August", "20 September", "31 August"],
    explanation:
      "Rule 10: if the application is made within 30 days of becoming liable, registration is effective from the date of LIABILITY; if made later, from the date of GRANT. He applied after 30 days, so it is effective from 25 September — and he remains exposed for supplies made between 1 August and that date.",
  },
  {
    chapter: REG,
    text: "The certificate of registration issued to a casual taxable person is valid for:",
    options: [
      "The period specified in the application or 90 days, whichever is earlier, extendable by up to 90 days",
      "One year from the date of registration",
      "180 days, with no extension",
      "As long as he continues to make supplies in that State",
    ],
    explanation:
      "Section 27: registration of a casual or non-resident taxable person is valid for the period in the application or 90 days from the effective date, whichever is earlier; the proper officer may extend it by a further period not exceeding 90 days. Such a person must apply at least 5 days before commencing business and deposit the estimated tax in ADVANCE.",
  },
  {
    chapter: REG,
    text: "A registration is cancelled by the proper officer on his own motion. Within what time can the person apply for revocation of the cancellation?",
    options: [
      "90 days from service of the cancellation order",
      "30 days from service of the cancellation order",
      "180 days from service of the cancellation order",
      "One year from the date of cancellation",
    ],
    explanation:
      "Section 30 with rule 23: the application for revocation is to be made within 90 days of service of the cancellation order (increased from 30 days from 1 October 2023). The Commissioner or an authorised officer may extend this by a further period of up to 180 days on sufficient cause. Revocation is not available where registration was cancelled on the person's own request.",
  },

  // ───────────── Exemptions ─────────────
  {
    chapter: EXEMPT,
    text: "A hospital charges a patient ₹6,000 per day for a non-ICU room. Is the room rent exempt as a health care service?",
    options: [
      "No — room rent exceeding ₹5,000 per day (other than ICU/CCU/ICCU/NICU) is taxable",
      "Yes — all services by a clinical establishment are exempt",
      "Yes — but only for the first seven days",
      "No — all room charges in hospitals are taxable",
    ],
    explanation:
      "Health care services by a clinical establishment are exempt, with one carve-out: room charges (other than ICU, CCU, ICCU and NICU) exceeding ₹5,000 per day per person are taxable, without input tax credit to the hospital. A room at ₹5,000 or less, and any ICU-type room at any price, stay exempt.",
  },
  {
    chapter: EXEMPT,
    text: "Which of the following supplies is exempt from GST?",
    options: [
      "Services provided by a school to its students by way of education up to higher secondary",
      "Coaching for competitive examinations by a private institute",
      "Catering supplied by an outside contractor to a college",
      "Online courses sold by a private ed-tech company",
    ],
    explanation:
      "Services by an 'educational institution' to its students, faculty and staff are exempt — the term covers pre-school to higher secondary, education leading to a qualification recognised by law, and approved vocational courses. Private coaching centres and ed-tech courses fall outside it and are taxable. Catering, transport, security and housekeeping are exempt only when supplied to institutions up to higher secondary, not to colleges.",
  },
  {
    chapter: EXEMPT,
    text: "A residential flat is let to a REGISTERED company, which uses it as a residence for its staff. The GST position is:",
    options: [
      "Taxable — the company pays the tax under reverse charge",
      "Exempt — it is a residential dwelling used as a residence",
      "Taxable — the landlord pays under forward charge",
      "Exempt — only commercial property is taxable",
    ],
    explanation:
      "Renting a residential dwelling for use as a residence is exempt EXCEPT where it is rented to a registered person, in which case the registered recipient pays under reverse charge. One relaxation: if the registered person is a proprietor who rents it in his personal capacity for his own residence, and not on account of the business, the exemption continues.",
  },
  {
    chapter: EXEMPT,
    text: "Which of the following services relating to agricultural produce is exempt from GST?",
    options: [
      "Loading, unloading, packing, storage or warehousing of agricultural produce",
      "Storage of processed tea and coffee",
      "Renting of a cold storage for packaged frozen foods",
      "Warehousing of manufactured fertilisers for a dealer",
    ],
    explanation:
      "Services relating to cultivation and to agricultural produce — including loading, unloading, packing, storage and warehousing — are exempt. 'Agricultural produce' means produce on which either no further processing is done or only such processing as is usually done by a cultivator and does not alter its essential characteristics. Processed tea, coffee and packaged foods are outside the definition.",
  },
  {
    chapter: EXEMPT,
    text: "Which transport of passengers is exempt from GST?",
    options: [
      "Travel by a non-air-conditioned contract carriage, other than for tourism, charter or hire",
      "Travel by air in economy class between two metros",
      "Travel by an air-conditioned stage carriage",
      "Travel in a radio taxi",
    ],
    explanation:
      "Exempt passenger transport includes: non-AC contract carriage (excluding tourism, conducted tour, charter or hire), stage carriage other than air-conditioned, metro, monorail and tramway, inland waterways, and rail in classes other than first class or AC. Air travel is taxable (with a specific exemption only for the north-eastern States and Bagdogra), as are AC buses and radio taxis.",
  },

  // ───────────── Charge of GST ─────────────
  {
    chapter: CHARGE,
    text: "A trader registered under the composition scheme u/s 10(1) has a turnover of taxable supplies of ₹80 lakh in the State. His composition tax liability is:",
    options: ["₹80,000", "₹4,00,000", "₹40,000", "₹4,80,000"],
    explanation:
      "Composition rates (CGST + SGST together): 1% of turnover in the State for manufacturers; 1% of turnover of TAXABLE supplies for traders; 5% for restaurants; 6% under section 10(2A) for service providers up to ₹50 lakh. 1% × ₹80 lakh = ₹80,000. A composition dealer cannot collect tax from customers or take input tax credit, and issues a bill of supply.",
  },
  {
    chapter: CHARGE,
    text: "A goods transport agency (which has NOT opted to pay tax under forward charge) transports goods for a registered manufacturer and charges freight of ₹50,000. Who pays GST, and how much?",
    options: [
      "The manufacturer, ₹2,500 under reverse charge",
      "The GTA, ₹2,500 under forward charge",
      "The manufacturer, ₹9,000 under reverse charge",
      "No GST — transport of goods by road is exempt",
    ],
    explanation:
      "Section 9(3): GTA services to specified recipients (registered persons, factories, companies, firms and others) are taxed under reverse charge at 5% where the GTA has not opted for forward charge — the recipient pays ₹50,000 × 5% = ₹2,500. Transport of goods by road is exempt only when supplied by someone OTHER than a GTA or a courier agency.",
  },
  {
    chapter: CHARGE,
    text: "Which of the following persons is NOT eligible to opt for the composition scheme u/s 10(1)?",
    options: [
      "A manufacturer of ice cream",
      "A grocery retailer with turnover of ₹90 lakh",
      "A restaurant not serving alcohol, with turnover of ₹1.2 crore",
      "A manufacturer of furniture with turnover of ₹1 crore",
    ],
    explanation:
      "Manufacturers of notified goods — ice cream and edible ice, pan masala, tobacco and substitutes, aerated waters, and certain bricks and tiles — cannot opt for composition. Nor can anyone making inter-State outward supplies, supplying non-taxable goods, or supplying through an e-commerce operator required to collect TCS. The turnover limit is ₹1.5 crore (₹75 lakh in special category States).",
  },
  {
    chapter: CHARGE,
    text: "A company pays sitting fees of ₹1,00,000 to an independent director (not its employee). Who is liable to pay GST?",
    options: [
      "The company, under reverse charge",
      "The director, under forward charge",
      "No one — director's fees are outside GST",
      "The director, only if his turnover exceeds ₹20 lakh",
    ],
    explanation:
      "Services supplied by a director of a company or body corporate to that company are notified u/s 9(3): the COMPANY pays under reverse charge. This covers independent and non-executive directors. Remuneration paid to a whole-time director who is an employee — with TDS u/s 192 — is a service in the course of employment (Schedule III) and outside GST.",
  },

  // ───────────── Returns ─────────────
  {
    chapter: RETURNS,
    text: "Up to what aggregate turnover in the preceding financial year may a registered person opt for the QRMP scheme (quarterly returns, monthly payment)?",
    options: ["₹5 crore", "₹1.5 crore", "₹2 crore", "₹10 crore"],
    explanation:
      "QRMP is open to persons with aggregate turnover up to ₹5 crore in the preceding financial year. They file GSTR-1 and GSTR-3B quarterly but PAY tax monthly (fixed-sum or self-assessment method, by the 25th of the following month), and may upload B2B invoices monthly through the Invoice Furnishing Facility by the 13th.",
  },
  {
    chapter: RETURNS,
    text: "A composition taxpayer's annual return in GSTR-4 for FY 2025-26 is due by:",
    options: ["30 June 2026", "30 April 2026", "31 December 2026", "18 April 2026"],
    explanation:
      "From FY 2024-25 onwards GSTR-4 is due by 30 JUNE following the end of the financial year (earlier 30 April). Composition dealers also pay tax quarterly with a statement in CMP-08 by the 18th of the month after the quarter. 31 December is the due date for GSTR-9, the annual return of regular taxpayers.",
  },
  {
    chapter: RETURNS,
    text: "A regular taxpayer has aggregate turnover of ₹6 crore in FY 2025-26. Which annual filings are due by 31 December 2026?",
    options: [
      "GSTR-9, and a self-certified reconciliation statement in GSTR-9C",
      "GSTR-9 only",
      "GSTR-9, and GSTR-9C certified by a chartered accountant",
      "GSTR-9C only",
    ],
    explanation:
      "Section 44: the annual return in GSTR-9 is due by 31 December following the financial year. Where aggregate turnover exceeds ₹5 crore, a SELF-CERTIFIED reconciliation statement in GSTR-9C is also required. Certification by a chartered or cost accountant was removed with effect from FY 2020-21.",
  },
  {
    chapter: RETURNS,
    text: "After how long from its due date can a GSTR-3B no longer be furnished?",
    options: ["Three years", "One year", "Five years", "There is no time limit, subject to late fee"],
    explanation:
      "Sections 37(5), 39(11), 44(2) and 52(15): GSTR-1, GSTR-3B, GSTR-9 and GSTR-8 cannot be furnished after the expiry of THREE YEARS from their due date. Note also the sequencing rule: a return cannot be filed if the return for any previous tax period is still pending.",
  },
  {
    chapter: RETURNS,
    text: "A regular taxpayer with tax liability files his GSTR-3B 10 days late. The late fee u/s 47 is:",
    options: [
      "₹500 (₹25 CGST + ₹25 SGST per day)",
      "₹1,000 (₹50 CGST + ₹50 SGST per day)",
      "₹200 (₹10 CGST + ₹10 SGST per day)",
      "₹2,000 (₹100 CGST + ₹100 SGST per day)",
    ],
    explanation:
      "The statutory late fee of ₹100 per day under each Act stands reduced by notification to ₹25 per day under CGST and ₹25 under SGST — ₹50 a day in all — where there is a tax liability, and ₹10 + ₹10 = ₹20 a day for a nil return. 10 days × ₹50 = ₹500. Interest u/s 50 on the unpaid tax is separate from the late fee.",
  },

  // ───────────── Payment of Tax ─────────────
  {
    chapter: PAYMENT,
    text: "A registered person wrongly avails input tax credit of ₹1,00,000 in April but does NOT utilise it; his credit ledger balance stays above ₹1,00,000 until he reverses it in September. Interest u/s 50(3) is:",
    options: [
      "Nil — interest applies only when wrongly availed credit is also utilised",
      "18% per annum from April to September",
      "24% per annum from April to September",
      "18% per annum, but only for the month of reversal",
    ],
    explanation:
      "Section 50(3), as amended retrospectively: interest is payable only where credit has been wrongly availed AND UTILISED. Rule 88B treats credit as utilised only when the electronic credit ledger balance falls below the wrongly availed amount. Where it does apply, the notified rate is 18% per annum. Interest u/s 50(1) on delayed payment is likewise 18%, on the net cash liability.",
  },
  {
    chapter: PAYMENT,
    text: "Which liability can NOT be discharged by debiting the electronic credit ledger?",
    options: [
      "Tax payable under reverse charge",
      "Output IGST on inter-State supplies",
      "Output CGST on intra-State supplies",
      "Output tax on an advance received for services",
    ],
    explanation:
      "The electronic credit ledger can be used only for OUTPUT TAX. Tax under reverse charge is not 'output tax' of the recipient, so it must be paid in cash through the electronic cash ledger — though credit of it can be taken afterwards. Interest, penalty, late fee and any other amount must also be paid in cash.",
  },
  {
    chapter: PAYMENT,
    text: "In what order must a taxable person discharge his dues u/s 49(8)?",
    options: [
      "Self-assessed tax and dues of previous periods → self-assessed tax and dues of the current period → any other amount, including demands",
      "Demands u/s 73 or 74 → current period dues → previous period dues",
      "Current period dues → previous period dues → demands",
      "In any order the taxpayer chooses",
    ],
    explanation:
      "Section 49(8) fixes the order: (a) self-assessed tax and other dues relating to returns of PREVIOUS tax periods; (b) self-assessed tax and other dues of the CURRENT tax period; (c) any other amount payable, including demands determined u/s 73 or 74. The taxpayer cannot choose to pay the current month first and leave arrears.",
  },
  {
    chapter: PAYMENT,
    text: "What is the maximum amount that can be deposited by over-the-counter payment (cash, cheque or demand draft) per challan per tax period?",
    options: ["₹10,000", "₹5,000", "₹50,000", "₹1,00,000"],
    explanation:
      "Rule 87: over-the-counter payment through authorised banks is limited to ₹10,000 per challan per tax period (the limit does not apply to government departments or to recovery proceedings). Other modes — internet banking, cards, UPI, NEFT and RTGS — have no such cap. A challan in GST PMT-06 is valid for 15 days.",
  },

  // ───────────── TDS and TCS under GST ─────────────
  {
    chapter: TDSTCS,
    text: "A Central Government department registered as a deductor in Delhi receives a supply from a supplier in Haryana, where the place of supply is also Haryana. Is TDS u/s 51 to be deducted?",
    options: [
      "No — the supplier's location and the place of supply are in a State different from the deductor's State of registration",
      "Yes, at 2% IGST",
      "Yes, at 1% CGST and 1% SGST",
      "Yes, but only if the contract exceeds ₹5 lakh",
    ],
    explanation:
      "Proviso to section 51(1): no deduction where the location of the supplier AND the place of supply are both in a State or Union territory different from that of the registration of the recipient. In that case the tax is CGST plus Haryana SGST, which a Delhi deductor cannot pass on as credit. Otherwise TDS is 2% where the contract value exceeds ₹2.5 lakh.",
  },
  {
    chapter: TDSTCS,
    text: "By when must tax deducted at source u/s 51 be paid to the Government, and in which return is it reported?",
    options: [
      "By the 10th of the following month, in GSTR-7",
      "By the 20th of the following month, in GSTR-3B",
      "By the 11th of the following month, in GSTR-1",
      "By the 10th of the following month, in GSTR-8",
    ],
    explanation:
      "The deductor pays the TDS and files GSTR-7 by the 10th of the month following the month of deduction; the deductee's credit then flows to his electronic CASH ledger. GSTR-8, also due by the 10th, is the e-commerce operator's statement of TCS u/s 52.",
  },

  // ───────────── Accounts and Records ─────────────
  {
    chapter: RECORDS,
    text: "Which of the following persons must maintain records under section 35(2) even if NOT registered under GST?",
    options: [
      "An owner or operator of a warehouse or godown, and a transporter",
      "Every agriculturist supplying produce from cultivation of land",
      "Every employee receiving salary from a registered employer",
      "Every unregistered recipient of taxable supplies",
    ],
    explanation:
      "Section 35(2): every owner or operator of a warehouse, godown or other storage place, and every transporter, must maintain records of consignors, consignees and goods — whether or not registered. If unregistered, they enrol in GST ENR-01 and get a unique enrolment number. Records are kept at the principal place of business and retained for 72 months from the due date of the annual return.",
  },

  // ───────────── Introduction to GST ─────────────
  {
    chapter: INTRO,
    text: "In the GST Council, how are votes weighted and what majority is needed to carry a decision?",
    options: [
      "Centre one-third, States together two-thirds; three-fourths of the weighted votes of members present and voting",
      "Centre one-half, States together one-half; simple majority",
      "Centre one-third, States together two-thirds; two-thirds majority",
      "Each member has one vote; three-fourths majority",
    ],
    explanation:
      "Article 279A: the vote of the Central Government carries one-third weight and the votes of all State Governments together two-thirds; every decision needs at least three-fourths of the weighted votes of members present and voting. Quorum is one-half of the total members. The Union Finance Minister chairs the Council.",
  },
  {
    chapter: INTRO,
    text: "Which Article of the Constitution provides for the levy and collection of GST on supplies in the course of inter-State trade or commerce, and its apportionment between the Union and the States?",
    options: ["Article 269A", "Article 246A", "Article 279A", "Article 366(12A)"],
    explanation:
      "Article 269A: IGST on inter-State supplies is levied and collected by the Union and apportioned between the Union and the States; imports are deemed inter-State supplies. Article 246A gives Parliament and State legislatures concurrent power to make laws on GST; 279A sets up the GST Council; 366(12A) defines 'goods and services tax'.",
  },

  // ───────────── E-way Bill ─────────────
  {
    chapter: EWAY,
    text: "Goods (not over-dimensional cargo) are to be moved 450 km by road. For how many days is the e-way bill valid?",
    options: ["3 days", "2 days", "5 days", "23 days"],
    explanation:
      "Rule 138(10): one day for every 200 km or part thereof for normal cargo — 450 km needs 3 days (200 + 200 + 50). For over-dimensional cargo or multimodal shipment involving a ship, it is one day for every 20 km or part, which is where 23 days comes from. Each 'day' runs to midnight of the day following generation.",
  },
  {
    chapter: EWAY,
    text: "In which case need Part B (vehicle details) of the e-way bill NOT be filled in?",
    options: [
      "Goods moved within the State for up to 50 km from the consignor's place of business to the transporter's place for further transport",
      "Goods moved inter-State by road for a distance below 100 km",
      "Goods of a consignment value between ₹50,000 and ₹1,00,000",
      "Goods moved by a registered supplier in his own vehicle",
    ],
    explanation:
      "Rule 138(3): Part B need not be furnished where goods move for a distance of up to 50 km WITHIN the State or Union territory, from the consignor's place of business to the transporter's place for further transportation (or from the transporter to the consignee). Part A is still required. An e-way bill is not valid for movement by road unless Part B is filled, outside this relaxation.",
  },
];
