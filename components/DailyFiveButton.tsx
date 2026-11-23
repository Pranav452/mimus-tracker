"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { startDailyFive } from "@/app/actions/study";

export default function DailyFiveButton() {
  const router = useRouter();
  const [pending, startTransition] = useTransition();
  const [error, setError] = useState("");

  return (
    <div>
      <button
        disabled={pending}
        onClick={() =>
          startTransition(async () => {
            try {
              setError("");
              const id = await startDailyFive();
              router.push(`/exam/${id}`);
            } catch {
              setError("Couldn't build today's quiz — check your internet and try again.");
            }
          })
        }
        className="w-full h-14 rounded-full bg-foreground text-background font-semibold text-[15px] disabled:opacity-60"
      >
        {pending ? "Picking your five…" : "Start today's 5  ·  5 min"}
      </button>
      {error && <p className="mt-2 text-sm text-red">{error}</p>}
    </div>
  );
}
