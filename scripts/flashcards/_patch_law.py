# Hand review of the drafted Law flashcards (23 Nov 2026). Fixes cards that were
# wrong, stale or filed under the wrong chapter, and adds the high-yield ones the
# draft missed.  python3 scripts/flashcards/_patch_law.py
import json
P = "scripts/flashcards/law.json"
d = json.load(open(P))
C = lambda f, b: {"front": f, "back": b}

def patch(ch, sets=None, dels=None, adds=None):
    cards = d[ch]
    for i, c in (sets or {}).items():
        cards[i] = c
    for i in sorted(dels or [], reverse=True):
        del cards[i]
    cards.extend(adds or [])

patch("Incorporation of Companies", sets={
  2: C("Declaration of commencement of business — who, when, which form?",
       "Every company having a share capital: a director files INC-20A within 180 days of incorporation, confirming subscribers have paid for their shares (s.10A). Until then it cannot commence business or borrow."),
}, adds=[
  C("Doctrine of ultra vires — effect of an act beyond the objects clause?",
    "Void ab initio; cannot be ratified even by all shareholders (Ashbury Railway Carriage v. Riche). The company is not bound, and directors may be personally liable."),
  C("Constructive notice vs indoor management?",
    "Constructive notice: outsiders are deemed to know the MOA/AOA. Indoor management (Royal British Bank v. Turquand): they may assume internal procedure was followed. No protection for forgery, knowledge of irregularity, or suspicious circumstances."),
  C("Shifting the registered office — what approval is needed?",
    "Within the same city/town: Board resolution. Outside local limits, same State: special resolution. One ROC to another in the same State: + Regional Director's confirmation. State to State: SR + Central Government (RD) approval, alter MOA."),
  C("Section 8 company — the essentials?",
    "Formed for charity, science, art, sport, education, etc.; profits applied to objects; NO dividend to members. Licence from the Central Government; need not use 'Limited'. Can never be a small company."),
  C("Alteration of articles and entrenchment (s.14, s.5)?",
    "Articles altered by special resolution. Entrenchment makes specified provisions alterable only on stricter conditions — agreed by ALL members (private) or by special resolution (public)."),
])

patch("Introduction — Preliminary Law", adds=[
  C("Holding/subsidiary vs associate company?",
    "Subsidiary (s.2(87)): the other company controls the composition of its Board, or controls more than one-half of total voting power. Associate (s.2(6)): significant influence = at least 20% of voting power, but not a subsidiary."),
  C("When can the corporate veil be lifted?",
    "Fraud or improper conduct, evasion of tax or law, the company being a sham or agent of its members, enemy character, and where statute provides. Starting point is separate personality — Salomon v. Salomon."),
  C("Which companies can NEVER be a small company?",
    "A public company, a holding company, a subsidiary company, a section 8 company, and a company governed by a special Act — whatever their capital and turnover."),
])

patch("Prospectus and Allotment of Shares", sets={
  4: C("Private placement — time to allot, and if not allotted?",
       "Allot within 60 days of receiving application money; else refund within 15 days after that; else repay with interest at 12% p.a. Money must sit in a separate bank account (s.42(6))."),
  6: C("Return of allotment in PAS-3 — time limits?",
       "Private placement: within 15 days of allotment (s.42(8)). Other allotments: within 30 days (s.39(4))."),
}, dels=[7], adds=[
  C("Misstatement in a prospectus — s.34 vs s.35 vs s.36?",
    "s.34: CRIMINAL liability (punishable as fraud u/s 447). s.35: CIVIL liability to compensate those who subscribed. s.36: punishment for fraudulently inducing persons to invest."),
  C("Minimum subscription and application money (s.39)?",
    "No allotment unless the minimum amount stated in the prospectus is subscribed. Application money at least 5% of nominal value (or as SEBI specifies). Not received within 30 days of issue → refund within 15 days of closure."),
  C("Private placement — consequence of breaching s.42?",
    "Offer to more than 200 persons, or any advertisement, makes it a deemed PUBLIC offer. Penalty on company, promoters and directors: up to the amount raised or ₹2 crore, whichever is lower; refund within 30 days of the order."),
  C("Shelf prospectus vs red herring prospectus?",
    "Shelf (s.31): valid 1 year for multiple issues; an information memorandum before each later issue. Red herring (s.32): lacks price/quantum; filed with ROC at least 3 days before the offer opens."),
])

