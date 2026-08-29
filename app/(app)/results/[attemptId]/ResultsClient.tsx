"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { CheckIcon, XIcon, ChevronDownIcon } from "@/components/icons";
import {
  evaluateWritten,
  evaluateWrittenFromPhoto,
  scoreWritten,
} from "@/app/actions/study";

/**
 * Phone cameras produce 3–8 MB images; the examiner only needs to read the
 * handwriting. Downscale to 1600px on the long edge before sending.
 */
function downscale(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);
    img.onload = () => {
      URL.revokeObjectURL(url);
      const scale = Math.min(1, 1600 / Math.max(img.width, img.height));
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);
      const ctx = canvas.getContext("2d");
      if (!ctx) return reject(new Error("Couldn't read that photo."));
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
      resolve(canvas.toDataURL("image/jpeg", 0.82));
    };
    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Couldn't read that photo."));
    };
    img.src = url;
  });
}

type Q = {
  id: number;
  section: string | null;
  kind: "mcq" | "descriptive";
  text: string;
  options: string[];
  correctIndex: number | null;
  marks: number;
  explanation: string | null;
  modelAnswer: string | null;
  keyPoints: string[] | null;
  chapterName: string | null;
};
type A = {
  questionId: number;
  selectedIndex: number | null;
  isCorrect: boolean | null;
  marksAwarded: number | null;
  textAnswer: string | null;
  aiFeedback: string | null;
  scored: boolean;
  timeSpentSeconds: number | null;
};

