"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { ArrowLeftIcon, ArrowRightIcon } from "@/components/icons";

type Point = {
  date: string;
  pct: number;
  paperSlug: string;
  paperName: string;
  title: string;
};
type Suggestion = {
  chapter: string;
  paperSlug: string;
  paperName: string;
  pct: number;
  total: number;
};

const dot: Record<string, string> = {
  accounts: "bg-green",
  law: "bg-blue",
  tax: "bg-lav",
  other: "bg-accent",
};

function adviceFor(s: Suggestion) {
  if (s.pct < 40)
    return "Revisit the concept notes first, then solve 5–7 easy problems to rebuild the base.";
  if (s.pct < 60)
    return "Solve 5–7 medium problems to strengthen pattern recognition.";
  return "Almost there — do a quick revision and 3–4 tricky questions to lock it in.";
}

export default function AnalyticsClient({
  points,
  suggestions,
}: {
  points: Point[];
  suggestions: Suggestion[];
}) {
  const papers = useMemo(
    () => [...new Set(suggestions.map((s) => s.paperName))],
    [suggestions]
  );
  const [activePaper, setActivePaper] = useState<string | null>(null);
  const [page, setPage] = useState(0);

  const filtered = activePaper
    ? suggestions.filter((s) => s.paperName === activePaper)
    : suggestions;
  const perPage = 2;
  const pages = Math.max(1, Math.ceil(filtered.length / perPage));
  const clamped = Math.min(page, pages - 1);
  const visible = filtered.slice(clamped * perPage, clamped * perPage + perPage);

  return (
    <>
      <section className="mx-5 rounded-3xl bg-surface border border-line p-4">
        <p className="font-bold px-1 mb-2">Score trend</p>
        {points.length === 0 ? (
          <div className="text-center py-8">
            <Image
              src="/assets/05-empty-no-data.png"
              alt=""
              width={110}
              height={110}
              className="mx-auto mb-3 rounded-2xl"
            />
            <p className="text-sm text-muted">
              Take your first test and your trend shows up here.
            </p>
          </div>
        ) : (
          <div className="h-56">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={points} margin={{ top: 8, right: 8, left: -22, bottom: 0 }}>
                <CartesianGrid stroke="#e6e2d8" strokeDasharray="3 3" vertical={false} />
                <XAxis
                  dataKey="date"
                  tick={{ fontSize: 11, fill: "#8a877e" }}
                  axisLine={false}
                  tickLine={false}
                />
                <YAxis
                  domain={[0, 100]}
                  tick={{ fontSize: 11, fill: "#8a877e" }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  formatter={(v) => [`${v}%`, "Score"]}
                  labelStyle={{ fontWeight: 700 }}
                  contentStyle={{
                    borderRadius: 16,
                    border: "1px solid #e6e2d8",
                    background: "#fdfcfa",
                    fontSize: 13,
                  }}
                />
                <Legend wrapperStyle={{ fontSize: 12 }} />
                <Line
                  type="monotone"
                  dataKey="pct"
                  name="Score %"
                  stroke="#c9a648"
                  strokeWidth={2}
                  dot={{ r: 3, fill: "#fdfcfa", stroke: "#c9a648", strokeWidth: 2 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        )}
      </section>

      <section className="px-5 mt-8 pb-8">
        <h2 className="text-xl font-bold">Suggestions for Improvement</h2>

        <div className="flex gap-2 overflow-x-auto no-scrollbar py-4">
          <button
            onClick={() => {
              setActivePaper(null);
              setPage(0);
            }}
            className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium border ${
              activePaper === null
                ? "bg-surface text-foreground border-foreground"
                : "bg-surface-2 text-muted border-line"
            }`}
          >
            All papers
          </button>
          {papers.map((p) => (
            <button
              key={p}
              onClick={() => {
                setActivePaper(p);
                setPage(0);
              }}
              className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium border ${
                activePaper === p
                  ? "bg-surface text-foreground border-foreground"
                  : "bg-surface-2 text-muted border-line"
              }`}
            >
              {p}
            </button>
          ))}
        </div>

        <div className="rounded-3xl bg-surface border border-line p-5">
          {filtered.length === 0 ? (
            <p className="text-sm text-muted text-center py-6">
              Not enough test data yet — suggestions appear after a few tests.
            </p>
          ) : (
            <>
              <div className="space-y-6">
                {visible.map((s) => (
                  <div key={s.chapter} className="pb-5 border-b border-line last:border-0 last:pb-0">
                    <p className="font-bold text-lg">{s.chapter}</p>
                    <p className="mt-2 flex items-center gap-2 text-[15px]">
                      <span className={`w-2.5 h-2.5 rounded-full ${dot[s.paperSlug] ?? "bg-accent"}`} />
                      {s.pct}% accuracy across {s.total} questions
                    </p>
                    <span className="mt-3 inline-block text-xs font-semibold text-lav bg-lav-soft rounded-full px-3 py-1">
                      Suggestion
                    </span>
                    <p className="mt-2 text-[15px] leading-relaxed">{adviceFor(s)}</p>
                  </div>
                ))}
              </div>
              <div className="mt-5 flex items-center justify-between">
                <p className="text-sm text-muted">
                  {clamped + 1} of {pages}
                </p>
                <div className="flex gap-2">
                  <button
                    onClick={() => setPage((p) => Math.max(0, p - 1))}
                    disabled={clamped === 0}
                    aria-label="Previous"
                    className="w-11 h-11 rounded-full bg-surface-2 flex items-center justify-center disabled:opacity-40"
                  >
                    <ArrowLeftIcon className="w-5 h-5" />
                  </button>
                  <button
                    onClick={() => setPage((p) => Math.min(pages - 1, p + 1))}
                    disabled={clamped >= pages - 1}
                    aria-label="Next"
                    className="w-11 h-11 rounded-full bg-surface-2 flex items-center justify-center disabled:opacity-40"
                  >
                    <ArrowRightIcon className="w-5 h-5" />
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </section>
    </>
  );
}
