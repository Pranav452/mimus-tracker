import { config } from "dotenv";
config({ path: ".env.local" });

import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { eq } from "drizzle-orm";
import bcrypt from "bcryptjs";
import * as schema from "../lib/db/schema";
import { SYLLABUS } from "../lib/syllabus";

const sql = neon(process.env.DATABASE_URL!);
const db = drizzle(sql, { schema });

async function main() {
  console.log("Seeding syllabus…");
  for (const paper of SYLLABUS) {
    let [p] = await db
      .select()
      .from(schema.papers)
      .where(eq(schema.papers.slug, paper.slug));
    if (!p) {
      [p] = await db
        .insert(schema.papers)
        .values({
          number: paper.number,
          name: paper.name,
          slug: paper.slug,
          tag: paper.tag,
          color: paper.color,
          image: paper.image,
        })
        .returning();
      console.log(`  + Paper ${paper.number}: ${paper.name}`);
    }
    for (let pi = 0; pi < paper.parts.length; pi++) {
      const part = paper.parts[pi];
      const existingParts = await db
        .select()
        .from(schema.parts)
        .where(eq(schema.parts.paperId, p.id));
      let dbPart = existingParts.find((x) => x.label === part.label);
      if (!dbPart) {
        [dbPart] = await db
          .insert(schema.parts)
          .values({ paperId: p.id, label: part.label, name: part.name, sort: pi })
          .returning();
      }
      const existingChapters = await db
        .select()
        .from(schema.chapters)
        .where(eq(schema.chapters.partId, dbPart.id));
      for (let ci = 0; ci < part.chapters.length; ci++) {
        const name = part.chapters[ci];
        if (!existingChapters.find((c) => c.name === name)) {
          await db
            .insert(schema.chapters)
            .values({ partId: dbPart.id, number: ci + 1, name });
        }
      }
    }
  }

  console.log("Seeding users…");
  const seedUsers = [
    {
      name: "Mimansha",
      email: process.env.SEED_STUDENT_EMAIL ?? "mimansha@mimus.app",
      password: process.env.SEED_STUDENT_PASSWORD ?? "mimus123",
      role: "student" as const,
    },
    {
      name: "Pranav",
      email: process.env.SEED_ADMIN_EMAIL ?? "pranav@mimus.app",
      password: process.env.SEED_ADMIN_PASSWORD ?? "admin123",
      role: "admin" as const,
    },
  ];
  for (const u of seedUsers) {
    const existing = await db
      .select()
      .from(schema.users)
      .where(eq(schema.users.email, u.email.toLowerCase()));
    if (existing.length === 0) {
      await db.insert(schema.users).values({
        name: u.name,
        email: u.email.toLowerCase(),
        passwordHash: await bcrypt.hash(u.password, 10),
        role: u.role,
      });
      console.log(`  + ${u.role}: ${u.email}`);
    }
  }

  console.log("Done.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
