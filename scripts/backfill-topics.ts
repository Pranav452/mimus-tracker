// Backfills 2 days of topics Mimansha studied but forgot to log, then
// generates + publishes an AI test per day, informed by real CA Inter
// 2025 exam-pattern research (see chat for sources).
import { config } from "dotenv";
config({ path: ".env.local" });

import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { eq } from "drizzle-orm";
import OpenAI from "openai";
import * as schema from "../lib/db/schema";

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql, { schema });
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
const MODEL = process.env.OPENAI_MODEL ?? "gpt-5-mini";

const STUDENT_ID = 1;
const ADMIN_ID = 2;

type Day = {
  date: string;
  chapterIds: number[];
  paperName: string;
  count: number;
  duration: number;
  title: string;
  notes: string;
};

const DAYS: Day[] = [
  {
    date: "2026-07-20",
    chapterIds: [43, 37, 2, 20, 21], // FEMA, Dividend, Co. Final A/cs, AS17, AS18
    paperName: "Advanced Accounting + Corporate & Other Laws",
    count: 15,
    duration: 35,
    title: "FEMA, Dividends, Final A/cs & AS 17/18 — 20 Jul",
    notes: `Base the difficulty/angle on real recent ICAI CA Inter exam patterns:
- FEMA: current/capital account transactions distinction, RBI's regulatory role, contravention & penalty provisions, authorised dealer categories.
- Declaration of Dividends: Sec 123 conditions (free reserves, transfer to reserves), interim dividend under Sec 123(3), unpaid dividend account & transfer to IEPF, time limit for payment.
- Company Final Accounts: Schedule III format issues, treatment of provisions/reserves, managerial remuneration ceiling under Sec 197.
- AS 17 (Segment Reporting): identifying reportable segments (10% revenue/result/assets test), primary vs secondary segment disclosure.
- AS 18 (Related Party Disclosures): MSME exemption (turnover ≤ ₹50 crore, borrowings ≤ ₹10 crore), disclosure required even if relationship ceases mid-year for transactions during the relationship period, key management personnel.
Mix conceptual and numerical MCQs, spread roughly evenly across the 5 topics.`,
  },
  {
    date: "2026-07-21",
    chapterIds: [55, 53], // Return of Income, Deductions
    paperName: "Taxation",
    count: 8,
    duration: 20,
    title: "Deductions & Return of Income — 21 Jul",
    notes: `Base this on real ICAI CA Inter Taxation exam patterns:
- Deductions (Chapter VI-A, Sections 80C to 80U): 80C investment limit ₹1.5 lakh, 80D health insurance limits (self/senior citizen), 80TTA vs 80TTB, 80G donation categories, 80GG rent paid.
- Return of Income: due dates (31 July for non-audit, 31 Oct for audit cases), sections 139(1)/139(4)/139(5), belated & revised returns, defective return under 139(9), mandatory e-filing/verification.
Mix conceptual and numerical MCQs, spread evenly across the 2 topics.`,
  },
];

function extractJsonArray<T>(text: string): T {
  const start = text.indexOf("[");
  const end = text.lastIndexOf("]");
  if (start === -1 || end === -1) throw new Error("Model did not return JSON");
  return JSON.parse(text.slice(start, end + 1)) as T;
}

async function main() {
  const chapters = await db.select().from(schema.chapters);

  for (const day of DAYS) {
    const chapterRows = day.chapterIds.map(
      (id) => chapters.find((c) => c.id === id)!
    );
    console.log(
      `\n== ${day.date}: ${chapterRows.map((c) => c.name).join(", ")} ==`
    );

    // 1. backfill daily_topics + activity_log
    await db.insert(schema.dailyTopics).values(
      chapterRows.map((c) => ({
        userId: STUDENT_ID,
        chapterId: c.id,
        forDate: day.date,
        note: "logged retroactively — forgot to add on the day",
      }))
    );
    await db
      .insert(schema.activityLog)
      .values({ userId: STUDENT_ID, onDate: day.date, kind: "topic" })
      .onConflictDoNothing({
        target: [schema.activityLog.userId, schema.activityLog.onDate, schema.activityLog.kind],
      });
    console.log(`Logged ${chapterRows.length} topics for ${day.date}`);

    // 2. generate MCQs, informed by real exam-pattern research
    console.log(`Generating ${day.count} questions with ${MODEL}…`);
    const prompt = `Create ${day.count} multiple-choice questions for CA Intermediate — ${day.paperName}.
Topics to cover (spread questions across them): ${chapterRows.map((c) => c.name).join("; ")}.
Difficulty: exam-level, matching actual recent ICAI CA Intermediate exam style.
${day.notes}

Each question must be a JSON object:
{"text": "...", "options": ["A...", "B...", "C...", "D..."], "correctIndex": 0-3, "explanation": "why the answer is correct, briefly", "chapterName": "exact topic name from the list above"}

Rules:
- Exactly 4 options each, one correct.
- Use Indian law/AS/Income Tax provisions as per current CA Inter syllabus.
- For numericals show amounts in ₹.
- Return ONLY the JSON array of ${day.count} objects.`;

    const res = await openai.chat.completions.create({
      model: MODEL,
      messages: [
        {
          role: "system",
          content:
            "You are an expert CA Intermediate (ICAI, India) exam question setter, well-versed in recent (2025) exam trends. Respond with ONLY a valid JSON array, no markdown fences.",
        },
        { role: "user", content: prompt },
      ],
    });
    const raw = res.choices[0]?.message?.content ?? "";
    const qs = extractJsonArray<
      {
        text: string;
        options: string[];
        correctIndex: number;
        explanation: string;
        chapterName: string;
      }[]
    >(raw);
    const valid = qs.filter(
      (q) => q.options?.length === 4 && q.correctIndex >= 0 && q.correctIndex <= 3
    );
    console.log(`Got ${valid.length} valid questions`);

    // fuzzy-match chapterName back to our chapter rows (same approach as admin UI)
    const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, "");
    function chapterIdFor(name: string) {
      const target = norm(name);
      const exact = chapterRows.find((c) => norm(c.name) === target);
      if (exact) return exact.id;
      const partial = chapterRows.find(
        (c) => norm(c.name).includes(target) || target.includes(norm(c.name))
      );
      return (partial ?? chapterRows[0]).id;
    }

    // 3. publish test
    const [test] = await db
      .insert(schema.tests)
      .values({
        title: day.title,
        paperId: null,
        scheduledFor: day.date,
        durationMinutes: day.duration,
        status: "published",
        createdBy: ADMIN_ID,
      })
      .returning();

    await db.insert(schema.questions).values(
      valid.map((q, i) => ({
        testId: test.id,
        chapterId: chapterIdFor(q.chapterName),
        section: day.paperName,
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
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
