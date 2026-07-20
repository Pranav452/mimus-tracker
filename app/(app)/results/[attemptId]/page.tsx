import Link from "next/link";
import { notFound } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { getAttemptDetail } from "@/lib/queries";
import { ArrowLeftIcon } from "@/components/icons";
import ResultsClient from "./ResultsClient";

export default async function ResultsPage(props: PageProps<"/results/[attemptId]">) {
  const user = await requireUser();
  const { attemptId } = await props.params;
  const id = Number(attemptId);
  if (!Number.isFinite(id)) notFound();
  const data = await getAttemptDetail(id, user.id);
  if (!data) notFound();

  const { attempt, test, questions, answers } = data;
  const secs = attempt.timeTakenSeconds ?? 0;
  const time = [
    String(Math.floor(secs / 3600)).padStart(2, "0"),
    String(Math.floor((secs % 3600) / 60)).padStart(2, "0"),
    String(secs % 60).padStart(2, "0"),
  ].join(":");

  return (
    <main className="fade-up">
      <header className="flex items-center gap-3 px-5 py-4 pt-safe">
        <Link
          href="/tests"
          aria-label="Back"
          className="w-10 h-10 rounded-full bg-surface border border-line flex items-center justify-center"
        >
          <ArrowLeftIcon className="w-5 h-5" />
        </Link>
        <h1 className="font-bold text-lg flex-1 text-center pr-10">{test.title}</h1>
      </header>

      <div className="px-5 flex items-center justify-between">
        <p className="font-bold">Test Summary</p>
        <span className="text-xs bg-surface border border-line rounded-lg px-2.5 py-1.5">
          Time: <b className="tabular-nums">{time}</b>
        </span>
      </div>

      <div className="mx-5 mt-3 rounded-3xl bg-surface border border-line p-5">
        <p className="text-sm font-semibold flex items-center gap-2">⚑ Your Score</p>
        <div className="mt-1 flex items-end justify-between">
          <p>
            <span className="font-display text-5xl">{attempt.score}</span>
            <span className="text-muted">/{attempt.maxScore}</span>
          </p>
          <p className="text-sm text-muted">
            ( <b className="text-foreground">{(attempt.correctCount ?? 0) + (attempt.incorrectCount ?? 0)}</b>
            /{questions.length} Attempted )
          </p>
        </div>
        <div className="my-4 border-t border-dashed border-line" />
        <p className="text-sm font-semibold flex items-center gap-2">◎ Your Accuracy</p>
        <div className="mt-1 flex items-end justify-between">
          <p className="font-display text-4xl">
            {(attempt.accuracy ?? 0).toFixed(2)}%
          </p>
          <div className="flex gap-2 text-xs">
            <span className="bg-green-soft text-green font-semibold rounded-lg px-2 py-1">
              +{attempt.correctCount} correct
            </span>
            <span className="bg-red-soft text-red font-semibold rounded-lg px-2 py-1">
              +{attempt.incorrectCount} incorrect
            </span>
          </div>
        </div>
      </div>

      <ResultsClient
        questions={questions.map((q) => ({
          id: q.id,
          section: q.section,
          text: q.text,
          options: q.options,
          correctIndex: q.correctIndex,
          marks: q.marks,
          explanation: q.explanation,
        }))}
        answers={answers.map((a) => ({
          questionId: a.questionId,
          selectedIndex: a.selectedIndex,
          isCorrect: a.isCorrect,
          marksAwarded: a.marksAwarded,
        }))}
      />
    </main>
  );
}
