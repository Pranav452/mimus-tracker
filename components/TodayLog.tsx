"use client";

// One-tap log of what she studied today. The chips are the chapters on today's
// plan, so the common case — "I did what was planned" — is a single tap each.
// Taps are optimistic: the chip fills at once and the server catches up.
import Link from "next/link";
import { useOptimistic, useTransition } from "react";
import { addDailyTopic, removeDailyTopic } from "@/app/actions/study";
import { CheckIcon, PlusIcon } from "@/components/icons";

type Suggestion = { chapterId: number; name: string };
type Logged = { id: number; chapterId: number; name: string };

export default function TodayLog({
  suggestions,
  logged,
}: {
  suggestions: Suggestion[];
  logged: Logged[];
}) {
  const [, startTransition] = useTransition();
  const [state, apply] = useOptimistic(
    logged,
    (cur, act: { add?: Suggestion; remove?: number }) =>
      act.add
        ? [...cur, { id: -act.add.chapterId, chapterId: act.add.chapterId, name: act.add.name }]
        : cur.filter((l) => l.chapterId !== act.remove)
  );

  const isLogged = (chapterId: number) => state.some((l) => l.chapterId === chapterId);
  const extras = state.filter((l) => !suggestions.some((s) => s.chapterId === l.chapterId));

  function toggle(s: Suggestion) {
    const on = isLogged(s.chapterId);
    const rows = logged.filter((l) => l.chapterId === s.chapterId);
    startTransition(async () => {
      if (on) {
        apply({ remove: s.chapterId });
        await Promise.all(rows.map((r) => removeDailyTopic(r.id)));
      } else {
        apply({ add: s });
        await addDailyTopic(s.chapterId);
      }
    });
  }

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {suggestions.map((s) => {
          const on = isLogged(s.chapterId);
          return (
            <button
              key={s.chapterId}
              onClick={() => toggle(s)}
              aria-pressed={on}
              className={`flex items-center gap-1.5 rounded-full pl-2.5 pr-3.5 py-2 text-[13px] font-semibold border text-left ${
                on
                  ? "bg-green-soft border-green/40 text-foreground"
                  : "bg-surface-2 border-line text-foreground"
              }`}
            >
              <span
                className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                  on ? "bg-green text-white" : "bg-surface border border-line text-muted"
                }`}
              >
                {on ? (
                  <CheckIcon className="w-3 h-3" strokeWidth={3} />
                ) : (
                  <PlusIcon className="w-3 h-3" strokeWidth={2.6} />
                )}
              </span>
              {s.name}
            </button>
          );
        })}
        {extras.map((l) => (
          <span
            key={l.id}
            className="flex items-center gap-1.5 rounded-full pl-2.5 pr-3.5 py-2 text-[13px] font-semibold border bg-green-soft border-green/40"
          >
            <span className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 bg-green text-white">
              <CheckIcon className="w-3 h-3" strokeWidth={3} />
            </span>
            {l.name}
          </span>
        ))}
      </div>
      <Link
        href="/topics"
        className="mt-3 inline-block text-sm font-semibold text-muted underline underline-offset-4"
      >
        {suggestions.length > 0 ? "Studied something else? Add it" : "Add what you studied"}
      </Link>
    </div>
  );
}
