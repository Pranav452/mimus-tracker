"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { startNightTest } from "@/app/actions/study";

export default function NightTestButton({ size }: { size: number }) {
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
              const id = await startNightTest();
              router.push(`/exam/${id}`);
            } catch {
              setError("Couldn't build tonight's test — check your internet and try again.");
            }
          })
        }
        className="w-full h-14 rounded-full bg-foreground text-background font-semibold text-[15px] disabled:opacity-60"
      >
        {pending ? "Building your test…" : `Start tonight's test  ·  ${size} Qs  ·  ${size} min`}
      </button>
      {error && <p className="mt-2 text-sm text-red">{error}</p>}
    </div>
  );
}
