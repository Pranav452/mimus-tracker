// Loads REVIEWED flashcards from scripts/flashcards/<paper>.json into the app,
// replacing whatever cards those chapters had. Only seed a paper once its
// drafts have been checked by hand (see the _patch_*.py review files).
//   npx tsx scripts/seed-flashcards.ts --paper=tax
import { config } from "dotenv";
config({ path: ".env.local" });

import fs from "node:fs";
import path from "node:path";
import { eq, inArray } from "drizzle-orm";
import * as schema from "../lib/db/schema";
import { db } from "../lib/db";

async function main() {
  const paper = process.argv.find((a) => a.startsWith("--paper="))?.slice(8);
  if (!paper) throw new Error("--paper=accounts|law|tax is required");
  const deck = JSON.parse(
    fs.readFileSync(path.join(__dirname, "flashcards", `${paper}.json`), "utf8")
  ) as Record<string, { front: string; back: string }[]>;

  const names = Object.keys(deck);
  const chapters = await db
    .select({ id: schema.chapters.id, name: schema.chapters.name })
    .from(schema.chapters)
    .where(inArray(schema.chapters.name, names));
  const missing = names.filter((n) => !chapters.some((c) => c.name === n));
  if (missing.length) throw new Error(`Unknown chapter(s): ${missing.join(", ")}`);

  let total = 0;
  for (const ch of chapters) {
    await db.delete(schema.flashcards).where(eq(schema.flashcards.chapterId, ch.id));
    const cards = deck[ch.name];
    if (cards.length)
      await db.insert(schema.flashcards).values(
        cards.map((c) => ({ chapterId: ch.id, front: c.front, back: c.back }))
      );
    total += cards.length;
  }
  console.log(`${paper}: ${total} cards across ${chapters.length} chapters`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
