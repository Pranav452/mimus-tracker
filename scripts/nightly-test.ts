// Nightly CLI: generates + publishes a test from Mimansha's topics logged on a
// given day (IST, defaults to today), using current-law amendments.
// Same logic as /admin/create.
// Usage: npx tsx scripts/nightly-test.ts [--count=10] [--duration=25] [--date=2026-07-25]
//                                        [--notes="mix direct + case-based"]
import { config } from "dotenv";
config({ path: ".env.local" });

import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { eq } from "drizzle-orm";
import OpenAI from "openai";
import * as schema from "../lib/db/schema";
import { AMENDMENTS_BRIEF } from "../lib/changes";

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql, { schema });
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const MODEL = process.env.OPENAI_MODEL ?? "gpt-5-mini";
const ADMIN_ID = 2;

const flag = (name: string) => {
  const arg = process.argv.find((a) => a.startsWith(`--${name}=`));
  return arg?.slice(name.length + 3);
};

const COUNT = Number(flag("count")) || 10;
const DURATION = Number(flag("duration")) || 25;
const NOTES = flag("notes");
const DATE =
  flag("date") ?? new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });

async function main() {
  const today = DATE;
  const topics = await db
    .select({
      chapterId: schema.dailyTopics.chapterId,
      chapterName: schema.chapters.name,
      paperName: schema.papers.name,
      note: schema.dailyTopics.note,
    })
    .from(schema.dailyTopics)
    .innerJoin(schema.chapters, eq(schema.dailyTopics.chapterId, schema.chapters.id))
    .innerJoin(schema.parts, eq(schema.chapters.partId, schema.parts.id))
    .innerJoin(schema.papers, eq(schema.parts.paperId, schema.papers.id))
    .where(eq(schema.dailyTopics.forDate, today));
  if (topics.length === 0) throw new Error(`No topics logged for ${today}`);

  const unique = [...new Map(topics.map((t) => [t.chapterId, t])).values()];
  console.log(
    `Topics for ${today}: ${unique.map((t) => t.chapterName).join("; ")}`
  );

  const prompt = `Create ${COUNT} multiple-choice questions for CA Intermediate.
Topics to cover (spread questions roughly evenly): ${unique
    .map((t) => `${t.chapterName} [paper: ${t.paperName}]${t.note ? ` (her note: ${t.note})` : ""}`)
    .join("; ")}.
Difficulty: exam-level, matching actual recent ICAI CA Intermediate exam style.${
    NOTES ? `\nExtra instructions from the mentor: ${NOTES}` : ""
  }

Each question must be a JSON object:
{"text": "...", "options": ["A...", "B...", "C...", "D..."], "correctIndex": 0-3, "explanation": "why the answer is correct, briefly", "chapterName": "exact topic name from the list above"}

Rules:
- Exactly 4 options each, one correct.
- Use Indian law/AS/Income Tax/GST provisions as per current CA Inter syllabus.
- For numericals show amounts in ₹.
- Return ONLY the JSON array of ${COUNT} objects.`;

  console.log(`Generating ${COUNT} questions with ${MODEL}…`);
  const res = await openai.chat.completions.create({
    model: MODEL,
    messages: [
      {
        role: "system",
        content: `You are an expert CA Intermediate (ICAI, India) exam question setter, well-versed in recent exam trends. Respond with ONLY a valid JSON array, no markdown fences.\n\nUse CURRENT law as applicable to the September 2026 attempt:\n${AMENDMENTS_BRIEF}`,
      },
      { role: "user", content: prompt },
    ],
  });
  const raw = res.choices[0]?.message?.content ?? "";
  const parsed = JSON.parse(
    raw.slice(raw.indexOf("["), raw.lastIndexOf("]") + 1)
  ) as {
    text: string;
    options: string[];
    correctIndex: number;
    explanation: string;
    chapterName: string;
  }[];
  const valid = parsed.filter(
    (q) => q.options?.length === 4 && q.correctIndex >= 0 && q.correctIndex <= 3
  );
  console.log(`Got ${valid.length} valid questions`);

  const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, "");
  const chapterFor = (name: string) => {
    const target = norm(name);
    return (
      unique.find((c) => norm(c.chapterName) === target) ??
      unique.find(
        (c) =>
          norm(c.chapterName).includes(target) || target.includes(norm(c.chapterName))
      ) ??
      unique[0]
    );
  };

  const dateLabel = new Date(`${today}T00:00:00+05:30`).toLocaleDateString("en-IN", {
    day: "numeric",
    month: "short",
    timeZone: "Asia/Kolkata",
  });
  const shortNames = unique.map((t) => t.chapterName.split("—")[0].trim().slice(0, 24));
  const [test] = await db
    .insert(schema.tests)
    .values({
      title: `${shortNames.join(" & ").slice(0, 60)} — ${dateLabel}`,
      paperId: null,
      scheduledFor: today,
      durationMinutes: DURATION,
      status: "published",
      createdBy: ADMIN_ID,
    })
    .returning();

  await db.insert(schema.questions).values(
    valid.map((q, i) => {
      const ch = chapterFor(q.chapterName);
      return {
        testId: test.id,
        chapterId: ch.chapterId,
        section: ch.paperName,
        seq: i,
        text: q.text,
        options: q.options,
        correctIndex: q.correctIndex,
        marks: 4,
        negativeMarks: 1,
        explanation: q.explanation,
      };
    })
  );
  console.log(
    `Published test #${test.id} "${test.title}" — ${valid.length} Qs, ${DURATION} min ✔`
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
