# Hand review of the drafted Tax flashcards (23 Nov 2026). Each entry fixes a card
# that was wrong, stale or off-chapter, or adds a high-yield card the draft
# missed. Run once after gen-flashcards.ts:  python3 scripts/flashcards/_patch_tax.py
import json
P = "scripts/flashcards/tax.json"
d = json.load(open(P))
C = lambda f, b: {"front": f, "back": b}

def patch(ch, sets=None, dels=None, adds=None):
    cards = d[ch]
    for i, c in (sets or {}).items():
        cards[i] = c
    for i in sorted(dels or [], reverse=True):
        del cards[i]
    cards.extend(adds or [])

patch("Basics of Income Tax", sets={
  7: C("When does s.6(1A) deem an Indian citizen to be resident?",
       "Indian CITIZEN (not PIO) + total income other than from foreign sources above ₹15 lakh + not liable to tax in any other country by reason of domicile or residence. Always RNOR (s.6(6)(d))."),
})

patch("Income from House Property", sets={
  2: C("Interest on borrowed capital u/s 24(b): let-out vs self-occupied, old vs new regime?",
       "Let-out: full interest, no ceiling. Self-occupied (old regime): ₹2,00,000, or ₹30,000 if conditions fail. New regime: NIL for self-occupied. Pre-construction interest: 5 equal instalments from year of completion."),
  4: C("How do you arrive at Gross Annual Value of a let-out house?",
       "Step 1: expected rent = higher of municipal value and fair rent, capped at standard rent. Step 2: GAV = higher of expected rent and actual rent received or receivable (s.23(1)). Vacancy can pull GAV below expected rent."),
  5: C("How many houses can be treated as self-occupied with nil annual value?",
       "TWO, at the owner's option (s.23(2)/(4)). A third and further houses are deemed let out and taxed on expected rent. The ₹2,00,000 interest ceiling covers both self-occupied houses together."),
  6: C("Co-owned house with definite shares: how is it taxed, and what does each co-owner get?",
       "Each co-owner is assessed separately on his share (s.26). For a self-occupied house, EACH co-owner gets the full ₹2,00,000 interest limit (old regime) — it is not split."),
  9: C("How are arrears of rent / unrealised rent recovered later taxed?",
       "s.25A: taxed in the year of RECEIPT under house property, after a flat 30% deduction — even if the assessee no longer owns the property."),
}, adds=[
  C("Can a house property loss be set off against salary: old regime vs new regime?",
    "Old regime: yes, up to ₹2,00,000 a year (s.71(3A)); balance carried forward 8 years against HP income only. New regime: NO set-off against any other head."),
  C("When are municipal taxes deductible from GAV?",
    "Only when actually PAID by the OWNER during the year — even if they relate to earlier years. Not if merely due, and not if borne by the tenant."),
])

patch("Residential Status", sets={
  2: C("s.6(1A) deemed residency — the three conditions?",
       "(1) Indian CITIZEN only, not PIO; (2) total income other than foreign-source income exceeds ₹15 lakh; (3) not liable to tax in any other country. Result: deemed resident, and always RNOR."),
  3: C("When is a resident individual 'not ordinarily resident' (RNOR)?",
       "If EITHER: non-resident in 9 out of 10 preceding years, OR in India for 729 days or less in the 7 preceding years (s.6(6)). Fail both escape routes = ROR."),
  7: C("When is a company resident in India? And a firm / HUF / AOP?",
       "Company: Indian company, OR its place of effective management (POEM) is in India in that year (s.6(3)). Firm/HUF/AOP: resident unless control and management is WHOLLY outside India."),
}, adds=[
  C("Indian citizen LEAVES India for employment or as ship's crew — which residence test applies?",
    "Only the 182-day test. The 60-day condition is replaced by 182 days (Explanation 1(a) to s.6(1)), so the 60 + 365 route is unavailable."),
  C("Indian citizen or PIO VISITING India — when does 60 days become 120 days?",
    "If income other than foreign-source income exceeds ₹15 lakh: 120 days + 365 days in 4 preceding years makes him resident (and RNOR). If such income is ₹15 lakh or less: only the 182-day test applies."),
])

