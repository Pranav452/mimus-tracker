import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { db } from "@/lib/db";
import { chapterNotes, chapters, parts, papers } from "@/lib/db/schema";
import { eq, desc } from "drizzle-orm";
import { ArrowLeftIcon, ChevronRightIcon, BookIcon } from "@/components/icons";

// Every hand-written explainer, one card per note, with the concepts it covers
// listed by name — so "net payment method" is findable even though it lives
// inside the Amalgamation chapter's note.
export default async function ExplanationsPage() {
  await requireUser();

  const notes = await db
    .select({
      id: chapterNotes.id,
      title: chapterNotes.title,
      concepts: chapterNotes.concepts,
      updatedAt: chapterNotes.updatedAt,
      chapterId: chapters.id,
      chapterName: chapters.name,
      paperName: papers.name,
      paperSlug: papers.slug,
    })
    .from(chapterNotes)
    .innerJoin(chapters, eq(chapterNotes.chapterId, chapters.id))
    .innerJoin(parts, eq(chapters.partId, parts.id))
    .innerJoin(papers, eq(parts.paperId, papers.id))
    .orderBy(desc(chapterNotes.updatedAt));

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
        <h1 className="font-bold text-lg">Explanations</h1>
      </header>

      <p className="px-5 font-display text-3xl leading-snug">
        Concepts, explained
        <br />
        <span className="italic text-muted">the way you&apos;ll remember them.</span>
      </p>

      <section className="px-5 mt-6 space-y-4 pb-8">
        {notes.length === 0 && (
          <div className="rounded-3xl bg-surface border border-line p-6 text-center">
            <BookIcon className="w-10 h-10 mx-auto text-accent" strokeWidth={1.4} />
            <p className="font-bold mt-3">Nothing here yet</p>
            <p className="text-sm text-muted mt-1">
              WhatsApp Pranav the topic you&apos;re stuck on — it&apos;ll show up here.
            </p>
          </div>
        )}

        {notes.map((n) => (
          <Link
            key={n.id}
            href={`/courses/${n.paperSlug}/${n.chapterId}`}
            className="block rounded-3xl bg-surface border border-line p-5"
          >
            <div className="flex items-center justify-between gap-3">
              <span className="text-[11px] font-bold text-muted uppercase tracking-wide">
                {n.paperName} · {n.chapterName}
              </span>
              <ChevronRightIcon className="w-4 h-4 text-muted shrink-0" />
            </div>
            <p className="mt-2 font-bold text-lg leading-snug">{n.title}</p>
            <div className="mt-3 flex flex-wrap gap-1.5">
              {(n.concepts ?? []).map((c) => (
                <span
                  key={c}
                  className="text-xs font-semibold bg-accent-soft text-accent rounded-full px-2.5 py-1"
                >
                  {c}
                </span>
              ))}
            </div>
          </Link>
        ))}

        <Link
          href="/courses"
          className="block rounded-3xl border border-dashed border-line p-4 text-center text-sm font-semibold text-muted"
        >
          Browse all courses →
        </Link>
      </section>
    </main>
  );
}
