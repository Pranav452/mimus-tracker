# Hand review of the drafted Accounts flashcards (23 Nov 2026).
# The draft's main fault was Ind AS / IFRS leaking into an AS-based syllabus
# (restating comparatives, "held for sale", CODM, indefinite-life intangibles,
# discounting provisions, bargain purchase gains...). Every card below is the
# Companies (Accounting Standards) Rules, 2021 position.
#   python3 scripts/flashcards/_patch_accounts.py
import json, re
P = "scripts/flashcards/accounts.json"
d = json.load(open(P))
C = lambda f, b: {"front": f, "back": b}

def K(prefix):
    hits = [k for k in d if k.startswith(prefix)]
    assert len(hits) == 1, (prefix, hits)
    return hits[0]

def patch(prefix, sets=None, dels=None, adds=None):
    cards = d[K(prefix)]
    for i, c in (sets or {}).items():
        cards[i] = c
    for i in sorted(dels or [], reverse=True):
        del cards[i]
    cards.extend(adds or [])

# --- cosmetic: the generator prefixed answers with "1.", "1 rule:", "Rule:" ---
NOISE = re.compile(r"^(\d+\.\s+|\d+:\s+|(?:1 |2 |3 )?(?:rule|Rule|formula|Formula|condition|method rule|method|test|event|review|limit|computation|reconciliation|frequency|requirement|disclosure|entry|common error|common omission|objective|choice|rate|Time rule|Cost rule|Frequency):\s+)")
for cards in d.values():
    for c in cards:
        b = NOISE.sub("", c["back"])
        c["back"] = b[:1].upper() + b[1:]

# paragraph numbers in the AS 16 draft were wrong - drop them, keep the rule
for c in d[K("AS 16")]:
    for k in ("front", "back"):
        c[k] = re.sub(r"\s*\((?:AS )?paras?[^)]*\)", "", c[k]).replace(" (cite paragraph)", "").strip()

# AS 21 says "minority interest", not NCI
for c in d[K("Consolidation")]:
    for k in ("front", "back"):
        c[k] = (c[k].replace("non‑controlling interest", "minority interest")
                    .replace("NCI’s", "minority's").replace("NCI%", "minority %").replace("NCI", "minority interest"))

patch("Investment Accounts", sets={
  0: C("Current vs long-term investment (AS 13)?",
       "Current: by its nature readily realisable AND intended to be held for not more than one year from the date it is made. Long-term: everything else."),
  6: C("Bonus shares and rights shares on an investment — cost treatment?",
       "Bonus: NO cost added; quantity rises, so cost per share falls. Rights subscribed: price paid is added to carrying amount. Rights sold: proceeds to P&L — unless bought cum-right and ex-right market value is below cost, then reduce the carrying amount."),
  7: C("Reclassification between long-term and current — at what value?",
       "Long-term → current: lower of COST and CARRYING AMOUNT on the transfer date. Current → long-term: lower of COST and FAIR VALUE on the transfer date."),
  10: C("Bought cum-interest — how is the price split in the investment account?",
        "Accrued interest from the last interest date to the purchase date is NOT cost: debit it to the interest column. Only the balance is capital cost. On sale, split the proceeds the same way."),
}, adds=[
  C("Current investments — compare cost and fair value at what level?",
    "Individually, or category-wise (equity, preference, debentures) — never on an overall/global basis. Long-term investments are assessed individually."),
  C("Dividend received out of pre-acquisition profits?",
    "It is a recovery of cost — credit the investment (reduce carrying amount), not income. Only the post-acquisition part is income."),
  C("Selling part of a holding — which cost is matched?",
    "Average carrying amount of the total holding (weighted average cost). Profit = net sale proceeds (after brokerage) minus that average cost."),
  C("Investment property under AS 13?",
    "Land or building not intended to be occupied substantially for own use or operations. Accounted as a LONG-TERM investment: cost less other-than-temporary diminution."),
])

patch("Cash Flow Statement", sets={
  3: C("Bank overdraft in an AS 3 cash flow statement?",
       "AS 3 is silent. Treat it as a borrowing — financing activity — and say so in a note. The 'part of cash equivalents if integral to cash management' rule is Ind AS 7, not this syllabus."),
  4: C("Interest and dividends — classification under AS 3?",
       "Non-financial enterprise: interest PAID and dividend PAID = financing; interest and dividend RECEIVED = investing. Financial enterprise: interest paid and interest/dividend received = operating. Dividend paid is always financing. No free choice."),
  11: C("Proposed dividend in a cash flow question — what was actually paid?",
        "LAST year's proposed dividend is this year's cash outflow (paid after the AGM). This year's proposed dividend is not a liability (AS 4) and not a cash flow. Add any interim dividend paid this year."),
}, adds=[
  C("Extraordinary items in the cash flow statement?",
    "Classify as operating, investing or financing as appropriate and disclose SEPARATELY — e.g. insurance claim for earthquake loss of stock = operating; of a building = investing."),
  C("Foreign currency cash flows and unrealised exchange gains?",
    "Record at the rate on the date of the cash flow. Unrealised exchange differences are not cash flows; the effect on cash held in foreign currency is shown separately to reconcile opening and closing cash."),
  C("Acquisition or disposal of a subsidiary — presentation?",
    "A separate line under INVESTING activities, net of cash and cash equivalents acquired or disposed of."),
])

