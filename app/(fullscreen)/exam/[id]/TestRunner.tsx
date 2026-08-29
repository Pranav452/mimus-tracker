"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { submitAttempt } from "@/app/actions/study";
import { BookmarkIcon } from "@/components/icons";

type Q = {
  id: number;
  section: string | null;
  kind: "mcq" | "descriptive";
  text: string;
  options: string[];
  marks: number;
  negativeMarks: number;
};

export default function TestRunner({
  testId,
  title,
  durationMinutes,
  questions,
}: {
  testId: number;
  title: string;
  durationMinutes: number;
  questions: Q[];
}) {
  const router = useRouter();
  const sections = useMemo(() => {
    const s = [...new Set(questions.map((q) => q.section ?? "Questions"))];
    return s;
  }, [questions]);

  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number | null>>({});
  const [written, setWritten] = useState<Record<number, string>>({});
  const [bookmarks, setBookmarks] = useState<Record<number, boolean>>({});
  const [secondsLeft, setSecondsLeft] = useState(durationMinutes * 60);
  const [submitting, setSubmitting] = useState(false);
  const [showGrid, setShowGrid] = useState(false);
  const startRef = useRef(Date.now());
  const submittedRef = useRef(false);

  // per-question stopwatch: accumulate seconds against whichever question is
  // on screen — revisits keep adding to the same question's total
  const timesRef = useRef<Record<number, number>>({});
  const shownAtRef = useRef(Date.now());
  const [qElapsed, setQElapsed] = useState(0);
  function bankTime() {
    const qq = questions[current];
    if (!qq) return;
    const secs = (Date.now() - shownAtRef.current) / 1000;
    timesRef.current[qq.id] = (timesRef.current[qq.id] ?? 0) + secs;
    shownAtRef.current = Date.now();
  }
  function goTo(idx: number) {
    bankTime();
    setCurrent(idx);
    setQElapsed(0);
  }

  const q = questions[current];
  const activeSection = q?.section ?? "Questions";

  async function doSubmit() {
    if (submittedRef.current) return;
    submittedRef.current = true;
    setSubmitting(true);
    bankTime();
    try {
      const attemptId = await submitAttempt({
        testId,
        timeTakenSeconds: Math.round((Date.now() - startRef.current) / 1000),
        answers: questions.map((qq) => ({
          questionId: qq.id,
          selectedIndex: answers[qq.id] ?? null,
          textAnswer: written[qq.id] ?? null,
          bookmarked: !!bookmarks[qq.id],
          timeSpentSeconds: Math.round(timesRef.current[qq.id] ?? 0),
        })),
      });
      router.replace(`/results/${attemptId}`);
    } catch {
      submittedRef.current = false;
      setSubmitting(false);
      alert("Couldn't submit — check your internet and try again.");
    }
  }

  useEffect(() => {
    const t = setInterval(() => {
      setSecondsLeft((s) => {
        if (s <= 1) {
          clearInterval(t);
          doSubmit();
          return 0;
        }
        return s - 1;
      });
      // stopwatch for the question on screen = time already banked on it
      // (earlier visits) + time since it was brought back up
      const qq = questions[current];
      if (qq)
        setQElapsed(
          Math.floor(
            (timesRef.current[qq.id] ?? 0) +
              (Date.now() - shownAtRef.current) / 1000
          )
        );
    }, 1000);
    return () => clearInterval(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [current]);

  const hh = String(Math.floor(secondsLeft / 3600)).padStart(2, "0");
  const mm = String(Math.floor((secondsLeft % 3600) / 60)).padStart(2, "0");
  const ss = String(secondsLeft % 60).padStart(2, "0");

  function jumpToSection(s: string) {
    const idx = questions.findIndex((qq) => (qq.section ?? "Questions") === s);
    if (idx >= 0) goTo(idx);
  }

  const isAnswered = (qq: Q) =>
    qq.kind === "descriptive"
      ? !!written[qq.id]?.trim()
      : answers[qq.id] != null;
  const attemptedCount = questions.filter(isAnswered).length;

  return (
    <main className="min-h-dvh flex flex-col">
      <header className="px-5 pt-safe">
        <div className="flex items-center justify-between py-3">
          <div>
            <p className="text-2xl font-bold tabular-nums tracking-tight">
              {hh}:{mm}:{ss}
            </p>
            <p className="text-xs text-muted">{title}</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                if (confirm(`Submit test? ${attemptedCount}/${questions.length} attempted.`))
                  doSubmit();
              }}
              disabled={submitting}
              className="rounded-full border border-line bg-surface px-4 py-2 text-sm font-semibold disabled:opacity-50"
            >
              {submitting ? "Submitting…" : "Submit"}
            </button>
            <button
              onClick={() => setShowGrid((v) => !v)}
              aria-label="Question palette"
              className="w-10 h-10 rounded-full border border-line bg-surface flex items-center justify-center text-lg"
            >
              ☰
            </button>
          </div>
        </div>

        {sections.length > 1 && (
          <div className="flex gap-5 border-b border-line overflow-x-auto no-scrollbar">
            {sections.map((s) => (
              <button
                key={s}
                onClick={() => jumpToSection(s)}
                className={`pb-2.5 text-[15px] whitespace-nowrap ${
                  s === activeSection
                    ? "font-bold border-b-2 border-foreground"
                    : "text-muted"
                }`}
              >
                {s}
              </button>
            ))}
          </div>
        )}
      </header>

      {showGrid && (
        <div className="px-5 py-4 border-b border-line bg-surface">
          <div className="grid grid-cols-8 gap-2">
            {questions.map((qq, i) => (
              <button
                key={qq.id}
                onClick={() => {
                  goTo(i);
                  setShowGrid(false);
                }}
                className={`h-9 rounded-lg text-sm font-semibold border ${
                  i === current
                    ? "bg-foreground text-background border-foreground"
                    : isAnswered(qq)
                      ? "bg-green-soft border-green/40"
                      : bookmarks[qq.id]
                        ? "bg-accent-soft border-accent/40"
                        : "bg-surface-2 border-line"
                }`}
              >
                {i + 1}
              </button>
            ))}
          </div>
        </div>
      )}

      <section className="flex-1 px-5 pb-36">
        <div className="flex items-center justify-between py-4">
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-full border border-line bg-surface flex items-center justify-center text-sm font-bold">
              {current + 1}
            </span>
            <span className="text-xs font-semibold text-green bg-green-soft rounded-full px-2.5 py-1">
              +{q.marks}
            </span>
            {q.negativeMarks > 0 && (
              <span className="text-xs font-semibold text-red bg-red-soft rounded-full px-2.5 py-1">
                −{q.negativeMarks}
              </span>
            )}
            <span
              className={`text-xs font-semibold rounded-full px-2.5 py-1 tabular-nums ${
                qElapsed > 60
                  ? "bg-red-soft text-red"
                  : qElapsed > 45
                    ? "bg-accent-soft text-accent"
                    : "bg-surface-2 text-muted"
              }`}
            >
              ⏱ {Math.floor(qElapsed / 60)}:{String(qElapsed % 60).padStart(2, "0")}
            </span>
          </div>
          <button
            onClick={() => setBookmarks((b) => ({ ...b, [q.id]: !b[q.id] }))}
            aria-label="Bookmark"
            className={bookmarks[q.id] ? "text-accent" : "text-muted"}
          >
            <BookmarkIcon className="w-6 h-6" filled={!!bookmarks[q.id]} />
          </button>
        </div>

        <p className="font-display text-[19px] leading-relaxed whitespace-pre-wrap">
          {q.text}
        </p>

        {q.kind === "descriptive" ? (
          <div className="mt-6">
            <p className="text-xs text-muted">
              Write the full answer in your book. Type the points you made here —
              section, provision, conclusion — so it can be marked.
            </p>
            <textarea
              value={written[q.id] ?? ""}
              onChange={(e) =>
                setWritten((w) => ({ ...w, [q.id]: e.target.value }))
              }
              rows={9}
              placeholder="e.g. S.42 — private placement, max 200 persons in a FY excluding QIBs and ESOP employees. 240 breaches it → deemed public offer…"
              className="mt-3 w-full rounded-2xl border border-line bg-surface p-4 text-[15px] leading-relaxed outline-none focus:border-foreground"
            />
            <p className="mt-2 text-xs text-muted tabular-nums">
              {(written[q.id] ?? "").trim().split(/\s+/).filter(Boolean).length} words
            </p>
          </div>
        ) : (
        <div className="mt-6 divide-y divide-line border-t border-b border-line">
          {q.options.map((opt, i) => {
            const selected = answers[q.id] === i;
            return (
              <button
                key={i}
                onClick={() =>
                  setAnswers((a) => ({ ...a, [q.id]: a[q.id] === i ? null : i }))
                }
                className={`w-full flex items-center gap-4 px-2 py-4 text-left text-[15px] transition-colors ${
                  selected ? "bg-green-soft" : ""
                }`}
              >
                <span
                  className={`w-8 h-8 shrink-0 rounded-full flex items-center justify-center text-sm font-semibold ${
                    selected
                      ? "bg-green text-white"
                      : "bg-surface-2 text-muted"
                  }`}
                >
                  {String.fromCharCode(65 + i)}
                </span>
                {opt}
              </button>
            );
          })}
        </div>
        )}
      </section>

      <div className="fixed bottom-0 inset-x-0 z-30">
        <div className="app-shell !min-h-0 px-5 pb-safe">
          <div className="flex gap-3 py-4 bg-background">
            <button
              onClick={() => goTo(Math.max(0, current - 1))}
              disabled={current === 0}
              className="flex-1 h-14 rounded-full bg-surface-2 font-semibold disabled:opacity-40"
            >
              Previous
            </button>
            {current < questions.length - 1 ? (
              <button
                onClick={() => goTo(Math.min(questions.length - 1, current + 1))}
                className="flex-1 h-14 rounded-full bg-foreground text-background font-semibold"
              >
                Next
              </button>
            ) : (
              <button
                onClick={() => {
                  if (confirm(`Submit test? ${attemptedCount}/${questions.length} attempted.`))
                    doSubmit();
                }}
                disabled={submitting}
                className="flex-1 h-14 rounded-full bg-foreground text-background font-semibold disabled:opacity-60"
              >
                {submitting ? "Submitting…" : "Finish & Submit"}
              </button>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
