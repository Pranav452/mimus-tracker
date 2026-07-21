import Link from "next/link";
import { requireUser, todayIST } from "@/lib/auth";
import { db, planItems } from "@/lib/db";
import { asc, eq } from "drizzle-orm";
import { ArrowLeftIcon } from "@/components/icons";
import PlannerClient from "./PlannerClient";

const PHASES = [
  {
    range: "22 – 31 Jul",
    title: "The sprint",
    detail: "Law — all 15 chapters + one DT block daily. Test every night.",
  },
  {
    range: "1 – 14 Aug",
    title: "Income Tax deep-dive",
    detail: "Your weakest paper gets the biggest block, + full GST 2.0 pass.",
  },
  {
    range: "15 – 24 Aug",
    title: "Accounts + AS sweep",
    detail: "Revision of Part A + all 21 AS, with daily IT practice to stay warm.",
  },
  {
    range: "25 – 31 Aug",
    title: "Mocks",
    detail: "One full 3-hr mock per paper under exam conditions, then patch weak spots.",
  },
  {
    range: "1 / 3 / 5 Sep",
    title: "Exams",
    detail: "Accounts → Law → Tax, with gap-day recaps in between.",
  },
];

export default async function PlannerPage() {
  const user = await requireUser();
  const items = await db
    .select()
    .from(planItems)
    .where(eq(planItems.userId, user.id))
    .orderBy(asc(planItems.onDate), asc(planItems.sort));

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
        <h1 className="font-bold text-lg">Planner</h1>
      </header>

      <div className="px-5">
        <h2 className="font-display text-4xl leading-tight">
          Road to
          <br />
          <span className="italic text-muted">September</span>
        </h2>
      </div>

      <div className="mt-5 flex gap-3 overflow-x-auto no-scrollbar px-5">
        {PHASES.map((p, i) => (
          <div
            key={p.range}
            className="shrink-0 w-52 rounded-3xl bg-surface border border-line p-4"
          >
            <p className="text-[10px] font-bold uppercase tracking-wide text-accent">
              Phase {i + 1} · {p.range}
            </p>
            <p className="font-bold mt-1">{p.title}</p>
            <p className="text-xs text-muted mt-1 leading-relaxed">{p.detail}</p>
          </div>
        ))}
      </div>

      <PlannerClient
        today={todayIST()}
        items={items.map((i) => ({
          id: i.id,
          onDate: String(i.onDate),
          title: i.title,
          subtitle: i.subtitle,
          kind: i.kind,
          done: i.done,
        }))}
      />
    </main>
  );
}