patch("Buyback", sets={
  1: C("Limit on the NUMBER of equity shares bought back in a year?",
       "Not more than 25% of the total paid-up equity capital of that financial year — the 'shares outstanding test'. Applies alongside the 25%-of-capital-and-free-reserves 'resources test'."),
  4: C("Cooling periods around a buyback?",
       "No new buyback offer within 1 year of closing the previous one. No fresh issue of the same kind of shares for 6 months after — except bonus shares and conversions (warrants, ESOPs, sweat equity, preference shares, debentures). Complete within 1 year of the resolution."),
  5: C("Out of which funds can a buyback be made (s.68(1))?",
       "Free reserves, securities premium account, or proceeds of an issue of shares or other specified securities — but NOT the proceeds of an earlier issue of the SAME kind of shares."),
  6: C("When is buyback prohibited (s.70)?",
       "Default in repaying deposits or interest, redeeming debentures or preference shares, paying dividend, or repaying a term loan or interest to a bank/FI — unless remedied and 3 years have passed. Also: not through a subsidiary or investment company."),
  7: C("Permitted modes of buyback (s.68(5))?",
       "From existing holders on a proportionate basis (tender offer); from the open market; from employees holding ESOP or sweat equity securities."),
}, adds=[
  C("The three tests for maximum buyback — and which one wins?",
    "1) Shares outstanding: 25% of equity shares. 2) Resources: 25% of paid-up capital + free reserves ÷ buyback price. 3) Debt-equity: post-buyback debt not more than twice capital + free reserves. Answer = the LOWEST of the three."),
  C("Debt-equity test — how is the maximum buyback worked out?",
    "Minimum equity to keep = total debt ÷ 2. Let x = transfer to CRR and y = buyback amount: (shareholders' funds − x) − y = minimum equity, and y = (x ÷ face value) × buyback price. Solve the two together — CRR is not a free reserve."),
  C("Journal treatment of the premium paid and the CRR on buyback?",
    "Premium on buyback: debit Securities Premium / free reserves. CRR (s.69): transfer the NOMINAL value of shares bought back out of free reserves or securities premium. No CRR for the part funded by a fresh issue."),
  C("Buyback paperwork — the forms?",
    "Declaration of solvency SH-9 before the buyback; letter of offer SH-8; special resolution in MGT-14 within 30 days; extinguish shares within 7 days of completion; return of buyback SH-11 within 30 days of completion; register in SH-10."),
])

patch("Company Final Accounts", sets={
  1: C("Order of headings in the Schedule III (Division I) balance sheet?",
       "Equity & Liabilities: (1) Shareholders' funds; (2) Share application money pending allotment; (3) Non-current liabilities; (4) Current liabilities. Assets: (1) Non-current assets; (2) Current assets."),
  2: C("Instalments of a long-term loan due within 12 months — where shown?",
       "Under SHORT-TERM BORROWINGS as 'current maturities of long-term borrowings' (2021 amendment — earlier it sat in Other current liabilities)."),
  3: C("Managerial remuneration limits (s.197)?",
       "Overall 11% of net profits (computed u/s 198). One MD/WTD/manager: 5%; more than one: 10% in all. Other directors: 1% if there is an MD/WTD/manager, otherwise 3%. Sitting fees are outside the limit."),
  4: C("Exceptional vs extraordinary items in the Division I Statement of P&L?",
       "BOTH have their own line. Exceptional items: shown before 'profit before extraordinary items and tax'. Extraordinary items: shown separately after that (AS 5). The 'no extraordinary items' rule is Ind AS."),
  9: C("Shareholding disclosures in the share capital note?",
       "Each shareholder holding MORE THAN 5% of shares (name, number, %); shares held by the holding company and its group; promoters' shareholding with % change during the year; reconciliation of opening and closing number of shares."),
}, adds=[
  C("Rounding off in Schedule III — the rule after the 2021 amendment?",
    "Now mandatory, based on TOTAL INCOME: below ₹100 crore — nearest hundreds, thousands, lakhs or millions; ₹100 crore or more — nearest lakhs, millions or crores. One unit used uniformly."),
  C("Debit balance of P&L, calls in arrears, forfeited shares — where do they go?",
    "Debit P&L balance: a NEGATIVE figure under 'Surplus' in Reserves & Surplus (even if the total turns negative). Calls unpaid: deducted from subscribed capital. Forfeited shares amount: added to share capital."),
  C("Proposed final dividend at year-end — provide or disclose?",
    "Disclose in the NOTES only. Dividend declared after the balance sheet date is not a liability at that date (AS 4, revised). It is adjusted in Surplus in the year it is paid."),
  C("New disclosures added to Schedule III in 2021 — the ones to name?",
    "Ageing schedules for trade receivables and trade payables; ageing of CWIP and intangibles under development; promoters' shareholding; key ratios with explanation for change above 25%; security deposits under Other non-current assets."),
])

patch("Amalgamation", sets={
  1: C("The five conditions for 'amalgamation in the nature of merger' (AS 14)?",
       "1) ALL assets and liabilities taken over. 2) Holders of at least 90% of the face value of equity become equity holders of the transferee. 3) Consideration to them wholly in equity shares (cash only for fractions). 4) Business intended to be carried on. 5) Book values unchanged, except to align accounting policies."),
  8: C("Purchase consideration — what is in and what is out?",
       "Only what is paid to the SHAREHOLDERS (equity and preference) of the transferor — shares, cash, other assets. Payments to debenture holders and creditors, and liquidation expenses, are NOT consideration."),
  9: C("Liquidation expenses of the transferor — treatment?",
       "Borne by transferor: debit Realisation A/c. Borne by transferee: debit Goodwill / Capital Reserve (purchase method) or General Reserve / P&L (merger). Never part of purchase consideration."),
  10: C("Statutory reserves of the transferor under the PURCHASE method?",
        "Must still be carried: debit Amalgamation Adjustment Reserve, credit the Statutory Reserve. Reverse the entry when the reserve is no longer required. Other reserves of the transferor disappear."),
}, adds=[
  C("Goodwill arising on amalgamation — amortisation?",
    "Over its useful life, not exceeding FIVE years unless a somewhat longer period can be justified (AS 14)."),
  C("Pooling of interests — share capital issued differs from the transferor's capital?",
    "The difference is adjusted in RESERVES of the transferee. No goodwill or capital reserve arises under the merger method."),
  C("Inter-company stock containing unrealised profit on amalgamation?",
    "Cancel mutual debtors/creditors and bills. Unrealised profit in stock: reduce the stock and debit Goodwill / Capital Reserve (purchase) or General Reserve (merger)."),
  C("Net payment method vs net assets method for consideration?",
    "Net payment: add up everything paid to shareholders in each form. Net assets: agreed value of assets taken over minus liabilities taken over. If the question gives the payments, net payment prevails."),
])

