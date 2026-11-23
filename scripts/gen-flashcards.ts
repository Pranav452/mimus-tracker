// Drafts revision flashcards for every chapter into scripts/flashcards/*.json.
// It deliberately does NOT write to the database: drafts are reviewed by hand
// (law figures drift, and the generator states stale ones confidently), then
// scripts/seed-flashcards.ts loads the reviewed files.
//
//   npx tsx scripts/gen-flashcards.ts [--paper=tax] [--only="Capital Gains"] [--force]
import { config } from "dotenv";
config({ path: ".env.local" });

import fs from "node:fs";
import path from "node:path";
import OpenAI from "openai";
import { SYLLABUS } from "../lib/syllabus";
import { AMENDMENTS_BRIEF } from "../lib/changes";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const MODEL = process.env.OPENAI_MODEL ?? "gpt-5-mini";
const OUT = path.join(__dirname, "flashcards");

const flag = (name: string) => {
  const arg = process.argv.find((a) => a.startsWith(`--${name}=`));
  return arg?.slice(name.length + 3);
};
const PAPER = flag("paper");
const ONLY = flag("only")?.toLowerCase();
const FORCE = process.argv.includes("--force");

export type Card = { front: string; back: string };
type Deck = Record<string, Card[]>;

async function draft(paper: string, part: string | undefined, chapter: string) {
  const res = await openai.chat.completions.create({
    model: MODEL,
    response_format: { type: "json_object" },
    messages: [
      {
        role: "system",
        content: `You write revision flashcards for a CA Intermediate (ICAI, India) student resitting Group I in January 2027. She knows the syllabus; she needs fast, exam-precise recall.

Use CURRENT law for the January 2027 attempt:
${AMENDMENTS_BRIEF}

Respond with ONLY a JSON object: {"cards":[{"front":"...","back":"..."}]}`,
      },
      {
        role: "user",
        content: `Write flashcards for ${paper}${part ? ` — ${part}` : ""}, chapter: "${chapter}".

How many: as many as the chapter genuinely needs — at least 8, at most 14. A thin chapter gets 8; a heavy one gets 14.

Each card:
- FRONT: a cue she must answer from memory — a pointed question, never a bare heading. Not "What is X?" unless the definition itself is what gets examined.
- BACK: the answer in at most 40 words, leading with the number, limit, rate, time period, condition or rule. Name the section / rule / AS paragraph wherever one exists.
- One fact or one tight group of facts per card.

What to prioritise, in this order:
1. Thresholds, rates, limits, time periods, percentages — anything numeric.
2. Conditions and their exceptions; who is covered and who is not.
3. The classic confusions and examiner traps of this chapter (pairs that get swapped, the step people skip).
4. For computational chapters: the formula or the order of steps, and the single most common wrong step.

Cover the WHOLE chapter in syllabus order — not just its opening sections.

Accuracy matters more than count. If you are not certain of a figure or a section number, leave that card out rather than guess. Plain text only: no markdown, no backslashes.`,
      },
    ],
  });
  const raw = res.choices[0]?.message?.content ?? "{}";
  const cards = ((JSON.parse(raw) as { cards?: Card[] }).cards ?? []).filter(
    (c) => c?.front?.trim() && c?.back?.trim()
  );
  return cards;
}

async function main() {
  fs.mkdirSync(OUT, { recursive: true });
  for (const paper of SYLLABUS) {
    if (PAPER && paper.slug !== PAPER) continue;
    const file = path.join(OUT, `${paper.slug}.json`);
    const deck: Deck = fs.existsSync(file)
      ? (JSON.parse(fs.readFileSync(file, "utf8")) as Deck)
      : {};

    const jobs = paper.parts.flatMap((part) =>
      part.chapters
        .filter((ch) => !ONLY || ch.toLowerCase().includes(ONLY))
        .filter((ch) => FORCE || !deck[ch]?.length)
        .map((ch) => ({ part: part.name, ch }))
    );
    console.log(`${paper.name}: drafting ${jobs.length} chapter(s)`);

    // small pool — enough to finish in minutes without tripping rate limits
    const POOL = 4;
    let next = 0;
    await Promise.all(
      Array.from({ length: POOL }, async () => {
        while (next < jobs.length) {
          const job = jobs[next++];
          for (let attempt = 1; attempt <= 3; attempt++) {
            try {
              const cards = await draft(paper.name, job.part, job.ch);
              deck[job.ch] = cards;
              // write after every chapter so a crash loses nothing
              fs.writeFileSync(file, JSON.stringify(deck, null, 2));
              console.log(`  ✔ ${job.ch} — ${cards.length} cards`);
              break;
            } catch (e) {
              console.log(`  … ${job.ch} attempt ${attempt} failed: ${(e as Error).message}`);
              if (attempt === 3) console.log(`  ✖ ${job.ch} — giving up`);
            }
          }
        }
      })
    );
  }
  console.log("ALL DONE");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
