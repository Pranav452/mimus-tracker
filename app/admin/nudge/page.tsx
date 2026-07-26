"use client";

import { useState, useTransition } from "react";
import { sendNudge } from "@/app/actions/admin";

const PRESETS: { label: string; title: string; body: string }[] = [
  {
    label: "Check-in",
    title: "Here for you, Always",
    body: `Hey there, just wanted to check in. I've noticed things have been a little different with your engagement/progress lately, and I wanted to make sure you're doing okay. Please know I'm here for you. 💛`,
  },
  {
    label: "Love note",
    title: "All my love, bbg 💛",
    body: `Kisses, hearts, all of it — yours. 😘 Missing you, but watching you go after this is honestly my favourite thing. One more page for me, then come tell me all about it. So proud of you, always.`,
  },
  {
    label: "Test ready",
    title: "Tonight's test is up 📝",
    body: `Made you a fresh test from today's topics. 25 minutes, go get it — then rest. You've got this. 💛`,
  },
];

export default function NudgePage() {
  const [title, setTitle] = useState(PRESETS[0].title);
  const [message, setMessage] = useState(PRESETS[0].body);
  const [result, setResult] = useState("");
  const [pending, startTransition] = useTransition();

  return (
    <main className="px-5 fade-up pb-10">
      <h1 className="font-display text-3xl mb-1">
        Send her a <span className="italic text-muted">nudge</span>
      </h1>
      <p className="text-sm text-muted mb-4">
        Goes to Mimansha&apos;s phone only (she needs notifications allowed once).
      </p>

      <div className="flex gap-2 overflow-x-auto no-scrollbar pb-4">
        {PRESETS.map((p) => (
          <button
            key={p.label}
            onClick={() => {
              setTitle(p.title);
              setMessage(p.body);
              setResult("");
            }}
            className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold border ${
              title === p.title
                ? "bg-foreground text-background border-foreground"
                : "bg-surface border-line"
            }`}
          >
            {p.label}
          </button>
        ))}
      </div>

      <label className="text-sm font-semibold">Title</label>
      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="mt-1.5 mb-4 w-full rounded-2xl bg-surface border border-line px-5 py-3.5 text-[15px] outline-none"
      />

      <label className="text-sm font-semibold">Message</label>
      <textarea
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        rows={5}
        className="mt-1.5 w-full rounded-3xl bg-surface border border-line px-5 py-4 text-[15px] leading-relaxed outline-none resize-none"
      />

      <button
        disabled={pending || !message.trim() || !title.trim()}
        onClick={() =>
          startTransition(async () => {
            try {
              const sent = await sendNudge(message.trim(), title.trim());
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
