// Loads a hand-written question bank (scripts/bank/<name>.ts) into the app as
// chapter practice questions — rows with no test, which is what the chapter
// Quiz tab shows and what the Daily 5 draws from.
//
//   npx tsx scripts/seed-bank.ts --bank=tax-income
//
// Authors write the CORRECT option first; the options are shuffled here with a
// seed derived from the question text, so the order is stable across re-runs
// and the key can never drift from the answer. Re-running updates questions in
// place (matched on text) — it never deletes, so her history on a question and
// the Daily 5 copies that point at it survive an edit to the explanation.
import { config } from "dotenv";
config({ path: ".env.local" });

import { and, eq, inArray, isNull } from "drizzle-orm";
import * as schema from "../lib/db/schema";
import { db } from "../lib/db";

export type BankQuestion = {
  chapter: string;
  text: string;
  /** exactly four; options[0] is the correct one */
  options: string[];
  explanation: string;
};

const flag = (name: string) => {
  const arg = process.argv.find((a) => a.startsWith(`--${name}=`));
  return arg?.slice(name.length + 3);
};

// small deterministic PRNG (mulberry32) seeded from the question text
function shuffled(text: string, options: string[]) {
  let h = 2166136261;
  for (let i = 0; i < text.length; i++) h = Math.imul(h ^ text.charCodeAt(i), 16777619);
  const rnd = () => {
    h |= 0; h = (h + 0x6d2b79f5) | 0;
    let t = Math.imul(h ^ (h >>> 15), 1 | h);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
  const order = options.map((_, i) => i);
  for (let i = order.length - 1; i > 0; i--) {
    const j = Math.floor(rnd() * (i + 1));
    [order[i], order[j]] = [order[j], order[i]];
  }
  return { options: order.map((i) => options[i]), correctIndex: order.indexOf(0) };
}

async function main() {
  const name = flag("bank");
  if (!name) throw new Error("--bank=<file in scripts/bank> is required");
  const { BANK } = (await import(`./bank/${name}`)) as { BANK: BankQuestion[] };
  const tag = `bank:${name}`;

  for (const q of BANK) {
    if (q.options.length !== 4 || new Set(q.options).size !== 4)
      throw new Error(`Needs four distinct options: ${q.text.slice(0, 70)}`);
  }
  if (new Set(BANK.map((q) => q.text)).size !== BANK.length)
    throw new Error("Duplicate question text in the bank file");

  const names = [...new Set(BANK.map((q) => q.chapter))];
  const chapters = await db
    .select({ id: schema.chapters.id, name: schema.chapters.name })
    .from(schema.chapters)
    .where(inArray(schema.chapters.name, names));
  const missing = names.filter((n) => !chapters.some((c) => c.name === n));
  if (missing.length) throw new Error(`Unknown chapter(s):\n  ${missing.join("\n  ")}`);
  const idByName = new Map(chapters.map((c) => [c.name, c.id]));

  const existing = await db
    .select({ id: schema.questions.id, text: schema.questions.text })
    .from(schema.questions)
    .where(and(eq(schema.questions.section, tag), isNull(schema.questions.testId)));
  const idByText = new Map(existing.map((e) => [e.text, e.id]));

  let created = 0;
  let updated = 0;
  for (const [i, q] of BANK.entries()) {
    const { options, correctIndex } = shuffled(q.text, q.options);
    const row = {
      testId: null,
      chapterId: idByName.get(q.chapter)!,
      section: tag,
      seq: i,
      kind: "mcq" as const,
      text: q.text,
      options,
      correctIndex,
      marks: 1,
      negativeMarks: 0,
      explanation: q.explanation,
    };
    const id = idByText.get(q.text);
    if (id) {
      await db.update(schema.questions).set(row).where(eq(schema.questions.id, id));
      updated++;
    } else {
      await db.insert(schema.questions).values(row);
      created++;
    }
  }

  const perChapter = new Map<string, number>();
  for (const q of BANK) perChapter.set(q.chapter, (perChapter.get(q.chapter) ?? 0) + 1);
  console.log(`${tag}: ${created} created, ${updated} updated`);
  for (const [c, n] of perChapter) console.log(`  ${String(n).padStart(2)}  ${c}`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
