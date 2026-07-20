import Link from "next/link";
import { BellIcon, GemLogo } from "./icons";

export default function TopBar() {
  return (
    <header className="flex items-center justify-between px-5 pt-safe">
      <div className="flex items-center gap-2 py-4">
        <GemLogo className="w-6 h-6" />
        <span className="font-semibold text-lg tracking-tight">Mimus</span>
        <span className="text-[10px] font-bold tracking-wide bg-surface-2 border border-line rounded-full px-2 py-0.5 text-muted">
          PRO
        </span>
      </div>
      <Link
        href="/profile"
        aria-label="Notifications"
        className="w-10 h-10 rounded-full bg-surface border border-line flex items-center justify-center"
      >
        <BellIcon className="w-5 h-5" />
      </Link>
    </header>
  );
}
