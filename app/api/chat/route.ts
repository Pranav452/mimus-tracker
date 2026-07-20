import { NextRequest } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { openai, AI_MODEL, CHAT_SYSTEM } from "@/lib/ai";
import { db, chatMessages } from "@/lib/db";
import { getRecentAttempts, getRecentTopics, getChapterAccuracy, getAllChapters } from "@/lib/queries";
import { desc, eq } from "drizzle-orm";

export async function GET() {
  const user = await getSessionUser();
  if (!user) return new Response("Unauthorized", { status: 401 });
  const history = await db
    .select()
    .from(chatMessages)
    .where(eq(chatMessages.userId, user.id))
    .orderBy(desc(chatMessages.createdAt))
    .limit(50);
  return Response.json(history.reverse());
}

export async function POST(request: NextRequest) {
  const user = await getSessionUser();
  if (!user) return new Response("Unauthorized", { status: 401 });

  const { message } = (await request.json()) as { message: string };
  if (!message?.trim()) return new Response("Empty message", { status: 400 });

  await db.insert(chatMessages).values({
    userId: user.id,
    role: "user",
    content: message,
  });

  const history = await db
    .select()
    .from(chatMessages)
    .where(eq(chatMessages.userId, user.id))
    .orderBy(desc(chatMessages.createdAt))
    .limit(20);

  // lightweight study context so "what should I study next" works
  const [recentAttempts, recentTopics, chapterAcc, allChapters] =
    await Promise.all([
      getRecentAttempts(user.id, 5),
      getRecentTopics(user.id, 10),
      getChapterAccuracy(user.id),
      getAllChapters(),
    ]);
  const weak = chapterAcc
    .filter((c) => c.total >= 3 && c.correct / c.total < 0.7)
    .map((c) => allChapters.find((ch) => ch.id === c.chapterId)?.name)
    .filter(Boolean)
    .slice(0, 6);

  const context = `Context about ${user.name}'s recent activity (today is ${new Date().toLocaleDateString("en-IN", { timeZone: "Asia/Kolkata", dateStyle: "long" })}):
Recent tests: ${recentAttempts.map((a) => `${a.title}: ${a.score}/${a.maxScore} (${Math.round(a.accuracy ?? 0)}% accuracy)`).join("; ") || "none yet"}
Recent topics studied: ${recentTopics.map((t) => t.chapterName).join("; ") || "none logged"}
Weak chapters (below 70% accuracy): ${weak.join("; ") || "not enough data"}`;

  const stream = await openai.chat.completions.create({
    model: AI_MODEL,
    stream: true,
    messages: [
      { role: "system", content: `${CHAT_SYSTEM}\n\n${context}` },
      ...history
        .reverse()
        .map((m) => ({ role: m.role as "user" | "assistant", content: m.content })),
    ],
  });

  const encoder = new TextEncoder();
  let full = "";
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
            role: "assistant",
            content: full,
          });
        }
        controller.close();
      }
    },
  });

  return new Response(readable, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