patch("Shares and Debentures", sets={
  0: C("Securities premium account — the only permitted uses (s.52)?",
       "Fully paid bonus shares; preliminary expenses; commission/discount/expenses on issue of securities; premium on redemption of preference shares or debentures; buyback u/s 68. Nothing else."),
  1: C("Rights issue u/s 62(1)(a) — the conditions?",
       "Offered to existing equity holders in proportion to paid-up capital; open 15 to 30 days; right of renunciation; not accepted = deemed declined. ESOP: special resolution. Preferential allotment: SR + registered valuer's price."),
  2: C("Sweat equity (s.54) — the limits?",
       "Special resolution, valid 12 months. Per year: 15% of paid-up equity or ₹5 CRORE in value, whichever is higher. Overall cap 25% of paid-up equity. Lock-in 3 years."),
  5: C("Bonus shares (s.63) — sources and bars?",
       "Out of free reserves, securities premium or CRR only — NEVER a revaluation reserve. Not in lieu of dividend. Once announced, cannot be withdrawn. Partly paid shares must first be made fully paid."),
}, adds=[
  C("Delivery of certificates (s.56) — time limits?",
    "Subscribers to MOA: 2 months from incorporation. Allotment: 2 months. Transfer/transmission: 1 month from receipt of the instrument. Debentures: 6 months from allotment. Transfer instrument lodged within 60 days of execution."),
  C("Capital Redemption Reserve on buyback (s.69)?",
    "Equal to the NOMINAL value of shares bought back out of free reserves or securities premium. Usable only to issue fully paid bonus shares."),
  C("Reduction of capital (s.66) vs buyback (s.68)?",
    "Reduction: special resolution + confirmation by the Tribunal (NCLT). Buyback: no Tribunal — board resolution up to 10%, special resolution up to 25%."),
])

patch("Acceptance of Deposits by Companies", sets={
  0: C("Which sections govern deposits?",
       "ss.73 to 76A with the Companies (Acceptance of Deposits) Rules, 2014. s.73: prohibition + deposits from members. s.76: eligible public companies from the public. s.76A: punishment."),
  1: C("Deposit limits — who can take how much?",
       "Eligible public company: 10% of capital + free reserves + securities premium from members, 25% from public. Government eligible company: 35% from public. Other public company: 35% from members. Private company: 100% from members."),
  2: C("Interest on deposits not repaid on maturity?",
       "Penal interest at 18% p.a. for the overdue period (Rule 17)."),
  3: C("Return of deposits — form and due date?",
       "Form DPT-3, on or before 30 June every year, with information as on 31 March, duly audited."),
  4: C("Deposit repayment reserve account?",
       "On or before 30 April each year, deposit at least 20% of deposits maturing during the FOLLOWING financial year in a scheduled bank. Usable only for repaying deposits."),
  5: C("Who is outside Chapter V altogether?",
       "Banking companies, NBFCs registered with RBI, housing finance companies registered with NHB, and other companies the Central Government specifies."),
}, dels=[6], adds=[
  C("Who is an 'eligible company' u/s 76?",
    "A PUBLIC company with net worth of at least ₹100 crore OR turnover of at least ₹500 crore, which has obtained prior consent by special resolution filed with the ROC, and a credit rating every year."),
  C("Tenure of deposits?",
    "Not less than 6 months and not more than 36 months. Exception: up to 10% of capital + free reserves for 3 to 6 months to meet short-term needs. No deposits repayable on demand."),
  C("Amounts that are NOT deposits (Rule 2(1)(c)) — the common ones?",
    "From Government/banks/financial institutions; from another company; share application money allotted within 60 days; from a DIRECTOR out of his own funds (with declaration); secured debentures; advances for goods/services adjusted within 365 days."),
  C("Punishment u/s 76A?",
    "Company: fine of at least ₹1 crore or twice the deposit (whichever lower), up to ₹10 crore. Officer in default: imprisonment up to 7 years and fine ₹25 lakh to ₹2 crore; fraud u/s 447 if wilful."),
])

patch("Registration of Charge", sets={
  7: C("Missed the 30 days — what are the extended windows (s.77)?",
       "Up to 60 days from creation: ROC may allow with additional fees. A further 60 days (120 in all): with ad valorem fees. Beyond that: only the Central Government can extend, u/s 87."),
}, adds=[
  C("Company does not register the charge — what can the lender do (s.78)?",
    "The charge-holder may himself apply after the 30 days. ROC gives the company 14 days' notice; then registers. He recovers the fees paid from the company."),
  C("Satisfaction of charge (s.82) — time and form?",
    "Intimate the ROC within 30 days of payment in full, Form CHG-4; ROC may allow up to 300 days with additional fees. ROC issues a memorandum of satisfaction."),
  C("Effect of registration on third parties (s.80)?",
    "Any person acquiring the charged property is DEEMED to have notice of the charge from the date of its registration."),
])

