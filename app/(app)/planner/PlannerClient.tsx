"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useOptimistic, useTransition } from "react";
import { togglePlanItem } from "@/app/actions/plan";
import { CheckIcon } from "@/components/icons";

type Item = {
  id: number;
  onDate: string;
  title: string;
  subtitle: string | null;
  kind: "study" | "revise" | "practice" | "test" | "exam";
  done: boolean;
};

const kindStyle: Record<Item["kind"], { label: string; cls: string }> = {
  study: { label: "Study", cls: "bg-blue-soft text-blue" },
  revise: { label: "Revise", cls: "bg-lav-soft text-lav" },
  practice: { label: "Practice", cls: "bg-green-soft text-green" },
  test: { label: "Test", cls: "bg-accent-soft text-accent" },
  exam: { label: "EXAM", cls: "bg-red-soft text-red" },
};

function fmt(d: string) {
  return new Date(`${d}T00:00:00+05:30`).toLocaleDateString("en-IN", {
    weekday: "short",
    day: "numeric",
    month: "short",
  });
}

export default function PlannerClient({
  items,
  today,
}: {
  items: Item[];
  today: string;
}) {
  const [, startTransition] = useTransition();
  const [optimistic, setOptimistic] = useOptimistic(
    items,
    (state, { id, done }: { id: number; done: boolean }) =>
      state.map((i) => (i.id === id ? { ...i, done } : i))
  );
  const todayRef = useRef<HTMLDivElement>(null);
  const [showPast, setShowPast] = useState(false);

  useEffect(() => {
    todayRef.current?.scrollIntoView({ block: "start", behavior: "instant" });
  }, []);

  const byDate = useMemo(() => {
    const m = new Map<string, Item[]>();
    for (const i of optimistic) {
      if (!m.has(i.onDate)) m.set(i.onDate, []);
      m.get(i.onDate)!.push(i);
    }
    return [...m.entries()];
  }, [optimistic]);

  const doneCount = optimistic.filter((i) => i.done).length;
  const pct = optimistic.length
    ? Math.round((doneCount / optimistic.length) * 100)
    : 0;
  const pastDates = byDate.filter(([d]) => d < today);
  const visibleDates = byDate.filter(([d]) => d >= today);

  function toggle(item: Item) {
    startTransition(async () => {
      setOptimistic({ id: item.id, done: !item.done });
      await togglePlanItem(item.id, !item.done);
    });
  }

  return (
    <div className="px-5 mt-6 pb-10">
      <div className="rounded-3xl bg-surface border border-line p-5">
        <div className="flex items-center justify-between text-sm">
          <p className="font-bold">Overall progress</p>
          <p className="text-muted">
            {doneCount}/{optimistic.length} · <b className="text-foreground">{pct}%</b>
          </p>
        </div>
        <div className="mt-2.5 h-2 rounded-full bg-surface-2 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-[#e0a35f] to-[#4c9a6a] transition-all"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      {pastDates.length > 0 && (
        <button
          onClick={() => setShowPast((v) => !v)}
          className="mt-5 text-sm font-semibold text-muted underline underline-offset-4"
        >
          {showPast ? "Hide" : "Show"} past days ({pastDates.length})
        </button>
      )}

      <div className="mt-4 space-y-6">
        {(showPast ? byDate : visibleDates).map(([d, list]) => {
          const isToday = d === today;
          const allDone = list.every((i) => i.done);
          return (
            <div key={d} ref={isToday ? todayRef : undefined} className="scroll-mt-4">
              <div className="flex items-center gap-2 mb-2">
                <p
                  className={`text-sm font-bold ${
                    isToday ? "text-accent" : "text-muted"
                  }`}
                >
                  {isToday ? "Today · " : ""}
                  {fmt(d)}
                </p>
                {allDone && <span className="text-xs">✅</span>}
              </div>
              <div className="rounded-3xl bg-surface border border-line divide-y divide-line overflow-hidden">
                {list.map((item) => {
                  const ks = kindStyle[item.kind];
                  return (
                    <button
                      key={item.id}
                      onClick={() => toggle(item)}
                      className="w-full flex items-start gap-3 px-4 py-3.5 text-left"
                    >
                      <span
                        className={`mt-0.5 w-6 h-6 shrink-0 rounded-full border flex items-center justify-center ${
                          item.done
                            ? "bg-green border-green text-white"
                            : "border-line bg-surface-2"
                        }`}
                      >
                        {item.done && (
                          <CheckIcon className="w-3.5 h-3.5" strokeWidth={3} />
                        )}
                      </span>
                      <span className="flex-1 min-w-0">
                        <span
                          className={`block text-[15px] leading-snug ${
                            item.done ? "line-through text-muted" : "font-medium"
                          }`}
                        >
                          {item.title}
                        </span>
                        {item.subtitle && (
                          <span className="block text-xs text-muted mt-0.5">
                            {item.subtitle}
                          </span>
                        )}
                      </span>
                      <span
                        className={`shrink-0 text-[10px] font-bold rounded-full px-2 py-0.5 ${ks.cls}`}
                      >
                        {ks.label}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
