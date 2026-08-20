// Full-syllabus GST mock — all 15 chapters of Paper 3 Section B.
// Seed with: npx tsx scripts/mock-test.ts --mock=idt-full
import type { Mock } from "../mock-test";

export const MOCK: Mock = {
  title: "MOCK — GST full syllabus (all 15 chapters)",
  paperName: "Paper 3, Section B — Goods and Services Tax",
  durationMinutes: 75,
  scheduledFor: "2026-08-20",
  marks: 2,
  negativeMarks: 0, // ICAI does not negatively mark MCQs
  notes: `GST 2.0 is in force and examinable: the rate slabs are 5 percent, 18 percent and 40 percent ONLY. The 12 percent and 28 percent slabs are ABOLISHED — never use them in a question or an option. Individual life and health insurance is exempt.

Stay strictly inside the ICAI CA Intermediate syllabus for GST — CGST Act, IGST Act and the rules. No CA Final material.

Mix the question types roughly half and half:
- DIRECT: section or rule numbers, time limits, thresholds, exact conditions.
- CASE-BASED: a short 2-4 line factual scenario, then the correct treatment, liability, amount or compliance step.`,
  sections: [
    {
      name: "Part A — Levy, supply and exemptions",
      count: 9,
      chapters: [
        "Introduction to GST",
        "Supply under GST",
        "Charge of GST (Levy, Composition, RCM)",
        "Exemptions from GST",
      ],
      notes: `Cover: the constitutional scheme and which taxes GST subsumed, and what stays outside GST (petroleum products, alcohol for human consumption); the definition and scope of supply u/s 7 with Schedules I, II and III, composite and mixed supply u/s 8 and the principal-supply test; the charge u/s 9 of the CGST Act and s.5 of the IGST Act; reverse charge including the notified services (goods transport agency, legal services from an advocate, director's services, sponsorship) and s.9(3) versus s.9(4); the composition levy u/s 10 with the ₹1.5 crore and ₹75 lakh turnover limits, the 1 percent, 5 percent and 6 percent rates, the ₹50 lakh service-provider composition scheme, and the conditions and disqualifications; and the main exemptions — healthcare, education, agriculture, transport of passengers and goods, residential dwelling, and the insurance exemption under GST 2.0.`,
    },
    {
      name: "Part B — Time, place and value",
      count: 8,
      chapters: ["Time of Supply", "Place of Supply", "Value of Supply"],
      notes: `Cover: time of supply of goods and services u/ss 12-14, the earlier-of tests, the effect of an invoice issued BEYOND the 30-day window, reverse-charge time of supply with the 30 and 60 day rules, vouchers, and change in rate of tax u/s 14. Place of supply u/ss 10-13 of the IGST Act, including bill-to ship-to u/s 10(1)(b) where the place of supply is the third person's principal place of business, immovable property, restaurant, training, events, transportation, telecom, banking, and supplies where one party is outside India — and the resulting CGST+SGST versus IGST conclusion. Value u/s 15 with the Valuation Rules: transaction value conditions, inclusions such as incidental expenses and s.15(2)(b) amounts the supplier was liable for, subsidies other than government subsidies, and discounts before and after supply with the pre-agreement and ITC-reversal conditions.`,
    },
    {
      name: "Part C — ITC, registration and procedure",
      count: 10,
      chapters: [
        "Input Tax Credit",
        "Registration",
        "Tax Invoice, Credit and Debit Notes",
        "Accounts and Records",
        "E-way Bill",
        "Payment of Tax",
        "TDS and TCS under GST",
        "Returns",
      ],
      notes: `Cover: input tax credit u/ss 16-18 — the four conditions in s.16(2), the 180-day payment rule, the 30 November time limit u/s 16(4), blocked credits u/s 17(5), and apportionment and reversal u/s 17. Registration u/ss 22-30 — the ₹40 lakh, ₹20 lakh and ₹10 lakh thresholds and which applies to goods, services and special category states, compulsory registration u/s 24, casual and non-resident taxable persons, and the 30-day application window. Tax invoice u/ss 31-34 — time limits for goods and services, continuous supply, bill of supply, revised invoice, and credit and debit notes with the 30 NOVEMBER following the financial year deadline (the old September-return deadline is superseded). Accounts and records u/s 35 and the retention period. E-way bill under rule 138 — the ₹50,000 threshold, Part A and Part B, validity by distance, exemptions, and cancellation within 24 hours. Payment of tax u/s 49 — the three electronic ledgers, the order of utilisation of IGST, CGST and SGST credit, and interest u/s 50. TDS u/s 51 at 2 percent above ₹2.5 lakh and TCS u/s 52 by e-commerce operators. Returns u/ss 37-39 and 44 — GSTR-1, GSTR-3B, GSTR-9 and their due dates, and the QRMP scheme.`,
    },
  ],
};