patch("Income from Salary", sets={
  6: C("Order of steps to compute taxable salary?",
       "Gross salary (basic + allowances + perquisites + profits in lieu) → less exempt allowances and exempt retirement benefits → less s.16 deductions (standard deduction; old regime also entertainment allowance and professional tax)."),
  11: C("Where are perquisites defined and valued?",
        "Defined in s.17(2); valued under Rule 3 of the Income-tax Rules. Rule 3C and 3D carry the new ₹4,00,000 and ₹8,00,000 limits."),
}, adds=[
  C("Rent-free unfurnished accommodation owned by a private employer — perquisite value?",
    "10% of salary if population above 40 lakh; 7.5% if above 15 lakh up to 40 lakh; 5% otherwise (2011 census; Rule 3 from 1-9-2023). The old 15% / 10% / 7.5% rates are superseded."),
  C("Leave encashment at retirement — exemption ceiling for non-government employees?",
    "₹25,00,000 (s.10(10AA)); least of the ceiling, actual amount, 10 months' average salary, and unavailed leave at max 30 days a year. Encashment DURING service is fully taxable."),
  C("Employer's contributions to PF + NPS + superannuation — when taxable?",
    "The aggregate above ₹7,50,000 in a year is a perquisite (s.17(2)(vii)), and so is the annual accretion on that excess. Separately, employer's PF contribution above 12% of salary is taxable."),
  C("Commuted pension — how much is exempt for a non-government employee?",
    "1/3 of the FULL commuted value if he also gets gratuity; 1/2 if he does not (s.10(10A)). Gross up first: full value = amount received ÷ percentage commuted. Government employees: fully exempt."),
  C("Which salary deductions/exemptions die in the new regime?",
    "HRA, LTA, children education and hostel allowance, professional tax, entertainment allowance. What survives: standard deduction ₹75,000 and employer's NPS contribution u/s 80CCD(2)."),
])

patch("Set off and Carry Forward of Losses", sets={
  5: C("House property loss — set-off and carry forward?",
       "Old regime: set off against other heads up to ₹2,00,000 a year (s.71(3A)); balance carried forward 8 AYs against house property income only (s.71B). New regime: no inter-head set-off."),
  8: C("Which losses need a return filed by the s.139(1) due date to be carried forward?",
       "Business loss (incl. speculation and specified business), capital loss, and loss from owning race horses (s.80). EXCEPTIONS: house property loss and unabsorbed depreciation carry forward even with a belated return."),
}, adds=[
  C("Can business loss be set off against salary income?",
    "No — s.71(2A) bars set-off of loss under PGBP against income under 'Salaries'. It can be set off against the other heads."),
  C("Specified business loss (s.35AD) and loss from owning race horses — rules?",
    "s.73A: specified business loss only against specified business income, carried forward indefinitely. s.74A: race-horse loss only against race-horse income, carried forward 4 AYs. Losses from lottery/betting cannot be set off at all."),
])

patch("Profits and Gains from Business or Profession", sets={
  0: C("s.44AD — turnover limit, rates, and the 5-year rule?",
       "Up to ₹2 crore; ₹3 crore if cash receipts do not exceed 5% of turnover. Income = 8% of turnover, 6% on receipts through banking channels. Declare lower and opt out → barred from 44AD for the next 5 AYs."),
  1: C("s.44ADA — limit and deemed income for professionals?",
       "Gross receipts up to ₹50 lakh; ₹75 lakh if cash receipts do not exceed 5%. Income = 50% of gross receipts. Unlike 44AD there is no 5-year lock-out."),
  7: C("s.40(a)(ia) vs s.40(a)(i) — how much is disallowed for TDS default?",
       "Payment to a RESIDENT: 30% of the sum disallowed. Payment to a NON-RESIDENT: 100%. Either is allowed in the year the tax is deducted and paid."),
  9: C("s.40(b) — maximum remuneration to working partners?",
       "On first ₹6,00,000 of book profit (or loss): ₹3,00,000 or 90% of book profit, whichever is higher. On the balance: 60%. Must be authorised by the deed. Interest to partners capped at 12% p.a."),
}, adds=[
  C("s.40A(3) — what is the limit for payments to a transporter?",
    "₹35,000 per day for plying, hiring or leasing goods carriages (general limit ₹10,000). Cross the limit and the WHOLE payment is disallowed, not the excess."),
  C("s.43B(h) — payments to micro and small enterprises?",
    "Deductible only on ACTUAL PAYMENT if not paid within the MSMED Act limit (45 days with written agreement, 15 days without). Paying before the return due date does NOT save it."),
  C("Employees' PF contribution deposited late — treatment?",
    "It is the employer's income u/s 2(24)(x); deduction u/s 36(1)(va) only if deposited by the due date under the PF law. The 'before return due date' relief of s.43B covers only the EMPLOYER'S own contribution."),
  C("Depreciation when an asset is used for less than 180 days? Additional depreciation?",
    "Under 180 days: half the normal rate. Additional depreciation: 20% on new plant and machinery for manufacturers (10% if under 180 days, balance next year) — NOT available in the new regime."),
  C("s.44AE — presumptive income for goods carriages?",
    "Up to 10 vehicles. Heavy goods vehicle: ₹1,000 per tonne of gross vehicle weight per month or part. Other vehicles: ₹7,500 per month or part. A part of a month counts as a full month."),
])

