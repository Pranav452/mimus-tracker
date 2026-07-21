import { db } from "@/lib/db";
import { sql } from "drizzle-orm";

export async function GET() {
  try {
    const r = await db.execute(sql`select 1 as ok`);
    return Response.json({ db: "ok", r: r.rows ?? r });
  } catch (e) {
    return Response.json({ db: "fail", error: String(e) }, { status: 500 });
  }
}