patch("Internal Reconstruction", sets={
  6: C("Reconstruction (Capital Reduction) Account — nature and how it is closed?",
       "A temporary account: credited with sacrifices by shareholders and creditors and appreciation in assets; debited with losses, fictitious assets and write-downs. Any credit balance left goes to CAPITAL RESERVE."),
  7: C("Entry for reducing a ₹10 share to ₹6 fully paid?",
       "Equity Share Capital (₹10) A/c Dr 10 → To Equity Share Capital (₹6) A/c 6, To Capital Reduction A/c 4. The sacrifice is the credit to Capital Reduction."),
  9: C("Alteration of capital u/s 61 vs reduction u/s 66?",
       "s.61 (increase, consolidation, sub-division, conversion to stock, cancel unissued): ordinary resolution if articles permit; Tribunal only if consolidation changes voting percentages. s.66 reduction: special resolution + Tribunal confirmation."),
}, adds=[
  C("Arrears of preference dividend waived or settled in a reconstruction?",
    "Arrears are only a contingent liability — no entry for the part WAIVED. Any amount actually paid or settled in shares is debited to Capital Reduction A/c."),
  C("Creditors or debenture holders agree to a cut — entry?",
    "Creditors / Debentures A/c Dr → To Capital Reduction A/c with the amount sacrificed. If they take new shares or debentures in settlement, credit those for the agreed value."),
])

patch("Consolidation", sets={
  0: C("When is an enterprise a subsidiary under AS 21?",
       "Control = ownership, directly or through subsidiaries, of MORE THAN ONE-HALF of the voting power, OR control of the composition of the board of directors so as to obtain economic benefits."),
  1: C("How is minority interest measured under AS 21?",
       "Minority's % of the subsidiary's net assets: their share of equity at the date of acquisition plus their share of movements since. Shown separately from liabilities and the parent's equity. No fair-value option."),
  2: C("Goodwill or capital reserve on consolidation — the formula?",
       "Cost of investment minus parent's share of the subsidiary's equity on the acquisition date (capital + pre-acquisition reserves). Positive = GOODWILL. Negative = CAPITAL RESERVE (never a gain in P&L)."),
  4: C("Unrealised profit in unsold intra-group stock?",
       "Eliminate IN FULL. Downstream (parent sold): all borne by the group. Upstream (subsidiary sold): reduce the subsidiary's profit, so the minority bears its share."),
  8: C("Parent and subsidiary have different reporting dates (AS 21)?",
       "Allowed if the gap is not more than SIX months; adjust for significant transactions in between. (Three months is the Ind AS 110 figure.)"),
  9: C("Cost of investment is LESS than the parent's share of equity — treatment?",
       "Capital Reserve on consolidation, shown in the consolidated balance sheet. AS 21 has no 'bargain purchase gain' in P&L."),
}, adds=[
  C("Minority's share of losses exceeds its interest in equity?",
    "The excess, and further losses, are adjusted against the MAJORITY interest — unless the minority has a binding obligation to make good. Later profits go to the majority until its absorbed share is recovered."),
  C("When is a subsidiary excluded from consolidation?",
    "Control is intended to be temporary (acquired and held exclusively for disposal in the near future), or severe long-term restrictions impair its ability to transfer funds. Account under AS 13 instead."),
  C("Subsidiary issues bonus shares — effect on cost of control?",
    "Out of PRE-acquisition profits: no effect. Out of POST-acquisition profits: revenue profits shrink and the paid-up value held rises, so goodwill falls (or capital reserve rises)."),
  C("Cumulative preference shares of the subsidiary held outside the group?",
    "Parent computes its share of profit only AFTER deducting the subsidiary's preference dividend for the period — whether or not declared."),
])

patch("Branch Accounts", sets={
  3: C("Methods of accounting for a dependent branch?",
       "Debtors method (one Branch A/c — small branch); Stock and Debtors method (separate control accounts — goods at invoice price); Final Accounts method (memorandum Branch Trading and P&L); Wholesale branch method."),
  8: C("Foreign branch under AS 11 — integral vs non-integral?",
       "Integral: monetary items at closing rate, non-monetary at historical rate, income/expenses at average rate, depreciation at the asset's rate; difference to P&L. Non-integral: ALL assets and liabilities at closing rate, income/expenses at average; difference to Foreign Currency Translation Reserve."),
  10: C("Goods or cash in transit between HO and branch at year-end?",
        "Adjust in ONE set of books, usually HO: Goods-in-transit A/c Dr / Cash-in-transit A/c Dr → To Branch A/c. Shown as an asset; reversed next year."),
  11: C("Inter-branch transfer of goods — entry in HO books?",
        "Receiving Branch A/c Dr → To Supplying Branch A/c. Each branch records it through its Head Office account, not through the other branch."),
}, adds=[
  C("Stock and Debtors method — which accounts are opened?",
    "Branch Stock A/c (at invoice price), Branch Debtors A/c, Branch Expenses A/c, Goods Sent to Branch A/c, Branch Adjustment A/c (the loading — gives gross profit), Branch P&L A/c."),
  C("Shortage or surplus in Branch Stock A/c kept at invoice price?",
    "Split it: the LOADING part goes to Branch Adjustment A/c, the COST part to Branch P&L A/c. Normal loss: adjust only the loading."),
  C("Branch fixed asset account kept in HO books — depreciation entries?",
    "Branch books: Depreciation A/c Dr → To Head Office A/c. HO books: Branch A/c Dr → To Branch Fixed Asset A/c. Same for an asset bought by the branch: Branch debits HO; HO debits Branch Asset."),
])

patch("AS 1 ", sets={
  1: C("Change in accounting policy — what does AS 1 require?",
       "Disclose any change with a material effect in the current period or later periods, and the AMOUNT of the effect to the extent ascertainable. If not ascertainable, say so. No restatement of earlier years."),
  2: C("Change has no material effect this year but will in later years?",
       "The fact of the change must still be disclosed in the period in which it is adopted (AS 1)."),
  5: C("The three fundamental accounting assumptions?",
       "Going concern, Consistency, Accrual. If followed — no disclosure needed. If NOT followed — the fact must be disclosed."),
  8: C("What guides the SELECTION of accounting policies?",
       "Prudence (provide for known losses, do not anticipate profits), Substance over form, Materiality. Aim: a true and fair view."),
}, adds=[
  C("Does disclosing a wrong policy cure it?",
    "No. Disclosure of accounting policies, or of changes in them, cannot remedy a wrong or inappropriate treatment in the accounts (AS 1)."),
])