patch("Capital Gains", sets={
  0: C("s.112A — rate, exemption and the grandfathering cost rule?",
       "12.5% on LTCG above ₹1,25,000 from STT-paid listed equity/equity funds, no indexation. Cost = higher of (a) actual cost and (b) LOWER of FMV on 31-1-2018 and sale price. It can wipe out a gain but never create a loss."),
  2: C("LTCG on land or building sold by a resident individual/HUF — which rate?",
       "Acquired BEFORE 23-7-2024: tax = lower of 12.5% without indexation and 20% with indexation. Acquired on or after that date, and for all other assessees and assets: 12.5% without indexation."),
  4: C("s.54 — time limits, cap and the two-house option?",
       "Buy within 1 year before or 2 years after, or construct within 3 years. Cost of new house counted up to ₹10 crore. If LTCG is up to ₹2 crore, may invest in TWO houses — once in a lifetime."),
  5: C("s.54F — how is the exemption computed and what is the ownership condition?",
       "Exemption = LTCG × amount invested ÷ NET CONSIDERATION. Must not own more than one residential house (other than the new one) on the date of transfer. ₹10 crore cap applies. Asset sold must NOT be a residential house."),
}, adds=[
  C("s.50C — when does stamp duty value replace actual consideration?",
    "Only if stamp value exceeds 110% of the consideration. If it does, the WHOLE stamp value is adopted. Same 10% tolerance in s.43CA and s.56(2)(x)."),
  C("Sale of depreciable assets (s.50) — nature of the gain?",
    "ALWAYS short-term, whatever the holding period. Gain arises when sale value exceeds opening WDV + additions, or the block ceases to exist."),
  C("Buyback of shares on or after 1-10-2024 — tax in the shareholder's hands?",
    "Entire amount received is DIVIDEND (s.2(22)(f)), no deduction for cost. For capital gains the consideration is nil, so the cost becomes a capital LOSS to set off or carry forward."),
  C("Capital asset converted into stock-in-trade — when and on what value is gain taxed?",
    "s.45(2): capital gain taxed in the year the stock is SOLD, using FMV on the date of conversion as consideration. Sale price minus that FMV is business income."),
])

patch("Income from Other Sources", sets={
  2: C("Immovable property bought for inadequate consideration — when is the difference taxed?",
       "s.56(2)(x): only if stamp value exceeds consideration by more than the HIGHER of ₹50,000 and 10% of the consideration. If it does, the whole difference is taxable."),
  5: C("Family pension — deduction in old vs new regime?",
       "s.57(iia): lower of 1/3 of the pension and ₹15,000 (old regime) or ₹25,000 (new regime). Taxed under Other Sources, never Salaries."),
  6: C("Lottery, races, card games, online games — how taxed?",
       "Flat 30% (s.115BB; online games s.115BBJ on net winnings). No basic exemption, no deduction of any expense, no set-off of losses; in the new regime no 87A rebate against it."),
  7: C("Dividend income — what expense can be deducted?",
       "Only INTEREST expense, and only up to 20% of the dividend (proviso to s.57). Commission or any other expense: nil."),
}, adds=[
  C("Interest on compensation or enhanced compensation — when taxed and what deduction?",
    "Taxed in the year of RECEIPT (s.145B), with a flat 50% deduction (s.57(iv)). No other deduction."),
  C("Gifts that are NOT taxable u/s 56(2)(x)?",
    "From relatives; on the individual's own marriage (from anyone); under a will or inheritance; in contemplation of death of the donor; from local authority or registered trust. Otherwise taxable in full once aggregate exceeds ₹50,000."),
])

patch("Deductions", sets={
  2: C("s.80CCD(2) — employer's NPS contribution: limit, and does it survive the new regime?",
       "Yes, it survives. New regime: up to 14% of salary (basic + DA) for all employers. Old regime: 10% for non-government employers, 14% government. Over and above the ₹1.5 lakh limit of s.80CCE."),
  7: C("Which Chapter VI-A deductions are available in the NEW regime?",
       "Only 80CCD(2) (employer's NPS), 80CCH(2) (Agniveer corpus) and 80JJAA. Everything else — 80C, 80D, 80E, 80G, 80TTA/TTB — is switched off."),
  10: C("s.80DD and s.80U — amounts?",
        "Flat ₹75,000; ₹1,25,000 for severe disability (80% or more). 80DD: for a disabled DEPENDANT. 80U: the assessee HIMSELF is disabled. Flat amounts regardless of actual expense. Residents only."),
}, adds=[
  C("s.80DDB — medical treatment of specified diseases?",
    "Actual expenditure up to ₹40,000; ₹1,00,000 if the patient is a senior citizen. For self or dependant; reduced by insurance or employer reimbursement."),
  C("s.80G with the 10% qualifying limit — the two steps?",
    "Step 1: cap the donation at 10% of adjusted gross total income. Step 2: apply 50% or 100% to that capped figure. Cash donations above ₹2,000 get nothing."),
])

