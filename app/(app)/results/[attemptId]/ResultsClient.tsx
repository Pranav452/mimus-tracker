"use client";

import { useMemo, useState } from "react";
import { CheckIcon, XIcon, ChevronDownIcon } from "@/components/icons";

type Q = {
  id: number;
  section: string | null;
  text: string;
  options: string[];
  correctIndex: number;
  marks: number;
  explanation: string | null;
};
type A = {
  questionId: number;
  selectedIndex: number | null;
  isCorrect: boolean | null;
  marksAwarded: number | null;
};

export default function ResultsClient({
  questions,
  answers,
}: {
  questions: Q[];
  answers: A[];
}) {
  const sections = useMemo(
    () => [...new Set(questions.map((q) => q.section ?? "Questions"))],
    [questions]
  );
  const [activeSection, setActiveSection] = useState(sections[0]);
  const [open, setOpen] = useState<number | null>(null);

  const ansFor = (id: number) => answers.find((a) => a.questionId === id);
  const sectionQs = questions.filter(
    (q) => (q.section ?? "Questions") === activeSection
  );

  const stats = useMemo(() => {
    const qs = sectionQs;
    let score = 0,
      max = 0,
      attempted = 0,
      correct = 0;
    for (const q of qs) {
      max += q.marks;
      const a = ansFor(q.id);
      if (a?.selectedIndex != null) {
        attempted++;
        if (a.isCorrect) correct++;
      }
      score += a?.marksAwarded ?? 0;
    }
    return {
      score,
      max,
      attempted,
      total: qs.length,
      accuracy: attempted ? (correct / attempted) * 100 : 0,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeSection, questions, answers]);

  return (
    <>
      <section className="px-5 mt-7">
        <h2 className="font-bold text-lg">Section-wise Performance</h2>
        {sections.length > 1 && (
          <div className="flex gap-5 border-b border-line mt-3 overflow-x-auto no-scrollbar">
            {sections.map((s) => (
              <button
                key={s}
                onClick={() => setActiveSection(s)}
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

        <div className="mt-4 rounded-3xl bg-surface border border-line p-5">
          <div className="grid grid-cols-3 gap-3 text-center">
            <div>
              <p className="text-xs text-muted mb-1">Score</p>
              <p className="font-display text-2xl">
                {stats.score}
                <span className="text-sm text-muted">/{stats.max}</span>
              </p>
            </div>
            <div>
              <p className="text-xs text-muted mb-1">Attempted</p>
              <p className="font-display text-2xl">
                {stats.attempted}
                <span className="text-sm text-muted">/{stats.total}</span>
              </p>
            </div>
            <div>
              <p className="text-xs text-muted mb-1">Accuracy</p>
              <p className="font-display text-2xl text-green">
                {stats.accuracy.toFixed(1)}%
              </p>
            </div>
          </div>
          <div className="mt-4 pt-4 border-t border-dashed border-line flex flex-wrap justify-center gap-2">
            {sectionQs.map((q, i) => {
              const a = ansFor(q.id);
              const state =
                a?.selectedIndex == null ? "skip" : a.isCorrect ? "ok" : "no";
              return (
                <button
                  key={q.id}
                  onClick={() => setOpen(open === q.id ? null : q.id)}
                  aria-label={`Question ${i + 1}`}
                  className={`w-7 h-7 rounded-full flex items-center justify-center ${
                    state === "ok"
                      ? "bg-green-soft text-green"
                      : state === "no"
                        ? "bg-red-soft text-red"
                        : "bg-surface-2 text-muted"
                  }`}
                >
                  {state === "ok" ? (
                    <CheckIcon className="w-4 h-4" strokeWidth={2.4} />
                  ) : state === "no" ? (
                    <XIcon className="w-4 h-4" strokeWidth={2.4} />
                  ) : (
                    <span className="text-[10px] font-bold">{i + 1}</span>
                  )}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      <section className="px-5 mt-7 pb-8">
        <h2 className="font-bold text-lg mb-3">Detailed Question Analysis:</h2>
        <div className="space-y-3">
          {sectionQs.map((q, i) => {
            const a = ansFor(q.id);
            const state =
              a?.selectedIndex == null ? "skip" : a.isCorrect ? "ok" : "no";
            const expanded = open === q.id;
            return (
              <div key={q.id} className="rounded-3xl bg-surface border border-line">
                <button
                  onClick={() => setOpen(expanded ? null : q.id)}
                  className="w-full flex items-center gap-2 px-5 py-4 text-left"
                >
                  {state === "ok" ? (
                    <CheckIcon className="w-4 h-4 text-green shrink-0" strokeWidth={2.6} />
                  ) : state === "no" ? (
                    <XIcon className="w-4 h-4 text-red shrink-0" strokeWidth={2.6} />
                  ) : (
                    <span className="w-2 h-2 rounded-full bg-muted shrink-0" />
                  )}
                  <span className="text-sm font-semibold flex-1">
                    Question {i + 1}.
                  </span>
                  <ChevronDownIcon
                    className={`w-4 h-4 text-muted transition-transform ${expanded ? "rotate-180" : ""}`}
                  />
                </button>
                {expanded ? (
                  <div className="px-5 pb-5">
                    <p className="font-display text-[17px] leading-relaxed whitespace-pre-wrap">
                      {q.text}
                    </p>
                    <div className="mt-4 space-y-2">
                      {q.options.map((opt, oi) => {
                        const isCorrect = oi === q.correctIndex;
                        const isPicked = a?.selectedIndex === oi;
                        return (
                          <div
                            key={oi}
                            className={`flex items-center gap-3 rounded-2xl border px-4 py-3 text-sm ${
                              isCorrect
                                ? "bg-green-soft border-green/40"
                                : isPicked
                                  ? "bg-red-soft border-red/40"
                                  : "border-line"
                            }`}
                          >
                            <span className="font-bold">
                              {String.fromCharCode(65 + oi)}.
                            </span>
                            <span className="flex-1">{opt}</span>
                            {isCorrect && (
                              <CheckIcon className="w-4 h-4 text-green" strokeWidth={2.6} />
                            )}
                            {isPicked && !isCorrect && (
                              <XIcon className="w-4 h-4 text-red" strokeWidth={2.6} />
                            )}
                          </div>
                        );
                      })}
                    </div>
                    {q.explanation && (
                      <div className="mt-4 rounded-2xl bg-surface-2 p-4 text-sm leading-relaxed">
                        <p className="font-bold mb-1">Explanation</p>
                        {q.explanation}
                      </div>
                    )}
                  </div>
                ) : (
                  <p className="px-5 pb-4 -mt-1 text-sm text-muted line-clamp-2">
                    {q.text}
                  </p>
                )}
              </div>
            );
          })}
        </div>
      </section>
    </>
  );
}
