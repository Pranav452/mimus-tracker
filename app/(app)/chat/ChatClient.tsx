"use client";

import { useEffect, useRef, useState } from "react";
import { GemLogo, SendIcon } from "@/components/icons";

type Msg = { role: "user" | "assistant"; content: string };

const SUGGESTIONS = [
  "Start today's study plan",
  "Analyze my weak areas",
  "What should I study next?",
  "Predict important exam topics",
];

function greeting() {
  const h = Number(
    new Date().toLocaleString("en-IN", { timeZone: "Asia/Kolkata", hour: "numeric", hour12: false })
  );
  if (h < 12) return "Good Morning";
  if (h < 17) return "Good Afternoon";
  return "Good Evening";
}

export default function ChatClient({ userName }: { userName: string }) {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    fetch("/api/chat")
      .then((r) => (r.ok ? r.json() : []))
      .then((rows: { role: "user" | "assistant"; content: string }[]) => {
        setMessages(rows.map((r) => ({ role: r.role, content: r.content })));
      })
      .finally(() => setLoaded(true));
  }, []);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  async function send(text: string) {
    const msg = text.trim();
    if (!msg || busy) return;
    setInput("");
    setBusy(true);
    setMessages((m) => [...m, { role: "user", content: msg }, { role: "assistant", content: "" }]);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: msg }),
      });
      if (!res.ok || !res.body) throw new Error("failed");
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        const chunk = decoder.decode(value);
        setMessages((m) => {
          const copy = [...m];
          copy[copy.length - 1] = {
            role: "assistant",
            content: copy[copy.length - 1].content + chunk,
          };
          return copy;
        });
      }
    } catch {
      setMessages((m) => {
        const copy = [...m];
        copy[copy.length - 1] = {
          role: "assistant",
          content: "Sorry, I couldn't reply just now. Try again in a moment?",
        };
        return copy;
      });
    } finally {
      setBusy(false);
    }
  }

  const empty = loaded && messages.length === 0;

  return (
    <main className="flex flex-col min-h-dvh pb-40">
      <header className="flex items-center justify-center gap-2 px-5 py-4 pt-safe">
        <GemLogo className="w-5 h-5" />
        <span className="font-semibold">Mimus</span>
        <span className="text-[10px] font-bold tracking-wide bg-surface-2 border border-line rounded-full px-2 py-0.5 text-muted">
          PRO
        </span>
      </header>

      {empty ? (
        <section className="px-5 mt-10 fade-up">
          <p className="font-display text-xl">
            Hi, <span className="italic text-muted">{userName}</span>
          </p>
          <h1 className="font-display text-[44px] leading-tight mb-6">{greeting()}</h1>
          <div className="flex flex-col items-start gap-2.5">
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                onClick={() => send(s)}
                className="rounded-full bg-surface border border-line px-4 py-2.5 text-[15px] active:scale-95 transition-transform"
              >
                {s}
              </button>
            ))}
          </div>
        </section>
      ) : (
        <section className="flex-1 px-5 space-y-4 mt-2">
          {messages.map((m, i) => (
            <div
              key={i}
              className={`max-w-[85%] rounded-3xl px-4 py-3 text-[15px] leading-relaxed whitespace-pre-wrap ${
                m.role === "user"
                  ? "ml-auto bg-foreground text-background rounded-br-lg"
                  : "bg-surface border border-line rounded-bl-lg"
              }`}
            >
              {m.content || (busy && i === messages.length - 1 ? "…" : "")}
            </div>
          ))}
          <div ref={bottomRef} />
        </section>
      )}

      <div className="fixed bottom-16 inset-x-0 z-30">
        <div className="app-shell !min-h-0 px-4 pb-3">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              send(input);
            }}
            className="flex items-center gap-2 rounded-3xl bg-surface border border-line px-4 py-2 shadow-[0_8px_30px_rgba(0,0,0,0.06)]"
          >
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Have any doubts?"
              className="flex-1 h-11 bg-transparent outline-none text-[15px]"
            />
            <button
              type="submit"
              disabled={busy || !input.trim()}
              aria-label="Send"
              className="w-10 h-10 rounded-full bg-foreground text-background flex items-center justify-center disabled:opacity-40"
            >
              <SendIcon className="w-5 h-5" />
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
