import { NextRequest } from "next/server";
import { getSessionUser, todayIST } from "@/lib/auth";
import { openai, AI_MODEL, CHAT_SYSTEM } from "@/lib/ai";
import { AMENDMENTS_BRIEF } from "@/lib/changes";
import { db, chatMessages, chatThreads, planItems } from "@/lib/db";
import {
  getRecentAttempts,
  getRecentTopics,
  getChapterAccuracy,
  getAllChapters,
} from "@/lib/queries";
import { and, asc, desc, eq } from "drizzle-orm";

export async function GET(request: NextRequest) {
  const user = await getSessionUser();
  if (!user) return new Response("Unauthorized", { status: 401 });
  const threadId = Number(request.nextUrl.searchParams.get("threadId"));
  if (!Number.isFinite(threadId)) return Response.json([]);
  const history = await db
    .select()
    .from(chatMessages)
    .where(
      and(eq(chatMessages.userId, user.id), eq(chatMessages.threadId, threadId))
    )
    .orderBy(asc(chatMessages.createdAt))
    .limit(100);
  return Response.json(history);
}

export async function POST(request: NextRequest) {
  const user = await getSessionUser();
  if (!user) return new Response("Unauthorized", { status: 401 });

  const { message, threadId: rawThreadId } = (await request.json()) as {
    message: string;
    threadId?: number | null;
  };
  if (!message?.trim()) return new Response("Empty message", { status: 400 });

  // resolve or create the thread
  let threadId = rawThreadId ?? null;
  if (threadId) {
    const [t] = await db
      .select()
      .from(chatThreads)
      .where(and(eq(chatThreads.id, threadId), eq(chatThreads.userId, user.id)));
    if (!t) threadId = null;
  }
  if (!threadId) {
    const [t] = await db
      .insert(chatThreads)
      .values({
        userId: user.id,
        title: message.trim().slice(0, 48),
      })
      .returning();
    threadId = t.id;
  } else {
    await db
      .update(chatThreads)
      .set({ updatedAt: new Date() })
      .where(eq(chatThreads.id, threadId));
  }

  await db.insert(chatMessages).values({
    userId: user.id,
    threadId,
    role: "user",
    content: message,
  });

  const history = await db
    .select()
    .from(chatMessages)
    .where(
      and(eq(chatMessages.userId, user.id), eq(chatMessages.threadId, threadId))
    )
    .orderBy(desc(chatMessages.createdAt))
    .limit(24);

  const today = todayIST();
  const [recentAttempts, recentTopics, chapterAcc, allChapters, todayPlan] =
    await Promise.all([
      getRecentAttempts(user.id, 5),
      getRecentTopics(user.id, 10),
      getChapterAccuracy(user.id),
      getAllChapters(),
      db
        .select()
        .from(planItems)
        .where(and(eq(planItems.userId, user.id), eq(planItems.onDate, today)))
        .orderBy(asc(planItems.sort)),
    ]);
  const weak = chapterAcc
    .filter((c) => c.total >= 3 && c.correct / c.total < 0.7)
    .map((c) => allChapters.find((ch) => ch.id === c.chapterId)?.name)
    .filter(Boolean)
    .slice(0, 6);

  const context = `Today is ${new Date().toLocaleDateString("en-IN", { timeZone: "Asia/Kolkata", dateStyle: "long" })}. Her exams: Paper 1 Advanced Accounting 1 Sep, Paper 2 Law 3 Sep, Paper 3 Taxation 5 Sep 2026 (2–5 PM).

${AMENDMENTS_BRIEF}

Her recent activity:
- Recent tests: ${recentAttempts.map((a) => `${a.title}: ${a.score}/${a.maxScore} (${Math.round(a.accuracy ?? 0)}%)`).join("; ") || "none yet"}
- Recent topics studied: ${recentTopics.map((t) => t.chapterName).join("; ") || "none logged"}
- Weak chapters (<70% accuracy): ${weak.join("; ") || "not enough data yet"} (she has said Income Tax overall is her weakest — prioritise it)
- Today's plan (from her Planner): ${todayPlan.map((p) => `${p.title}${p.done ? " ✓done" : ""}`).join("; ") || "no items today"}`;

  const style = `Response style — IMPORTANT:
- She wants "fatak se conclusion": give the ANSWER/CONCLUSION in the first line, then only the essential why (2-4 short lines). Default under 120 words.
- Expand only when she explicitly asks for detail/steps.
- Use the AMENDED figures above always. If her message uses outdated figures, correct briefly.
- Plain language, ₹ examples, section numbers in brackets.`;

  const stream = await openai.chat.completions.create({
    model: AI_MODEL,
    stream: true,
    messages: [
      { role: "system", content: `${CHAT_SYSTEM}\n\n${style}\n\n${context}` },
      ...history
        .reverse()
        .map((m) => ({ role: m.role as "user" | "assistant", content: m.content })),
    ],
  });

  const encoder = new TextEncoder();
  let full = "";
  const finalThreadId = threadId;
  const readable = new ReadableStream({
    async start(controller) {
      try {
        for await (const chunk of stream) {
          const delta = chunk.choices[0]?.delta?.content;
          if (delta) {
            full += delta;
            controller.enqueue(encoder.encode(delta));
          }
        }
      } finally {
        if (full) {
          await db.insert(chatMessages).values({
            userId: user.id,
            threadId: finalThreadId,
            role: "assistant",
            content: full,
          });
        }
        controller.close();
      }
    },
  });

  return new Response(readable, {
    headers: {
      "Content-Type": "text/plain; charset=utf-8",
      "X-Thread-Id": String(threadId),
    },
  });
}
