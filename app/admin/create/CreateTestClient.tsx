"use client";

import { useMemo, useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  generateTestQuestions,
  saveTest,
} from "@/app/actions/admin";
import type { GeneratedQuestion } from "@/lib/ai";
import { CheckIcon, TrashIcon, SparkleIcon } from "@/components/icons";

type Chapter = {
  id: number;
  name: string;
  paperId: number;
  paperName: string;
  partLabel: string;
};

type Step = "pick" | "review" | "settings";

export default function CreateTestClient({
  chapters,
  papers,
  preselect,
}: {
  chapters: Chapter[];
  papers: { id: number; name: string }[];
  preselect: number[];
}) {
  const router = useRouter();
  const [step, setStep] = useState<Step>("pick");
  const [selected, setSelected] = useState<Set<number>>(new Set(preselect));
  const [count, setCount] = useState(10);
  const [difficulty, setDifficulty] = useState("exam-level");
  const [notes, setNotes] = useState("");
  const [questions, setQuestions] = useState<GeneratedQuestion[]>([]);
  const [error, setError] = useState("");
  const [pending, startTransition] = useTransition();

  // settings
  const [title, setTitle] = useState("");
  const [durationMinutes, setDurationMinutes] = useState(30);
  const [marks, setMarks] = useState(4);
  const [negativeMarks, setNegativeMarks] = useState(1);
  const [scheduledFor, setScheduledFor] = useState("");
  const [paperId, setPaperId] = useState<number | "">("");

  const byPaper = useMemo(() => {
    const m = new Map<string, Chapter[]>();
    for (const c of chapters) {
      if (!m.has(c.paperName)) m.set(c.paperName, []);
      m.get(c.paperName)!.push(c);
    }
    return [...m.entries()];
  }, [chapters]);

  const selectedChapters = chapters.filter((c) => selected.has(c.id));

  function generate() {
    setError("");
    startTransition(async () => {
      try {
        const qs = await generateTestQuestions({
          chapterIds: [...selected],
          count,
          difficulty,
          notes: notes.trim() || undefined,
        });
        if (qs.length === 0) throw new Error("empty");
        setQuestions(qs);
        // sensible defaults for settings step
        const paperNames = [...new Set(selectedChapters.map((c) => c.paperName))];
        if (paperNames.length === 1) {
          const p = papers.find((x) => x.name === paperNames[0]);
          setPaperId(p?.id ?? "");
        }
        if (!title) {
          const d = new Date().toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
          });
          setTitle(`${paperNames.length === 1 ? paperNames[0] : "Mixed"} — ${d}`);
        }
        setStep("review");
      } catch {
        setError("Generation failed. Check the ANTHROPIC_API_KEY and try again.");
      }
    });
  }

  // AI-returned chapter names don't always match verbatim ("Buy-back" vs
  // "Buyback") — normalize and prefer the chapters picked in step 1.
  function chapterIdFor(name: string): number | null {
    const norm = (s: string) => s.toLowerCase().replace(/[^a-z0-9]/g, "");
    const target = norm(name);
    const pool = selectedChapters.length > 0 ? selectedChapters : chapters;
    const exact = pool.find((c) => norm(c.name) === target);
    if (exact) return exact.id;
    const partial = pool.find(
      (c) => norm(c.name).includes(target) || target.includes(norm(c.name))
    );
    return (partial ?? pool[0])?.id ?? null;
  }

  function save(publish: boolean) {
    setError("");
    startTransition(async () => {
      try {
        await saveTest({
          title: title.trim() || "Practice Test",
          paperId: paperId === "" ? null : paperId,
          scheduledFor: scheduledFor || null,
          durationMinutes,
          marks,
          negativeMarks,
          publish,
          questions: questions.map((q) => {
            const chapterId = chapterIdFor(q.chapterName);
            const ch = chapters.find((c) => c.id === chapterId);
            return {
              text: q.text,
              options: q.options,
              correctIndex: q.correctIndex,
              explanation: q.explanation,
              chapterId,
              section: ch?.paperName ?? null,
            };
          }),
        });
        router.push("/admin");
      } catch {
        setError("Couldn't save the test — try again.");
      }
    });
  }

  return (
    <main className="px-5 fade-up pb-10">
      <div className="flex items-center gap-2 mb-5 text-xs font-bold text-muted">
        {(["pick", "review", "settings"] as Step[]).map((s, i) => (
          <span
            key={s}
            className={`rounded-full px-3 py-1.5 ${
              step === s ? "bg-foreground text-background" : "bg-surface-2"
            }`}
          >
            {i + 1}. {s === "pick" ? "Topics" : s === "review" ? "Review" : "Publish"}
          </span>
        ))}
      </div>

      {error && (
        <p className="mb-4 text-sm text-red bg-red-soft rounded-2xl px-4 py-3">{error}</p>
      )}

      {step === "pick" && (
        <>
          <h1 className="font-display text-3xl mb-1">
            Pick <span className="italic text-muted">topics</span>
          </h1>
          <p className="text-sm text-muted mb-4">
            {selected.size} selected — questions are spread across them.
          </p>

          <div className="space-y-4">
            {byPaper.map(([paperName, chs]) => (
              <details key={paperName} className="rounded-3xl bg-surface border border-line overflow-hidden" open={chs.some((c) => selected.has(c.id))}>
                <summary className="px-5 py-4 font-bold cursor-pointer list-none flex items-center justify-between">
                  {paperName}
                  <span className="text-xs text-muted font-normal">
                    {chs.filter((c) => selected.has(c.id)).length}/{chs.length}
                  </span>
                </summary>
                <div className="border-t border-line divide-y divide-line max-h-72 overflow-y-auto">
                  {chs.map((c) => {
                    const on = selected.has(c.id);
                    return (
                      <button
                        key={c.id}
                        onClick={() =>
                          setSelected((prev) => {
                            const next = new Set(prev);
                            if (on) next.delete(c.id);
                            else next.add(c.id);
                            return next;
                          })
                        }
                        className="w-full flex items-center gap-3 px-5 py-3 text-left"
                      >
                        <span
                          className={`w-5 h-5 shrink-0 rounded-md border flex items-center justify-center ${
                            on
                              ? "bg-foreground border-foreground text-background"
                              : "border-line bg-surface-2"
                          }`}
                        >
                          {on && <CheckIcon className="w-3.5 h-3.5" strokeWidth={3} />}
                        </span>
                        <span className="text-sm">{c.name}</span>
                      </button>
                    );
                  })}
                </div>
              </details>
            ))}
          </div>

          <div className="mt-5 rounded-3xl bg-surface border border-line p-5 space-y-4">
            <div>
              <label className="text-sm font-semibold">Number of questions: {count}</label>
              <input
                type="range"
                min={5}
                max={30}
                value={count}
                onChange={(e) => setCount(Number(e.target.value))}
                className="w-full mt-2 accent-[#1d1c19]"
              />
            </div>
            <div className="flex gap-2">
              {["easy warm-up", "exam-level", "hard, tricky"].map((d) => (
                <button
                  key={d}
                  onClick={() => setDifficulty(d)}
                  className={`flex-1 rounded-full py-2.5 text-xs font-semibold border ${
                    difficulty === d
                      ? "bg-foreground text-background border-foreground"
                      : "bg-surface-2 border-line"
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>
            <textarea
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Extra instructions for the AI (optional) — e.g. focus on numericals from buyback"
              rows={2}
              className="w-full rounded-2xl bg-surface-2 border border-line px-4 py-3 text-sm outline-none resize-none"
            />
          </div>

          <button
            onClick={generate}
            disabled={pending || selected.size === 0}
            className="mt-5 w-full h-14 rounded-full bg-foreground text-background font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
          >
            <SparkleIcon className="w-5 h-5" />
            {pending ? "Generating… (~30s)" : `Generate ${count} questions`}
          </button>
        </>
      )}

      {step === "review" && (
        <>
          <h1 className="font-display text-3xl mb-1">
            Review <span className="italic text-muted">& edit</span>
          </h1>
          <p className="text-sm text-muted mb-4">
            {questions.length} questions. Tap any text to edit. Tap an option to mark
            it correct.
          </p>

          <div className="space-y-4">
            {questions.map((q, qi) => (
              <div key={qi} className="rounded-3xl bg-surface border border-line p-5">
                <div className="flex items-start justify-between gap-3 mb-2">
                  <span className="text-xs font-bold text-muted">
                    Q{qi + 1} · {q.chapterName}
                  </span>
                  <button
                    aria-label="Delete question"
                    onClick={() => setQuestions((qs) => qs.filter((_, i) => i !== qi))}
                    className="text-muted"
                  >
                    <TrashIcon className="w-4 h-4" />
                  </button>
                </div>
                <textarea
                  value={q.text}
                  onChange={(e) =>
                    setQuestions((qs) =>
                      qs.map((x, i) => (i === qi ? { ...x, text: e.target.value } : x))
                    )
                  }
                  rows={3}
                  className="w-full bg-transparent font-display text-[17px] leading-relaxed outline-none resize-none"
                />
                <div className="mt-2 space-y-2">
                  {q.options.map((opt, oi) => (
                    <div
                      key={oi}
                      className={`flex items-center gap-2 rounded-2xl border px-3 py-2 ${
                        q.correctIndex === oi
                          ? "bg-green-soft border-green/40"
                          : "border-line"
                      }`}
                    >
                      <button
                        onClick={() =>
                          setQuestions((qs) =>
                            qs.map((x, i) =>
                              i === qi ? { ...x, correctIndex: oi } : x
                            )
                          )
                        }
                        aria-label="Mark correct"
                        className={`w-7 h-7 shrink-0 rounded-full flex items-center justify-center text-xs font-bold ${
                          q.correctIndex === oi
                            ? "bg-green text-white"
                            : "bg-surface-2 text-muted"
                        }`}
                      >
                        {String.fromCharCode(65 + oi)}
                      </button>
                      <input
                        value={opt}
                        onChange={(e) =>
                          setQuestions((qs) =>
                            qs.map((x, i) =>
                              i === qi
                                ? {
                                    ...x,
                                    options: x.options.map((o, j) =>
                                      j === oi ? e.target.value : o
                                    ),
                                  }
                                : x
                            )
                          )
                        }
                        className="flex-1 bg-transparent text-sm outline-none"
                      />
                    </div>
                  ))}
                </div>
                <details className="mt-3">
                  <summary className="text-xs font-bold text-muted cursor-pointer">
                    Explanation
                  </summary>
                  <textarea
                    value={q.explanation}
                    onChange={(e) =>
                      setQuestions((qs) =>
                        qs.map((x, i) =>
                          i === qi ? { ...x, explanation: e.target.value } : x
                        )
                      )
                    }
                    rows={3}
                    className="mt-2 w-full rounded-2xl bg-surface-2 px-3 py-2 text-sm outline-none resize-none"
                  />
                </details>
              </div>
            ))}
          </div>

          <div className="mt-5 flex gap-3">
            <button
              onClick={() => setStep("pick")}
              className="flex-1 h-13 py-3.5 rounded-full bg-surface-2 font-semibold"
            >
              Back
            </button>
            <button
              onClick={() => setStep("settings")}
              disabled={questions.length === 0}
              className="flex-1 h-13 py-3.5 rounded-full bg-foreground text-background font-semibold disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </>
      )}

      {step === "settings" && (
        <>
          <h1 className="font-display text-3xl mb-4">
            Publish <span className="italic text-muted">it</span>
          </h1>
          <div className="rounded-3xl bg-surface border border-line p-5 space-y-4">
            <div>
              <label className="text-sm font-semibold">Title</label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="mt-1.5 w-full rounded-2xl bg-surface-2 border border-line px-4 py-3 text-[15px] outline-none"
              />
            </div>
            <div>
              <label className="text-sm font-semibold">Paper</label>
              <select
                value={paperId}
                onChange={(e) =>
                  setPaperId(e.target.value ? Number(e.target.value) : "")
                }
                className="mt-1.5 w-full rounded-2xl bg-surface-2 border border-line px-4 py-3 text-[15px] outline-none"
              >
                <option value="">Mixed / none</option>
                {papers.map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div>
                <label className="text-xs font-semibold">Minutes</label>
                <input
                  type="number"
                  min={5}
                  value={durationMinutes}
                  onChange={(e) => setDurationMinutes(Number(e.target.value) || 30)}
                  className="mt-1.5 w-full rounded-2xl bg-surface-2 border border-line px-3 py-3 text-[15px] outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-semibold">+ Marks</label>
                <input
                  type="number"
                  min={1}
                  value={marks}
                  onChange={(e) => setMarks(Number(e.target.value) || 4)}
                  className="mt-1.5 w-full rounded-2xl bg-surface-2 border border-line px-3 py-3 text-[15px] outline-none"
                />
              </div>
              <div>
                <label className="text-xs font-semibold">− Negative</label>
                <input
                  type="number"
                  min={0}
                  step={0.25}
                  value={negativeMarks}
                  onChange={(e) => setNegativeMarks(Number(e.target.value) || 0)}
                  className="mt-1.5 w-full rounded-2xl bg-surface-2 border border-line px-3 py-3 text-[15px] outline-none"
                />
              </div>
            </div>
            <div>
              <label className="text-sm font-semibold">For date (optional)</label>
              <input
                type="date"
                value={scheduledFor}
                onChange={(e) => setScheduledFor(e.target.value)}
                className="mt-1.5 w-full rounded-2xl bg-surface-2 border border-line px-4 py-3 text-[15px] outline-none"
              />
            </div>
          </div>

          <div className="mt-5 flex gap-3">
            <button
              onClick={() => setStep("review")}
              className="h-13 py-3.5 px-6 rounded-full bg-surface-2 font-semibold"
            >
              Back
            </button>
            <button
              onClick={() => save(false)}
              disabled={pending}
              className="flex-1 h-13 py-3.5 rounded-full bg-surface border border-line font-semibold disabled:opacity-50"
            >
              Save draft
            </button>
            <button
              onClick={() => save(true)}
              disabled={pending}
              className="flex-1 h-13 py-3.5 rounded-full bg-foreground text-background font-semibold disabled:opacity-50"
            >
              {pending ? "Saving…" : "Publish 🚀"}
            </button>
          </div>
        </>
      )}
    </main>
  );
}
