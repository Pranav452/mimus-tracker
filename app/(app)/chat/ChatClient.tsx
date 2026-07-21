"use client";

import { useEffect, useRef, useState } from "react";
import ReactMarkdown from "react-markdown";
import { GemLogo, SendIcon, PlusIcon, ChatIcon } from "@/components/icons";

type Msg = { role: "user" | "assistant"; content: string };
type Thread = { id: number; title: string; updatedAt: string };

const SUGGESTIONS = [
  "What should I do today as per my plan?",
  "What changed in Income Tax since my last attempt?",
  "Quick — new regime slab rates?",
  "Analyze my weak areas",
];

function greeting() {
  const h = Number(
    new Date().toLocaleString("en-IN", {
      timeZone: "Asia/Kolkata",
      hour: "numeric",
      hour12: false,
    })
  );
  if (h < 12) return "Good Morning";
  if (h < 17) return "Good Afternoon";
  return "Good Evening";
}

export default function ChatClient({ userName }: { userName: string }) {
  const [messages, setMessages] = useState<Msg[]>([]);
  const [threads, setThreads] = useState<Thread[]>([]);
  const [threadId, setThreadId] = useState<number | null>(null);
  const [showThreads, setShowThreads] = useState(false);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const bottomRef = useRef<HTMLDivElement>(null);
  const firstScroll = useRef(true);

  async function loadThreads() {
    const rows: Thread[] = await fetch("/api/chat/threads").then((r) =>
      r.ok ? r.json() : []
    );
    setThreads(rows);
    return rows;
  }

  async function openThread(id: number) {
    setShowThreads(false);
    setThreadId(id);
    firstScroll.current = true;
    const rows: Msg[] = await fetch(`/api/chat?threadId=${id}`).then((r) =>
      r.ok ? r.json() : []
    );
    setMessages(rows.map((r) => ({ role: r.role, content: r.content })));
  }

  function newChat() {
    setShowThreads(false);
    setThreadId(null);
    setMessages([]);
  }

  useEffect(() => {
    // open the most recent thread on mount, if any
    loadThreads().then((rows) => {
      if (rows.length > 0) openThread(rows[0].id);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (messages.length === 0) return;
    bottomRef.current?.scrollIntoView({
      behavior: firstScroll.current ? "instant" : "smooth",
    });
    firstScroll.current = false;
  }, [messages]);

  async function send(text: string) {
    const msg = text.trim();
    if (!msg || busy) return;
    setInput("");
    setBusy(true);
    setMessages((m) => [
      ...m,
      { role: "user", content: msg },
      { role: "assistant", content: "" },
    ]);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ message: msg, threadId }),
      });
      if (!res.ok || !res.body) throw new Error("failed");
      const newThreadId = Number(res.headers.get("X-Thread-Id"));
      if (Number.isFinite(newThreadId) && newThreadId !== threadId) {
        setThreadId(newThreadId);
      }
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
      loadThreads();
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

  const empty = messages.length === 0;

  return (
    <main className="flex flex-col min-h-dvh pb-44">
      <header className="sticky top-0 z-20 bg-background/95 backdrop-blur pt-safe">
        <div className="flex items-center justify-between px-4 py-3">
          <button
            onClick={() => setShowThreads((v) => !v)}
            aria-label="Chat history"
            className="w-10 h-10 rounded-full bg-surface border border-line flex items-center justify-center"
          >
            <ChatIcon className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-2">
            <GemLogo className="w-5 h-5" />
            <span className="font-semibold">Mimus</span>
            <span className="text-[10px] font-bold tracking-wide bg-surface-2 border border-line rounded-full px-2 py-0.5 text-muted">
              PRO
            </span>
          </div>
          <button
            onClick={newChat}
            aria-label="New chat"
            className="w-10 h-10 rounded-full bg-foreground text-background flex items-center justify-center"
          >
            <PlusIcon className="w-5 h-5" strokeWidth={2.2} />
          </button>
        </div>

        {showThreads && (
          <div className="mx-4 mb-3 rounded-3xl bg-surface border border-line overflow-hidden shadow-[0_12px_40px_rgba(0,0,0,0.08)]">
            <button
              onClick={newChat}
              className="w-full flex items-center gap-2 px-5 py-3.5 font-semibold text-[15px] border-b border-line"
            >
              <PlusIcon className="w-4 h-4" strokeWidth={2.4} /> New chat
            </button>
            <div className="max-h-72 overflow-y-auto divide-y divide-line">
              {threads.length === 0 && (
                <p className="px-5 py-4 text-sm text-muted">No chats yet.</p>
              )}
              {threads.map((t) => (
                <button
                  key={t.id}
                  onClick={() => openThread(t.id)}
                  className={`w-full px-5 py-3.5 text-left text-[15px] ${
                    t.id === threadId ? "bg-surface-2 font-semibold" : ""
                  }`}
                >
                  <span className="block truncate">{t.title}</span>
                  <span className="block text-xs text-muted mt-0.5">
                    {new Date(t.updatedAt).toLocaleDateString("en-IN", {
                      day: "numeric",
                      month: "short",
                    })}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
      </header>

      {empty ? (
        <section className="px-5 mt-8 fade-up">
          <p className="font-display text-xl">
            Hi, <span className="italic text-muted">{userName}</span>
          </p>
          <h1 className="font-display text-[44px] leading-tight mb-6">
            {greeting()}
          </h1>
          <div className="flex flex-col items-start gap-2.5">
            {SUGGESTIONS.map((s) => (
              <button
                key={s}
                onClick={() => send(s)}
                className="rounded-full bg-surface border border-line px-4 py-2.5 text-[15px] text-left active:scale-95 transition-transform"
              >
                {s}
              </button>
            ))}
          </div>
        </section>
      ) : (
        <section className="flex-1 px-4 space-y-3 mt-3">
          {messages.map((m, i) =>
            m.role === "user" ? (
              <div
                key={i}
                className="max-w-[85%] ml-auto rounded-3xl rounded-br-lg px-4 py-3 text-[15px] leading-relaxed whitespace-pre-wrap bg-foreground text-background"
              >
                {m.content}
              </div>
            ) : (
              <div
                key={i}
                className="max-w-[92%] rounded-3xl rounded-bl-lg px-4 py-3 bg-surface border border-line text-[15px] leading-relaxed [&_p]:mb-2 [&_p:last-child]:mb-0 [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:mb-2 [&_ol]:list-decimal [&_ol]:pl-5 [&_ol]:mb-2 [&_li]:mb-1 [&_strong]:font-bold [&_h1]:font-bold [&_h2]:font-bold [&_h3]:font-bold [&_h1]:text-base [&_h2]:text-base [&_h3]:text-[15px] [&_h1]:mb-1.5 [&_h2]:mb-1.5 [&_h3]:mb-1 [&_table]:text-xs [&_code]:bg-surface-2 [&_code]:rounded [&_code]:px-1"
              >
                {m.content ? (
                  <ReactMarkdown>{m.content}</ReactMarkdown>
                ) : busy && i === messages.length - 1 ? (
                  <span className="inline-flex gap-1">
                    <span className="w-1.5 h-1.5 rounded-full bg-muted animate-bounce [animation-delay:0ms]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-muted animate-bounce [animation-delay:120ms]" />
                    <span className="w-1.5 h-1.5 rounded-full bg-muted animate-bounce [animation-delay:240ms]" />
                  </span>
                ) : null}
              </div>
            )
          )}
          <div ref={bottomRef} />
        </section>
      )}

      <div className="fixed bottom-16 inset-x-0 z-30">
        <div className="app-shell !min-h-0 px-4 pb-3 bg-gradient-to-t from-[var(--background)] via-[var(--background)] to-transparent pt-3">
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
              className="flex-1 h-11 bg-transparent outline-none text-[15px] min-w-0"
            />
            <button
              type="submit"
              disabled={busy || !input.trim()}
              aria-label="Send"
              className="w-10 h-10 shrink-0 rounded-full bg-foreground text-background flex items-center justify-center disabled:opacity-40"
            >
              <SendIcon className="w-5 h-5" />
            </button>
          </form>
        </div>
      </div>
    </main>
  );
}
