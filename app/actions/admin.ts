"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { tests, questions, papers, pushSubscriptions } from "@/lib/db/schema";
import { requireAdmin } from "@/lib/auth";
import { eq } from "drizzle-orm";
import { generateMCQs, type GeneratedQuestion } from "@/lib/ai";
import { getChaptersByIds, getAllChapters } from "@/lib/queries";

export async function generateTestQuestions(input: {
  chapterIds: number[];
  count: number;
  difficulty: string;
  notes?: string;
}): Promise<GeneratedQuestion[]> {
  await requireAdmin();
  const all = await getAllChapters();
  const selected = all.filter((c) => input.chapterIds.includes(c.id));
  if (selected.length === 0) throw new Error("Pick at least one chapter");
  const paperNames = [...new Set(selected.map((c) => c.paperName))].join(" + ");
  return generateMCQs({
    paperName: paperNames,
    chapters: selected.map((c) => ({ id: c.id, name: c.name })),
    count: input.count,
    difficulty: input.difficulty,
    notes: input.notes,
  });
}

export type PublishInput = {
  title: string;
  paperId: number | null;
  scheduledFor: string | null;
  durationMinutes: number;
  marks: number;
  negativeMarks: number;
  publish: boolean;
  questions: {
    text: string;
    options: string[];
    correctIndex: number;
    explanation: string;
    chapterId: number | null;
    section: string | null;
  }[];
};

export async function saveTest(input: PublishInput) {
  const admin = await requireAdmin();
  if (input.questions.length === 0) throw new Error("No questions to save");

  const [test] = await db
    .insert(tests)
    .values({
      title: input.title,
      paperId: input.paperId,
      scheduledFor: input.scheduledFor,
      durationMinutes: input.durationMinutes,
      status: input.publish ? "published" : "draft",
      createdBy: admin.id,
    })
    .returning();

  await db.insert(questions).values(
    input.questions.map((q, i) => ({
      testId: test.id,
      chapterId: q.chapterId,
      section: q.section,
      seq: i,
      text: q.text,
      options: q.options,
      correctIndex: q.correctIndex,
      marks: input.marks,
      negativeMarks: input.negativeMarks,
      explanation: q.explanation,
    }))
  );

  revalidatePath("/admin");
  revalidatePath("/tests");
  return test.id;
}

export async function setTestStatus(testId: number, status: "draft" | "published") {
  await requireAdmin();
  await db.update(tests).set({ status }).where(eq(tests.id, testId));
  revalidatePath("/admin");
  revalidatePath("/tests");
}

export async function deleteTest(testId: number) {
  await requireAdmin();
  await db.delete(questions).where(eq(questions.testId, testId));
  await db.delete(tests).where(eq(tests.id, testId));
  revalidatePath("/admin");
  revalidatePath("/tests");
}

export async function getPapersForAdmin() {
  await requireAdmin();
  return db.select().from(papers).orderBy(papers.number);
}

export async function sendNudge(message: string) {
  await requireAdmin();
  const webpush = (await import("web-push")).default;
  webpush.setVapidDetails(
    process.env.VAPID_SUBJECT ?? "mailto:admin@mimus.app",
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
    process.env.VAPID_PRIVATE_KEY!
  );
  const subs = await db.select().from(pushSubscriptions);
  let sent = 0;
  for (const sub of subs) {
    try {
      await webpush.sendNotification(
        {
          endpoint: sub.endpoint,
          keys: { p256dh: sub.p256dh, auth: sub.auth },
        },
        JSON.stringify({
          title: "Here for you, Always",
          body: message,
        })
      );
      sent++;
    } catch {
      await db.delete(pushSubscriptions).where(eq(pushSubscriptions.id, sub.id));
    }
  }
  return sent;
}

export async function getChapterNamesByIds(ids: number[]) {
  await requireAdmin();
  return getChaptersByIds(ids);
}
