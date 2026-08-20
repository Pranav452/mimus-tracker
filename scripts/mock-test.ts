// Generates a multi-section MOCK test from an explicit chapter list — unlike
// scripts/nightly-test.ts, it does not read daily_topics, so it can cover a
// whole syllabus she finished weeks ago.
//
// Specs live in scripts/mocks/*.ts and export a `MOCK` object. Run:
//   npx tsx scripts/mock-test.ts --mock=idt-full [--replace]
//
// Each section is generated in its own call — smaller batches come back more
// reliable, and one bad section can be re-run without redoing the rest.
import { config } from "dotenv";
config({ path: ".env.local" });

import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { eq, inArray } from "drizzle-orm";
import OpenAI from "openai";
import * as schema from "../lib/db/schema";
import { AMENDMENTS_BRIEF } from "../lib/changes";

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql, { schema });
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const MODEL = process.env.OPENAI_MODEL ?? "gpt-5-mini";
const ADMIN_ID = 2;

export type MockSection = {
  name: string;
  count: number;
  chapters: string[];
  notes: string;
};
export type Mock = {
  title: string;
  durationMinutes: number;
  scheduledFor: string;
  marks: number;
  negativeMarks: number;
  paperName: string;
  notes: string;
  sections: MockSection[];
};

type Generated = {
  text: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  chapterName: string;
};

const flag = (name: string) => {
  const arg = process.argv.find((a) => a.startsWith(`--${name}=`));
  return arg?.slice(name.length + 3);
};

async function generateSection(
  mock: Mock,
  section: MockSection
): Promise<Generated[]> {
  const prompt = `Create ${section.count} multiple-choice questions for CA Intermediate — ${mock.paperName}.

This is a FULL-SYLLABUS MOCK covering chapters she has already finished, so questions must be exam-standard, not introductory.

Chapters to cover — spread the questions across ALL of them, roughly evenly, and never leave a chapter unrepresented:
${section.chapters.map((c) => `- ${c}`).join("\n")}

${mock.notes}

${section.notes}

Each question must be a JSON object:
{"text": "...", "options": ["...", "...", "...", "..."], "correctIndex": 0-3, "explanation": "the provision, the reasoning, and why the distractors fail", "chapterName": "exact chapter name from the list above"}

Rules:
- Exactly 4 options each, exactly one defensible answer. If a provision is a slab, a percentage, a threshold or has conditions, put EVERY qualifying fact in the stem so no other option can be argued.
- Amounts in ₹. Plain text only — no backslashes, no LaTeX, no markdown.
- Cite the governing section in the explanation.
- Return ONLY the JSON array of ${section.count} objects.`;

  const res = await openai.chat.completions.create({
    model: MODEL,
    messages: [
      {
        role: "system",
        content: `You are an expert CA Intermediate (ICAI, India) exam question setter, well-versed in recent exam trends. Respond with ONLY a valid JSON array, no markdown fences.

Use CURRENT law as applicable to the September 2026 attempt:
${AMENDMENTS_BRIEF}`,
      },
      { role: "user", content: prompt },
    ],
  });

  const raw = res.choices[0]?.message?.content ?? "";
  // stray backslashes are not valid JSON escapes and would kill the whole batch
  const json = raw
    .slice(raw.indexOf("["), raw.lastIndexOf("]") + 1)
    .replace(/\\(?!["\\/bfnrtu])/g, "");
  const parsed = JSON.parse(json) as Generated[];
  return parsed.filter(
    (q) =>
      q.text &&
      Array.isArray(q.options) &&
      q.options.length === 4 &&
      q.correctIndex >= 0 &&
      q.correctIndex <= 3
  );
}

async function main() {
  const slug = flag("mock");
  if (!slug) throw new Error("--mock=<file in scripts/mocks> is required");
  const { MOCK } = (await import(`./mocks/${slug}`)) as { MOCK: Mock };

  const names = [...new Set(MOCK.sections.flatMap((s) => s.chapters))];
  const chapters = await db
    .select({ id: schema.chapters.id, name: schema.chapters.name })
    .from(schema.chapters)
    .where(inArray(schema.chapters.name, names));
  const missing = names.filter((n) => !chapters.some((c) => c.name === n));
  if (missing.length) throw new Error(`Unknown chapter(s):\n  ${missing.join("\n  ")}`);

  if (process.argv.includes("--replace")) {
    const existing = await db
      .select({ id: schema.tests.id })
      .from(schema.tests)
      .where(eq(schema.tests.title, MOCK.title));
    for (const t of existing) {
      await db.delete(schema.tests).where(eq(schema.tests.id, t.id));
      console.log(`removed previous test #${t.id}`);
    }
  }

  const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, "");
  const rows: (typeof schema.questions.$inferInsert)[] = [];

  for (const section of MOCK.sections) {
    console.log(`Generating ${section.count} for "${section.name}" with ${MODEL}…`);
    const qs = await generateSection(MOCK, section);
    console.log(`  got ${qs.length} valid`);

    // the model returns near-miss chapter names ("Buy-back" vs "Buyback"),
    // so match fuzzily, but only within this section's own chapters
    const pool = chapters.filter((c) => section.chapters.includes(c.name));
    const chapterFor = (name: string) => {
      const t = norm(name ?? "");
      return (
        pool.find((c) => norm(c.name) === t) ??
        pool.find((c) => norm(c.name).includes(t) || t.includes(norm(c.name))) ??
        pool[0]
      );
    };

    const covered = new Set<string>();
    for (const q of qs) {
      const ch = chapterFor(q.chapterName);
      covered.add(ch.name);
      rows.push({
        chapterId: ch.id,
        section: section.name,
        seq: rows.length,
        kind: "mcq",
        text: q.text,
        options: q.options,
        correctIndex: q.correctIndex,
        marks: MOCK.marks,
        negativeMarks: MOCK.negativeMarks,
        explanation: q.explanation,
      });
    }
    const skipped = section.chapters.filter((c) => !covered.has(c));
    if (skipped.length) console.log(`  ⚠ no question for: ${skipped.join(", ")}`);
  }

  const [test] = await db
    .insert(schema.tests)
    .values({
      title: MOCK.title,
      paperId: null,
      scheduledFor: MOCK.scheduledFor,
      durationMinutes: MOCK.durationMinutes,
      status: "published",
      createdBy: ADMIN_ID,
    })
    .returning();

  await db
    .insert(schema.questions)
    .values(rows.map((r) => ({ ...r, testId: test.id })));

  console.log(
    `Published test #${test.id} "${MOCK.title}" — ${rows.length} Qs, ${
      rows.length * MOCK.marks
    } marks, ${MOCK.durationMinutes} min ✔`
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
