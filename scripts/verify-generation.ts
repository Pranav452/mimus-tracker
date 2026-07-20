// One-off end-to-end check of the nightly flow, bypassing the admin UI:
// today's topics -> OpenAI MCQs -> published test in Neon.
import { config } from "dotenv";
config({ path: ".env.local" });

import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { and, eq } from "drizzle-orm";
import OpenAI from "openai";
import * as schema from "../lib/db/schema";

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql, { schema });
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const MODEL = process.env.OPENAI_MODEL ?? "gpt-5-mini";

async function main() {
  const today = new Date().toLocaleDateString("en-CA", { timeZone: "Asia/Kolkata" });
  const topics = await db
    .select({
      chapterId: schema.dailyTopics.chapterId,
      chapterName: schema.chapters.name,
      paperName: schema.papers.name,
    })
    .from(schema.dailyTopics)
    .innerJoin(schema.chapters, eq(schema.dailyTopics.chapterId, schema.chapters.id))
    .innerJoin(schema.parts, eq(schema.chapters.partId, schema.parts.id))
    .innerJoin(schema.papers, eq(schema.parts.paperId, schema.papers.id))
    .where(eq(schema.dailyTopics.forDate, today));
  if (topics.length === 0) throw new Error("No topics logged today");
  console.log("Today's topics:", topics.map((t) => t.chapterName).join("; "));

  console.log(`Generating 6 MCQs with ${MODEL}…`);
  const res = await openai.chat.completions.create({
    model: MODEL,
    messages: [
      {
        role: "system",
        content:
          "You are an expert CA Intermediate (ICAI, India) exam question setter. Respond with ONLY a valid JSON array, no markdown fences.",
      },
      {
        role: "user",
        content: `Create 6 multiple-choice questions for CA Intermediate — ${topics[0].paperName}.
Topics: ${topics.map((t) => t.chapterName).join("; ")}.
Each: {"text": "...", "options": ["...","...","...","..."], "correctIndex": 0-3, "explanation": "...", "chapterName": "exact topic name"}.
Exam-level difficulty, ₹ for numericals. Return ONLY the JSON array.`,
      },
    ],
  });
  const text = res.choices[0]?.message?.content ?? "";
  const qs = JSON.parse(text.slice(text.indexOf("["), text.lastIndexOf("]") + 1)) as {
    text: string;
    options: string[];
    correctIndex: number;
    explanation: string;
    chapterName: string;
  }[];
  const valid = qs.filter(
    (q) => q.options?.length === 4 && q.correctIndex >= 0 && q.correctIndex <= 3
  );
  console.log(`Got ${valid.length} valid questions`);
  console.log("Sample:", valid[0].text.slice(0, 140));

  const [admin] = await db
    .select()
    .from(schema.users)
    .where(eq(schema.users.role, "admin"));
  const [paper] = await db
    .select()
    .from(schema.papers)
    .where(eq(schema.papers.name, topics[0].paperName));

  const [test] = await db
    .insert(schema.tests)
    .values({
      title: `Buyback & Today's Topics — ${new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", timeZone: "Asia/Kolkata" })}`,
      paperId: paper?.id ?? null,
      scheduledFor: today,
      durationMinutes: 20,
      status: "published",
      createdBy: admin.id,
    })
    .returning();

  const chapterRows = await db.select().from(schema.chapters);
  await db.insert(schema.questions).values(
    valid.map((q, i) => ({
      testId: test.id,
      chapterId: chapterRows.find((c) => c.name === q.chapterName)?.id ?? null,
      section: topics[0].paperName,
      seq: i,
      text: q.text,
      options: q.options,
      correctIndex: q.correctIndex,
      marks: 4,
      negativeMarks: 1,
      explanation: q.explanation,
    }))
  );
  console.log(`Published test #${test.id} "${test.title}" with ${valid.length} questions ✔`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
