"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { HomeIcon, ChatIcon, ClipboardIcon } from "./icons";

const tabs = [
  { href: "/", icon: HomeIcon, label: "Home" },
  { href: "/chat", icon: ChatIcon, label: "Chat" },
  { href: "/tests", icon: ClipboardIcon, label: "Tests" },
];

export default function BottomNav() {
  const pathname = usePathname();
  return (
    <nav className="fixed bottom-0 inset-x-0 z-40">
      <div className="app-shell !min-h-0 bg-surface/95 backdrop-blur border-t border-line pb-safe">
        <div className="flex items-center justify-around h-16">
          {tabs.map(({ href, icon: Icon, label }) => {
            const active =
              href === "/" ? pathname === "/" : pathname.startsWith(href);
            return (
              <Link
                key={href}
                href={href}
                aria-label={label}
                className={`p-3 rounded-full transition-colors ${
                  active ? "text-foreground" : "text-muted"
                }`}
              >
                <Icon strokeWidth={active ? 2.1 : 1.7} />
              </Link>
            );
          })}
          <Link href="/profile" aria-label="Profile" className="p-3">
            <span
              className={`block w-6 h-6 rounded-full bg-gradient-to-br from-[#e8b98a] via-[#cfd8b8] to-[#8fb8a8] ${
                pathname.startsWith("/profile")
                  ? "ring-2 ring-foreground ring-offset-2 ring-offset-surface"
                  : ""
              }`}
            />
          </Link>
        </div>
      </div>
    </nav>
  );
}
