"use client";

import { useRouter } from "next/navigation";

export default function TestFilter({
  active,
  options,
}: {
  active: string;
  options: { slug: string; label: string }[];
}) {
  const router = useRouter();
  return (
    <div className="flex gap-2 overflow-x-auto no-scrollbar px-5 py-4">
      {options.map((o) => (
        <button
          key={o.slug}
          onClick={() =>
            router.replace(o.slug === "all" ? "/tests" : `/tests?paper=${o.slug}`)
          }
          className={`shrink-0 rounded-full px-4 py-2 text-sm font-medium border ${
            active === o.slug
              ? "bg-foreground text-background border-foreground"
              : "bg-surface-2 text-foreground border-line"
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
