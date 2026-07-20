"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const tabs = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/create", label: "Create test" },
  { href: "/admin/nudge", label: "Nudge" },
];

export default function AdminTabs() {
  const pathname = usePathname();
  return (
    <nav className="flex gap-2 px-5 pb-4 overflow-x-auto no-scrollbar">
      {tabs.map((t) => {
        const active =
          t.href === "/admin" ? pathname === "/admin" : pathname.startsWith(t.href);
        return (
          <Link
            key={t.href}
            href={t.href}
            className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold border ${
              active
                ? "bg-foreground text-background border-foreground"
                : "bg-surface border-line"
            }`}
          >
            {t.label}
          </Link>
        );
      })}
    </nav>
  );
}
