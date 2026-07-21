import Link from "next/link";
import { requireUser } from "@/lib/auth";
import { CHANGE_SECTIONS, CHANGES_UPDATED } from "@/lib/changes";
import { ArrowLeftIcon } from "@/components/icons";

const prio: Record<string, string> = {
  high: "bg-red-soft text-red",
  medium: "bg-accent-soft text-accent",
  low: "bg-surface-2 text-muted",
};

export default async function ChangesPage() {
  await requireUser();
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
        <h1 className="font-bold text-lg">What changed</h1>
      </header>

      <div className="px-5">
        <h2 className="font-display text-4xl leading-tight">
          2025 attempt
          <br />
          <span className="italic text-muted">vs Sept 2026</span>
        </h2>
        <p className="mt-2 text-sm text-muted">
          Only the deltas — everything else you studied last time still stands.
          Updated {CHANGES_UPDATED}.
        </p>
      </div>

      <div className="px-5 mt-6 space-y-8 pb-10">
        {CHANGE_SECTIONS.map((section) => (
          <section key={section.id}>
            <h3 className="font-bold text-lg">
              {section.emoji} {section.title}
            </h3>
            <p className="text-sm text-muted mt-0.5 mb-3">{section.intro}</p>
            <div className="space-y-3">
              {section.items.map((item) => (
                <div
                  key={item.topic}
                  className="rounded-3xl bg-surface border border-line p-5"
                >
                  <div className="flex items-start justify-between gap-3">
                    <p className="font-bold text-[15px] leading-snug">{item.topic}</p>
                    <span
                      className={`shrink-0 text-[10px] font-bold uppercase tracking-wide rounded-full px-2.5 py-1 ${prio[item.priority]}`}
                    >
                      {item.priority}
                    </span>
                  </div>
                  <div className="mt-3 space-y-2 text-sm leading-relaxed">
                    <div className="rounded-2xl bg-surface-2 px-4 py-3">
                      <p className="text-[10px] font-bold uppercase tracking-wide text-muted mb-0.5">
                        Last time (2025)
                      </p>
                      {item.was}
                    </div>
                    <div className="rounded-2xl bg-green-soft px-4 py-3">
                      <p className="text-[10px] font-bold uppercase tracking-wide text-green mb-0.5">
                        Now (Sept 2026)
                      </p>
                      {item.now}
                    </div>
                  </div>
                  {item.note && (
                    <p className="mt-3 text-sm leading-relaxed">
                      <span className="text-[10px] font-bold uppercase tracking-wide text-lav bg-lav-soft rounded-full px-2.5 py-1 mr-2">
                        Exam angle
                      </span>
                      {item.note}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </section>
        ))}

        <p className="text-xs text-muted text-center leading-relaxed">
          Cross-check with ICAI&apos;s Statutory Update / RTP for Sept 2026 one week
          before the exam — Pranav keeps this page updated. 💛
        </p>
      </div>
    </main>
  );
}