patch("Advance Tax, TDS and TCS", sets={
  0: C("Who must pay advance tax, and who is exempt?",
       "Anyone whose tax payable for the year is ₹10,000 or more (s.208). Exempt: a RESIDENT individual aged 60+ with no business or professional income (s.207(2))."),
  5: C("Advance tax under presumptive taxation?",
       "Assessees under s.44AD or s.44ADA pay the whole advance tax in ONE instalment by 15 March. (s.44AE is not covered — normal four instalments.)"),
  8: C("s.194-I — rent: threshold and rates?",
       "Threshold ₹50,000 per MONTH or part of a month (from 1-4-2025; earlier ₹2.4 lakh a year). 10% on land, building, furniture; 2% on plant and machinery — on the whole rent."),
  10: C("s.194C — contractors: thresholds and rates?",
        "Single payment above ₹30,000 OR aggregate above ₹1,00,000 in the year. 1% if payee is an individual or HUF; 2% for any other payee. On the whole amount."),
  11: C("s.194T — payments by a firm to its partners?",
        "From 1-4-2025: 10% TDS on salary, remuneration, commission, bonus or interest to a partner if the aggregate exceeds ₹20,000 in the year."),
}, adds=[
  C("s.194-IB — rent paid by an individual/HUF not liable to audit?",
    "Rent above ₹50,000 a month: 2% (cut from 5% on 1-10-2024), deducted once — in the last month of the year or of the tenancy. No TAN needed."),
  C("s.194Q vs s.206C(1H)?",
    "194Q: buyer with turnover above ₹10 crore deducts 0.1% on purchases EXCEEDING ₹50 lakh. 206C(1H) (TCS by seller on goods) was switched off from 1-4-2025."),
  C("TCS on LRS remittances u/s 206C(1G)?",
    "Threshold ₹10 lakh (from 1-4-2025). Other purposes: 20% on the excess. Education/medical: 5% on the excess. Education funded by a loan from a specified institution: nil."),
  C("s.194J — which payments attract 2% rather than 10%?",
    "Fees for TECHNICAL services, royalty for sale/distribution of films, and call centres: 2%. Professional services, directors' fees and other royalty: 10%. Threshold ₹50,000."),
])

patch("Clubbing of Income", sets={
  1: C("When is a minor child's income NOT clubbed u/s 64(1A)?",
       "(1) Income from manual work; (2) income from an activity involving the child's skill, talent or specialised knowledge; (3) the minor suffers from a disability specified in s.80U. Everything else is clubbed."),
  5: C("Minor's income: clubbed with which parent, and what exemption?",
       "With the parent whose total income (before clubbing) is HIGHER; if parents are separated, the parent maintaining the child. Exemption u/s 10(32): ₹1,500 per child (old regime only)."),
}, adds=[
  C("Spouse's remuneration from a concern in which the individual has substantial interest?",
    "Clubbed with the individual (s.64(1)(ii)) — UNLESS the spouse has technical or professional qualifications and the income is solely attributable to them. Substantial interest = 20% or more."),
  C("Asset gifted to spouse vs to son's wife?",
    "Both clubbed with the transferor (s.64(1)(iv) and (vi)). Exceptions for spouse: transfer for adequate consideration or under an agreement to live apart. Income on the accumulated income is NOT clubbed."),
  C("Cross transfers — are they caught?",
    "Yes. A gifts to B's wife and B gifts to A's wife: each income is clubbed in the hands of the deemed transferor, to the extent the gifts match."),
])

