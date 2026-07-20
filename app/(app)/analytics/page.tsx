import Link from "next/link";
import { requireUser } from "@/lib/auth";
import {
  getRecentAttempts,
  getChapterAccuracy,
  getAllChapters,
} from "@/lib/queries";
import { ArrowLeftIcon } from "@/components/icons";
import AnalyticsClient from "./AnalyticsClient";

export default async function AnalyticsPage() {
  const user = await requireUser();
  const [attempts, chapterAcc, chapters] = await Promise.all([
    getRecentAttempts(user.id, 30),
    getChapterAccuracy(user.id),
    getAllChapters(),
  ]);

  const points = attempts
    .slice()
    .reverse()
    .map((a) => ({
      date: new Date(a.submittedAt!).toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
      }),
      pct: a.maxScore ? Math.round(((a.score ?? 0) / a.maxScore) * 100) : 0,
      paperSlug: a.paperSlug ?? "other",
      paperName: a.paperName ?? "General",
      title: a.title,
    }));

  const suggestions = chapterAcc
    .map((c) => {
      const ch = chapters.find((x) => x.id === c.chapterId);
      if (!ch) return null;
      const pct = c.total ? (c.correct / c.total) * 100 : 0;
      return {
        chapter: ch.name,
        paperSlug: ch.paperSlug,
        paperName: ch.paperName,
        pct: Math.round(pct),
        total: c.total,
      };
    })
    .filter((x): x is NonNullable<typeof x> => x !== null)
    .sort((a, b) => a.pct - b.pct);

  return (
    <main className="fade-up">
      <header className="flex items-center gap-3 px-5 py-4 pt-safe">
        <Link
          href="/"
          aria-label="Back"
          className="w-10 h-10 rounded-full bg-surface border border-line flex items-center justify-center"
        >
          <ArrowLeftIcon className="w-5 h-5" />
        </Link>
        <h1 className="font-bold text-lg">Analytics</h1>
      </header>
      <AnalyticsClient points={points} suggestions={suggestions} />
    </main>
  );
}
