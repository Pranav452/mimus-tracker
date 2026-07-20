import Link from "next/link";
import { requireUser, todayIST } from "@/lib/auth";
import { getAllChapters, getRecentTopics } from "@/lib/queries";
import { ArrowLeftIcon } from "@/components/icons";
import TopicsClient from "./TopicsClient";

export default async function TopicsPage() {
  const user = await requireUser();
  const [chapters, recent] = await Promise.all([
    getAllChapters(),
    getRecentTopics(user.id, 60),
  ]);
  const today = todayIST();

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
        <h1 className="font-bold text-lg">Today&apos;s study plan</h1>
      </header>

      <TopicsClient
        chapters={chapters.map((c) => ({
          id: c.id,
          name: c.name,
          paperName: c.paperName,
          partLabel: c.partLabel,
          partName: c.partName,
        }))}
        topics={recent.map((t) => ({
          id: t.id,
          forDate: String(t.forDate),
          note: t.note,
          chapterName: t.chapterName,
          paperName: t.paperName,
          paperSlug: t.paperSlug,
        }))}
        today={today}
      />
    </main>
  );
}
