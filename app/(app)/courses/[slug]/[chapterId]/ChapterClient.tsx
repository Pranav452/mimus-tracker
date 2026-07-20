"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import {
  setChapterStatus,
  getOrGenerateFlashcards,
  generateChapterQuiz,
} from "@/app/actions/study";
import {
  BookIcon,
  CardsIcon,
  SparkleIcon,
  CheckIcon,
  XIcon,
  ArrowLeftIcon,
  ArrowRightIcon,
} from "@/components/icons";

type Quiz = {
  id: number;
  text: string;
  options: string[];
  correctIndex: number;
  explanation: string | null;
};
type Card = { id: number; front: string; back: string };
type Status = "not_started" | "in_progress" | "done";

export default function ChapterClient({
  chapterId,
  chapterName,
  status: initialStatus,
  quiz,
  cards: initialCards,
}: {
  chapterId: number;
  chapterName: string;
  status: Status;
  quiz: Quiz[];
  cards: Card[];
}) {
  const router = useRouter();
  const [tab, setTab] = useState<"learn" | "quiz" | "cards">("learn");
  const [status, setStatus] = useState<Status>(initialStatus);
  const [cards, setCards] = useState<Card[]>(initialCards);
  const [cardIdx, setCardIdx] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [pending, startTransition] = useTransition();
  const [genError, setGenError] = useState("");

  // quiz state
  const [qIdx, setQIdx] = useState(0);
  const [picked, setPicked] = useState<Record<number, number>>({});

  const tabs = [
    { key: "learn" as const, label: "Learn", icon: BookIcon },
    { key: "quiz" as const, label: "Quiz", icon: SparkleIcon },
    { key: "cards" as const, label: "Flashcards", icon: CardsIcon },
  ];

  function updateStatus(s: Status) {
    setStatus(s);
    startTransition(() => setChapterStatus(chapterId, s));
  }

  return (
    <div className="px-5">
      <div className="flex gap-6 border-b border-line">
        {tabs.map(({ key, label, icon: Icon }) => (
          <button
            key={key}
            onClick={() => setTab(key)}
            className={`flex items-center gap-1.5 pb-2.5 text-[15px] ${
              tab === key ? "font-bold border-b-2 border-foreground" : "text-muted"
            }`}
          >
            <Icon className="w-4 h-4" />
            {label}
          </button>
        ))}
      </div>

      {tab === "learn" && (
        <section className="mt-5 pb-8 space-y-4">
          <div className="rounded-3xl bg-surface border border-line p-5">
            <p className="font-bold mb-1">Where are you with this chapter?</p>
            <p className="text-sm text-muted mb-4">
              Keep this updated — it drives your course progress.
            </p>
            <div className="flex gap-2">
              {(
                [
                  ["not_started", "Not started"],
                  ["in_progress", "Studying"],
                  ["done", "Done ✓"],
                ] as [Status, string][]
              ).map(([s, label]) => (
                <button
                  key={s}
                  onClick={() => updateStatus(s)}
                  disabled={pending}
                  className={`flex-1 rounded-full py-2.5 text-sm font-semibold border ${
                    status === s
                      ? "bg-foreground text-background border-foreground"
                      : "bg-surface-2 border-line"
                  }`}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          <Link
            href="/chat"
            className="block rounded-3xl p-5 bg-gradient-to-br from-[#f3c98f] to-[#d9b8e8] border border-line"
          >
            <p className="font-bold text-white drop-shadow-sm">
              Doubts in {chapterName}?
            </p>
            <p className="text-sm text-white/90 mt-1">
              Ask Mimus — it knows the CA Inter syllabus inside out.
            </p>
          </Link>

          <Link
            href="/topics"
            className="block rounded-3xl bg-surface border border-line p-5"
          >
            <p className="font-bold">Studying this today?</p>
            <p className="text-sm text-muted mt-1">
              Add it to today&apos;s plan so tonight&apos;s test covers it.
            </p>
          </Link>
        </section>
      )}

      {tab === "quiz" && (
        <section className="mt-5 pb-8">
          {quiz.length === 0 ? (
            <div className="rounded-3xl bg-surface border border-line p-6 text-center">
              <SparkleIcon className="w-10 h-10 mx-auto text-accent" strokeWidth={1.4} />
              <p className="font-bold mt-3">No practice quiz yet</p>
              <p className="text-sm text-muted mt-1 mb-4">
                Generate 8 quick practice questions for this chapter.
              </p>
              {genError && <p className="text-sm text-red mb-2">{genError}</p>}
              <button
                disabled={pending}
                onClick={() =>
                  startTransition(async () => {
                    try {
                      setGenError("");
                      await generateChapterQuiz(chapterId);
                      router.refresh();
                    } catch {
                      setGenError("Generation failed — try again in a minute.");
                    }
                  })
                }
                className="rounded-full bg-foreground text-background px-6 py-3 text-sm font-semibold disabled:opacity-50"
              >
                {pending ? "Generating…" : "✨ Generate quiz"}
              </button>
            </div>
          ) : (
            <QuizRunner
              quiz={quiz}
              qIdx={qIdx}
              setQIdx={setQIdx}
              picked={picked}
              setPicked={setPicked}
            />
          )}
        </section>
      )}

      {tab === "cards" && (
        <section className="mt-5 pb-8">
          {cards.length === 0 ? (
            <div className="rounded-3xl bg-surface border border-line p-6 text-center">
              <CardsIcon className="w-10 h-10 mx-auto text-lav" strokeWidth={1.4} />
              <p className="font-bold mt-3">No flashcards yet</p>
              <p className="text-sm text-muted mt-1 mb-4">
                Generate a revision deck for this chapter.
              </p>
              {genError && <p className="text-sm text-red mb-2">{genError}</p>}
              <button
                disabled={pending}
                onClick={() =>
                  startTransition(async () => {
                    try {
                      setGenError("");
                      const result = await getOrGenerateFlashcards(chapterId);
                      setCards(result.map((c) => ({ id: c.id, front: c.front, back: c.back })));
                    } catch {
                      setGenError("Generation failed — try again in a minute.");
                    }
                  })
                }
                className="rounded-full bg-foreground text-background px-6 py-3 text-sm font-semibold disabled:opacity-50"
              >
                {pending ? "Generating…" : "✨ Generate flashcards"}
              </button>
            </div>
          ) : (
            <div>
              <button
                onClick={() => setFlipped((f) => !f)}
                className="w-full min-h-[320px] rounded-3xl p-6 flex flex-col items-center justify-center text-center transition-colors border border-line"
                style={{
                  background: flipped ? "var(--surface)" : "#2b2a26",
                  color: flipped ? "var(--foreground)" : "#f4f2ec",
                }}
              >
                <p className="font-display text-[22px] leading-relaxed whitespace-pre-wrap">
                  {flipped ? cards[cardIdx].back : cards[cardIdx].front}
                </p>
                <p className={`mt-6 text-xs ${flipped ? "text-muted" : "text-white/50"}`}>
                  {flipped ? "Tap to see question" : "See answer"}
                </p>
              </button>
              <div className="mt-5 flex items-center justify-between">
                <button
                  onClick={() => {
                    setCardIdx((i) => Math.max(0, i - 1));
                    setFlipped(false);
                  }}
                  disabled={cardIdx === 0}
                  aria-label="Previous card"
                  className="w-12 h-12 rounded-full bg-surface border border-line flex items-center justify-center disabled:opacity-40"
                >
                  <ArrowLeftIcon className="w-5 h-5" />
                </button>
                <p className="text-sm text-muted">
                  <b className="text-foreground">{cardIdx + 1}</b>/{cards.length}
                </p>
                <button
                  onClick={() => {
                    setCardIdx((i) => Math.min(cards.length - 1, i + 1));
                    setFlipped(false);
                  }}
                  disabled={cardIdx >= cards.length - 1}
                  aria-label="Next card"
                  className="w-12 h-12 rounded-full bg-surface border border-line flex items-center justify-center disabled:opacity-40"
                >
                  <ArrowRightIcon className="w-5 h-5" />
                </button>
              </div>
            </div>
          )}
        </section>
      )}
    </div>
  );
}

function QuizRunner({
  quiz,
  qIdx,
  setQIdx,
  picked,
  setPicked,
}: {
  quiz: Quiz[];
  qIdx: number;
  setQIdx: (n: number) => void;
  picked: Record<number, number>;
  setPicked: React.Dispatch<React.SetStateAction<Record<number, number>>>;
}) {
  const q = quiz[qIdx];
  const answered = picked[q.id] != null;

  return (
    <div>
      <p className="text-sm text-muted mb-2">
        Question <b className="text-foreground">{qIdx + 1}</b> of {quiz.length}
      </p>
      <p className="font-display text-[19px] leading-relaxed whitespace-pre-wrap">
        {q.text}
      </p>
      <div className="mt-5 space-y-2.5">
        {q.options.map((opt, i) => {
          const isPicked = picked[q.id] === i;
          const isCorrect = i === q.correctIndex;
          let cls = "border-line bg-surface";
          if (answered && isCorrect) cls = "border-green/50 bg-green-soft";
          else if (answered && isPicked) cls = "border-red/50 bg-red-soft";
          return (
            <button
              key={i}
              disabled={answered}
              onClick={() => setPicked((p) => ({ ...p, [q.id]: i }))}
              className={`w-full flex items-center gap-3 rounded-2xl border px-4 py-3.5 text-left text-[15px] ${cls}`}
            >
              <span className="w-7 h-7 shrink-0 rounded-full bg-surface-2 flex items-center justify-center text-xs font-bold">
                {String.fromCharCode(65 + i)}
              </span>
              <span className="flex-1">{opt}</span>
              {answered && isCorrect && (
                <CheckIcon className="w-4 h-4 text-green" strokeWidth={2.6} />
              )}
              {answered && isPicked && !isCorrect && (
                <XIcon className="w-4 h-4 text-red" strokeWidth={2.6} />
              )}
            </button>
          );
        })}
      </div>
      {answered && q.explanation && (
        <div className="mt-4 rounded-2xl bg-surface-2 p-4 text-sm leading-relaxed">
          <p className="font-bold mb-1">Explanation</p>
          {q.explanation}
        </div>
      )}
      <div className="mt-6 flex gap-3">
        <button
          onClick={() => setQIdx(Math.max(0, qIdx - 1))}
          disabled={qIdx === 0}
          className="flex-1 h-13 py-3.5 rounded-full bg-surface-2 font-semibold disabled:opacity-40"
        >
          Previous
        </button>
        <button
          onClick={() => setQIdx(Math.min(quiz.length - 1, qIdx + 1))}
          disabled={qIdx >= quiz.length - 1}
          className="flex-1 h-13 py-3.5 rounded-full bg-foreground text-background font-semibold disabled:opacity-40"
        >
          Next
        </button>
      </div>
    </div>
  );
}