patch("Management and Administration", sets={
  0: C("Annual return (s.92) — form, due date, certification?",
       "MGT-7 (MGT-7A for OPC and small companies) within 60 days of the AGM. Certified in MGT-8 by a CS in practice if listed, or paid-up capital ₹10 crore+ or turnover ₹50 crore+."),
  1: C("AGM timing (s.96)?",
       "First AGM: within 9 months of the close of the first FY (no ROC extension). Later: within 6 months of FY close; gap not over 15 months. ROC may extend by 3 months. 9 AM to 6 PM, not a national holiday."),
  2: C("EGM on requisition (s.100)?",
       "Members holding 1/10th of paid-up voting capital. Board must move within 21 days and hold it within 45 days of the requisition; else requisitionists hold it within 3 months. Expenses recovered from defaulting directors."),
  3: C("Proxy (s.105) — the rules?",
       "Need not be a member; cannot speak; votes only on a poll. One person: proxy for max 50 members and 10% of voting capital. Deposit 48 hours before; inspection from 24 hours before."),
  4: C("Poll demand vs special notice — the fractions?",
       "Poll (s.109): 1/10th of total voting power OR ₹5 lakh paid-up capital. Special notice (s.115): 1% of voting power OR ₹5 lakh paid-up capital. Same ₹5 lakh, different fractions."),
  5: C("Closing the register of members (s.91)?",
       "At least 7 days' prior notice. Closed for not more than 30 days at a stretch and 45 days in a year."),
  6: C("Significant beneficial owner (s.90)?",
       "Holds, alone or together, beneficial interest of at least 10% in shares, voting rights or distributable dividend, or exercises control/significant influence. BEN-1 to the company; company files BEN-2."),
  7: C("Filing resolutions with the ROC (s.117)?",
       "MGT-14 within 30 days of passing — all special resolutions and specified Board resolutions and agreements."),
  9: C("Quorum for a general meeting (s.103)?",
       "Public company: 5 members if up to 1,000 members; 15 if 1,001 to 5,000; 30 if more than 5,000. Private company: 2. PERSONALLY present — proxies do not count; a s.113 corporate representative does."),
  11: C("No quorum within half an hour — what happens?",
        "Meeting stands adjourned to the same day next week, same time and place. If it was called on REQUISITION, it stands cancelled. At the adjourned meeting, members present are the quorum."),
  12: C("Ordinary vs special resolution (s.114)?",
        "Ordinary: votes for exceed votes against. Special: intention stated in the notice, and votes for are at least THREE TIMES the votes against."),
  13: C("Report on AGM (s.121) and postal ballot (s.110)?",
        "AGM report: listed public companies only, MGT-15 within 30 days. Postal ballot: mandatory for notified items; not required for OPC and companies with up to 200 members."),
})

patch("Audit and Auditors", sets={
  3: C("Casual vacancy in the office of auditor (s.139(8))?",
       "Board fills it within 30 days. If caused by RESIGNATION, the appointment must also be approved by the company in general meeting within 3 months of the Board's recommendation. Holds office till the next AGM."),
  6: C("Fraud reporting by the auditor (s.143(12))?",
       "₹1 crore or more: report to Board/Audit Committee within 2 days, seek reply within 45 days, then forward to the Central Government within 15 days (ADT-4). Below ₹1 crore: to Board/Audit Committee only; disclosed in Board's report."),
  7: C("Tenure of an auditor appointed at an AGM (s.139(1))?",
       "From the conclusion of that AGM till the conclusion of the SIXTH AGM — a five-year term. Annual ratification by members is no longer required."),
  9: C("First auditor (s.139(6))?",
       "Appointed by the Board within 30 days of incorporation; failing which, by members at an EGM within 90 days. Holds office till the conclusion of the FIRST AGM."),
}, adds=[
  C("Which companies must rotate auditors (Rule 5)?",
    "Listed companies; unlisted PUBLIC companies with paid-up capital ₹10 crore+; PRIVATE companies with paid-up capital ₹50 crore+; any company with public borrowings/deposits of ₹50 crore+."),
  C("Disqualifications u/s 141(3) — the money limits?",
    "Self/relative/partner holding securities (a RELATIVE may hold up to ₹1 lakh face value); indebted above ₹5 lakh; guarantee above ₹1 lakh; business relationship. Also: officer/employee, body corporate (LLP allowed), more than 20 audits."),
  C("Removing an auditor before his term (s.140(1))?",
    "Board resolution → application to the Central Government in ADT-2 within 30 days → on approval, special resolution within 60 days. Auditor must get a reasonable opportunity of being heard."),
  C("Services an auditor cannot render (s.144)?",
    "Accounting and book-keeping; internal audit; design of financial information systems; actuarial; investment advisory; investment banking; outsourced financial services; management services."),
  C("Auditor's resignation — filing?",
    "File ADT-3 within 30 days of resignation with the company and the ROC (also with the CAG for government companies), stating reasons. Default: penalty of ₹50,000 or audit fees, whichever is less, plus ₹500 a day."),
])

