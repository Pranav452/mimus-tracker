// Publishes a FULL exam paper — MCQ section + descriptive section — into the app.
//
// Descriptive questions are stored with a model answer and the point-wise
// breakdown an examiner marks on. She writes the answer in her book, types the
// points she made, and marks it from the results screen (AI or by hand).
//
// Papers live in scripts/papers/*.ts and export a `PAPER` object. Add a file,
// then run:  npx tsx scripts/seed-paper.ts --paper=law-mock-1 [--replace]
import { config } from "dotenv";
config({ path: ".env.local" });

import { and, eq, inArray } from "drizzle-orm";
import * as schema from "../lib/db/schema";
import { db } from "../lib/db";

const ADMIN_ID = 2;

export type PaperQuestion = {
  chapter: string;
  section: string;
  marks: number;
} & (
  | {
      kind: "mcq";
      text: string;
      options: string[];
      correctIndex: number;
      explanation: string;
    }
  | {
      kind: "descriptive";
      text: string;
      modelAnswer: string;
      keyPoints: string[];
    }
);

export type Paper = {
  slug: string;
  title: string;
  durationMinutes: number;
  scheduledFor: string;
  questions: PaperQuestion[];
};

const flag = (name: string) => {
  const arg = process.argv.find((a) => a.startsWith(`--${name}=`));
  return arg?.slice(name.length + 3);
};

async function main() {
  const slug = flag("paper");
  if (!slug) throw new Error("--paper=<file in scripts/papers> is required");
  const replace = process.argv.includes("--replace");

  const mod = (await import(`./papers/${slug}`)) as { PAPER: Paper };
  const paper = mod.PAPER;

  // fail loudly on a chapter typo rather than silently dropping the link
  const names = [...new Set(paper.questions.map((q) => q.chapter))];
  const chapters = await db
    .select({ id: schema.chapters.id, name: schema.chapters.name })
    .from(schema.chapters)
    .where(inArray(schema.chapters.name, names));
  const missing = names.filter((n) => !chapters.some((c) => c.name === n));
  if (missing.length) throw new Error(`Unknown chapter(s):\n  ${missing.join("\n  ")}`);
  const idByName = new Map(chapters.map((c) => [c.name, c.id]));

  const total = paper.questions.reduce((s, q) => s + q.marks, 0);
  const mcqCount = paper.questions.filter((q) => q.kind === "mcq").length;
  const descCount = paper.questions.length - mcqCount;

  if (replace) {
    const existing = await db
      .select({ id: schema.tests.id })
      .from(schema.tests)
      .where(and(eq(schema.tests.title, paper.title)));
    for (const t of existing) {
      await db.delete(schema.tests).where(eq(schema.tests.id, t.id));
      console.log(`removed previous test #${t.id}`);
    }
  }

  const [test] = await db
    .insert(schema.tests)
    .values({
      title: paper.title,
      paperId: null,
      scheduledFor: paper.scheduledFor,
      durationMinutes: paper.durationMinutes,
      status: "published",
      createdBy: ADMIN_ID,
    })
    .returning();

  await db.insert(schema.questions).values(
    paper.questions.map((q, i) => ({
      testId: test.id,
      chapterId: idByName.get(q.chapter)!,
      section: q.section,
      seq: i,
      kind: q.kind,
      text: q.text,
      options: q.kind === "mcq" ? q.options : [],
      correctIndex: q.kind === "mcq" ? q.correctIndex : null,
      marks: q.marks,
      // ICAI does not negatively mark Part I of Paper 2
      negativeMarks: 0,
      explanation: q.kind === "mcq" ? q.explanation : null,
      modelAnswer: q.kind === "descriptive" ? q.modelAnswer : null,
      keyPoints: q.kind === "descriptive" ? q.keyPoints : null,
    }))
  );

  console.log(
    `Published test #${test.id} "${paper.title}" — ${mcqCount} MCQ + ${descCount} written, ${total} marks, ${paper.durationMinutes} min ✔`
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
