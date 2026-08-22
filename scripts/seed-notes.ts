// Seeds hand-authored study notes into chapter_notes (upsert by chapter name).
// Content is current for the Sept 2026 CA Inter attempt — amalgamation accounting
// at Inter level is still AS 14 (Ind AS 103 is a Final topic; don't mix them).
// Run: npx tsx scripts/seed-notes.ts
import { config } from "dotenv";
config({ path: ".env.local" });

import { eq, inArray } from "drizzle-orm";
import { db } from "../lib/db";
import * as schema from "../lib/db/schema";
import type { NoteBlock } from "../components/NotesView";

const AMALGAMATION: NoteBlock[] = [
  {
    type: "layman",
    title: "The one idea",
    text: "All three are company 'weddings'. The ONLY thing that changes between them is **who survives the wedding**. Get that one question right and the definitions can never confuse you again.",
  },
  {
    type: "table",
    caption: "The three, side by side",
    headers: ["", "Amalgamation", "Absorption", "External reconstruction"],
    rows: [
      ["Companies before", "2 or more (A + B)", "2 or more (A + B)", "Just 1 (sick A)"],
      ["New company formed?", "**Yes** — C Ltd is born", "**No** — A already exists", "**Yes** — 'New A' Ltd is born"],
      ["Who dies", "Both A and B", "Only B (A carries on)", "Old A"],
      ["Who survives", "C — a brand-new company", "A — the bigger fish", "New A — same business, new body"],
      ["Why", "Two equals join forces", "Big one swallows small one", "Shed old losses, reset capital"],
      ["Picture it as", "Two rivers → one new river", "Big fish eats small fish", "Rebirth — same soul, new body"],
    ],
  },
  {
    type: "example",
    title: "Real-world hooks",
    lines: [
      "**Amalgamation** — Vodafone India + Idea combined into **Vi**: both old companies gone, one new entity.",
      "**Absorption** — HDFC Ltd merged **into HDFC Bank** (2023): the Bank already existed and survived; HDFC Ltd vanished.",
      "**External reconstruction** — a loss-heavy 'Sunrise Textiles Ltd' forms 'Sunrise Textiles (2026) Ltd' to take over its own business. One business, fresh balance sheet, losses left behind in the corpse.",
    ],
    punch: "Ask 'who survives?' — new company (amalgamation), existing company (absorption), reborn self (external reconstruction).",
  },
  {
    type: "para",
    text: "**Exam angle:** the accounting for all three is the same standard — **AS 14, Accounting for Amalgamations**. The company that dies is the **transferor** (vendor); the one that takes over is the **transferee**. AS 14 splits every combination into two types: **merger** (genuine pooling of two shareholder families) and **purchase** (one side is simply buying). Merger → **pooling of interests method** (add balance sheets line by line at book values, reserves survive). Purchase → **purchase method** (record at agreed values; difference vs consideration = **goodwill or capital reserve**; only statutory reserves survive)."
  },
  {
    type: "mnemonic",
    text: "Merger's 5 conditions — **A**ll assets move · **S**hareholders 90% continue · **C**onsideration in equity shares · **B**usiness continues · **B**ook values kept",
  },
  { type: "heading", text: "Purchase consideration — the price tag", emoji: "🏷️" },
  {
    type: "layman",
    text: "Purchase consideration (PC) is **only what the buyer pays to the SHAREHOLDERS** (equity + preference) of the dying company. Anything paid to outsiders — debentureholders, creditors, liquidation expenses — is a separate arrangement, **never** part of PC. That single line kills half the wrong answers in this chapter.",
  },
  {
    type: "steps",
    title: "Two routes to the same price",
    items: [
      {
        title: "Net payment method — 'total the cheques'",
        text: "List every payment made to equity and preference shareholders — shares (at issue price), cash, anything — and simply add them up. Ignore assets, ignore liabilities, ignore debentures.",
      },
      {
        title: "Net assets method — 'what did I actually get?'",
        text: "PC = **agreed** value of assets taken over − **agreed** value of liabilities taken over. Agreed/revalued figures, not book figures. Leave out any asset not taken over, and remember fictitious assets (P&L debit balance, preliminary expenses) are never assets.",
      },
      {
        title: "Which one does the question want?",
        text: "If the question lists what was **paid** → net payment. If it gives **values of assets and liabilities taken over** → net assets. If it gives both, the stated payments win.",
      },
    ],
  },
  {
    type: "example",
    title: "Both methods, same deal",
    lines: [
      "X Ltd takes over Y Ltd. Y has 1,00,000 equity shares and 20,000 preference shares of ₹100.",
      "**Net payment:** each equity share gets 2 shares of X (₹10 face, issued at ₹12) + ₹4 cash. Preference paid off at 10% premium.",
      "Equity: 1,00,000 × 2 × ₹12 = ₹24,00,000, plus cash 1,00,000 × ₹4 = ₹4,00,000.",
      "Preference: 20,000 × ₹110 = ₹22,00,000.",
      "**PC = 24L + 4L + 22L = ₹50,00,000.** (X also took over ₹5,00,000 debentures — irrelevant to PC.)",
      "**Net assets:** assets taken over at agreed values ₹62,00,000 − liabilities taken over ₹12,00,000 = **₹50,00,000**. Same destination, different road.",
    ],
    punch: "PC = what shareholders receive. Debentures and creditors taken over change goodwill, not PC.",
  },
  {
    type: "trap",
    text: "Three favourites: (1) adding debentures or creditors into net payment — never; (2) using **book** values in net assets when the question gives **agreed** values; (3) counting the transferor's accumulated losses or preliminary expenses as assets taken over. Also: goodwill or capital reserve arises only under the **purchase method** — pooling of interests never creates goodwill.",
  },
];

