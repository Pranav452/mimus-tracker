import { config } from "dotenv";
config({ path: ".env.local" });
import { sql as dsql } from "drizzle-orm";
import { db } from "./lib/db";
async function main() {
  await db.execute(dsql.raw(`create table if not exists chapter_notes (
    id serial primary key,
    chapter_id integer not null unique references chapters(id),
    title text not null,
    content jsonb not null,
    updated_at timestamp not null default now()
  )`));
  console.log("chapter_notes ready");
}
main().catch((e) => { console.error(e); process.exit(1); });
