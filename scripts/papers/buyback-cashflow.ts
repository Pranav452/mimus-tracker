// Written practice — Buyback of Shares + Cash Flow Statement (AS 3).
// No MCQs: two proper questions per chapter, each with a fully worked model
// answer she can mark herself against after attempting in her book.
// Seed with: npx tsx scripts/seed-paper.ts --paper=buyback-cashflow
import type { Paper } from "../seed-paper";

export const PAPER: Paper = {
  slug: "buyback-cashflow",
  title: "WRITTEN — Buyback & Cash Flow (2 + 2, with answers)",
  durationMinutes: 60,
  scheduledFor: "2026-08-25",
  questions: [
    {
      kind: "descriptive",
      chapter: "Buyback of Shares",
      section: "Buyback of Shares",
      marks: 8,
      text: "Q1 [8 marks] The summarised balance sheet of Radiant Ltd. as on 31 March 2026 shows:\n\nEquity share capital (2,00,000 shares of ₹10 fully paid) ₹20,00,000\nSecurities premium ₹4,00,000\nGeneral reserve ₹10,00,000\nSurplus in P&L ₹6,00,000\n10% Debentures ₹8,00,000\n\nThe company buys back 50,000 equity shares at ₹15 per share, complying with all legal formalities. Premium on buyback is to be adjusted against securities premium.\n\n(a) Verify that the buyback is within the limits of section 68.\n(b) Pass journal entries for the buyback, including the transfer to Capital Redemption Reserve.\n(c) Show the debt-equity position after the buyback.",
      modelAnswer:
        "(a) THE THREE TESTS OF SECTION 68(2)\n\n1. Equity ceiling — buyback of equity in a financial year cannot exceed 25% of paid-up equity capital: 50,000 × ₹10 = ₹5,00,000, which is exactly 25% of ₹20,00,000. Within limit.\n\n2. Resources ceiling — total buyback cannot exceed 25% of paid-up capital + free reserves. Free reserves here include securities premium: 20,00,000 + 4,00,000 + 10,00,000 + 6,00,000 = ₹40,00,000; 25% = ₹10,00,000. Buyback cost = 50,000 × ₹15 = ₹7,50,000. Within limit.\n\n3. Debt-equity after buyback must not exceed 2:1 — tested in (c) below.\n\n(b) JOURNAL ENTRIES\n\n1. Equity Share Capital A/c Dr 5,00,000\n   Premium on Buyback A/c Dr 2,50,000\n       To Equity Shareholders A/c 7,50,000\n   (50,000 shares of ₹10 bought back at ₹15; premium ₹5 per share)\n\n2. Securities Premium A/c Dr 2,50,000\n       To Premium on Buyback A/c 2,50,000\n   (premium on buyback adjusted against securities premium)\n\n3. Equity Shareholders A/c Dr 7,50,000\n       To Bank A/c 7,50,000\n   (payment made)\n\n4. General Reserve A/c Dr 5,00,000\n       To Capital Redemption Reserve A/c 5,00,000\n   (s.69: nominal value of shares bought back out of free reserves transferred to CRR)\n\n(c) DEBT-EQUITY AFTER BUYBACK\n\nEquity after: share capital 15,00,000 + securities premium (4,00,000 − 2,50,000) 1,50,000 + general reserve (10,00,000 − 5,00,000) 5,00,000 + P&L 6,00,000 + CRR 5,00,000 = ₹32,50,000.\nDebt = ₹8,00,000. Ratio = 8,00,000 : 32,50,000 ≈ 0.25 : 1 — comfortably within 2:1. All three conditions satisfied.",
      keyPoints: [
        "Tests all three s.68(2) limits: 25% equity ceiling (on nominal value), 25% of capital + free reserves, and 2:1 debt-equity",
        "Includes securities premium in free reserves for the resources test",
        "Entry 1: capital at nominal ₹5,00,000, premium on buyback ₹2,50,000, shareholders ₹7,50,000",
        "Premium adjusted against securities premium",
        "CRR transfer of ₹5,00,000 — nominal value, not the ₹7,50,000 paid",
        "Post-buyback equity ₹32,50,000 and ratio ≈ 0.25:1 stated",
      ],
    },
    {
      kind: "descriptive",
      chapter: "Buyback of Shares",
      section: "Buyback of Shares",
      marks: 4,
      text: "Q2 [4 marks] The Board of Meadow Ltd. proposes, by a board resolution alone, to buy back shares worth ₹5,00,000. Its paid-up equity capital is ₹40,00,000 and free reserves are ₹20,00,000. The company completed a previous buyback eight months ago.\n\nAdvise the Board whether it may proceed, with reference to section 68.",
      modelAnswer:
        "Two separate hurdles apply.\n\n1. THE BOARD-ROUTE LIMIT — s.68(2)(b): a buyback authorised by board resolution alone (without a special resolution of members) cannot exceed 10% of the aggregate of paid-up equity capital and free reserves. Here 10% of (40,00,000 + 20,00,000) = ₹6,00,000. The proposed ₹5,00,000 is within this, so the amount itself would be fine by board resolution.\n\n2. THE COOLING-OFF PERIOD — proviso to s.68(2): NO offer of buyback shall be made within a period of ONE YEAR from the date of closure of the preceding offer of buyback. The previous buyback closed only eight months ago.\n\nCONCLUSION: despite the amount being within the board-route limit, Meadow Ltd. cannot proceed now. It must wait until one year has elapsed from the closure of the previous offer. (Note: the one-year bar applies whether the earlier buyback was by board or special resolution.)",
      keyPoints: [
        "Board-route ceiling of 10% of paid-up equity capital + free reserves, computed as ₹6,00,000",
        "Proposed ₹5,00,000 passes the amount test",
        "One-year gap from closure of the previous offer — proviso to s.68(2)",
        "Correct conclusion: cannot proceed for another four months",
      ],
    },
    {
      kind: "descriptive",
      chapter: "Cash Flow Statement (AS 3)",
      section: "Cash Flow Statement (AS 3)",
      marks: 8,
      text: "Q3 [8 marks] From the following information of Verdant Ltd. for the year ended 31 March 2026, prepare a Cash Flow Statement under the indirect method as per AS 3:\n\nNet profit before tax ₹5,00,000 · Depreciation ₹1,20,000 · Profit on sale of machinery ₹20,000 · Interest expense ₹50,000 · Interest income ₹30,000\nDebtors increased by ₹80,000 · Stock decreased by ₹40,000 · Creditors increased by ₹60,000 · Income tax paid ₹1,10,000\nMachinery (book value ₹70,000) sold for ₹90,000 · New machinery purchased ₹2,00,000 · Interest received in cash ₹30,000\nEquity shares issued for cash ₹3,00,000 · Debentures repaid ₹1,50,000 · Interest paid ₹50,000 · Dividend paid ₹70,000\nCash and cash equivalents on 1 April 2025: ₹65,000",
      modelAnswer:
        "CASH FLOW STATEMENT (indirect method, AS 3)\n\nA. OPERATING ACTIVITIES\nNet profit before tax 5,00,000\nAdd: Depreciation 1,20,000 (non-cash)\nAdd: Interest expense 50,000 (financing item, remove from operating profit)\nLess: Profit on sale of machinery (20,000) (investing item)\nLess: Interest income (30,000) (investing item)\nOperating profit before working capital changes = 6,20,000\nLess: Increase in debtors (80,000)\nAdd: Decrease in stock 40,000\nAdd: Increase in creditors 60,000\nCash generated from operations = 6,40,000\nLess: Income tax paid (1,10,000)\nNET CASH FROM OPERATING ACTIVITIES = 5,30,000\n\nB. INVESTING ACTIVITIES\nSale of machinery 90,000 (full sale proceeds — the ₹20,000 profit is inside this)\nInterest received 30,000\nPurchase of machinery (2,00,000)\nNET CASH USED IN INVESTING ACTIVITIES = (80,000)\n\nC. FINANCING ACTIVITIES\nProceeds of equity issue 3,00,000\nRepayment of debentures (1,50,000)\nInterest paid (50,000)\nDividend paid (70,000)\nNET CASH FROM FINANCING ACTIVITIES = 30,000\n\nNet increase in cash = 5,30,000 − 80,000 + 30,000 = 4,80,000\nOpening cash and cash equivalents 65,000\nCLOSING CASH AND CASH EQUIVALENTS = ₹5,45,000\n\nThe two classic checks: (i) profit on sale is removed from operating AND the full ₹90,000 proceeds appear in investing — counting ₹20,000 twice is the standard error; (ii) interest expense is added back in operating and the cash interest actually paid is shown under financing (for a non-financial company).",
      keyPoints: [
        "Starts from net profit BEFORE tax and adds back depreciation",
        "Removes profit on sale (20,000) and interest income; adds back interest expense",
        "Working capital: −80,000 + 40,000 + 60,000, giving cash generated 6,40,000",
        "Tax paid deducted within operating; CFO = 5,30,000",
        "Investing shows full sale proceeds 90,000, interest received, purchase; net (80,000)",
        "Financing: share issue, debenture repayment, interest paid, dividend; net 30,000",
        "Closing cash 5,45,000 ties to opening 65,000 + 4,80,000",
      ],
    },
    {
      kind: "descriptive",
      chapter: "Cash Flow Statement (AS 3)",
      section: "Cash Flow Statement (AS 3)",
      marks: 4,
      text: "Q4 [4 marks] State, with a one-line reason each, how the following are dealt with in the Cash Flow Statement of a MANUFACTURING company under AS 3:\n\n(i) Interest paid on term loan\n(ii) Dividend received on long-term investments\n(iii) Payment made on buyback of own shares\n(iv) Purchase of a patent\n(v) Machinery acquired by issue of equity shares to the vendor\n(vi) A 60-day treasury deposit made during the year",
      modelAnswer:
        "(i) Interest paid on term loan — FINANCING activity. For a non-financial company, the cost of borrowing is a financing outflow (it was added back while computing operating profit).\n\n(ii) Dividend received on long-term investments — INVESTING activity. It is a return ON an investment, not from operations (for a financial enterprise it would be operating).\n\n(iii) Buyback payment — FINANCING activity. It changes the owners' capital of the enterprise, exactly like an issue of shares in reverse.\n\n(iv) Purchase of a patent — INVESTING activity. Acquisition of a long-term (intangible) asset.\n\n(v) Machinery acquired by issue of shares — NOT shown in the cash flow statement at all. It is a non-cash transaction: no cash moved. AS 3 requires it to be disclosed separately by way of note.\n\n(vi) 60-day treasury deposit — not a cash 'flow' between categories at all: an investment maturing within three months of acquisition is a CASH EQUIVALENT, so moving money into it is merely a movement WITHIN cash and cash equivalents.\n\nThe pattern to carry into the exam: ask (1) did cash actually move? If no — note only. (2) If yes, is it owners/borrowings (financing), long-term assets and their returns (investing), or the trade itself (operating)?",
      keyPoints: [
        "Interest paid → financing, for a non-financial company",
        "Dividend received → investing (return on investment)",
        "Buyback → financing (change in owners' capital)",
        "Patent → investing (long-term intangible asset)",
        "Shares-for-machinery → non-cash, excluded, disclosed by note",
        "≤3-month deposit → cash equivalent, movement within cash, not a flow",
      ],
    },
  ],
};