export default function ResultsClient({
  attemptId,
  questions,
  answers,
}: {
  attemptId: number;
  questions: Q[];
  answers: A[];
}) {
  const router = useRouter();
  const [busy, setBusy] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function runEvaluation(questionId: number) {
    setBusy(questionId);
    setError(null);
    try {
      await evaluateWritten(attemptId, questionId);
      router.refresh();
    } catch (e) {
      setError(
        e instanceof Error ? e.message : "Couldn't mark that one — try again."
      );
    } finally {
      setBusy(null);
    }
  }

  async function markFromPhoto(questionId: number, file: File) {
    setBusy(questionId);
    setError(null);
    try {
      const dataUrl = await downscale(file);
      await evaluateWrittenFromPhoto(attemptId, questionId, dataUrl);
      router.refresh();
    } catch (e) {
      setError(
        e instanceof Error
          ? e.message
          : "Couldn't read that photo — try a clearer shot in better light."
      );
    } finally {
      setBusy(null);
    }
  }

  async function awardByHand(questionId: number, marks: number) {
    setBusy(questionId);
    setError(null);
    try {
      await scoreWritten(attemptId, questionId, marks);
      router.refresh();
    } catch {
      setError("Couldn't save those marks — try again.");
    } finally {
      setBusy(null);
    }
  }
  const sections = useMemo(
    () => [...new Set(questions.map((q) => q.section ?? "Questions"))],
    [questions]
  );
  const [activeSection, setActiveSection] = useState(sections[0]);
  const [open, setOpen] = useState<number | null>(null);

  const ansFor = (id: number) => answers.find((a) => a.questionId === id);

  // Pace report for her 1-minute-per-MCQ practice: which topics ran over, and
  // where slow met wrong. Only rendered when the attempt carries timing data.
  const PACE_LIMIT = 60;
  const paceReport = useMemo(() => {
    const timed = questions.filter((q) => {
      const a = ansFor(q.id);
      return q.kind === "mcq" && a?.timeSpentSeconds != null;
    });
    if (timed.length === 0) return null;
    const byTopic = new Map<
      string,
      { qs: number; secs: number; over: number; wrong: number; slowWrong: number }
    >();
    for (const q of timed) {
      const a = ansFor(q.id)!;
      const t = a.timeSpentSeconds ?? 0;
      const key = q.chapterName ?? q.section ?? "Other";
      const row =
        byTopic.get(key) ?? { qs: 0, secs: 0, over: 0, wrong: 0, slowWrong: 0 };
      row.qs++;
      row.secs += t;
      if (t > PACE_LIMIT) row.over++;
      if (a.isCorrect === false) row.wrong++;
      if (t > PACE_LIMIT && a.isCorrect !== true) row.slowWrong++;
      byTopic.set(key, row);
    }
    const topics = [...byTopic.entries()]
      .map(([topic, r]) => ({ topic, ...r, avg: r.secs / r.qs }))
      .sort((x, y) => y.slowWrong - x.slowWrong || y.avg - x.avg);
    const overCount = timed.reduce(
      (n, q) => n + ((ansFor(q.id)?.timeSpentSeconds ?? 0) > PACE_LIMIT ? 1 : 0),
      0
    );
    const totalSecs = timed.reduce(
      (n, q) => n + (ansFor(q.id)?.timeSpentSeconds ?? 0),
      0
    );
    return {
      topics,
      overCount,
      total: timed.length,
      avg: totalSecs / timed.length,
      revise: topics.filter((t) => t.slowWrong > 0 || t.avg > PACE_LIMIT),
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [questions, answers]);

  const fmtSecs = (t: number) =>
    `${Math.floor(t / 60)}:${String(Math.round(t) % 60).padStart(2, "0")}`;
  const sectionQs = questions.filter(
    (q) => (q.section ?? "Questions") === activeSection
  );

  const stats = useMemo(() => {
    const qs = sectionQs;
    let score = 0,
      max = 0,
      attempted = 0,
      correct = 0,
      unmarked = 0;
    for (const q of qs) {
      max += q.marks;
      const a = ansFor(q.id);
      if (q.kind === "descriptive") {
        if (a?.textAnswer?.trim()) attempted++;
        if (!a?.scored) unmarked++;
      } else if (a?.selectedIndex != null) {
        attempted++;
        if (a.isCorrect) correct++;
      }
      score += a?.marksAwarded ?? 0;
    }
    // accuracy is an MCQ measure — written answers carry marks, not right/wrong
    const mcqAttempted = qs.filter((q) => {
      const a = ansFor(q.id);
      return q.kind !== "descriptive" && a?.selectedIndex != null;
    }).length;
    return {
      score,
      max,
      attempted,
      unmarked,
      total: qs.length,
      accuracy: mcqAttempted ? (correct / mcqAttempted) * 100 : 0,
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [activeSection, questions, answers]);

  return (
    <>
      {paceReport && (
        <section className="px-5 mt-7">
          <h2 className="font-bold text-lg">Pace — the 1-minute drill</h2>
          <div className="mt-3 rounded-3xl bg-surface border border-line p-5">
            <div className="flex items-end justify-between">
              <div>
                <p className="text-xs font-bold uppercase tracking-wide text-muted">
                  Average per question
                </p>
                <p
                  className={`font-display text-4xl tabular-nums ${
                    paceReport.avg > PACE_LIMIT ? "text-red" : "text-green"
                  }`}
                >
                  {fmtSecs(paceReport.avg)}
                </p>
              </div>
              <p className="text-sm text-muted text-right">
                <b
                  className={
                    paceReport.overCount > 0 ? "text-red" : "text-green"
                  }
                >
                  {paceReport.overCount}
                </b>
                /{paceReport.total} questions
                <br />
                over 1 minute
              </p>
            </div>

            {paceReport.revise.length > 0 ? (
              <div className="mt-4 pt-4 border-t border-dashed border-line">
                <p className="text-xs font-bold uppercase tracking-wide text-red mb-2">
                  Revise these first
                </p>
                <div className="space-y-2">
                  {paceReport.revise.map((t) => (
                    <div
                      key={t.topic}
                      className="flex items-center justify-between gap-3 rounded-2xl bg-red-soft border border-red/25 px-4 py-2.5"
                    >
                      <p className="text-sm font-semibold leading-snug">{t.topic}</p>
                      <p className="text-xs text-right tabular-nums whitespace-nowrap text-muted">
                        avg {fmtSecs(t.avg)}
                        {t.wrong > 0 && (
                          <>
                            {" "}· <span className="text-red font-semibold">{t.wrong} wrong</span>
                          </>
                        )}
                      </p>
                    </div>
                  ))}
                </div>
                <p className="mt-2.5 text-xs text-muted leading-relaxed">
                  Slow AND wrong is a concept gap — reread that chapter's notes or
                  quiz it. Slow but right is just drilling speed.
                </p>
              </div>
            ) : (
              <p className="mt-4 pt-4 border-t border-dashed border-line text-sm font-semibold text-green">
                Every topic inside a minute — exam pace. 🔥
              </p>
            )}
          </div>
        </section>
      )}

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
            const written = q.kind === "descriptive";
            const state = written
              ? !a?.scored
                ? "pending"
                : (a.marksAwarded ?? 0) >= q.marks * 0.6
                  ? "ok"
                  : "no"
              : a?.selectedIndex == null
                ? "skip"
                : a.isCorrect
                  ? "ok"
                  : "no";
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
                  {a?.timeSpentSeconds != null && (
                    <span
                      className={`text-[11px] font-bold rounded-full px-2 py-0.5 tabular-nums ${
                        a.timeSpentSeconds > 60
                          ? "bg-red-soft text-red"
                          : "bg-surface-2 text-muted"
                      }`}
                    >
                      ⏱ {fmtSecs(a.timeSpentSeconds)}
                    </span>
                  )}
                  {written && (
                    <span
                      className={`text-[11px] font-bold rounded-full px-2 py-0.5 tabular-nums ${
                        a?.scored
                          ? "bg-surface-2 text-muted"
                          : "bg-accent-soft text-accent"
                      }`}
                    >
                      {a?.scored
                        ? `${a.marksAwarded ?? 0}/${q.marks}`
                        : `${q.marks} marks · to mark`}
                    </span>
                  )}
                  <ChevronDownIcon
                    className={`w-4 h-4 text-muted transition-transform ${expanded ? "rotate-180" : ""}`}
                  />
                </button>
                {expanded ? (
                  <div className="px-5 pb-5">
                    <p className="font-display text-[17px] leading-relaxed whitespace-pre-wrap">
                      {q.text}
                    </p>

                    {written ? (
                      <div className="mt-4 space-y-4">
                        <div>
                          <p className="text-xs font-bold text-muted uppercase tracking-wide">
                            What you wrote
                          </p>
                          <p className="mt-1.5 text-sm leading-relaxed whitespace-pre-wrap rounded-2xl border border-line px-4 py-3">
                            {a?.textAnswer?.trim() || "Nothing recorded."}
                          </p>
                        </div>

                        {!a?.scored && (
                          <div className="rounded-2xl bg-accent-soft border border-accent/30 p-4">
                            <p className="text-sm font-semibold">Not marked yet</p>
                            <p className="mt-1 text-xs text-muted">
                              Photograph your answer sheet for the closest thing to
                              real marking — or mark the points you typed, or award
                              yourself after reading the model answer.
                            </p>
                            <label
                              className={`mt-3 flex items-center justify-center gap-2 rounded-full bg-foreground text-background px-4 py-3 text-sm font-semibold ${
                                busy === q.id ? "opacity-40" : "cursor-pointer"
                              }`}
                            >
                              📷 {busy === q.id ? "Marking…" : "Photograph my answer"}
                              <input
                                type="file"
                                accept="image/*"
                                capture="environment"
                                disabled={busy === q.id}
                                className="hidden"
                                onChange={(e) => {
                                  const f = e.target.files?.[0];
                                  e.target.value = "";
                                  if (f) markFromPhoto(q.id, f);
                                }}
                              />
                            </label>
                            <div className="mt-3 flex flex-wrap gap-2">
                              <button
                                onClick={() => runEvaluation(q.id)}
                                disabled={busy === q.id || !a?.textAnswer?.trim()}
                                className="rounded-full border border-line bg-surface px-4 py-2 text-sm font-semibold disabled:opacity-40"
                              >
                                Mark typed points
                              </button>
                              {Array.from(
                                { length: q.marks * 2 + 1 },
                                (_, k) => k / 2
                              ).map((m) => (
                                <button
                                  key={m}
                                  onClick={() => awardByHand(q.id, m)}
                                  disabled={busy === q.id}
                                  className="rounded-full border border-line bg-surface px-3 py-2 text-sm font-semibold tabular-nums disabled:opacity-40"
                                >
                                  {m}
                                </button>
                              ))}
                            </div>
                          </div>
                        )}

                        {a?.aiFeedback && (
                          <div className="rounded-2xl border border-line p-4">
                            <p className="text-xs font-bold text-muted uppercase tracking-wide">
                              Examiner's note
                            </p>
                            <p className="mt-1.5 text-sm leading-relaxed">
                              {a.aiFeedback}
                            </p>
                          </div>
                        )}

                        {q.keyPoints && q.keyPoints.length > 0 && (
                          <div>
                            <p className="text-xs font-bold text-muted uppercase tracking-wide">
                              Marks were for
                            </p>
                            <ul className="mt-1.5 space-y-1.5">
                              {q.keyPoints.map((p, pi) => (
                                <li key={pi} className="flex gap-2 text-sm">
                                  <span className="text-muted">•</span>
                                  <span>{p}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}

                        {q.modelAnswer && (
                          <div className="rounded-2xl bg-green-soft border border-green/30 p-4">
                            <p className="text-xs font-bold uppercase tracking-wide text-green">
                              Model answer
                            </p>
                            <p className="mt-1.5 text-sm leading-relaxed whitespace-pre-wrap">
                              {q.modelAnswer}
                            </p>
                          </div>
                        )}

                        {error && busy === null && (
                          <p className="text-sm text-red">{error}</p>
                        )}
                      </div>
                    ) : (
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
                    )}
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
