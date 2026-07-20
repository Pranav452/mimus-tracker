import Link from "next/link";
import Image from "next/image";
import TopBar from "@/components/TopBar";
import { requireUser } from "@/lib/auth";
import { getPublishedTests, getPapers } from "@/lib/queries";
import { SparkleIcon } from "@/components/icons";
import TestFilter from "./TestFilter";

export default async function TestsPage(props: PageProps<"/tests">) {
  const user = await requireUser();
  const search = await props.searchParams;
  const filter = typeof search.paper === "string" ? search.paper : "all";
  const [allTests, papers] = await Promise.all([
    getPublishedTests(user.id),
    getPapers(),
  ]);
  const tests =
    filter === "all" ? allTests : allTests.filter((t) => t.paperSlug === filter);

  return (
    <main className="fade-up">
      <TopBar />

      <div className="mx-5 rounded-3xl p-5 bg-gradient-to-br from-[#f5c98a] via-[#eec2ae] to-[#d9b8e8] relative overflow-hidden">
        <SparkleIcon className="absolute right-4 top-4 w-10 h-10 text-white/80" strokeWidth={1.3} />
        <p className="font-bold text-lg text-white drop-shadow-sm">
          AI-Powered Mock Test
        </p>
        <p className="mt-1 text-sm text-white/95 max-w-[240px]">
          Pranav uploads your daily topics — Mimus generates a mock that matches
          your exam pattern.
        </p>
        <Link
          href="/topics"
          className="mt-4 inline-block bg-white rounded-full px-5 py-2.5 text-sm font-semibold"
        >
          Log today&apos;s topics
        </Link>
      </div>

      <section className="mt-7 px-5">
        <h2 className="text-xl font-bold">Your tests</h2>
        <p className="text-sm text-muted">Fresh tests and your performance</p>
      </section>

      <TestFilter
        active={filter}
        options={[
          { slug: "all", label: "All" },
          ...papers.map((p) => ({ slug: p.slug, label: p.name })),
        ]}
      />

      <section className="px-5 space-y-3 mt-1">
        {tests.length === 0 && (
          <div className="rounded-3xl bg-surface border border-line p-6 text-center">
            <Image
              src="/assets/05-empty-no-data.png"
              alt=""
              width={120}
              height={120}
              className="mx-auto mb-3 rounded-2xl"
            />
            <p className="font-semibold">Nothing here yet</p>
            <p className="text-sm text-muted">
              New tests appear here the moment they&apos;re published.
            </p>
          </div>
        )}
        {tests.map((t) => (
          <div key={t.id} className="rounded-3xl bg-surface border border-line p-5">
            <div className="flex items-center justify-between">
              <span className="inline-flex items-center gap-1.5 text-xs text-muted bg-surface-2 rounded-lg px-2.5 py-1">
                📅{" "}
                {new Date(t.scheduledFor ?? t.createdAt).toLocaleDateString("en-IN", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </span>
              {t.paperName && (
                <span className="text-[11px] font-bold text-muted">{t.paperName}</span>
              )}
            </div>
            <p className="mt-3 font-bold text-lg">{t.title}</p>
            {t.attempt ? (
              <div className="mt-3 pt-3 border-t border-dashed border-line flex items-center justify-between">
                <div className="flex gap-4 text-sm">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-green" />
                    <b>{t.attempt.score}</b>
                    <span className="text-muted">/{t.attempt.maxScore}</span>
                  </span>
                  <span className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-accent" />
                    <b>{(t.attempt.accuracy ?? 0).toFixed(1)}%</b>
                  </span>
                </div>
                <Link
                  href={`/results/${t.attempt.id}`}
                  className="text-sm font-semibold underline underline-offset-4"
                >
                  Results
                </Link>
              </div>
            ) : (
              <div className="mt-3 pt-3 border-t border-dashed border-line flex items-center justify-between">
                <span className="text-sm text-muted">
                  {t.durationMinutes} min · not attempted
                </span>
                <Link
                  href={`/exam/${t.id}`}
                  className="bg-foreground text-background rounded-full px-5 py-2 text-sm font-semibold"
                >
                  Start
                </Link>
              </div>
            )}
          </div>
        ))}
      </section>
    </main>
  );
}