patch("AS 4 ", sets={
  0: C("Which events does AS 4 cover?",
       "Significant events, favourable or unfavourable, between the balance sheet date and the date the financial statements are APPROVED by the Board of Directors (or other approving authority)."),
  2: C("Non-adjusting events — where are they disclosed?",
       "No change to the figures. Material changes and commitments affecting the financial position are disclosed in the REPORT OF THE APPROVING AUTHORITY (Board's report): nature of the event and an estimate of its effect, or that it cannot be estimated."),
  7: C("Debtor becomes insolvent after the balance sheet date — adjusting or not?",
       "Depends on WHY. Loss caused by conditions existing at the balance sheet date (already in trouble): adjusting — provide. Caused by an event after that date (fire at his premises in April): non-adjusting — disclose."),
  9: C("Exceptions — events after the date that are adjusted anyway?",
       "Where statute requires, or where the event shows the going concern assumption no longer holds (e.g. destruction of the major plant) — then the basis of accounting itself changes."),
})

patch("AS 2 ", sets={
  7: C("Joint products and by-products under AS 2?",
       "Joint costs: allocate on a rational basis, e.g. relative sales value at separation or at completion. By-products, scrap and waste: measured at NRV, and that value is DEDUCTED from the cost of the main product."),
  8: C("Cost vs NRV — compared how, and how often?",
       "Item by item (or groups of similar items) — never total cost against total NRV. Reassess NRV at every balance sheet date. Under a firm sales contract, NRV = the contract price."),
  9: C("AS 2 disclosures?",
       "The accounting policy adopted including the cost formula used; the total carrying amount of inventories and its classification (raw materials, WIP, finished goods, stores, loose tools)."),
}, adds=[
  C("Raw material price has fallen — do you write the raw material down?",
    "NOT if the finished goods will still sell at or above cost. If the finished product's NRV is below its cost, write the material down — and REPLACEMENT COST is the best measure of its NRV."),
  C("What is outside AS 2?",
    "WIP under construction contracts (AS 7), WIP of service providers, shares and other financial instruments held as stock-in-trade, and producers' livestock, agricultural/forest products and mineral ores measured at NRV by trade practice."),
  C("Standard cost and retail method — allowed?",
    "Yes, for convenience, if the results approximate actual cost. Retail method: sales value less the appropriate gross margin percentage."),
])

patch("AS 5 ", sets={
  0: C("What is a 'prior period item' (AS 5)?",
       "Income or expense arising in the CURRENT period from ERRORS OR OMISSIONS in preparing the financial statements of one or more earlier periods. A revised estimate is not a prior period item."),
  1: C("Presentation of prior period items?",
       "Included in the current year's profit or loss, with their nature and amount disclosed separately so that the impact on current profit can be seen. Opening balances and comparatives are NOT restated."),
  2: C("What is an extraordinary item, and how is it shown?",
       "Income or expense from events clearly distinct from ordinary activities and not expected to recur frequently — e.g. earthquake loss, attachment of property. Part of net profit, but nature and amount disclosed SEPARATELY on the face of the P&L."),
  3: C("When may an accounting policy be changed (AS 5)?",
       "Only if required by statute, required for compliance with an Accounting Standard, or it gives a more appropriate presentation. Disclose the change and its impact; if the amount is not ascertainable, say so."),
  5: C("Is restating last year's figures the fix for an error found this year?",
       "No. Under AS 5 the correction passes through THIS year's P&L as a prior period item, separately disclosed. Retrospective restatement is Ind AS 8, not this syllabus."),
  6: C("Exceptional items (items within ordinary activities needing separate disclosure)?",
       "Ordinary-activity items of such size, nature or incidence that disclosure is relevant: inventory write-downs, restructuring costs, disposal of fixed assets or long-term investments, litigation settlements, reversal of provisions."),
  7: C("What is NOT a change in accounting policy?",
       "Adopting a policy for events that differ in substance from earlier ones, or for events that did not occur before or were immaterial."),
  8: C("Change in depreciation method — policy or estimate?",
       "A change in accounting ESTIMATE (AS 10 revised) — applied prospectively. Change in inventory cost formula (FIFO to weighted average) is a change in POLICY."),
  9: C("Hard to tell whether it is a change in policy or in estimate?",
       "Treat it as a change in accounting estimate, with appropriate disclosure (AS 5)."),
  10: C("Where does the effect of a change in estimate go in the P&L?",
        "In the same classification as the original estimate: ordinary if it was ordinary, extraordinary if it was extraordinary. Period of change, and future periods if they are affected."),
})

patch("AS 7 ", sets={
  4: C("Outcome of a contract cannot be estimated reliably — what is recognised?",
       "Revenue only to the extent of contract costs incurred whose recovery is PROBABLE; contract costs expensed as incurred; no profit. Expected loss still recognised at once. (AS 7 has no 'completed contract method'.)"),
  6: C("Contract costs — what is in, what is out?",
       "In: direct costs (site labour, materials, plant depreciation, hire, design), attributable costs allocated (insurance, construction overheads, borrowing costs per AS 16), costs chargeable to the customer. Out: general administration, selling costs, unreimbursed R&D, depreciation of idle plant."),
  10: C("Cost-to-cost method — which costs are left out of 'costs incurred to date'?",
        "Costs relating to FUTURE activity: materials delivered to site but not yet installed or used, and advances paid to sub-contractors for work not yet done."),
}, adds=[
  C("Expected loss on a contract — working for the provision?",
    "Total expected loss = total estimated cost − contract revenue. Recognise ALL of it now: loss already reflected (cost incurred − revenue recognised) plus a provision for the balance. Stage of completion is irrelevant."),
  C("Fixed price vs cost plus contract — reliability conditions?",
    "Fixed price: revenue, costs to complete and stage of completion all reliably measurable, benefits probable. Cost plus: benefits probable and attributable costs clearly identified and reliably measured."),
])

