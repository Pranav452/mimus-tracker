import { getSessionUser } from "@/lib/auth";
import { db, chatThreads, chatMessages } from "@/lib/db";
import { and, desc, eq, isNull } from "drizzle-orm";

export async function GET() {
  const user = await getSessionUser();
  if (!user) return new Response("Unauthorized", { status: 401 });

  // adopt any orphan messages from before threads existed
  const orphans = await db
    .select()
    .from(chatMessages)
    .where(and(eq(chatMessages.userId, user.id), isNull(chatMessages.threadId)))
    .limit(1);
  if (orphans.length > 0) {
    const [t] = await db
      .insert(chatThreads)
      .values({ userId: user.id, title: "Earlier chats" })
      .returning();
    await db
      .update(chatMessages)
      .set({ threadId: t.id })
      .where(and(eq(chatMessages.userId, user.id), isNull(chatMessages.threadId)));
  }

  const threads = await db
    .select()
    .from(chatThreads)
    .where(eq(chatThreads.userId, user.id))
    .orderBy(desc(chatThreads.updatedAt))
    .limit(30);
  return Response.json(threads);
}
