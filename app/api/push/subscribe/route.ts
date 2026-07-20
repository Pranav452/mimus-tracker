import { NextRequest } from "next/server";
import { getSessionUser } from "@/lib/auth";
import { db, pushSubscriptions } from "@/lib/db";
import { eq } from "drizzle-orm";

export async function POST(request: NextRequest) {
  const user = await getSessionUser();
  if (!user) return new Response("Unauthorized", { status: 401 });
  const sub = (await request.json()) as {
    endpoint: string;
    keys: { p256dh: string; auth: string };
  };
  if (!sub?.endpoint) return new Response("Bad subscription", { status: 400 });
  await db
    .insert(pushSubscriptions)
    .values({
      userId: user.id,
      endpoint: sub.endpoint,
      p256dh: sub.keys.p256dh,
      auth: sub.keys.auth,
    })
    .onConflictDoNothing({ target: pushSubscriptions.endpoint });
  return Response.json({ ok: true });
}

export async function DELETE(request: NextRequest) {
  const user = await getSessionUser();
  if (!user) return new Response("Unauthorized", { status: 401 });
  const { endpoint } = (await request.json()) as { endpoint: string };
  await db.delete(pushSubscriptions).where(eq(pushSubscriptions.endpoint, endpoint));
  return Response.json({ ok: true });
}