const BRANCH: NoteBlock[] = [
  {
    type: "layman",
    title: "The one idea",
    text: "The head office sits in one city and wants to control a branch in another **without trusting anyone's word**. So instead of one messy account, it opens a small CCTV camera on every moving part — stock, debtors, expenses, profit-loading — and the books THEMSELVES expose any missing goods. That set of cameras is the **Stock & Debtors method**.",
  },
  {
    type: "para",
    text: "Used for **dependent branches** where HO invoices goods at **invoice price** (cost + loading) and the branch sells for cash and on credit. The method's superpower: **shortage or surplus of stock pops out automatically** as a balancing figure — nobody has to confess.",
  },
  {
    type: "formula",
    title: "Loading — learn to flip the fraction",
    formula: "Loading as a slice of INVOICE price: cost + 25% → 25/125 = **1/5** · cost + 20% → 20/120 = **1/6** · cost + 33⅓% → **1/4** · cost + 50% → **1/3**",
    note: "Markup is stated on cost, but stocks stand at invoice price — so loading = markup ÷ (100 + markup). Removing loading from any invoice-price figure is one multiplication.",
  },
  {
    type: "steps",
    title: "The cast — one account per camera",
    items: [
      {
        title: "Branch Stock A/c (at invoice price)",
        text: "Tracks physical goods. Debit what comes in (opening stock, goods sent, sales returns); credit what goes out (cash sales, credit sales, returns to HO, closing stock). If the credit side falls short — that gap **is the shortage**.",
      },
      {
        title: "Branch Debtors A/c",
        text: "Tracks people who owe money. Debit: opening debtors, credit sales. Credit: cash collected, returns from customers, bad debts, discounts allowed. Balance = closing debtors.",
      },
      {
        title: "Goods Sent to Branch A/c",
        text: "Mirror of despatches, at invoice price. Its loading is stripped out later; the net (cost) figure goes to the Trading/Purchases side of HO books.",
      },
      {
        title: "Branch Adjustment A/c — the profit-squeezer",
        text: "Collects the LOADING on everything. Credit: loading on opening stock and on goods sent. Debit: loading on closing stock, on returns to HO, and on shortage. The balance left is **gross profit**.",
      },
      {
        title: "Branch P&L A/c",
        text: "Starts with gross profit, then absorbs the real-world pain: branch expenses, **cost of shortage**, bad debts, discounts. What survives is net profit of the branch.",
      },
    ],
  },
  {
    type: "trap",
    text: "**Split the shortage in two.** The loading part of a shortage goes to Branch Adjustment A/c; the **cost** part goes to Branch P&L A/c. Dumping the whole shortage in one account is the classic mark-loser. Same logic for surplus, in reverse. And bad debts/discounts touch **Debtors and P&L only** — never the Adjustment account, because they contain no loading.",
  },
  { type: "heading", text: "One worked story, end to end", emoji: "🎬" },
  {
    type: "example",
    title: "Setup — goods invoiced at cost + 25% (loading = 1/5 of invoice price)",
    lines: [
      "Opening stock at branch (IP) **₹20,000** · Goods sent (IP) **₹1,00,000**",
      "Cash sales **₹40,000** · Credit sales **₹60,000** · Closing stock (IP) **₹15,000**",
      "Opening debtors ₹10,000 · Cash from debtors ₹52,500 · Bad debts ₹1,000 · Discount allowed ₹500",
      "Branch expenses (rent + salaries) ₹6,000",
    ],
  },
  {
    type: "example",
    title: "Step 1 · Branch Stock A/c finds the shortage",
    lines: [
      "In: 20,000 + 1,00,000 = **₹1,20,000**",
      "Out: 40,000 + 60,000 + 15,000 = **₹1,15,000**",
      "Gap = **₹5,000 shortage** (at invoice price) — the books just caught it.",
      "Split it: loading 1/5 × 5,000 = **₹1,000** → Adjustment A/c; cost **₹4,000** → P&L.",
    ],
  },
  {
    type: "example",
    title: "Step 2 · Branch Adjustment A/c squeezes out gross profit",
    lines: [
      "Credit (loading in): opening 1/5 × 20,000 = 4,000 · goods sent 1/5 × 1,00,000 = 20,000 → **24,000**",
      "Debit (loading out): closing 1/5 × 15,000 = 3,000 · shortage 1,000 → **4,000**",
      "**Gross profit = 24,000 − 4,000 = ₹20,000**",
    ],
  },
  {
    type: "example",
    title: "Step 3 · Branch Debtors + Branch P&L",
    lines: [
      "Debtors: 10,000 + 60,000 − 52,500 − 1,000 − 500 = closing **₹16,000**",
      "P&L: GP 20,000 − cost of shortage 4,000 − expenses 6,000 − bad debts 1,000 − discount 500",
      "**Net profit = ₹8,500**",
    ],
    punch: "Every number in the question found its home in exactly one account — that's the whole method.",
  },
  {
    type: "mnemonic",
    text: "**Stock** watches goods · **Debtors** watch people · **Adjustment** strips the loading · **P&L** tells the truth",
  },
  {
    type: "para",
    text: "**Why examiners love it:** the shortage is invisible in the question and only appears if your Branch Stock A/c balances properly — it tests the whole method with one number. Standard assumption: the branch sells at invoice price. If a question says the branch sold **above** invoice price, the extra over IP is additional profit — credit it to Branch Adjustment A/c so the gross profit picks it up.",
  },
];

