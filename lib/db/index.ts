import { neon, neonConfig } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

// Neon over HTTP occasionally throws transient "fetch failed" (DNS/socket
// hiccups) — retry briefly before surfacing an error.
neonConfig.fetchFunction = async (url: string, init: RequestInit) => {
  let lastErr: unknown;
  for (let attempt = 0; attempt < 3; attempt++) {
    try {
      return await fetch(url, init);
    } catch (e) {
      lastErr = e;
      await new Promise((r) => setTimeout(r, 200 * (attempt + 1)));
    }
  }
  throw lastErr;
};

const sql = neon(process.env.DATABASE_URL!);
export const db = drizzle(sql, { schema });
export * from "./schema";