patch("Declaration of Dividends", sets={
  1: C("When is a company barred from declaring dividend on equity shares (s.123(6))?",
       "While it is in default of sections 73 and 74 — acceptance and repayment of DEPOSITS. (Do not confuse with s.70, which bars BUYBACK for deposit, debenture, preference and term-loan defaults.)"),
  3: C("Time to pay a declared dividend, and the punishment (s.127)?",
       "Within 30 days of declaration. Default: every director knowingly a party — imprisonment up to 2 years and fine of at least ₹1,000 a day; company pays simple interest at 18% p.a."),
  8: C("In what form may dividend be paid (s.123(5))?",
       "Only in CASH — cheque, warrant or electronic mode — to the registered holder or his banker. Capitalising profits to issue fully paid bonus shares is not barred by this rule."),
}, adds=[
  C("Dividend out of accumulated reserves when profits are inadequate — the conditions?",
    "Rate not above the average of the 3 preceding years; withdrawal not above 1/10th of paid-up capital + free reserves; amount first used to set off the year's losses; reserves after withdrawal at least 15% of paid-up capital."),
  C("Interim dividend when the company has a loss in the current year?",
    "Rate cannot exceed the average of dividends declared in the 3 immediately preceding financial years (s.123(3)). It caps the rate; it does not bar the dividend."),
  C("Unpaid Dividend Account — statement and interest (s.124)?",
    "Statement of names and unpaid amounts on the company's website within 90 days of the transfer. Default in transferring: interest at 12% p.a. for the members' benefit."),
  C("What goes to the IEPF after 7 years?",
    "The unpaid/unclaimed dividend AND the underlying SHARES on which dividend has been unclaimed for 7 consecutive years (s.124(5), (6)). Both can be reclaimed from the IEPF Authority."),
])

patch("Accounts of Companies", sets={
  2: C("Which companies need not prepare a cash flow statement (s.2(40))?",
       "One Person Company, small company (paid-up up to ₹10 crore AND turnover up to ₹100 crore), dormant company, and a private company that is a start-up."),
}, adds=[
  C("CSR (s.135) — when does it apply and how much?",
    "Any ONE in the immediately preceding FY: net worth ₹500 crore+, turnover ₹1,000 crore+, or net profit ₹5 crore+. Spend 2% of average net profits of the 3 preceding FYs. No CSR Committee if the obligation is ₹50 lakh or less."),
  C("Re-opening (s.130) vs voluntary revision (s.131)?",
    "130: only on a court/Tribunal order, for fraud or mismanagement; up to 8 years back. 131: directors' own application with Tribunal approval; any of the 3 preceding FYs; once a year."),
  C("Internal audit (s.138) — unlisted public company thresholds?",
    "Paid-up capital ₹50 crore+, or turnover ₹200 crore+, or bank/PFI borrowings above ₹100 crore, or deposits ₹25 crore+. Private company: turnover ₹200 crore+ or borrowings above ₹100 crore. Every listed company."),
  C("Filing financial statements — OPC, and if not adopted at the AGM?",
    "Normally AOC-4 within 30 days of the AGM. OPC: within 180 days of the close of the FY. If not adopted, file unadopted statements within 30 days; ROC takes them as provisional."),
])

patch("Companies Incorporated outside India", sets={
  7: C("Foreign company fails to comply with Chapter XXII — effect on its contracts (s.393)?",
       "Contracts stay VALID and it can be sued — but the company cannot bring any suit, claim a set-off or counter-claim on them until it complies."),
}, adds=[
  C("When must a foreign company comply as if it were an Indian company (s.379(2))?",
    "Where not less than 50% of its paid-up share capital is held by Indian citizens and/or companies or bodies corporate incorporated in India."),
  C("Accounts of a foreign company (s.381) — filing time?",
    "Balance sheet, P&L and a list of all places of business in India, within 6 months of the close of the financial year; ROC may extend by up to 3 months."),
])

