// Predicted full paper — CA Inter Paper 2, Corporate and Other Laws, Sept 2026.
// 30 marks MCQ + 70 marks descriptive, in ICAI's own structure.
// Seed with: npx tsx scripts/seed-paper.ts --paper=law-mock-1
import type { Paper } from "../seed-paper";

const S1 =
  "SUNVALE INFRATECH PRIVATE LIMITED — incorporated 12 Apr 2023; paid-up equity ₹3 crore; free reserves ₹1.20 crore; turnover FY 2025-26 ₹35 crore; neither holding nor subsidiary; not a section 8 company.";
const S2 =
  "AURORA TEXTILES LIMITED — unlisted public company; 3,500 members; paid-up capital ₹60 crore; net worth ₹520 crore; turnover ₹640 crore; net profit FY 2025-26 ₹4.20 crore; average net profit of the three preceding years ₹6 crore; articles silent on quorum; AGM for FY 2025-26 held 12 Aug 2026.";

export const PAPER: Paper = {
  slug: "law-mock-1",
  title: "FULL PAPER — Law Paper 2 (100 marks, predicted)",
  durationMinutes: 180,
  scheduledFor: "2026-08-12",
  questions: [
    // ---------- Part I · Division A: case scenario I ----------
    {
      kind: "mcq",
      chapter: "Introduction — Preliminary Law",
      section: "Part I — MCQ",
      marks: 2,
      text: `${S1}\n\nIs Sunvale a "small company" under section 2(85)?`,
      options: [
        "Yes — paid-up capital is within ₹10 crore and turnover within ₹100 crore",
        "No — paid-up share capital exceeds the ceiling of ₹2 crore",
        "No — turnover exceeds the ceiling of ₹20 crore",
        "No — small company status is available only to a One Person Company",
      ],
      correctIndex: 0,
      explanation:
        "Section 2(85) read with the Companies (Specification of Definition Details) Rules, as amended by G.S.R. 880(E) with effect from 1 December 2025: paid-up capital up to ₹10 crore AND turnover up to ₹100 crore. The earlier ₹4 crore / ₹40 crore and ₹2 crore / ₹20 crore figures are superseded.",
    },
    {
      kind: "mcq",
      chapter: "Acceptance of Deposits by Companies",
      section: "Part I — MCQ",
      marks: 2,
      text: `${S1}\n\nOn 5 May 2026 it accepted ₹90 lakh of deposits from its members. Is this permissible?`,
      options: [
        "No — a private company can never accept deposits from its members",
        "Yes — a private company may accept from members up to 100% of paid-up capital, free reserves and securities premium",
        "Yes — but only up to 10% of paid-up capital and free reserves",
        "No — it must first become an 'eligible company' under section 76",
      ],
      correctIndex: 1,
      explanation:
        "Section 73(2) with Rule 3(3): a private company may accept deposits from members up to 100% of the aggregate of paid-up capital, free reserves and securities premium — here ₹4.20 crore. ₹90 lakh is well within it.",
    },
    {
      kind: "mcq",
      chapter: "Registration of Charge",
      section: "Part I — MCQ",
      marks: 2,
      text: `${S1}\n\nA charge created 1 June 2026 had its particulars filed on 10 July 2026 — the 39th day. What is the position?`,
      options: [
        "The charge can no longer be registered; the thirty-day period is absolute",
        "It may be registered — the Registrar may allow registration within sixty days of creation on payment of additional fees",
        "It may be registered within three hundred days on payment of ad valorem fees",
        "No registration is required, the charge-holder being a banking company",
      ],
      correctIndex: 1,
      explanation:
        "Section 77(1) requires registration within 30 days. The first proviso lets the Registrar allow a further 30 days — 60 in all — on additional fees. Day 39 is inside that window.",
    },
    {
      kind: "mcq",
      chapter: "Declaration of Dividends",
      section: "Part I — MCQ",
      marks: 2,
      text: `${S1}\n\nOn 20 July 2026 the Board declared an interim dividend out of the surplus in the profit and loss account. Which statement is correct?`,
      options: [
        "Interim dividend may be declared only out of free reserves",
        "It may be declared out of the surplus in the profit and loss account or profits of the year; and where the company has incurred a loss up to the quarter immediately preceding declaration, the rate cannot exceed the average of the dividends declared in the three immediately preceding financial years",
        "Interim dividend can be declared only by the members in general meeting",
        "Interim dividend cannot be declared before the annual general meeting",
      ],
      correctIndex: 1,
      explanation:
        "Section 123(3). Note the loss condition caps the RATE — it does not bar the dividend altogether.",
    },
    {
      kind: "mcq",
      chapter: "Declaration of Dividends",
      section: "Part I — MCQ",
      marks: 2,
      text: `${S1}\n\nDividend was declared 20 July 2026. As on 25 August 2026, ₹6 lakh remained unpaid. By when must it go into a separate Unpaid Dividend Account?`,
      options: [
        "By 19 August 2026",
        "By 26 August 2026",
        "By 20 September 2026",
        "It must be transferred directly to the IEPF at once",
      ],
      correctIndex: 1,
      explanation:
        "Section 124(1): within 7 days of the expiry of the 30 days allowed for payment u/s 127. 20 July + 30 = 19 August; + 7 = 26 August 2026.",
    },
    // ---------- Part I · Division A: case scenario II ----------
    {
      kind: "mcq",
      chapter: "Management and Administration",
      section: "Part I — MCQ",
      marks: 2,
      text: `${S2}\n\nWhat was the quorum required for that general meeting?`,
      options: [
        "5 members personally present",
        "15 members personally present",
        "30 members personally present",
        "2 members personally present",
      ],
      correctIndex: 1,
      explanation:
        "Section 103(1)(a): 5 members up to 1,000; 15 above 1,000 up to 5,000; 30 above 5,000. With 3,500 members it is 15.",
    },
    {
      kind: "mcq",
      chapter: "Management and Administration",
      section: "Part I — MCQ",
      marks: 2,
      text: `${S2}\n\nBy what date must the annual return be filed with the Registrar?`,
      options: [
        "11 September 2026",
        "11 October 2026",
        "10 November 2026",
        "31 March 2027",
      ],
      correctIndex: 1,
      explanation:
        "Section 92(4): within 60 days of the AGM. 12 August 2026 + 60 days = 11 October 2026.",
    },
    {
      kind: "mcq",
      chapter: "Accounts of Companies",
      section: "Part I — MCQ",
      marks: 2,
      text: `${S2}\n\nWhat is the company's CSR position?`,
      options: [
        "Not applicable — net profit of ₹4.20 crore is below ₹5 crore",
        "Applicable — spend ₹12 lakh, and no CSR Committee is needed because the amount does not exceed ₹50 lakh",
        "Applicable — spend ₹8.40 lakh, being 2% of the current year's net profit",
        "Not applicable — CSR applies only to listed companies",
      ],
      correctIndex: 1,
      explanation:
        "Section 135(1) is satisfied by ANY ONE test — the ₹520 crore net worth triggers it, so the ₹4.20 crore profit is irrelevant. Spend is 2% of the three-year average of ₹6 crore = ₹12 lakh; s.135(9) removes the committee requirement at ₹50 lakh or less.",
    },
    {
      kind: "mcq",
      chapter: "Audit and Auditors",
      section: "Part I — MCQ",
      marks: 2,
      text: `${S2}\n\nDo the auditor rotation provisions apply?`,
      options: [
        "No — rotation applies only to listed companies",
        "Yes — an unlisted public company with paid-up capital of ₹10 crore or more is covered; an individual may serve one term of five years and a firm two",
        "Yes — but an individual auditor may serve two terms of five consecutive years",
        "No — rotation is triggered only where turnover exceeds ₹1,000 crore",
      ],
      correctIndex: 1,
      explanation:
        "Section 139(2) with Rule 5: unlisted public companies with paid-up capital of ₹10 crore or more are covered.",
    },
    {
      kind: "mcq",
      chapter: "Accounts of Companies",
      section: "Part I — MCQ",
      marks: 2,
      text: `${S2}\n\nIs an internal auditor required?`,
      options: [
        "No — internal audit is optional for every unlisted company",
        "Yes — an unlisted public company with paid-up capital of ₹50 crore or more, or turnover of ₹200 crore or more, must appoint one",
        "No — it applies only where borrowings exceed ₹100 crore",
        "Yes — but only if the Central Government so directs",
      ],
      correctIndex: 1,
      explanation:
        "Section 138 with Rule 13. Aurora crosses both the ₹50 crore capital and ₹200 crore turnover tests.",
    },
    // ---------- Part I · Division B: independent MCQs ----------
    {
      kind: "mcq",
      chapter: "Foreign Exchange Management Act, 1999",
      section: "Part I — MCQ",
      marks: 1,
      text: "Under FEMA, 1999, which of the following is a capital account transaction?",
      options: [
        "Payment of interest on a loan taken abroad",
        "Remittance for a child's living expenses while studying abroad",
        "Acquisition of immovable property outside India by a person resident in India",
        "Payment for ordinary short-term banking facilities in the ordinary course of business",
      ],
      correctIndex: 2,
      explanation:
        "Section 2(e): a capital account transaction alters assets or liabilities outside India of a resident. The other three are current account transactions u/s 2(j).",
    },
    {
      kind: "mcq",
      chapter: "Foreign Exchange Management Act, 1999",
      section: "Part I — MCQ",
      marks: 1,
      text: "Under section 2(v) of FEMA, 1999, an individual is broadly a 'person resident in India' if he has resided in India in the preceding financial year for —",
      options: [
        "more than 60 days",
        "182 days or more, counted in the current financial year",
        "more than 182 days, subject to the exclusions for those leaving or staying abroad for employment, business or an uncertain period",
        "the whole of the financial year without any break",
      ],
      correctIndex: 2,
      explanation:
        "Section 2(v)(A). The exclusions matter more than the day-count in exam problems.",
    },
    {
      kind: "mcq",
      chapter: "General Clauses Act, 1897",
      section: "Part I — MCQ",
      marks: 1,
      text: "A notice is properly addressed, prepaid and posted by registered post. Under section 27 of the General Clauses Act, 1897, service is —",
      options: [
        "not effected unless an acknowledgement is produced",
        "deemed effected at the time the letter would be delivered in the ordinary course of post, unless the contrary is proved",
        "effected only on the addressee personally signing for it",
        "effected on the date of posting in every case",
      ],
      correctIndex: 1,
      explanation: "Section 27 raises a rebuttable presumption of deemed service.",
    },
    {
      kind: "mcq",
      chapter: "General Clauses Act, 1897",
      section: "Part I — MCQ",
      marks: 1,
      text: "Unless a different intention appears, the repeal of an enactment under section 6 of the General Clauses Act, 1897 does NOT —",
      options: [
        "affect any right, privilege, obligation or liability already acquired, accrued or incurred under the repealed enactment",
        "permit any pending legal proceeding to be continued",
        "preserve any penalty incurred before the repeal",
        "revive anything not in force at the time of the repeal",
      ],
      correctIndex: 0,
      explanation:
        "Read the negative in the stem carefully. Section 6 SAVES accrued rights, penalties incurred and pending proceedings — repeal does not affect them.",
    },
    {
      kind: "mcq",
      chapter: "Interpretation of Statutes",
      section: "Part I — MCQ",
      marks: 1,
      text: "Where the literal meaning of a provision leads to absurdity, the court modifies the meaning just enough to avoid it. This is the —",
      options: [
        "literal rule",
        "golden rule",
        "mischief rule",
        "rule of harmonious construction",
      ],
      correctIndex: 1,
      explanation:
        "The golden rule departs from plain meaning only so far as needed to avoid absurdity or repugnance.",
    },
    {
      kind: "mcq",
      chapter: "Interpretation of Statutes",
      section: "Part I — MCQ",
      marks: 1,
      text: "A proviso appended to a section ordinarily —",
      options: [
        "enlarges the scope of the main provision",
        "carves out an exception from the main provision to which it is appended",
        "governs every other section of the Act",
        "has no interpretative value whatsoever",
      ],
      correctIndex: 1,
      explanation:
        "A proviso excepts something out of the enacting clause and is confined to the section it is attached to. An Explanation, by contrast, clarifies.",
    },
    {
      kind: "mcq",
      chapter: "Limited Liability Partnership Act, 2008",
      section: "Part I — MCQ",
      marks: 1,
      text: "Under the LLP Act, 2008, every LLP must have —",
      options: [
        "at least two designated partners, both resident in India",
        "at least two designated partners who are individuals, at least one resident in India",
        "at least one designated partner, who may be a body corporate",
        "at least three designated partners",
      ],
      correctIndex: 1,
      explanation: "Section 7 of the LLP Act, 2008.",
    },
    {
      kind: "mcq",
      chapter: "Companies Incorporated outside India",
      section: "Part I — MCQ",
      marks: 1,
      text: "A foreign company establishing a place of business in India must deliver the prescribed documents to the Registrar within —",
      options: [
        "7 days of establishing the place of business",
        "30 days of establishing the place of business",
        "60 days of establishing the place of business",
        "6 months of the close of the financial year",
      ],
      correctIndex: 1,
      explanation:
        "Section 380 — within 30 days. The six-month period relates to filing accounts u/s 381.",
    },
    {
      kind: "mcq",
      chapter: "Incorporation of Companies",
      section: "Part I — MCQ",
      marks: 1,
      text: "A company must have a registered office capable of receiving communications within —",
      options: [
        "15 days of its incorporation",
        "30 days of its incorporation",
        "60 days of its incorporation",
        "such time as the Board may decide",
      ],
      correctIndex: 1,
      explanation:
        "Section 12(1) as amended by the Companies (Amendment) Act, 2017. The 15-day figure is the pre-2017 provision.",
    },
    {
      kind: "mcq",
      chapter: "Incorporation of Companies",
      section: "Part I — MCQ",
      marks: 1,
      text: "A company having share capital must file the declaration for commencement of business within —",
      options: [
        "60 days of incorporation",
        "90 days of incorporation",
        "180 days of incorporation",
        "one year of incorporation",
      ],
      correctIndex: 2,
      explanation:
        "Section 10A — Form INC-20A within 180 days of incorporation.",
    },

    // ---------- Part II · descriptive ----------
    {
      kind: "descriptive",
      chapter: "Acceptance of Deposits by Companies",
      section: "Part II — Written (Q1 compulsory)",
      marks: 6,
      text: "Q1(a) [6 marks] Kaveri Alloys Limited is an 'eligible company' under section 76. The aggregate of its paid-up share capital, free reserves and securities premium account is ₹80 crore. In FY 2026-27 it proposes to accept ₹10 crore of deposits from its members and a further ₹18 crore from the public.\n\nExamine whether the company may lawfully accept these amounts. Would your answer differ if Kaveri Alloys Limited were a Government company?",
      modelAnswer:
        "Section 76 read with Rule 3 of the Companies (Acceptance of Deposits) Rules, 2014 permits an eligible public company to accept deposits subject to two separate ceilings computed on the aggregate of paid-up share capital, free reserves and securities premium account — here ₹80 crore.\n\n(i) Deposits from MEMBERS: not exceeding 10% of that aggregate = ₹8 crore. The proposed ₹10 crore therefore EXCEEDS the limit and cannot lawfully be accepted; it may accept only up to ₹8 crore.\n\n(ii) Deposits from the PUBLIC (persons other than members): not exceeding 25% of that aggregate = ₹20 crore. The proposed ₹18 crore is WITHIN the limit and may be accepted, subject to compliance with the conditions — credit rating, deposit insurance where applicable, circular in Form DPT-1, deposit repayment reserve account of at least 20% of deposits maturing in the following financial year, and the return of deposits in Form DPT-3.\n\nIf Kaveri Alloys were a Government eligible company, the public ceiling is higher — 35% of the aggregate of paid-up capital, free reserves and securities premium — so ₹18 crore would remain permissible with considerably more headroom.",
      keyPoints: [
        "Identifies section 76 and Rule 3 as the governing provisions",
        "Members' ceiling of 10% = ₹8 crore, so ₹10 crore is NOT permissible",
        "Public ceiling of 25% = ₹20 crore, so ₹18 crore IS permissible",
        "Base for both is paid-up capital + free reserves + securities premium",
        "Government eligible company: the public limit rises to 35%",
        "Mentions any of the attached conditions (DPT-1, repayment reserve, DPT-3)",
      ],
    },
    {
      kind: "descriptive",
      chapter: "Audit and Auditors",
      section: "Part II — Written (Q1 compulsory)",
      marks: 4,
      text: "Q1(b) [4 marks] The Board of Nilgiri Cements Limited wishes to remove its statutory auditor before the expiry of his term. State the procedure to be followed, and the auditor's right in the matter.",
      modelAnswer:
        "Section 140(1) read with Rule 7: an auditor may be removed before the expiry of his term only by a SPECIAL RESOLUTION of the company and after obtaining the PREVIOUS APPROVAL of the Central Government.\n\nProcedure: (i) the Board passes a resolution proposing the removal; (ii) an application is made to the Central Government in Form ADT-2 within 30 days of that Board resolution; (iii) on receiving the Central Government's approval, the company holds a general meeting within 60 days of that approval and passes a special resolution.\n\nThe auditor's right: the first proviso to section 140(1) requires that the auditor concerned be given a REASONABLE OPPORTUNITY OF BEING HEARD before he is removed. Removal without that opportunity is bad in law.",
      keyPoints: [
        "Section 140(1) — special resolution PLUS previous approval of the Central Government",
        "Board resolution first, then application in Form ADT-2 within 30 days",
        "Special resolution in general meeting within 60 days of Central Government approval",
        "Auditor must be given a reasonable opportunity of being heard",
      ],
    },
    {
      kind: "descriptive",
      chapter: "Foreign Exchange Management Act, 1999",
      section: "Part II — Written (Q1 compulsory)",
      marks: 4,
      text: "Q1(c) [4 marks] Distinguish between a 'current account transaction' and a 'capital account transaction' under FEMA, 1999, giving two examples of each, and state the extent to which each may be restricted.",
      modelAnswer:
        "A CAPITAL ACCOUNT TRANSACTION is defined in section 2(e) as a transaction which alters the assets or liabilities, including contingent liabilities, outside India of a person resident in India, or assets or liabilities in India of a person resident outside India. Examples: acquisition of immovable property outside India by a resident; investment in shares of a foreign company; borrowing or lending in foreign exchange.\n\nA CURRENT ACCOUNT TRANSACTION is defined in section 2(j) as any transaction other than a capital account transaction, and includes payments due in connection with foreign trade, other current business, services and short-term banking and credit facilities in the ordinary course of business; interest on loans; net income from investments; remittances for living expenses of parents, spouse and children residing abroad; and expenses for foreign travel, education and medical care.\n\nExtent of restriction: under section 5, any person may sell or draw foreign exchange for a CURRENT account transaction, and such transactions are FREE, subject only to reasonable restrictions imposed by the Central Government in consultation with the Reserve Bank. Under section 6, a CAPITAL account transaction is permissible only to the extent specified — a person may undertake it only if it falls within the classes of transactions and the limits that the Reserve Bank, in consultation with the Central Government, permits.\n\nIn short: current account transactions are free unless restricted; capital account transactions are restricted unless permitted.",
      keyPoints: [
        "Section 2(e) definition of capital account transaction — alteration of assets/liabilities",
        "Section 2(j) definition of current account transaction — residuary, with inclusions",
        "Two correct examples of each",
        "Section 5 — current account transactions are free, subject to reasonable restrictions",
        "Section 6 — capital account transactions permissible only as RBI regulations allow",
        "The contrast: free unless restricted vs restricted unless permitted",
      ],
    },
    {
      kind: "descriptive",
      chapter: "Incorporation of Companies",
      section: "Part II — Written (all compulsory)",
      marks: 6,
      text: "Q2(a) [6 marks] Mr. Rehan advanced ₹25 lakh to Coastal Ventures Limited against a document signed by two persons describing themselves as directors and bearing what appeared to be the company's common seal. The signatures were in fact forged by an officer of the company. The articles permitted the company to borrow on the authority of a board resolution.\n\nAdvise Mr. Rehan whether he can enforce the document against the company. Explain the doctrine on which your answer rests, and state four situations in which its protection is not available.",
      modelAnswer:
        "The doctrine in issue is the DOCTRINE OF INDOOR MANAGEMENT, laid down in Royal British Bank v. Turquand. An outsider dealing with a company is bound to read the public documents — the memorandum and articles — but is entitled to assume that the company's INTERNAL procedures have been duly complied with. He need not enquire into the regularity of internal proceedings such as whether a board resolution was in fact validly passed.\n\nHowever, the protection does NOT extend to FORGERY. A forged document is a nullity; the company can never be bound by it, because there is no act of the company at all to which the doctrine could attach. This is settled by Ruben v. Great Fingall Consolidated.\n\nAdvice to Mr. Rehan: the signatures being forged, the document is void and he CANNOT enforce it against Coastal Ventures Limited. His remedy, if any, lies personally against the officer who committed the forgery.\n\nFour situations where the protection of the doctrine is not available: (i) forgery, as here; (ii) where the outsider had actual KNOWLEDGE of the irregularity; (iii) where the circumstances were SUSPICIOUS and put him on enquiry, and he failed to enquire (negligence); and (iv) where the act is void ab initio, or wholly outside the apparent authority of the officer concerned — and, likewise, where the outsider never actually consulted the articles at all.",
      keyPoints: [
        "Names the doctrine of indoor management and Royal British Bank v. Turquand",
        "States the rule: outsiders may assume internal procedures were complied with",
        "Forgery is outside the doctrine — Ruben v. Great Fingall Consolidated",
        "Correct conclusion: Mr. Rehan cannot enforce the document",
        "Four valid exceptions: forgery, knowledge, suspicion/negligence, void ab initio or beyond apparent authority",
      ],
    },
    {
      kind: "descriptive",
      chapter: "Registration of Charge",
      section: "Part II — Written (all compulsory)",
      marks: 4,
      text: "Q2(b) [4 marks] A company has failed to register a charge created in favour of its lender. State the consequences of non-registration, and explain what remedy is open to the charge-holder.",
      modelAnswer:
        "Consequences of non-registration: under section 77(3), no charge created by a company shall be taken into account by the liquidator appointed under the Companies Act or the Insolvency and Bankruptcy Code, or by any other creditor, unless it is duly registered and a certificate of registration has been issued. The charge is therefore VOID as against the liquidator and other creditors — the lender is reduced to the position of an unsecured creditor in the winding up.\n\nSection 77(4) preserves what non-registration does not destroy: nothing in section 77(3) prejudices any contract or obligation for repayment of the money secured. The debt remains fully payable, and the charge remains valid AS BETWEEN the company and the charge-holder. Further, the money secured becomes immediately payable.\n\nRemedy of the charge-holder: section 78 provides that where a company fails to register the charge within 30 days of its creation, the PERSON IN WHOSE FAVOUR the charge is created may himself apply to the Registrar for registration. The Registrar gives the company 14 days' notice to show cause; if the company does not itself register the charge or show sufficient cause, the Registrar allows the charge-holder's application. The charge-holder is entitled to recover from the company the fees he has properly paid for the registration.",
      keyPoints: [
        "Section 77(3) — charge void against the liquidator and other creditors",
        "Lender falls to the rank of an unsecured creditor",
        "Section 77(4) — the contract of repayment is unaffected; money becomes immediately payable",
        "Section 78 — the charge-holder may himself apply for registration after 30 days",
        "Registrar gives the company 14 days' notice; fees recoverable from the company",
      ],
    },
    {
      kind: "descriptive",
      chapter: "General Clauses Act, 1897",
      section: "Part II — Written (all compulsory)",
      marks: 4,
      text: "Q2(c) [4 marks] An appeal must be filed 'within thirty days from the date of the order'. The order is dated 1 September 2026, and the thirtieth day falls on a day when the office is closed. Explain, with reference to the General Clauses Act, 1897, how the period is to be computed and by when the appeal may be filed.",
      modelAnswer:
        "Two provisions apply.\n\nSection 9 — commencement and termination of time. Where a period is expressed to begin 'from' a particular day, the FIRST day is EXCLUDED. The word 'from' excludes the day of the order, so the thirty days run from 2 September 2026 and the last day is 1 October 2026.\n\nSection 10 — computation of time. Where an act is directed to be done within a prescribed period in a court or office, and the LAST day falls on a day when the court or office is CLOSED, the act shall be considered as done in due time if it is done on the NEXT DAY on which the court or office is open.\n\nApplying both: time runs from 2 September 2026; the thirtieth day is 1 October 2026; and as the office is closed that day, the appeal may validly be filed on the next day on which the office reopens. Section 10 does not extend the period generally — it saves only the situation where the last day itself is a closed day.",
      keyPoints: [
        "Section 9 — 'from' excludes the first day; time runs from 2 September",
        "Correctly identifies the last day as 1 October 2026",
        "Section 10 — where the last day is a closed day, the act may be done the next open day",
        "Notes that section 10 saves only the last-day situation, not a general extension",
      ],
    },
    {
      kind: "descriptive",
      chapter: "Declaration of Dividends",
      section: "Part II — Written (all compulsory)",
      marks: 6,
      text: "Q3(a) [6 marks] Explain the treatment of unpaid and unclaimed dividend under the Companies Act, 2013 — the transfer to the Unpaid Dividend Account, the disclosure the company must make, the eventual transfer to the Investor Education and Protection Fund, the position of the underlying shares, and the remedy available to a shareholder who comes forward later.",
      modelAnswer:
        "Section 127 requires a declared dividend to be paid within 30 days of declaration.\n\nUnpaid Dividend Account — section 124(1): where the dividend has not been paid or claimed within those 30 days, the company must, within 7 days of the expiry of that period, transfer the unpaid or unclaimed amount to a special account called the Unpaid Dividend Account, opened with a scheduled bank.\n\nDisclosure — section 124(2): within 90 days of that transfer, the company must prepare a statement giving the names, last known addresses and the unpaid dividend payable to each person, and place it on its own website and on any other website approved by the Central Government.\n\nInterest — section 124(3): if the company defaults in transferring the amount, it must pay interest at 12% per annum from the date of default, and the interest accrues to the benefit of the members in proportion to the amounts remaining unpaid.\n\nTransfer to the IEPF — section 124(5): any money remaining unpaid or unclaimed in the Unpaid Dividend Account for SEVEN YEARS from the date of that transfer must be transferred, along with the accrued interest, to the Investor Education and Protection Fund established u/s 125.\n\nThe underlying SHARES — section 124(6): all shares in respect of which dividend has not been paid or claimed for seven CONSECUTIVE years must also be transferred by the company in the name of the IEPF, together with a statement of the prescribed particulars. This is the point candidates most often miss — the shares follow the dividend.\n\nRemedy of the claimant — proviso to section 124(6) and section 125(3): a person whose shares or dividend have been transferred to the IEPF is entitled to CLAIM them back. He applies to the IEPF Authority in the prescribed form, and on being satisfied the Authority refunds the amount and restores the shares. The right of the true owner is therefore not extinguished by the transfer — it is only redirected.",
      keyPoints: [
        "Section 127 — dividend payable within 30 days of declaration",
        "Section 124(1) — transfer to Unpaid Dividend Account within 7 days of expiry of the 30 days",
        "Section 124(2) — statement on the company's website within 90 days",
        "Section 124(3) — 12% per annum interest on default, for the members' benefit",
        "Section 124(5) — amounts unclaimed for 7 years go to the IEPF",
        "Section 124(6) — the SHARES also transfer where dividend is unclaimed for 7 consecutive years",
        "Claimant may apply to the IEPF Authority for refund and restoration of shares",
      ],
    },
    {
      kind: "descriptive",
      chapter: "Limited Liability Partnership Act, 2008",
      section: "Part II — Written (all compulsory)",
      marks: 4,
      text: "Q3(b) [4 marks] Explain the extent of liability of a limited liability partnership and of its partners. In what circumstances does a partner incur personal liability?",
      modelAnswer:
        "Section 26: every partner of an LLP is, for the purpose of its business, the AGENT OF THE LLP — but notably not the agent of the other partners. This is the essential departure from an ordinary partnership.\n\nSection 27: the LLP is not bound by anything done by a partner in dealing with a person if the partner had in fact no authority and that person knew of the want of authority or did not know or believe him to be a partner. Where a partner does act with authority, the LLP is LIABLE for his wrongful act or omission in the ordinary course of its business.\n\nSection 28: an obligation of the LLP, whether arising in contract or otherwise, is solely the obligation of the LLP, and its liabilities are met out of the PROPERTY OF THE LLP. A partner is not personally liable, directly or indirectly, for such an obligation merely by reason of being a partner — this is the limited liability that gives the form its name.\n\nWhen a partner IS personally liable: (i) for his OWN wrongful act or omission — section 28(1) expressly preserves this, so the shield does not cover his own tort or wrong; (ii) under section 30, where the LLP or any of its partners carries on business with INTENT TO DEFRAUD creditors or for any fraudulent purpose, the liability of the LLP and of the partners who acted with that intent is UNLIMITED; and (iii) where he holds himself out, or knowingly permits himself to be held out, in circumstances that make him liable.",
      keyPoints: [
        "Section 26 — a partner is the agent of the LLP, not of the other partners",
        "Section 27 — the LLP is liable for a partner's wrongful act in the ordinary course of business",
        "Section 28 — obligations are solely those of the LLP, met out of LLP property",
        "A partner remains personally liable for his OWN wrongful act or omission",
        "Section 30 — unlimited liability where business is carried on to defraud creditors",
      ],
    },
    {
      kind: "descriptive",
      chapter: "Interpretation of Statutes",
      section: "Part II — Written (all compulsory)",
      marks: 4,
      text: "Q3(c) [4 marks] Explain the mischief rule of interpretation, stating the matters a court must consider, and the case in which the rule was laid down.",
      modelAnswer:
        "The MISCHIEF RULE, also called the rule in Heydon's Case (1584), is applied where the words of a statute are ambiguous and the court must discover the true intention of the legislature. Rather than reading the words in isolation, the court asks what defect in the earlier law the statute was passed to cure, and then construes the words so as to SUPPRESS THE MISCHIEF AND ADVANCE THE REMEDY.\n\nHeydon's Case lays down four matters the court must consider:\n\n(i) What was the COMMON LAW before the making of the Act?\n(ii) What was the MISCHIEF AND DEFECT for which the common law did not provide?\n(iii) What REMEDY has Parliament resolved and appointed to cure the disease of the commonwealth?\n(iv) The TRUE REASON of the remedy.\n\nThe office of the judge is then to make such construction as shall suppress the mischief and advance the remedy, and to suppress subtle inventions and evasions for the continuance of the mischief.\n\nThe rule is therefore purposive: it looks beyond the literal words to the object of the enactment, and is particularly useful with remedial and welfare legislation. It is distinguished from the literal rule, which stops at the plain meaning, and from the golden rule, which departs from the plain meaning only so far as is necessary to avoid absurdity.",
      keyPoints: [
        "Names the rule and Heydon's Case (1584)",
        "States all four matters — prior common law, the mischief, the remedy, the true reason",
        "The judge's office: suppress the mischief and advance the remedy",
        "Notes it is a purposive rule, contrasted with the literal and golden rules",
      ],
    },
    {
      kind: "descriptive",
      chapter: "Management and Administration",
      section: "Part II — Written (all compulsory)",
      marks: 6,
      text: "Q4(a) [6 marks] Members holding 12% of the paid-up share capital of Vindhya Papers Limited carrying voting rights deposited a valid requisition for an extraordinary general meeting with the company on 4 August 2026. The Board took no steps.\n\nAdvise the requisitionists as to their rights — the time within which the Board ought to have acted, the period within which they may themselves call the meeting, and who bears the expenses.",
      modelAnswer:
        "Section 100(2) empowers the Board to call an extraordinary general meeting on the requisition of members holding, in the case of a company having share capital, not less than ONE-TENTH of the paid-up share capital carrying the right to vote as on the date of receipt of the requisition. The requisitionists here hold 12%, which exceeds one-tenth, so the requisition is valid, and it is stated to be valid in form.\n\nDuty of the Board — section 100(4): on receipt of a valid requisition, the Board must within TWENTY-ONE DAYS proceed to call a meeting, and the meeting must be actually HELD within FORTY-FIVE DAYS from the date of receipt of the requisition.\n\nDefault — section 100(4) proviso and 100(5): where the Board fails to do so, the REQUISITIONISTS THEMSELVES may call and hold the meeting. They must do so within THREE MONTHS from the date of the deposit of the requisition. The meeting is called in the same manner, as nearly as possible, as that in which meetings are called by the Board.\n\nExpenses — section 100(6): any reasonable expenses incurred by the requisitionists in calling such a meeting shall be REIMBURSED BY THE COMPANY, and the company shall in turn RECOVER those sums from the fees or other remuneration payable to such of the DIRECTORS who were in default in calling the meeting. The defaulting directors therefore bear the cost personally.\n\nAdvice: the Board ought to have moved by 25 August 2026 and held the meeting by 18 September 2026. Having failed, the requisitionists may call and hold the meeting themselves up to 4 November 2026, and recover their reasonable expenses from the company.",
      keyPoints: [
        "Section 100(2) — requisition valid at one-tenth of paid-up capital; 12% qualifies",
        "Board must move within 21 days and the meeting be held within 45 days of receipt",
        "On default the requisitionists may themselves call it, within 3 months of the deposit",
        "Section 100(6) — reasonable expenses reimbursed by the company",
        "Company recovers those expenses from the defaulting directors' fees or remuneration",
        "Applies the dates to the facts",
      ],
    },
    {
      kind: "descriptive",
      chapter: "Accounts of Companies",
      section: "Part II — Written (all compulsory)",
      marks: 4,
      text: "Q4(b) [4 marks] Distinguish between re-opening of accounts on a court or Tribunal order and voluntary revision of financial statements or the Board's report under the Companies Act, 2013.",
      modelAnswer:
        "RE-OPENING — section 130. A company shall NOT re-open its books of account or recast its financial statements except on an ORDER of a court of competent jurisdiction or the Tribunal. Such an order may be made only on an application by the Central Government, the Income-tax authorities, the Securities and Exchange Board, any other statutory regulatory body or authority, or any person concerned. The ground is that the earlier accounts were prepared in a FRAUDULENT manner, or that the affairs of the company were MISMANAGED during the relevant period casting doubt on the reliability of the financial statements. The court or Tribunal must give notice to the Central Government, the Income-tax authorities, SEBI or the concerned body and consider their representations. Accounts so revised or recast are FINAL. No order may be made for a period earlier than eight financial years preceding the current year, unless a direction u/s 128(5) has been made.\n\nVOLUNTARY REVISION — section 131. Here the initiative is the company's own. If it appears to the DIRECTORS that the financial statements or the Board's report do not comply with sections 129 or 134, they may prepare revised financial statements or a revised report for any of the THREE PRECEDING financial years, after obtaining the APPROVAL OF THE TRIBUNAL. The Tribunal gives notice to the Central Government and the Income-tax authorities and considers their representations. Such revision may be made only ONCE in a financial year, and the detailed reasons for revision must be disclosed in the Board's report of the relevant year.\n\nThe distinction in short: section 130 is compulsory, external and triggered by fraud or mismanagement, reaching back up to eight years; section 131 is voluntary, internal and triggered by non-compliance, limited to three years and to one revision a year.",
      keyPoints: [
        "Section 130 — re-opening only on a court or Tribunal order; who may apply",
        "Grounds: fraudulent preparation or mismanagement of affairs",
        "Section 130 reaches back up to eight financial years; accounts so recast are final",
        "Section 131 — voluntary, at the directors' initiative, with Tribunal approval",
        "Section 131 limited to any of the three preceding financial years, once a year",
        "Draws the compulsory/external vs voluntary/internal contrast",
      ],
    },
    {
      kind: "descriptive",
      chapter: "Foreign Exchange Management Act, 1999",
      section: "Part II — Written (all compulsory)",
      marks: 4,
      text: "Q4(c) [4 marks] Mr. Advait, who had lived in India all his life, left India on 15 June 2025 to take up employment in Singapore, and remained there throughout. Determine his residential status under FEMA, 1999 for FY 2025-26, giving reasons.",
      modelAnswer:
        "Section 2(v)(A) defines a 'person resident in India' as a person residing in India for MORE THAN 182 DAYS during the course of the PRECEDING financial year. On the day-count alone Mr. Advait, having lived in India all his life, satisfies that test for FY 2025-26, since he resided in India throughout the preceding financial year.\n\nBut the definition does not stop at the day-count. Sub-clause (A) expressly EXCLUDES a person who has gone out of India, or who stays outside India, in either case — (a) for or on taking up EMPLOYMENT outside India, (b) for carrying on outside India a business or vocation, or (c) for any other purpose in such circumstances as would indicate his intention to stay outside India for an UNCERTAIN PERIOD.\n\nMr. Advait left India on 15 June 2025 for the express purpose of taking up employment in Singapore, and remained there. He therefore falls squarely within exclusion (a).\n\nCONCLUSION: notwithstanding that he resided in India for more than 182 days in the preceding financial year, Mr. Advait became a PERSON RESIDENT OUTSIDE INDIA with effect from 15 June 2025, the date of his departure, and is a non-resident under FEMA for FY 2025-26 from that date. Under FEMA the PURPOSE of the departure governs, unlike the Income-tax Act where the day-count is decisive — a distinction that is frequently examined.",
      keyPoints: [
        "Section 2(v)(A) — more than 182 days in the PRECEDING financial year",
        "Identifies the exclusion for a person leaving India for employment abroad",
        "Correct conclusion: resident OUTSIDE India from 15 June 2025",
        "Reasons that purpose of departure governs, not the day-count",
        "Notes the contrast with residential status under the Income-tax Act",
      ],
    },
    {
      kind: "descriptive",
      chapter: "Prospectus and Allotment of Shares",
      section: "Part II — Written (all compulsory)",
      marks: 6,
      text: "Q5(a) [6 marks] Deccan Organics Private Limited made a private placement offer to 240 identified persons during FY 2026-27, none of whom were qualified institutional buyers or employees under an ESOP. It also published an advertisement in a national daily inviting subscription.\n\nExamine the validity of the offer, and state the consequences of contravention of the private placement provisions.",
      modelAnswer:
        "Section 42 read with Rule 14 of the Companies (Prospectus and Allotment of Securities) Rules, 2014 governs private placement — an offer of securities made to a SELECT GROUP of identified persons through a private placement offer-cum-application letter in Form PAS-4.\n\nThe numerical ceiling: a private placement offer may be made to not more than TWO HUNDRED persons IN THE AGGREGATE in a financial year, excluding qualified institutional buyers and employees to whom securities are offered under a scheme of employees' stock option. The ceiling is reckoned separately for each KIND of security.\n\nApplying this: Deccan Organics made the offer to 240 persons, none of whom fall in the excluded categories. The offer therefore EXCEEDS the ceiling of 200 and is invalid.\n\nThe advertisement: section 42(7) expressly provides that no company making a private placement shall release any public ADVERTISEMENT or utilise any media, marketing or distribution channels or agents to inform the public at large about such an offer. Publishing an advertisement in a national daily is a plain breach of this.\n\nCONSEQUENCE — deemed public offer: where an offer is made to more than the prescribed number of persons, or accompanied by such solicitation of the public, it is treated as an offer to the public and is DEEMED TO BE A PUBLIC OFFER. It must accordingly comply with all the provisions relating to a prospectus and a public issue, including the Securities Contracts (Regulation) Act, 1956 and the SEBI Act, 1992 — whether or not the company intended a public offer, and whether or not the allottees actually subscribed.\n\nPENALTY — section 42(10): where a company makes an offer or accepts monies in contravention of section 42, the COMPANY, its PROMOTERS and DIRECTORS shall be liable to a PENALTY which may extend to the AMOUNT RAISED through the private placement, or ₹2 CRORE, whichever is LOWER. The company shall also REFUND all monies with interest to the subscribers within THIRTY DAYS of the order imposing the penalty.\n\nOther conditions worth noting: monies must be received only by cheque, demand draft or other banking channel and kept in a separate bank account; allotment must be completed within SIXTY DAYS of receipt of application money, failing which the money is repayable within fifteen days and thereafter with interest at 12% p.a.; and the return of allotment in Form PAS-3 must be filed within FIFTEEN DAYS of allotment.",
      keyPoints: [
        "Section 42 with Rule 14 — private placement to identified persons via PAS-4",
        "Ceiling of 200 persons in the aggregate in a financial year, excluding QIBs and ESOP employees",
        "Conclusion: 240 persons breaches the ceiling — offer invalid",
        "Section 42(7) — no public advertisement; the newspaper notice is a separate breach",
        "Consequence: deemed a public offer, must comply with prospectus/public issue provisions",
        "Section 42(10) — penalty up to the amount raised or ₹2 crore, whichever is lower",
        "Refund of all monies within 30 days of the penalty order",
      ],
    },
    {
      kind: "descriptive",
      chapter: "Audit and Auditors",
      section: "Part II — Written (all compulsory)",
      marks: 4,
      text: "Q5(b) [4 marks] Mr. Suhas is proposed to be appointed as the statutory auditor of Pallava Steel Limited. His brother holds equity shares of the company of face value ₹1.4 lakh, and Mr. Suhas owes the company ₹6 lakh. Examine his eligibility.",
      modelAnswer:
        "Section 141(3) lists the persons who are NOT ELIGIBLE for appointment as auditor of a company. Two of those grounds are in issue.\n\n(i) HOLDING OF SECURITIES — section 141(3)(d)(i) with Rule 10: a person is disqualified if he, or his RELATIVE or partner, is holding any security of or interest in the company. A brother is a relative within the meaning of the Act. However, the PROVISO permits a RELATIVE to hold securities of FACE VALUE NOT EXCEEDING ₹1,00,000. Mr. Suhas's brother holds shares of face value ₹1.4 lakh, which EXCEEDS that limit. Mr. Suhas is therefore disqualified on this ground. (Rule 10 allows a corrective window of sixty days for the relative to bring the holding within the limit, failing which the disqualification stands.)\n\n(ii) INDEBTEDNESS — section 141(3)(d)(ii): a person is disqualified if he, or his relative or partner, is INDEBTED to the company in excess of ₹5,00,000. Mr. Suhas himself owes the company ₹6 lakh, which exceeds ₹5,00,000. He is therefore disqualified on this ground as well.\n\nCONCLUSION: Mr. Suhas is NOT ELIGIBLE for appointment as statutory auditor of Pallava Steel Limited, on BOTH counts independently. Further, under section 141(4), if an auditor incurs any of the disqualifications in section 141(3) AFTER his appointment, he shall be deemed to have VACATED his office, and the vacancy is treated as a casual vacancy.",
      keyPoints: [
        "Section 141(3)(d)(i) — relative may hold securities of face value up to ₹1,00,000 only",
        "Brother is a relative; ₹1.4 lakh exceeds the limit, so disqualified",
        "Section 141(3)(d)(ii) — indebtedness exceeding ₹5,00,000 disqualifies; ₹6 lakh exceeds it",
        "Correct conclusion: not eligible, on both grounds independently",
        "Section 141(4) — disqualification arising later means deemed vacation of office",
      ],
    },
    {
      kind: "descriptive",
      chapter: "Interpretation of Statutes",
      section: "Part II — Written (all compulsory)",
      marks: 4,
      text: "Q5(c) [4 marks] Explain any four internal aids to the interpretation of a statute.",
      modelAnswer:
        "Internal aids are those found WITHIN the statute itself, as distinct from external aids such as parliamentary history or dictionaries. Any four of the following:\n\n(i) LONG TITLE — the long title sets out in general terms the purpose of the Act and is a legitimate aid to construction where the enacting words are ambiguous, though it cannot override clear language.\n\n(ii) PREAMBLE — the preamble states the reasons and objects of the enactment. It is a key to the mind of the legislature and may be used where the words are ambiguous; but it CANNOT restrict or override the plain and unambiguous words of a substantive provision.\n\n(iii) HEADINGS AND MARGINAL NOTES — headings prefixed to a group of sections may be treated as a preamble to those sections and used to resolve ambiguity. Marginal notes are of limited weight, since they are usually inserted by the draftsman rather than enacted by the legislature, but may be looked at where the section is ambiguous.\n\n(iv) DEFINITION OR INTERPRETATION CLAUSES — a definition clause fixes the meaning of a term throughout the Act. Where it says 'means', the definition is exhaustive; where it says 'includes', it is extensive and enlarges the ordinary meaning; 'means and includes' is exhaustive.\n\n(v) PROVISO — a proviso carves out an EXCEPTION from the main provision to which it is appended, and is normally confined to that provision alone.\n\n(vi) EXPLANATION — an Explanation is added to clarify the meaning of the main provision, to remove doubt, or to widen or narrow its scope; it does not ordinarily enlarge the section beyond its terms.\n\n(vii) SCHEDULES — schedules form part of the statute and must be read together with the sections; in the event of a conflict between a schedule and the enacting part, the ENACTING PART PREVAILS.\n\n(viii) ILLUSTRATIONS — illustrations appended to a section exemplify the operation of the section and are of value in showing its intended scope, but cannot control or curtail the plain words of the section.",
      keyPoints: [
        "Explains any four internal aids correctly",
        "For each, states its interpretative weight, not merely its name",
        "Notes that no internal aid may override clear and unambiguous language",
        "Distinguishes 'means' (exhaustive) from 'includes' (extensive) if definitions are chosen",
      ],
    },
  ],
};