patch("Return of Income", sets={
  0: C("Due dates for the return u/s 139(1)?",
       "31 July: individuals and others not requiring audit. 31 October: companies, audit cases and their partners. 30 November: transfer-pricing cases. (30 September is the tax AUDIT REPORT date, not the return.)"),
  3: C("Updated return u/s 139(8A) — additional tax by timing?",
       "On tax + interest: 25% if filed within 12 months of the end of the AY; 50% within 24; 60% within 36; 70% within 48. Cannot be used to claim a refund, reduce tax or increase a loss."),
}, adds=[
  C("Fee for filing the return late (s.234F)?",
    "₹5,000; ₹1,000 if total income does not exceed ₹5 lakh. Separate from 1% a month interest u/s 234A."),
  C("Who must file a return even with income below the exemption limit?",
    "Current-account deposits above ₹1 crore; foreign travel spend above ₹2 lakh; electricity above ₹1 lakh; turnover above ₹60 lakh or professional receipts above ₹10 lakh; TDS/TCS ₹25,000+ (₹50,000 seniors); savings deposits ₹50 lakh+."),
  C("Who verifies the return of a company, firm and LLP (s.140)?",
    "Company: managing director (else any director). Firm: managing partner (else any partner not a minor). LLP: designated partner. Individual: himself, or a duly authorised person if absent or incapacitated."),
])

patch("Computation of Total Income", sets={
  3: C("New regime slabs for AY 2026-27 — and the cumulative tax at each step?",
       "0-4L nil; 4-8L 5%; 8-12L 10%; 12-16L 15%; 16-20L 20%; 20-24L 25%; above 24L 30%. Cumulative: ₹20,000 at 8L; ₹60,000 at 12L; ₹1,20,000 at 16L; ₹2,00,000 at 20L; ₹3,00,000 at 24L."),
  8: C("Marginal relief just above ₹12 lakh (new regime)?",
       "Tax cannot exceed the income above ₹12,00,000. E.g. income ₹12,10,000: slab tax ₹61,500 but payable ₹10,000 (+ cess). Without it, earning ₹10,000 more would cost ₹61,500."),
  9: C("Is the s.87A rebate available against tax on capital gains u/s 111A/112A in the new regime?",
       "No (from AY 2026-27). The rebate is limited to tax at SLAB rates. So total income under ₹12 lakh can still carry tax if it includes special-rate income."),
}, adds=[
  C("Surcharge rates for an individual — and the new-regime cap?",
    "10% above ₹50 lakh; 15% above ₹1 crore; 25% above ₹2 crore; 37% above ₹5 crore (old regime only). New regime caps at 25%. On dividend and 111A/112/112A gains: max 15%."),
  C("Old-regime exemption limits by age?",
    "₹2,50,000 general; ₹3,00,000 resident aged 60 to under 80; ₹5,00,000 resident aged 80+. The NEW regime has one limit of ₹4,00,000 for everyone."),
])

patch("Charge of GST (Levy, Composition, RCM)", sets={
  3: C("CGST + SGST or IGST — the one decisive test?",
       "Compare the LOCATION OF THE SUPPLIER with the PLACE OF SUPPLY (not the recipient's location). Same State: intra-State, CGST + SGST. Different States: inter-State, IGST. Imports: IGST."),
  6: C("Who cannot opt for composition?",
       "Makers of inter-State outward supplies; suppliers through an e-commerce operator liable to TCS; manufacturers of ice cream, pan masala, tobacco, aerated waters; casual and non-resident taxable persons; suppliers of non-taxable goods."),
  8: C("Reverse charge u/s 9(3) — the services to remember?",
       "GTA (5%, recipient pays); legal services by an advocate to a business entity; director's services to the company; sponsorship to a body corporate or firm; residential dwelling rented to a registered person; security services by a non-corporate to a registered person."),
}, adds=[
  C("Composition rates?",
    "Manufacturers: 1% of turnover in the State. Traders: 1% of turnover of TAXABLE supplies. Restaurants: 5%. Service providers u/s 10(2A): 6%, turnover up to ₹50 lakh. (CGST + SGST combined.)"),
  C("s.9(3) vs s.9(4)?",
    "9(3): NOTIFIED goods/services — recipient pays whatever the supplier's status. 9(4): specified registered recipients (promoters in real estate) pay on notified supplies received from UNREGISTERED suppliers."),
])

patch("Introduction to GST", sets={
  4: C("GST Council — voting weights, majority and quorum?",
       "Centre one-third, all States together two-thirds. Decisions need three-fourths of the weighted votes of members present and voting. Quorum: half the members. Chair: Union Finance Minister (Art. 279A)."),
  5: C("Which Articles: power to levy GST, IGST on inter-State supply, GST Council?",
       "246A: concurrent power of Parliament and States to make GST laws. 269A: levy and apportionment of IGST on inter-State supplies and imports. 279A: GST Council. 366(12A): definition of GST."),
}, adds=[
  C("What stays OUTSIDE GST?",
    "Alcoholic liquor for human consumption (States tax it). Five petroleum products — crude, petrol, diesel, ATF, natural gas — until the Council recommends a date. Electricity. Tobacco is IN GST and can also bear excise."),
])

