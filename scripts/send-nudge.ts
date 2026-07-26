// Sends a push notification to Mimansha's devices.
// Usage: npx tsx scripts/send-nudge.ts --title="..." --body="..." [--user=1]
import { config } from "dotenv";
config({ path: ".env.local" });

import { neon } from "@neondatabase/serverless";
import webpush from "web-push";

const sql = neon(process.env.DATABASE_URL!);

const flag = (name: string) =>
  process.argv.find((a) => a.startsWith(`--${name}=`))?.split("=").slice(1).join("=");

const TITLE = flag("title") ?? "Mimus";
const BODY = flag("body") ?? "";
const USER_ID = Number(flag("user")) || 1; // 1 = Mimansha

async function main() {
  if (!BODY) throw new Error("--body is required");
  webpush.setVapidDetails(
    process.env.VAPID_SUBJECT ?? "mailto:admin@mimus.app",
    process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
    process.env.VAPID_PRIVATE_KEY!
  );

  const subs = (await sql`
    select id, endpoint, p256dh, auth from push_subscriptions where user_id = ${USER_ID}
  `) as { id: number; endpoint: string; p256dh: string; auth: string }[];

  if (subs.length === 0) {
    console.log(`No subscribed devices for user ${USER_ID}.`);
    return;
  }

  let sent = 0;
  for (const sub of subs) {
    try {
      await webpush.sendNotification(
        { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
        JSON.stringify({ title: TITLE, body: BODY, url: "/" })
      );
      sent++;
      console.log(`  ✔ ${sub.endpoint.slice(0, 50)}…`);
    } catch (e) {
      const status = (e as { statusCode?: number }).statusCode;
      // 404/410 = device unsubscribed; clean it up
      if (status === 404 || status === 410) {
        await sql`delete from push_subscriptions where id = ${sub.id}`;
        console.log(`  ✖ stale subscription removed (${status})`);
      } else {
        console.log(`  ✖ failed (${status ?? "unknown"}): ${String(e).slice(0, 120)}`);
      }
    }
  }
  console.log(`\nDelivered to ${sent}/${subs.length} device(s).`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