patch("AS 10 ", sets={
  3: C("Revaluation increase and decrease under AS 10?",
       "Increase: credited to Revaluation Surplus (owners' interests) — to P&L only to the extent it reverses an earlier decrease charged there. Decrease: to P&L — except to the extent of a credit in the surplus for that asset."),
}, adds=[
  C("Costs that are NOT part of the cost of PPE?",
    "Opening a new facility, introducing a new product (advertising), conducting business in a new location or with new customers (staff training), administration and general overheads, initial operating losses. Income from incidental operations goes to P&L."),
  C("When does depreciation start and stop?",
    "Starts when the asset is AVAILABLE for use. Stops at the earlier of being retired from active use and held for disposal, or derecognition. It does NOT stop when the asset is idle. Land is not depreciated."),
  C("Revaluation — one asset or the whole class? And the surplus later?",
    "The ENTIRE class must be revalued. The surplus may be transferred to revenue reserves on derecognition, or gradually as the asset is used — directly, never through P&L."),
  C("Asset retired from active use and held for disposal?",
    "Carry at the LOWER of carrying amount and net realisable value; recognise any write-down in P&L. Spares and stand-by equipment are PPE if they meet the definition, otherwise inventory."),
])

patch("AS 9 ", sets={
  0: C("Core conditions for recognising revenue under AS 9?",
       "The revenue is MEASURABLE, and at the time of sale or service it is not unreasonable to expect ULTIMATE COLLECTION. If collection is uncertain at that time, postpone recognition."),
  2: C("Revenue from services — the two methods?",
       "Proportionate completion method: recognised as each act is performed, in proportion to completion. Completed service contract method: recognised when the sole or final act is done and the service is chargeable."),
  3: C("Interest, royalties and dividends — when recognised?",
       "Interest: time-proportion basis (amount outstanding × rate). Royalties: accrual basis as per the agreement. Dividends: when the owner's RIGHT TO RECEIVE payment is established."),
  4: C("What is outside AS 9?",
       "Construction contracts (AS 7), hire purchase and lease agreements, government grants and subsidies, insurance contracts of insurers. Also not 'revenue': gains on sale or revaluation of fixed assets, holding gains, exchange gains."),
  5: C("Uncertainty about collection arises AFTER the sale was recognised?",
       "Do not reverse the revenue. Make a separate PROVISION for the uncertain amount. (If the uncertainty existed at the time of sale, recognition is postponed.)"),
  6: C("Sale on approval or 'sale or return' — when is it revenue?",
       "When the buyer formally accepts, does an act adopting the transaction, or the time for rejection has elapsed (a reasonable time if none is fixed). Guaranteed sale with money-back: recognise at sale with a provision for returns."),
  7: C("Consignment sales and 'bill and hold' sales?",
       "Consignment: no revenue until the consignee sells to a third party. Bill and hold (delivery delayed at the buyer's request, buyer takes title): recognise, provided the goods are on hand, identified and ready for delivery."),
  9: C("Goods sold subject to installation and inspection?",
       "No revenue until the customer accepts delivery and installation and inspection are complete. If installation is simple (e.g. a TV set), recognise on delivery."),
  11: C("AS 9 disclosure?",
        "Besides the AS 1 policy disclosure: the circumstances in which revenue recognition has been POSTPONED pending resolution of significant uncertainties."),
}, adds=[
  C("Instalment sales — how is the price split?",
    "Sale price EXCLUDING interest is revenue on the date of sale. The interest element is recognised over time, in proportion to the unpaid balance."),
  C("Subscriptions, advertising commission, tuition and membership fees?",
    "Publication subscriptions: straight-line over the period. Advertising commission: when the advertisement appears. Tuition fees: over the period of instruction. Entrance fee: generally capitalised; membership fee: over the period of the benefits."),
])

patch("AS 11 ", sets={
  6: C("Integral vs non-integral foreign operation — translation rules?",
       "Integral: as if the transactions were the enterprise's own — monetary at closing rate, non-monetary at historical rate, differences to P&L. Non-integral: all assets and liabilities at closing rate, income/expenses at transaction (average) rates, differences to Foreign Currency Translation Reserve."),
}, adds=[
  C("Forward exchange contract NOT for trading or speculation?",
    "Premium or discount at inception is amortised as expense/income over the life of the contract. Exchange differences recognised in P&L in the period the rates change. Profit or loss on cancellation or renewal: P&L of that period."),
  C("Forward contract held for trading or speculation?",
    "Ignore the premium or discount. Mark to market at each balance sheet date: gain or loss = forward rate available for the remaining maturity vs the contracted rate. To P&L."),
  C("Para 46/46A option for long-term foreign currency monetary items?",
    "Exchange differences may be: added to or deducted from the cost of a DEPRECIABLE capital asset and depreciated over its remaining life; otherwise accumulated in FCMITDA and amortised over the life of the item. Irrevocable once chosen."),
  C("Foreign operation reclassified between integral and non-integral?",
    "Apply the new translation procedure prospectively from the date of change. Integral → non-integral: differences on non-monetary assets go to FCTR. Non-integral → integral: FCTR stays until disposal."),
])

patch("AS 12 ", sets={
  3: C("Non-monetary government grants — at what value?",
       "Given at a CONCESSIONAL rate: record at acquisition cost. Given FREE: record at a nominal value. (Fair value is IAS 20, not AS 12.)"),
  4: C("Grant becomes refundable — treatment?",
       "Extraordinary item (AS 5). Revenue grant: first against unamortised deferred credit, balance to P&L. Asset grant: increase the asset's book value (depreciate prospectively over remaining life) or reduce deferred income. Promoters' contribution: reduce capital reserve."),
  5: C("Grant in the nature of promoters' contribution?",
       "Given with reference to total investment or towards total capital outlay, with no repayment expected: credit to CAPITAL RESERVE as part of shareholders' funds. Not distributable as dividend, not deferred income."),
  9: C("Grant received as compensation for past losses, or as immediate support with no further costs?",
       "Recognise in P&L in the period it becomes RECEIVABLE — as an extraordinary item if appropriate (AS 5)."),
}, adds=[
  C("Grant for a NON-depreciable asset, and a grant equal to the whole cost?",
    "Non-depreciable asset (land): credit to capital reserve; if conditions require spending, credit to income over the period those costs are charged. Grant = whole cost of the asset: show the asset at a nominal value."),
])