patch("Place of Supply", sets={
  0: C("Inter-State or intra-State — what is compared?",
       "Location of the SUPPLIER and the PLACE OF SUPPLY. Different States: inter-State (IGST, s.7 IGST Act). Same State: intra-State (CGST + SGST, s.8). The recipient's location matters only where the rule makes it the place of supply."),
  1: C("Goods involving movement — place of supply? And bill-to ship-to?",
       "s.10(1)(a): where the movement TERMINATES for delivery to the recipient. s.10(1)(b): delivered on the direction of a THIRD PERSON → that third person's principal place of business."),
  2: C("Goods with no movement, and goods assembled or installed at site?",
       "No movement: location of the goods at the time of delivery (s.10(1)(c)). Assembled/installed: place of installation (s.10(1)(d)). On board a conveyance: where taken on board (s.10(1)(e))."),
  4: C("Default rule for services, both parties in India (s.12(2))?",
       "To a REGISTERED person: location of the recipient. To an UNREGISTERED person: location of the recipient if his address is on record; otherwise location of the supplier."),
  7: C("Passenger transport — place of supply?",
       "Registered recipient: location of the recipient. Unregistered: place where the passenger EMBARKS for a continuous journey (s.12(9))."),
  10: C("Training/performance appraisal, and banking services — place of supply?",
        "Training (s.12(5)): registered recipient → his location; unregistered → where actually performed. Banking (s.12(12)): location of the recipient on the supplier's records, else location of the supplier."),
})

patch("Time of Supply", sets={
  0: C("Advance received: is GST payable at receipt — goods vs services?",
       "SERVICES: yes, time of supply is the earlier of invoice and payment, so an advance is taxed on receipt (receipt voucher). GOODS: no tax on advances — time of supply is the invoice date or last date to invoice."),
  4: C("What is the 'date of receipt of payment'?",
       "The EARLIER of the date it is entered in the supplier's books and the date it is credited to his bank account (Explanation to s.12/13)."),
  5: C("Time of supply of GOODS under forward charge?",
       "Earlier of (a) date of issue of invoice and (b) the last date on which the invoice was required to be issued u/s 31. Date of payment is not relevant for goods."),
}, adds=[
  C("Reverse charge — time of supply for goods and for services?",
    "Goods (s.12(3)): earliest of receipt of goods, date of payment, 30 days from supplier's invoice. Services (s.13(3)): earlier of date of payment and 60 days from invoice. Payment date = earlier of books entry and bank debit."),
  C("Change in rate of tax (s.14) — the rule of thumb?",
    "Three events: supply, invoice, payment. The rate in force when ANY TWO of them occur applies. Supplied before the change but invoiced and paid after → new rate, time of supply = earlier of invoice/payment."),
])

patch("Value of Supply", sets={
  2: C("What must be ADDED to transaction value (s.15(2))?",
       "Non-GST taxes and duties; amounts the SUPPLIER was liable to pay but the recipient incurred; incidental expenses (packing, commission) charged before delivery; interest, late fee or penalty for delayed payment; subsidies linked to price EXCEPT government subsidies."),
  4: C("Deadline for a credit note to reduce output tax?",
       "30 November following the financial year of the supply, or the annual return date, whichever is earlier (s.34(2)). A credit note can be issued any time; this limit only governs the tax adjustment."),
}, adds=[
  C("Post-supply discount — when is it deductible from value?",
    "s.15(3)(b): only if (1) established by an agreement entered into at or BEFORE the time of supply and linked to specific invoices, AND (2) the recipient has reversed the proportionate ITC. A spontaneous later discount gets nothing."),
])

patch("Exemptions from GST", sets={
  8: C("GST 2.0 and insurance?",
       "From 22-9-2025: INDIVIDUAL life insurance and INDIVIDUAL health insurance policies are exempt. Group policies are not covered by this exemption."),
}, adds=[
  C("Hospital room rent — exempt?",
    "Health care services by a clinical establishment are exempt, EXCEPT room charges above ₹5,000 per day (other than ICU/CCU/ICCU/NICU), which are taxable without ITC."),
  C("Renting a residential dwelling — exempt or taxable?",
    "Exempt when used as a residence — EXCEPT when let to a registered person, who then pays under reverse charge. Still exempt if the registered person is a proprietor renting it for his own residence in a personal capacity."),
  C("Education services — what is exempt?",
    "Services by an educational institution (pre-school to higher secondary, recognised qualifications, approved vocational courses) to students, faculty and staff. Private coaching is taxable. Catering/transport/security exempt only up to higher secondary."),
  C("Passenger transport — which modes are exempt?",
    "Non-AC contract carriage (not tourism/charter), non-AC stage carriage, metro/monorail/tram, inland waterways, rail other than first class and AC. Taxable: air, AC bus, radio taxi, AC and first-class rail."),
])