patch("Limited Liability Partnership Act, 2008", sets={
  0: C("Minimum partners and designated partners; who is 'resident'?",
       "At least 2 partners; at least 2 designated partners who are individuals, one of them resident in India — i.e. stayed in India at least 120 days during the financial year (s.7)."),
}, adds=[
  C("Whose agent is a partner of an LLP (s.26)?",
    "Agent of the LLP — NOT of the other partners. The LLP is liable for his wrongful acts in the course of business; other partners are not personally liable."),
  C("When is liability UNLIMITED in an LLP (s.30)?",
    "Where the LLP or its partners act with intent to defraud creditors or for a fraudulent purpose: unlimited for the LLP and for the partners who acted so. Also imprisonment up to 5 years and fine ₹50,000 to ₹5 lakh."),
  C("No LLP agreement, or it is silent — what governs (s.23(4))?",
    "The First Schedule: equal share in capital and profits, every partner may take part in management, no remuneration for management, new partner only with consent of all."),
  C("Fewer than 2 partners for more than 6 months?",
    "The sole partner who carries on business knowing this is PERSONALLY liable for obligations incurred in that period (s.6). It is also a ground for winding up."),
])

patch("General Clauses Act, 1897", sets={
  3: C("'From' and 'to' in computing time (s.9)?",
       "'From' EXCLUDES the first day; 'to' INCLUDES the last day."),
  4: C("Last day falls on a day the court or office is closed (s.10)?",
       "The act is in time if done on the NEXT day on which the court or office is open. It saves only the last day — it is not a general extension."),
  6: C("Service by post (s.27)?",
       "Deemed effected by properly addressing, pre-paying and posting by registered post — at the time the letter would be delivered in the ordinary course, unless the contrary is proved."),
  9: C("When does a Central Act come into operation if no date is stated (s.5)?",
       "On the day it receives the President's assent. It operates from the first moment of that day (s.5(3))."),
}, adds=[
  C("Effect of repeal (s.6) — what survives?",
    "Unless a different intention appears: previous operation of the law, rights and liabilities accrued, penalties incurred, and pending proceedings all survive. Repeal does not revive anything not in force."),
  C("Power to appoint (s.16) and power to make rules (s.21)?",
    "s.16: power to appoint includes power to suspend or dismiss. s.21: power to issue notifications, orders, rules or bye-laws includes power to add to, amend, vary or rescind them."),
  C("Key definitions in s.3 — 'financial year', 'good faith', 'immovable property'?",
    "Financial year: commencing on 1 April. Good faith: done honestly, whether negligently or not. Immovable property: includes land, benefits arising out of land, and things attached to the earth."),
])

patch("Foreign Exchange Management Act, 1999", sets={
  0: C("'Person resident in India' u/s 2(v) — the test and its exceptions?",
       "Resided in India more than 182 days in the PRECEDING financial year — BUT not one who has gone or stays abroad for employment, business or an uncertain period. A person coming to India for those purposes becomes resident. Purpose beats day-count."),
  6: C("Penalty for contravention (s.13)?",
       "Up to THRICE the sum involved where quantifiable; otherwise up to ₹2 lakh. Continuing contravention: up to ₹5,000 for every day after the first. Civil, adjudicated by the Adjudicating Authority."),
  7: C("Compounding (s.15)?",
       "On application, by the RBI or Directorate of Enforcement, within 180 days of the application. Once compounded, no further proceedings for that contravention."),
}, adds=[
  C("Current vs capital account — the rule of freedom?",
    "Current account (s.5): FREE, subject to reasonable restrictions by the Central Government. Capital account (s.6): permitted only to the extent RBI/Central Government allow. Free unless restricted vs restricted unless permitted."),
  C("Current account transactions — Schedules I, II and III?",
    "Schedule I: PROHIBITED (remittance of lottery winnings, racing income, purchase of lottery tickets, banned magazines). Schedule II: prior approval of the Central Government. Schedule III: RBI approval beyond specified limits; individuals — LRS USD 2,50,000."),
  C("Realisation and repatriation of export proceeds (s.7, s.8)?",
    "Exporters must furnish a declaration of full export value and realise and repatriate the proceeds to India within the period RBI specifies. Residents must take reasonable steps to bring back foreign exchange due."),
])

json.dump(d, open(P, "w"), indent=2, ensure_ascii=False)
print("law patched:", sum(len(v) for v in d.values()), "cards across", len(d), "chapters")

# NOTE: a record of the review. It edits cards by index, so do not re-run it on the
# already-patched law.json.