patch("AS 16 ", sets={
  0: C("What do 'borrowing costs' include under AS 16?",
       "Interest and commitment charges; amortisation of discounts or premiums; amortisation of ancillary costs of arranging borrowings; finance charges under finance leases; exchange differences on foreign currency borrowings to the extent they are an adjustment to interest cost."),
  1: C("What is a qualifying asset — and how long is 'substantial'?",
       "An asset that necessarily takes a substantial period to get ready for its intended use or sale. Ordinarily TWELVE MONTHS is substantial, unless a shorter or longer period can be justified on the facts."),
  3: C("When is capitalisation suspended — and when not?",
       "Suspended during extended periods in which ACTIVE DEVELOPMENT is interrupted. Not suspended while substantial technical and administrative work continues, or when a temporary delay is a necessary part of the process (high water levels while building a bridge)."),
  6: C("General borrowings — amount to capitalise, and the ceiling?",
       "Capitalisation rate (weighted average cost of general borrowings outstanding) × expenditure on the qualifying asset. The amount capitalised can NEVER exceed the borrowing costs actually incurred in the period."),
}, adds=[
  C("Exchange difference on a foreign currency loan — how much is 'borrowing cost'?",
    "Only up to the difference between interest on an equivalent LOCAL currency borrowing and the interest on the foreign currency borrowing. Any exchange loss beyond that is an AS 11 exchange difference."),
])

patch("AS 15 ", sets={
  7: C("Termination benefits under AS 15 — when recognised?",
       "As a liability and expense when, and only when: there is a present obligation from a past event, an outflow is probable, and a reliable estimate can be made. ('Demonstrably committed' is the IAS 19 wording.)"),
}, adds=[
  C("Defined contribution vs defined benefit — who carries the risk?",
    "Contribution plan: employee bears actuarial and investment risk; employer's duty ends with the contribution. Benefit plan: employer bears both. A provident fund with a guaranteed return is a defined BENEFIT plan."),
  C("Other long-term employee benefits (long-service leave, jubilee awards)?",
    "Measured like defined benefit plans, but simpler: actuarial gains and losses AND past service cost are both recognised immediately."),
])

patch("AS 17 ", sets={
  0: C("Primary and secondary segment formats — what decides?",
       "The dominant source and nature of RISKS AND RETURNS. Mainly products and services: business segments primary, geographical secondary — and vice versa. Internal organisation and reporting is normally the guide."),
  1: C("The 10% tests for a reportable segment?",
       "Any ONE: revenue (external + inter-segment) ≥ 10% of total segment revenue; OR result ≥ 10% of the combined result of all segments in profit or all segments in loss, whichever is GREATER in absolute amount; OR assets ≥ 10% of total segment assets."),
  2: C("Segment revenue — what is included and excluded?",
       "Includes sales to external customers and inter-segment sales, directly attributable or reasonably allocable. Excludes extraordinary items, interest and dividend income (unless a financial segment), and gains on sale of investments."),
  4: C("Disclosures for each PRIMARY reportable segment?",
       "Revenue (external and inter-segment separately), result, carrying amount of assets, LIABILITIES, capital expenditure, depreciation and amortisation, other significant non-cash expenses. Segment liabilities are mandatory under AS 17."),
  7: C("Segment result test when some segments are in loss?",
       "Add up the profits of all segments in profit; add up the losses of all segments in loss. Take the LARGER total (absolute). A segment is reportable if its own profit or loss is 10% or more of that figure."),
  8: C("Inter-segment transfers — measurement and disclosure?",
       "Measured on the basis the enterprise actually used to price them. Disclose that basis and any change in it."),
  9: C("AS 17 approach vs Ind AS 108 — the exam trap?",
       "AS 17 identifies segments by RISKS AND RETURNS. The 'management approach' and 'chief operating decision maker' belong to Ind AS 108 — do not use them in an AS answer."),
}, adds=[
  C("Segment expense — what is excluded?",
    "Extraordinary items, interest expense (unless a financial segment), losses on sale of investments, income tax, and general administrative and head-office expenses that relate to the enterprise as a whole."),
  C("A segment was reportable last year but falls below 10% this year?",
    "Keep reporting it if management judges it to be of continuing significance. A segment reportable for the first time: restate prior-period comparatives unless impracticable."),
])

patch("AS 18 ", sets={
  0: C("The five categories of related parties under AS 18?",
       "(a) Enterprises that control, are controlled by, or are under common control with the reporting enterprise. (b) Associates and joint ventures. (c) Individuals with control or significant influence, and their relatives. (d) Key management personnel and their relatives. (e) Enterprises over which (c) or (d) have significant influence."),
  1: C("'Control' and 'significant influence' in AS 18?",
       "Control: more than one-half of voting power, OR control of the board's composition, OR a substantial interest (20% or more) plus power to direct financial/operating policies. Significant influence: participation in those policy decisions without control — presumed at 20% or more of voting power."),
  2: C("Key management personnel and 'relative' under AS 18?",
       "KMP: those with authority and responsibility for planning, directing and controlling the activities (MD, whole-time directors). A non-executive director is not KMP merely by being a director. Relative: spouse, son, daughter, brother, sister, father, mother."),
  5: C("No price was charged for the transaction — still disclosable?",
       "Yes. A related party transaction is a transfer of resources or obligations REGARDLESS of whether a price is charged. AS 18 does not ask you to certify arm's length."),
  6: C("Where control exists but there were no transactions?",
       "Still disclose the NAME of the related party and the NATURE of the relationship. Control relationships are disclosed irrespective of transactions."),
  7: C("Who is deemed NOT to be a related party?",
       "Two companies merely having a common director; a single customer, supplier, franchiser, distributor or agent on whom the business depends economically; providers of finance, trade unions, public utilities and government departments in normal dealings."),
  9: C("Exemptions from AS 18 disclosure?",
       "Intra-group transactions in CONSOLIDATED statements; transactions between state-controlled enterprises; and where disclosure would conflict with a duty of confidentiality under statute or a regulator (e.g. banks)."),
  10: C("'Substantial interest' under AS 18?",
        "An individual or enterprise holding 20% or more of the voting power, directly or indirectly."),
  11: C("Remuneration paid to a whole-time director — is that a related party transaction?",
        "Yes — he is key management personnel, so the remuneration is disclosed. Sitting fees to a non-executive director are not (he is not KMP)."),
})