patch("Input Tax Credit", sets={
  4: C("Motor vehicles (seating up to 13) — when is ITC allowed despite s.17(5)?",
       "When used for (i) further supply of such vehicles, (ii) transportation of passengers, or (iii) imparting training on driving. Vehicles for transport of GOODS are not blocked at all."),
  5: C("ITC on capital goods when moving from composition/exempt to taxable (s.18)?",
       "Credit is reduced by 5 percentage points per quarter or part from the invoice date (Rule 40). New registrants u/s 18(1)(a)/(b) get credit only on INPUTS in stock, not capital goods. Invoice must not be over 1 year old."),
  8: C("Common credit used for taxable and exempt supplies — how apportioned?",
       "s.17(2) with Rule 42: reverse common credit × exempt turnover ÷ total turnover. Capital goods: Rule 43, spread over 60 months."),
}, adds=[
  C("Conditions to take ITC u/s 16(2)?",
    "Tax invoice or debit note in hand; invoice furnished by the supplier and reflected in GSTR-2B; goods/services received; tax actually paid to Government; recipient has filed GSTR-3B. No provisional credit beyond GSTR-2B."),
  C("s.17(5)(b) — food, catering, health, insurance: the exception?",
    "Blocked unless (a) used for making an outward supply of the same category, or (b) OBLIGATORY for the employer to provide to employees under any law — e.g. a canteen required by the Factories Act."),
  C("Banks and NBFCs — the s.17(4) option?",
    "Either normal apportionment u/s 17(2), or avail 50% of eligible ITC every month and let the rest lapse. Option cannot be withdrawn during the rest of the financial year."),
])

patch("Registration", sets={
  8: C("Several places of business in ONE State — how many registrations?",
       "One is enough, but a SEPARATE registration may be taken for each place of business (s.25(2)). Establishments with separate registrations are 'distinct persons' — supplies between them are taxable."),
}, adds=[
  C("Registration thresholds (aggregate turnover)?",
    "₹40 lakh: exclusively GOODS, in States that adopted it. ₹20 lakh: services or mixed. ₹10 lakh: Manipur, Mizoram, Nagaland, Tripura. The ₹40 lakh limit is not for ice cream, pan masala, tobacco."),
  C("What goes into 'aggregate turnover' (s.2(6))?",
    "All taxable supplies + exempt supplies + exports + inter-State supplies, all-India, same PAN. EXCLUDES inward supplies under reverse charge and the GST itself."),
  C("Compulsory registration regardless of turnover (s.24)?",
    "Inter-State taxable supply of GOODS; casual and non-resident taxable persons; those paying under reverse charge; e-commerce operators and their suppliers (with relaxations); TDS deductors; agents. Inter-State SERVICES get the threshold."),
  C("Casual taxable person — validity of registration?",
    "Period in the application or 90 days, whichever is earlier; extendable by up to 90 days. Advance deposit of estimated tax required. Apply at least 5 days before starting."),
  C("Revocation of cancellation — time limit?",
    "Apply within 90 days of service of the cancellation order (was 30); extendable by up to 180 days by the Commissioner. Not available for voluntary cancellation."),
])

patch("Tax Invoice, Credit and Debit Notes", sets={
  2: C("When is a bill of supply issued instead of a tax invoice?",
       "By a composition taxpayer, and for EXEMPT supplies (s.31(3)(c)). Exports are zero-rated and need a tax invoice, not a bill of supply."),
  7: C("Credit note vs debit note — is there a time limit?",
       "Credit note: output tax can be reduced only if declared by 30 November after the FY (or annual return, if earlier). Debit note: no time limit to issue; ITC on it runs from the financial year of the DEBIT NOTE, not the original invoice."),
}, adds=[
  C("Invoice time limits — banks/insurers, and continuous supply of services?",
    "Services: 30 days from supply; 45 days for banks, insurers, NBFCs. Continuous supply: on or before the due date of payment, or on receipt of payment, or on completion of the event."),
  C("How many copies of a tax invoice?",
    "Goods: TRIPLICATE — original for recipient, duplicate for transporter, triplicate for supplier. Services: DUPLICATE — original for recipient, duplicate for supplier."),
  C("Revised invoice and consolidated invoice?",
    "Revised invoice: within one month of the registration certificate, for supplies from the effective date. No invoice needed for supplies under ₹200 to an unregistered person who does not ask — one consolidated invoice at day end."),
])

