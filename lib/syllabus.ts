// CA Intermediate syllabus — seeded into Neon, also used for display fallbacks.
export type SyllabusPaper = {
  number: number;
  name: string;
  slug: string;
  tag: string;
  color: string;
  image: string;
  parts: { label: string; name?: string; chapters: string[] }[];
};

export const SYLLABUS: SyllabusPaper[] = [
  {
    number: 1,
    name: "Advanced Accounting",
    slug: "accounts",
    tag: "Paper 1",
    color: "green",
    image: "/assets/04-subject-mathematics.png",
    parts: [
      {
        label: "Part A",
        chapters: [
          "Buyback of Shares",
          "Company Final Accounts",
          "Investment Accounts (AS 13)",
          "Cash Flow Statement (AS 3)",
          "Consolidation",
          "Amalgamation",
          "Internal Reconstruction",
          "Branch Accounts",
        ],
      },
      {
        label: "Part B",
        name: "Accounting Standards",
        chapters: [
          "AS 1 — Disclosure of Accounting Policies",
          "AS 2 — Valuation of Inventory",
          "AS 4 — Events occurring after Balance Sheet date",
          "AS 5 — Net Profit or Loss for the Period, Prior Period Items and Changes in Accounting Policies",
          "AS 7 — Construction Contracts",
          "AS 9 — Revenue Recognition",
          "AS 10 — Property, Plant and Equipment",
          "AS 11 — The Effects of Changes in Foreign Exchange Rates",
          "AS 12 — Accounting for Government Grants",
          "AS 15 — Employee Benefits",
          "AS 16 — Borrowing Costs",
          "AS 17 — Segment Reporting",
          "AS 18 — Related Party Disclosures",
          "AS 19 — Leases",
          "AS 20 — Earnings per Share",
          "AS 22 — Accounting for Taxes on Income",
          "AS 24 — Discontinuing Operations",
          "AS 25 — Interim Financial Reporting",
          "AS 26 — Intangible Assets",
          "AS 28 — Impairment of Assets",
          "AS 29 — Provisions, Contingent Liabilities and Contingent Assets",
        ],
      },
    ],
  },
  {
    number: 2,
    name: "Corporate & Other Laws",
    slug: "law",
    tag: "Paper 2",
    color: "blue",
    image: "/assets/03-subject-coding-flow.png",
    parts: [
      {
        label: "Part A",
        name: "Company Law",
        chapters: [
          "Introduction — Preliminary Law",
          "Incorporation of Companies",
          "Prospectus and Allotment of Shares",
          "Shares and Debentures",
          "Acceptance of Deposits by Companies",
          "Registration of Charge",
          "Management and Administration",
          "Declaration of Dividends",
          "Accounts of Companies",
          "Audit and Auditors",
          "Companies Incorporated outside India",
          "Limited Liability Partnership Act, 2008",
        ],
      },
      {
        label: "Part B",
        name: "Other Laws",
        chapters: [
          "General Clauses Act, 1897",
          "Foreign Exchange Management Act, 1999",
          "Interpretation of Statutes",
        ],
      },
    ],
  },
  {
    number: 3,
    name: "Taxation",
    slug: "tax",
    tag: "Paper 3",
    color: "lav",
    image: "/assets/02-subject-physics-atom.png",
    parts: [
      {
        label: "Part A",
        name: "Income Tax",
        chapters: [
          "Basics of Income Tax",
          "Residential Status",
          "Income from Salary",
          "Income from House Property",
          "Profits and Gains from Business or Profession",
          "Capital Gains",
          "Income from Other Sources",
          "Set off and Carry Forward of Losses",
          "Deductions",
          "Advance Tax, TDS and TCS",
          "Return of Income",
          "Clubbing of Income",
          "Computation of Total Income",
        ],
      },
      {
        label: "Part B",
        name: "Goods and Services Tax",
        chapters: [
          "Introduction to GST",
          "Supply under GST",
          "Charge of GST (Levy, Composition, RCM)",
          "Place of Supply",
          "Time of Supply",
          "Value of Supply",
          "Exemptions from GST",
          "Input Tax Credit",
          "Registration",
          "Tax Invoice, Credit and Debit Notes",
          "Accounts and Records",
          "E-way Bill",
          "Payment of Tax",
          "TDS and TCS under GST",
          "Returns",
        ],
      },
    ],
  },
];
