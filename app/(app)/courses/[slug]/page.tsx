import Link from "next/link";
import { notFound } from "next/navigation";
import { requireUser } from "@/lib/auth";
import { getAllChapters, getPapers, getUserProgressMap } from "@/lib/queries";
import { ArrowLeftIcon, ChevronRightIcon } from "@/components/icons";

const statusPill: Record<string, { label: string; cls: string }> = {
  not_started: { label: "Not visited", cls: "bg-surface-2 text-muted" },
  in_progress: { label: "Continue", cls: "bg-foreground text-background" },
  done: { label: "Done ✓", cls: "bg-green-soft text-green" },
};

export default async function PaperPage(props: PageProps<"/courses/[slug]">) {
  const user = await requireUser();
  const { slug } = await props.params;
  const papers = await getPapers();
  const paper = papers.find((p) => p.slug === slug);
  if (!paper) notFound();

  const [chapters, progress] = await Promise.all([
    getAllChapters(),
    getUserProgressMap(user.id),
  ]);
  const mine = chapters.filter((c) => c.paperSlug === slug);
  const parts = [...new Set(mine.map((c) => c.partId))].map((pid) => {
    const chs = mine.filter((c) => c.partId === pid);
    return { id: pid, label: chs[0].partLabel, name: chs[0].partName, chapters: chs };
  });
  const done = mine.filter((c) => progress.get(c.id) === "done").length;

  return (
    <main className="fade-up">
      <div className="bg-gradient-to-br from-accent-soft via-background to-background pb-6">
        <header className="flex items-center px-5 py-4 pt-safe">
          <Link
            href="/courses"
            aria-label="Back"
            className="w-10 h-10 rounded-full bg-surface border border-line flex items-center justify-center"
          >
            <ArrowLeftIcon className="w-5 h-5" />
          </Link>
        </header>
        <div className="px-5">
          <h1 className="font-display text-4xl leading-tight">
            {paper.tag}
            <br />
            {paper.name}
          </h1>
          <div className="mt-4 flex gap-2">
            <span className="text-xs font-semibold bg-surface border border-line rounded-full px-3 py-1.5">
              📖 {mine.length} chapters
            </span>
            <span className="text-xs font-semibold bg-surface border border-line rounded-full px-3 py-1.5">
              ✅ {done} done
            </span>
          </div>
        </div>
      </div>

      <section className="px-5 space-y-6 pb-8">
        {parts.map((part) => (
          <div key={part.id}>
            <h2 className="font-bold text-lg mb-1">
              {part.label}
              {part.name ? ` — ${part.name}` : ""}
            </h2>
            <div className="rounded-3xl bg-surface border border-line divide-y divide-line overflow-hidden">
              {part.chapters.map((c) => {
                const st = progress.get(c.id) ?? "not_started";
                const pill = statusPill[st];
                return (
                  <Link
                    key={c.id}
                    href={`/courses/${slug}/${c.id}`}
                    className="flex items-center gap-3 px-5 py-4"
                  >
                    <p className="flex-1 text-[15px] font-medium leading-snug">
                      {c.name}
                    </p>
                    <span className={`shrink-0 text-[11px] font-bold rounded-full px-2.5 py-1 ${pill.cls}`}>
                      {pill.label}
                    </span>
                    <ChevronRightIcon className="w-4 h-4 text-muted shrink-0" />
                  </Link>
                );
              })}
            </div>
          </div>
        ))}
      </section>
    </main>
  );
}
