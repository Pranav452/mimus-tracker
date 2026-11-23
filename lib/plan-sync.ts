// Auto-ticks planner items from the topics she logs.
//
// The sync is a pure recomputation from (topics × items), so running it
// repeatedly is idempotent and never drifts:
//
//  1. Each logged topic is assigned to the *nearest by date* plan item that
//     covers that chapter. Studying Capital Gains in July therefore lands on
//     the July item, and revising it in August lands on the August one.
//  2. An item is ticked only when EVERY chapter it covers has a topic
//     assigned to it — so logging just "Supply" doesn't complete an
//     "Intro + Supply" day.
//  3. Items she has ticked or unticked by hand (`manual`) are left alone.
//  4. A topic logged BEFORE the plan's first day never ticks anything. Without
//     this, rebuilding the plan for a new attempt would let last attempt's
//     topics land on the new items and mark them done on day one.
//
// NOT server-only: the seed/CLI scripts import this too.
import { db } from "./db";
import { planItems, dailyTopics } from "./db/schema";
import { asc, eq } from "drizzle-orm";

const dayNumber = (d: string) => Date.parse(`${d}T00:00:00+05:30`) / 86_400_000;

export async function syncPlanProgress(userId: number): Promise<number> {
  const [topics, items] = await Promise.all([
    db
      .select({
        id: dailyTopics.id,
        chapterId: dailyTopics.chapterId,
        forDate: dailyTopics.forDate,
      })
      .from(dailyTopics)
      .where(eq(dailyTopics.userId, userId))
      .orderBy(asc(dailyTopics.forDate), asc(dailyTopics.id)),
    db.select().from(planItems).where(eq(planItems.userId, userId)),
  ]);

  const eligible = items.filter((i) => !i.manual && (i.chapterIds?.length ?? 0) > 0);
  const planStart = items.length
    ? Math.min(...items.map((i) => dayNumber(String(i.onDate))))
    : Infinity;
  // itemId -> chapterId -> topicIds that covered it
  const coverage = new Map<number, Map<number, number[]>>();

  for (const topic of topics) {
    const topicDay = dayNumber(String(topic.forDate));
    if (topicDay < planStart) continue; // belongs to an earlier attempt
    let best: { id: number; distance: number; day: number } | null = null;

    for (const item of eligible) {
      if (!item.chapterIds.includes(topic.chapterId)) continue;
      const itemDay = dayNumber(String(item.onDate));
      const distance = Math.abs(itemDay - topicDay);
      // nearest wins; ties go to the earlier item
      if (
        !best ||
        distance < best.distance ||
        (distance === best.distance && itemDay < best.day)
      ) {
        best = { id: item.id, distance, day: itemDay };
      }
    }
    if (!best) continue;

    if (!coverage.has(best.id)) coverage.set(best.id, new Map());
    const byChapter = coverage.get(best.id)!;
    byChapter.set(topic.chapterId, [
      ...(byChapter.get(topic.chapterId) ?? []),
      topic.id,
    ]);
  }

  let ticked = 0;
  for (const item of eligible) {
    const byChapter = coverage.get(item.id);
    const complete =
      !!byChapter && item.chapterIds.every((c) => (byChapter.get(c)?.length ?? 0) > 0);
    const sourceTopicIds = complete
      ? [...new Set(item.chapterIds.flatMap((c) => byChapter!.get(c) ?? []))].sort(
          (a, b) => a - b
        )
      : [];

    const unchanged =
      item.done === complete &&
      JSON.stringify(item.sourceTopicIds ?? []) === JSON.stringify(sourceTopicIds);
    if (unchanged) {
      if (complete) ticked++;
      continue;
    }

    await db
      .update(planItems)
      .set({ done: complete, sourceTopicIds })
      .where(eq(planItems.id, item.id));
    if (complete) ticked++;
  }

  return ticked;
}
