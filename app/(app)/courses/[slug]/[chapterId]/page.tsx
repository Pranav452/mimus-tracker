import Link from "next/link";
import { notFound } from "next/navigation";
import { requireUser } from "@/lib/auth";
import {
  getAllChapters,
  getChapterQuiz,
  getUserProgressMap,
} from "@/lib/queries";
import { db, flashcards } from "@/lib/db";
import { eq } from "drizzle-orm";
import { ArrowLeftIcon } from "@/components/icons";
import ChapterClient from "./ChapterClient";

export default async function ChapterPage(
  props: PageProps<"/courses/[slug]/[chapterId]">
) {
  const user = await requireUser();
  const { slug, chapterId } = await props.params;
  const id = Number(chapterId);
  if (!Number.isFinite(id)) notFound();

  const chapters = await getAllChapters();
  const chapter = chapters.find((c) => c.id === id && c.paperSlug === slug);
  if (!chapter) notFound();

  const [quiz, cards, progress] = await Promise.all([
    getChapterQuiz(id),
    db.select().from(flashcards).where(eq(flashcards.chapterId, id)),
    getUserProgressMap(user.id),
  ]);

  return (
    <main className="fade-up">
      <header className="flex items-center gap-3 px-5 py-4 pt-safe">
        <Link
          href={`/courses/${slug}`}
          aria-label="Back"
          className="w-10 h-10 rounded-full bg-surface border border-line flex items-center justify-center"
        >
          <ArrowLeftIcon className="w-5 h-5" />
        </Link>
        <div className="min-w-0">
          <h1 className="font-display text-2xl leading-tight truncate">
            {chapter.name}
          </h1>
          <p className="text-xs text-muted">
            {chapter.paperName} · {chapter.partLabel}
            {chapter.partName ? ` (${chapter.partName})` : ""}
          </p>
        </div>
      </header>

      <ChapterClient
        chapterId={id}
        chapterName={chapter.name}
        status={progress.get(id) ?? "not_started"}
        quiz={quiz.map((q) => ({
          id: q.id,
          text: q.text,
          options: q.options,
          correctIndex: q.correctIndex,
          explanation: q.explanation,
        }))}
        cards={cards.map((c) => ({ id: c.id, front: c.front, back: c.back }))}
      />
    </main>
  );
}
