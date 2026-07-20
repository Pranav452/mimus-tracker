"use client";

import { useState, useTransition } from "react";
import { sendNudge } from "@/app/actions/admin";

const PRESET = `Hey there, just wanted to check in. I've noticed things have been a little different with your engagement/progress lately, and I wanted to make sure you're doing okay. Please know I'm here for you. 💛`;

export default function NudgePage() {
  const [message, setMessage] = useState(PRESET);
  const [result, setResult] = useState("");
  const [pending, startTransition] = useTransition();

  return (
    <main className="px-5 fade-up">
      <h1 className="font-display text-3xl mb-1">
        Here for you, <span className="italic text-muted">Always</span>
      </h1>
      <p className="text-sm text-muted mb-5">
        Sends a push notification to Mimansha&apos;s phone (she needs to have opened
        the app and allowed notifications once).
      </p>

      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        rows={5}
        className="w-full rounded-3xl bg-surface border border-line px-5 py-4 text-[15px] leading-relaxed outline-none resize-none"
      />

      <button
        disabled={pending || !message.trim()}
        onClick={() =>
          startTransition(async () => {
            try {
              const sent = await sendNudge(message.trim());
              setResult(
                sent > 0
                  ? `Sent to ${sent} device${sent > 1 ? "s" : ""} 💌`
                  : "No subscribed devices yet — she needs to allow notifications in the app first."
              );
            } catch {
              setResult("Failed — check the VAPID keys in .env.local.");
            }
          })
        }
        className="mt-4 w-full h-14 rounded-full bg-foreground text-background font-semibold disabled:opacity-50"
      >
        {pending ? "Sending…" : "Send nudge"}
      </button>

      {result && <p className="mt-4 text-sm text-center text-muted">{result}</p>}
    </main>
  );
}
