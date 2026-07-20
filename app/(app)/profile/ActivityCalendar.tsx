"use client";

import { useState } from "react";

type Act = { date: string; kind: "login" | "test" | "topic" | "course" };

// priority when a day has multiple kinds: test > topic/course > login
function colorFor(kinds: Set<string>) {
  if (kinds.has("test")) return "bg-accent-soft text-accent";
  if (kinds.has("topic") || kinds.has("course")) return "bg-blue-soft text-blue";
  if (kinds.has("login")) return "bg-green-soft text-green";
  return "";
}

export default function ActivityCalendar({
  activity,
  streak,
}: {
  activity: Act[];
  streak: number;
}) {
  const now = new Date();
  const [month, setMonth] = useState(now.getMonth());
  const [year, setYear] = useState(now.getFullYear());

  const byDate = new Map<string, Set<string>>();
  for (const a of activity) {
    if (!byDate.has(a.date)) byDate.set(a.date, new Set());
    byDate.get(a.date)!.add(a.kind);
  }

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const monthKey = (d: number) =>
    `${year}-${String(month + 1).padStart(2, "0")}-${String(d).padStart(2, "0")}`;
  const activeDaysThisMonth = Array.from({ length: daysInMonth }, (_, i) => i + 1).filter(
    (d) => byDate.has(monthKey(d))
  ).length;

  const label = new Date(year, month, 1).toLocaleDateString("en-IN", {
    month: "long",
    year: "numeric",
  });

  return (
    <div>
      <div className="flex items-center justify-between mt-1">
        <p className="text-sm text-muted">
          You showed up on <b className="text-foreground">{activeDaysThisMonth} days</b> this
          month {streak > 1 ? "🔥" : ""}
        </p>
        <div className="flex items-center gap-1 text-sm">
          <button
            className="px-2 py-1 text-muted"
            onClick={() => {
              const m = month - 1;
              if (m < 0) {
                setMonth(11);
                setYear(year - 1);
              } else setMonth(m);
            }}
          >
            ‹
          </button>
          <span className="text-xs font-semibold">{label}</span>
          <button
            className="px-2 py-1 text-muted"
            onClick={() => {
              const m = month + 1;
              if (m > 11) {
                setMonth(0);
                setYear(year + 1);
              } else setMonth(m);
            }}
          >
            ›
          </button>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-7 gap-2">
        {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((d) => {
          const kinds = byDate.get(monthKey(d));
          const cls = kinds ? colorFor(kinds) : "bg-surface-2 text-muted";
          return (
            <span
              key={d}
              className={`h-8 rounded-lg flex items-center justify-center text-xs font-semibold ${cls}`}
            >
              {d}
            </span>
          );
        })}
      </div>

      <div className="mt-4 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted">
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded bg-green-soft border border-green/40" /> Logged in
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded bg-accent-soft border border-accent/40" /> Test attempts
        </span>
        <span className="flex items-center gap-1.5">
          <span className="w-2.5 h-2.5 rounded bg-blue-soft border border-blue/40" /> Studying
        </span>
      </div>
    </div>
  );
}