patch("Accounts and Records", dels=[5], adds=[
  C("Who must keep records even if unregistered?",
    "Owners/operators of warehouses and godowns, and transporters (s.35(2)); they enrol in GST ENR-01. Records are kept at the principal place of business."),
  C("Annual reconciliation — who certifies GSTR-9C now?",
    "Self-certified by the taxpayer, where aggregate turnover exceeds ₹5 crore. Audit by a chartered or cost accountant was removed from FY 2020-21."),
])

patch("E-way Bill", sets={
  4: C("Validity of an e-way bill?",
       "One day for every 200 km or part thereof (normal cargo). Over-dimensional cargo: one day for every 20 km. A 'day' ends at midnight of the day after generation."),
}, adds=[
  C("When is Part B (vehicle details) not required?",
    "Movement within the State of up to 50 km between the consignor's place and the transporter's place (or transporter to consignee). Part A is still needed."),
  C("When is no e-way bill required at all?",
    "Consignment value up to ₹50,000 (with exceptions); transport by non-motorised conveyance; goods from port/airport to an ICD or CFS for customs clearance; notified exempt goods."),
  C("Acceptance or rejection by the recipient?",
    "Within 72 hours of the details being made available, or the time of delivery, whichever is earlier — else deemed accepted."),
])

patch("TDS and TCS under GST", sets={
  1: C("TCS by e-commerce operators — rate and base?",
       "0.5% (0.25% CGST + 0.25% SGST, or 0.5% IGST) of the NET value of taxable supplies made through the operator — reduced from 1% with effect from 10 July 2024 (s.52)."),
  6: C("Where does the deductee/supplier get the credit of GST TDS or TCS?",
       "In the electronic CASH ledger, after the deductor/operator files GSTR-7 / GSTR-8. It is cash, not input tax credit."),
}, adds=[
  C("When is GST TDS NOT deducted even above ₹2.5 lakh?",
    "When the location of the supplier AND the place of supply are both in a State different from the State of registration of the deductor (proviso to s.51(1))."),
])

patch("Payment of Tax", sets={
  0: C("Order of utilising input tax credit (s.49(5), 49A)?",
       "IGST credit FIRST: against IGST, then CGST and SGST in any order — and it must be exhausted before CGST/SGST credit is used. CGST credit: CGST, then IGST. SGST credit: SGST, then IGST. CGST and SGST never cross."),
  1: C("What can the electronic credit ledger NOT pay?",
       "Tax under reverse charge, interest, penalty, late fee and any other amount — all must be paid in cash. The credit ledger pays OUTPUT TAX only."),
  4: C("Order of discharging dues (s.49(8))?",
       "(1) Self-assessed tax and dues of PREVIOUS periods; (2) self-assessed tax and dues of the CURRENT period; (3) any other amount, including demands u/s 73/74."),
  5: C("Over-the-counter payment limit and challan validity?",
       "OTC (cash, cheque, DD): up to ₹10,000 per challan per tax period. Challan GST PMT-06 is valid for 15 days."),
  6: C("Interest on wrongly availed ITC (s.50(3))?",
       "18% p.a. — but only where the credit is wrongly availed AND utilised. Availed but lying unused in the credit ledger: no interest."),
  7: C("Interest for late payment (s.50(1)) — on what amount?",
       "18% p.a. on the portion paid through the electronic CASH ledger (net cash liability), where the return is filed late but before proceedings begin."),
})

patch("Returns", sets={
  2: C("GSTR-1 and GSTR-3B — monthly due dates?",
       "GSTR-1: 11th of the following month. GSTR-3B: 20th of the following month. GSTR-3B cannot be filed until GSTR-1 for the period is filed."),
  3: C("QRMP scheme — who, and when is tax paid?",
       "Aggregate turnover up to ₹5 crore. Returns quarterly (GSTR-1 by 13th, GSTR-3B by 22nd/24th of the month after the quarter); tax paid MONTHLY by the 25th. Optional IFF for B2B invoices by the 13th."),
  4: C("Composition taxpayer — payment and return?",
       "CMP-08 quarterly by the 18th of the month after the quarter. GSTR-4 annually by 30 JUNE following the financial year (was 30 April)."),
  6: C("Annual return and reconciliation statement?",
       "GSTR-9 by 31 December following the FY. GSTR-9C (self-certified) also, where aggregate turnover exceeds ₹5 crore."),
  7: C("Late fee for GSTR-3B/GSTR-1, and the outer time limit to file?",
       "₹50 a day (₹25 CGST + ₹25 SGST); ₹20 a day for a nil return. No return can be filed after 3 years from its due date."),
})

json.dump(d, open(P, "w"), indent=2, ensure_ascii=False)
print("tax patched:", sum(len(v) for v in d.values()), "cards across", len(d), "chapters")
