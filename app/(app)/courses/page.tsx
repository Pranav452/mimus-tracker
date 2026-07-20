import Link from "next/link";
import Image from "next/image";
import { requireUser } from "@/lib/auth";
import { getPapersWithProgress } from "@/lib/queries";
import { ArrowLeftIcon, ChevronRightIcon } from "@/components/icons";

const soft: Record<string, string> = {
  green: "bg-green-soft",
  blue: "bg-blue-soft",
  lav: "bg-lav-soft",
};

export default async function CoursesPage() {
  const user = await requireUser();
  const papers = await getPapersWithProgress(user.id);

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
        <h1 className="font-bold text-lg">Your courses</h1>
      </header>

      <p className="px-5 font-display text-3xl leading-snug">
        CA Intermediate,
        <br />
        <span className="italic text-muted">one paper at a time.</span>
      </p>

      <section className="px-5 mt-6 space-y-4 pb-8">
        {papers.map((p) => (
          <Link
            key={p.id}
            href={`/courses/${p.slug}`}
            className={`block rounded-3xl p-5 border border-line ${soft[p.color] ?? "bg-surface"}`}
          >
            <div className="flex items-start justify-between">
              <div className="w-14 h-14 rounded-2xl overflow-hidden bg-surface/70">
                <Image src={p.image} alt="" width={56} height={56} className="object-cover w-full h-full" />
              </div>
              <span className="text-[11px] font-bold bg-surface rounded-full px-2.5 py-1">
                {p.tag}
              </span>
            </div>
            <p className="mt-4 font-bold text-xl">{p.name}</p>
            <div className="mt-2 h-1.5 rounded-full bg-surface/80 overflow-hidden">
              <div
                className="h-full rounded-full bg-foreground/70"
                style={{
                  width: `${p.totalChapters ? Math.round((p.doneChapters / p.totalChapters) * 100) : 0}%`,
                }}
              />
            </div>
            <div className="mt-3 flex items-center justify-between text-sm">
              <span className="text-muted">
                {p.doneChapters}/{p.totalChapters} chapters done
              </span>
              <ChevronRightIcon className="w-4 h-4 text-muted" />
            </div>
          </Link>
        ))}
      </section>
    </main>
  );
}
