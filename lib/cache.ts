// Tiny in-process cache for data that only changes when a seed script runs
// (the syllabus, how many flashcards a chapter has). Every page needs it, and
// each Neon round-trip is a full HTTP request, so re-reading it per navigation
// was a large part of why the app felt slow.
const store = new Map<string, { at: number; value: Promise<unknown> }>();

export function memo<T>(key: string, ttlMs: number, fn: () => Promise<T>): Promise<T> {
  const hit = store.get(key);
  if (hit && Date.now() - hit.at < ttlMs) return hit.value as Promise<T>;
  const value = fn().catch((e) => {
    store.delete(key); // never cache a failure
    throw e;
  });
  store.set(key, { at: Date.now(), value });
  return value;
}
