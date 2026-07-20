import { notFound, redirect } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { getTestWithQuestions } from "@/lib/queries";
import { db, attempts } from "@/lib/db";
import { and, eq, isNotNull } from "drizzle-orm";
import TestRunner from "./TestRunner";

export default async function TakeTestPage(props: PageProps<"/exam/[id]">) {
  const user = await requireUser();
  const { id } = await props.params;
  const testId = Number(id);
  if (!Number.isFinite(testId)) notFound();

  const data = await getTestWithQuestions(testId);
  if (!data || data.test.status !== "published" || data.questions.length === 0)
    notFound();

  // already attempted → straight to results
  const [existing] = await db
    .select()
    .from(attempts)
    .where(
      and(
        eq(attempts.testId, testId),
        eq(attempts.userId, user.id),
        isNotNull(attempts.submittedAt)
      )
    )
    .limit(1);
  if (existing) redirect(`/results/${existing.id}`);

  return (
    <TestRunner
      testId={data.test.id}
      title={data.test.title}
      durationMinutes={data.test.durationMinutes}
      questions={data.questions.map((q) => ({
        id: q.id,
        section: q.section,
        text: q.text,
        options: q.options,
        marks: q.marks,
        negativeMarks: q.negativeMarks,
      }))}
    />
  );
}