const NOTES: { chapter: string; title: string; blocks: NoteBlock[] }[] = [
  {
    chapter: "Amalgamation",
    title: "Amalgamation vs Absorption vs External Reconstruction",
    blocks: AMALGAMATION,
  },
  {
    chapter: "Branch Accounts",
    title: "Branch Accounts — Stock & Debtors method",
    blocks: BRANCH,
  },
];

async function main() {
  const chapters = await db
    .select({ id: schema.chapters.id, name: schema.chapters.name })
    .from(schema.chapters)
    .where(inArray(schema.chapters.name, NOTES.map((n) => n.chapter)));
  const missing = NOTES.filter((n) => !chapters.some((c) => c.name === n.chapter));
  if (missing.length)
    throw new Error(`Unknown chapter(s): ${missing.map((m) => m.chapter).join(", ")}`);

  for (const note of NOTES) {
    const ch = chapters.find((c) => c.name === note.chapter)!;
    const [existing] = await db
      .select({ id: schema.chapterNotes.id })
      .from(schema.chapterNotes)
      .where(eq(schema.chapterNotes.chapterId, ch.id));
    if (existing) {
      await db
        .update(schema.chapterNotes)
        .set({ title: note.title, content: note.blocks, updatedAt: new Date() })
        .where(eq(schema.chapterNotes.id, existing.id));
      console.log(`updated notes for "${note.chapter}" (${note.blocks.length} blocks)`);
    } else {
      await db.insert(schema.chapterNotes).values({
        chapterId: ch.id,
        title: note.title,
        content: note.blocks,
      });
      console.log(`created notes for "${note.chapter}" (${note.blocks.length} blocks)`);
    }
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
