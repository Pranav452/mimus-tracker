"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { planItems } from "@/lib/db/schema";
import { requireUser } from "@/lib/auth";
import { and, eq } from "drizzle-orm";

export async function togglePlanItem(id: number, done: boolean) {
  const user = await requireUser();
  await db
    .update(planItems)
    .set({ done })
    .where(and(eq(planItems.id, id), eq(planItems.userId, user.id)));
  revalidatePath("/planner");
}
