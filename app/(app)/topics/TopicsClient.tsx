"use client";

import { useMemo, useState, useTransition } from "react";
import { addDailyTopic, removeDailyTopic } from "@/app/actions/study";
import { PlusIcon, TrashIcon } from "@/components/icons";

type Chapter = {
  id: number;
  name: string;
  paperName: string;
  partLabel: string;
  partName: string | null;
};
type Topic = {
  id: number;
  forDate: string;
  note: string | null;
  chapterName: string;
  paperName: string;
  paperSlug: string;
};

const dot: Record<string, string> = {
  accounts: "bg-green",
  law: "bg-blue",
  tax: "bg-lav",
};

export default function TopicsClient({
  chapters,
  topics,
  today,
}: {
  chapters: Chapter[];
  topics: Topic[];
  today: string;
}) {
  const papers = useMemo(
    () => [...new Set(chapters.map((c) => c.paperName))],
    [chapters]
  );
  const [paper, setPaper] = useState(papers[0] ?? "");
  const [chapterId, setChapterId] = useState<number | "">("");
  const [note, setNote] = useState("");
  const [pending, startTransition] = useTransition();

  const paperChapters = chapters.filter((c) => c.paperName === paper);
  const todayTopics = topics.filter((t) => t.forDate === today);
  const pastByDate = useMemo(() => {
    const m = new Map<string, Topic[]>();
    for (const t of topics) {
      if (t.forDate === today) continue;
      if (!m.has(t.forDate)) m.set(t.forDate, []);
      m.get(t.forDate)!.push(t);
    }
    return [...m.entries()];
  }, [topics, today]);

  function add() {
    if (chapterId === "") return;
    startTransition(async () => {
      await addDailyTopic(chapterId as number, note.trim() || undefined);
      setChapterId("");
      setNote("");
    });
  }

  return (
    <div className="px-5">
      <section className="rounded-3xl bg-surface border border-line p-5">
        <p className="font-bold mb-3">What are you studying today?</p>
        <div className="flex gap-2 overflow-x-auto no-scrollbar pb-1">
          {papers.map((p) => (
            <button
              key={p}
              onClick={() => {
                setPaper(p);
                setChapterId("");
              }}
              className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium border ${
                paper === p
                  ? "bg-foreground text-background border-foreground"
                  : "bg-surface-2 border-line"
              }`}
            >
              {p}
            </button>
          ))}
        </div>
        <select
          value={chapterId}
          onChange={(e) => setChapterId(e.target.value ? Number(e.target.value) : "")}
          className="mt-3 w-full h-13 rounded-2xl bg-surface-2 border border-line px-4 py-3.5 text-[15px] outline-none"
        >
          <option value="">Pick a chapter…</option>
          {paperChapters.map((c) => (
            <option key={c.id} value={c.id}>
              {c.partLabel}
              {c.partName ? ` · ${c.partName}` : ""} — {c.name}
            </option>
          ))}
        </select>
        <input
          value={note}
          onChange={(e) => setNote(e.target.value)}
          placeholder="Note (optional) — e.g. examples + past paper Qs"
          className="mt-3 w-full rounded-2xl bg-surface-2 border border-line px-4 py-3.5 text-[15px] outline-none"
        />
        <button
          onClick={add}
          disabled={pending || chapterId === ""}
          className="mt-4 w-full h-13 py-3.5 rounded-full bg-foreground text-background font-semibold flex items-center justify-center gap-2 disabled:opacity-50"
        >
          <PlusIcon className="w-5 h-5" strokeWidth={2.2} />
          {pending ? "Adding…" : "Add to today's plan"}
        </button>
      </section>

      <section className="mt-6">
        <h2 className="font-bold text-lg mb-3">
          Today{" "}
          <span className="text-sm font-normal text-muted">
            ·{" "}
            {new Date(`${today}T00:00:00+05:30`).toLocaleDateString("en-IN", {
              day: "numeric",
              month: "long",
            })}
          </span>
        </h2>
        {todayTopics.length === 0 ? (
          <p className="text-sm text-muted rounded-3xl bg-surface border border-line p-5">
            Nothing yet. Log what you&apos;re studying — Pranav will turn it into
            tonight&apos;s test. 💪
          </p>
        ) : (
          <div className="space-y-2.5">
            {todayTopics.map((t) => (
              <div
                key={t.id}
                className="flex items-center gap-3 rounded-2xl bg-surface border border-line px-4 py-3.5"
              >
                <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${dot[t.paperSlug] ?? "bg-accent"}`} />
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-[15px] leading-snug">{t.chapterName}</p>
                  <p className="text-xs text-muted">
                    {t.paperName}
                    {t.note ? ` · ${t.note}` : ""}
                  </p>
                </div>
                <button
                  aria-label="Remove"
                  onClick={() => startTransition(() => removeDailyTopic(t.id))}
                  className="text-muted p-1"
                >
                  <TrashIcon className="w-4.5 h-4.5" />
                </button>
              </div>
            ))}
          </div>
        )}
      </section>

      {pastByDate.length > 0 && (
        <section className="mt-8 pb-8">
          <h2 className="font-bold text-lg mb-3">Earlier</h2>
          <div className="space-y-5">
            {pastByDate.map(([date, list]) => (
              <div key={date}>
                <p className="text-xs font-bold text-muted uppercase tracking-wide mb-2">
                  {new Date(`${date}T00:00:00+05:30`).toLocaleDateString("en-IN", {
                    weekday: "short",
                    day: "numeric",
                    month: "long",
                  })}
                </p>
                <div className="space-y-2">
                  {list.map((t) => (
                    <div
                      key={t.id}
                      className="flex items-center gap-3 rounded-2xl bg-surface-2 px-4 py-3"
                    >
                      <span className={`w-2 h-2 rounded-full shrink-0 ${dot[t.paperSlug] ?? "bg-accent"}`} />
                      <p className="text-sm">{t.chapterName}</p>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