patch("AS 19 ", sets={
  0: C("Indicators of a finance lease (AS 19)?",
       "Ownership transfers at the end; bargain purchase option; lease term covers the major part of economic life; PV of minimum lease payments is substantially all of fair value; asset is so specialised that only the lessee can use it without major modification."),
  1: C("Finance lease in the lessee's books — amount and discount rate?",
       "Asset and liability at the LOWER of fair value and PV of minimum lease payments (lessee's view). Discount at the rate implicit in the lease if practicable to determine; otherwise the lessee's incremental borrowing rate."),
  8: C("Gross investment, net investment and unearned finance income?",
       "Gross investment = minimum lease payments (lessor's view) + unguaranteed residual value. Net investment = gross investment − unearned finance income (i.e. its present value at the implicit rate)."),
  9: C("Estimated unguaranteed residual value falls during the lease?",
       "Review regularly. Revise the income allocation over the remaining term, and recognise IMMEDIATELY any reduction in respect of amounts already accrued."),
  11: C("Sale and leaseback resulting in a FINANCE lease?",
        "Any excess OR deficiency of sale proceeds over carrying amount is deferred and amortised over the lease term in proportion to depreciation of the leased asset. Nothing is taken to P&L at once."),
}, adds=[
  C("Sale and leaseback resulting in an OPERATING lease?",
    "Sale at fair value: profit/loss immediately. Below fair value: immediately — unless the loss is compensated by below-market future rentals, then defer. Above fair value: defer the excess over fair value. If fair value is below carrying amount, that loss is recognised at once."),
  C("Manufacturer or dealer lessor — finance lease?",
    "Recognise selling profit as for an outright sale. If an artificially low interest rate is quoted, restrict profit to what a commercial rate would give. Initial direct costs: expense at the inception of the lease."),
  C("What is outside AS 19?",
    "Leases to explore for or use natural resources (oil, gas, timber, minerals); licensing agreements for films, plays, manuscripts, patents, copyrights; and lease agreements to use LAND."),
])

patch("AS 20 ", sets={
  7: C("Presentation and disclosure of EPS under AS 20?",
       "Basic AND diluted EPS on the face of the P&L for each class of equity, with equal prominence — even if negative. Also EPS excluding extraordinary items. Disclose the numerators with a reconciliation to net profit, weighted average shares, and nominal value per share."),
  8: C("Rights issue with a bonus element — the adjustment?",
       "Theoretical ex-rights price = (fair value of all shares before rights + rights proceeds) ÷ shares after rights. Factor = fair value per share before rights ÷ theoretical ex-rights price. Multiply the pre-rights shares (and prior years') by the factor."),
}, adds=[
  C("Partly paid shares in the weighted average?",
    "Counted as a FRACTION of a share, to the extent they are entitled to participate in dividend relative to a fully paid share."),
  C("Share application money pending allotment — basic or diluted?",
    "Not in basic EPS. If it is not statutorily required to be kept separately and is being used in the business, treat it as dilutive POTENTIAL equity shares for diluted EPS."),
  C("Several potential equity instruments — in what order are they tested?",
    "From MOST dilutive to least dilutive (lowest earnings per incremental share first). Include one only if it lowers EPS from continuing ordinary operations; stop when the next would raise it."),
])

patch("AS 24 ", sets={
  0: C("What is a discontinuing operation (AS 24)?",
       "A component that, under a SINGLE PLAN, is being disposed of substantially in its entirety, disposed of piecemeal, or terminated through abandonment — AND is a separate major line of business or geographical area — AND is distinguishable operationally and for financial reporting."),
  1: C("How are the assets of a discontinuing operation measured?",
       "AS 24 has NO measurement rules — it is a presentation and disclosure standard. Apply the other standards: AS 28 for impairment, AS 29 for provisions, AS 10, AS 15. ('Held for sale at lower of carrying amount and fair value less costs' is Ind AS 105.)"),
  2: C("Initial disclosure event — what triggers the disclosures?",
       "The EARLIER of: a binding sale agreement for substantially all the assets of the operation; or the Board approving a detailed formal plan AND announcing it."),
  3: C("What goes on the FACE of the P&L for a discontinuing operation?",
       "Pre-tax profit or loss from its ordinary activities and the related tax expense; and the pre-tax gain or loss on disposal of its assets or settlement of its liabilities. Not a single net-of-tax line."),
  4: C("What goes in the NOTES?",
       "Description of the operation, its segment, date and nature of the initial disclosure event, expected completion; carrying amounts of total assets to be disposed of and liabilities to be settled; its revenue and expenses; net cash flows by operating, investing, financing."),
  5: C("What is NOT a discontinuing operation?",
       "Gradual phasing out of a product line; discontinuing several products within an ongoing line; shifting production or marketing to another location; closing a facility to save costs; selling a subsidiary whose activities are similar to the parent's."),
  8: C("The plan is later withdrawn, or continues into next year?",
       "Withdrawn: disclose that fact and its effect. Continuing: update the disclosures every period up to and including the period in which the discontinuance is completed. Comparatives are restated to segregate the operation."),
})

patch("AS 25 ", sets={
  1: C("Minimum components of an interim financial report (AS 25)?",
       "Condensed balance sheet, condensed statement of profit and loss, condensed cash flow statement, and selected explanatory notes. (There is no statement of changes in equity under AS.)"),
  6: C("Seasonal revenue and uneven costs at an interim date?",
       "Do NOT anticipate or defer them at the interim date unless that would also be appropriate at the year-end. Test: would it be recognised if this were the annual balance sheet date?"),
  8: C("Change in accounting policy vs change in estimate during the year?",
       "Policy: restate the PRIOR INTERIM periods of the current financial year. Estimate: earlier interim figures are not restated; a significant change in the final interim period is disclosed in the annual statements."),
  9: C("How is materiality judged in an interim report?",
       "In relation to the INTERIM period's financial data — not the forecast annual figures. Interim measurements may rely more on estimates."),
}, dels=[13], adds=[
  C("Does frequency of reporting change the annual result?",
    "No. Interim measurement is on a YEAR-TO-DATE basis, so quarterly or half-yearly reporting must give the same annual figures. Same accounting policies as the annual statements."),
  C("Year-end bonus, and inventories, at an interim date?",
    "Bonus: anticipate only if there is a legal or constructive obligation and a reliable estimate. Inventories: same principles as year-end; write down to NRV at the interim date. Basic and diluted EPS go on the face of the interim P&L."),
])

patch("AS 22 ", sets={
  3: C("Recognising deferred tax ASSETS — the prudence tests?",
       "Normally: REASONABLE CERTAINTY of sufficient future taxable income. Where there is unabsorbed depreciation or carried-forward tax losses: VIRTUAL CERTAINTY supported by convincing evidence (e.g. firm orders in hand)."),
  5: C("Tax rate changes — which rate, and where does the effect go?",
       "Measure at rates and laws enacted or substantively enacted by the balance sheet date. The effect of a change is taken to the PROFIT AND LOSS of that year."),
  9: C("Timing vs permanent differences — exam examples?",
       "Timing: depreciation (book vs tax), section 43B items allowed on payment, provision for doubtful debts, preliminary expenses. Permanent: penalties and donations disallowed, exempt income — no deferred tax."),
  11: C("Tax holiday (sections 80-IA, 10AA) and deferred tax?",
        "Timing differences that reverse DURING the holiday: no deferred tax. Those that reverse AFTER it: recognise in the year they originate. Assume those that originate first reverse first."),
}, adds=[
  C("MAT and MAT credit under AS 22?",
    "MAT paid is CURRENT tax. MAT credit is not a deferred tax asset: recognise 'MAT credit entitlement' as an asset only on convincing evidence that normal tax will be payable within the set-off period."),
  C("Deferred tax assets at each balance sheet date?",
    "Review the carrying amount: write down if realisation is no longer reasonably/virtually certain; reverse the write-down if it becomes so. Reassess unrecognised deferred tax assets too."),
])

patch("AS 26 ", sets={
  5: C("Useful life of an intangible asset under AS 26?",
       "Rebuttable presumption: not more than TEN years from when it is available for use. Every intangible is amortised — there is no 'indefinite life, no amortisation' under AS. If amortised over more than 10 years: disclose why, and test for impairment every year."),
  6: C("Can an intangible asset be revalued under AS 26?",
       "No. Cost less accumulated amortisation and impairment only. The revaluation model for intangibles is Ind AS 38."),
}, adds=[
  C("What can NEVER be recognised as an intangible asset?",
    "Internally generated goodwill, brands, mastheads, publishing titles, customer lists. Expensed when incurred: research, start-up and preliminary costs, training, advertising, relocation."),
  C("Expenditure on an intangible item was expensed last year — can it be capitalised now?",
    "No. Expenditure initially recognised as an expense cannot be reinstated as part of the cost of an intangible asset later."),
  C("Amortisation method, and intangibles not yet in use?",
    "Method should reflect the pattern of benefits; if that cannot be determined reliably, STRAIGHT-LINE. An intangible not yet available for use is tested for impairment at least every year-end."),
])

patch("AS 28 ", sets={
  1: C("Recoverable amount under AS 28?",
       "The HIGHER of net selling price (arm's-length sale price less costs of disposal) and value in use (present value of future cash flows from use and eventual disposal)."),
  6: C("Which assets are outside AS 28?",
       "Inventories (AS 2), assets arising from construction contracts (AS 7), financial assets including investments (AS 13), and deferred tax assets (AS 22)."),
  7: C("Reversing an impairment loss — when, the cap, and goodwill?",
       "Only if the ESTIMATES used for recoverable amount have changed. Cap: the carrying amount (net of depreciation) had no loss been recognised. Goodwill: reversed only if the loss came from a specific external event of an exceptional nature and later external events reversed it."),
}, adds=[
  C("Cash flow estimates for value in use — the rules?",
    "Based on reasonable assumptions and approved budgets, normally up to FIVE years. Exclude financing cash flows and income tax, and the effects of future restructuring not yet committed or future capital expenditure that enhances performance."),
  C("Goodwill and corporate assets in a CGU test?",
    "Bottom-up test: can it be allocated to the CGU on a reasonable basis? If yes, test that CGU including it. If not, also do a top-down test on the smallest larger CGU to which it can be allocated."),
])

patch("AS 29 ", sets={
  3: C("Contingent asset under AS 29 — recognise, disclose, or neither?",
       "Not recognised AND not disclosed in the financial statements. If an inflow is probable, it is usually mentioned in the Board's report. When realisation becomes VIRTUALLY CERTAIN it is no longer contingent — recognise it."),
  5: C("Are provisions discounted to present value under AS 29?",
       "NO — except decommissioning, restoration and similar liabilities recognised as part of the cost of PPE, which are discounted at a pre-tax rate. General discounting is IAS 37 / Ind AS 37."),
  6: C("Expected reimbursement (insurance, indemnity) of a provision?",
       "Recognise only when VIRTUALLY CERTAIN, as a separate asset, not exceeding the provision. In the P&L the expense may be shown net of the reimbursement."),
  7: C("Restructuring provision under AS 29?",
       "Only when the ordinary recognition criteria are met — AS 29 does not recognise 'constructive obligations'. No obligation for a sale of an operation until there is a binding sale agreement. Include only direct costs, not ongoing activities."),
}, adds=[
  C("Probable, possible, remote — the three outcomes?",
    "Probable (more likely than not) + reliable estimate: PROVIDE. Possible, or probable but not measurable: DISCLOSE as contingent liability. Remote: nothing."),
  C("Measuring a provision — three things to remember?",
    "Best estimate, before tax. Ignore gains from the expected disposal of assets. A provision is used only for the expenditure it was created for; reverse it if an outflow is no longer probable."),
])

json.dump(d, open(P, "w"), indent=2, ensure_ascii=False)
print("accounts patched:", sum(len(v) for v in d.values()), "cards across", len(d), "chapters")

# NOTE: after the first run two more fixes were applied directly to the JSON
# (AS 5 card 4 reworded to the AS position; stray "para N" citations removed).
# This script is a record of the review, not something to re-run on the patched file.
