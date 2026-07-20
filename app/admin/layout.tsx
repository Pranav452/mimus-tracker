import { requireAdmin } from "@/lib/auth";

export const dynamic = "force-dynamic";
import { logout } from "@/app/actions/auth";
import { GemLogo, LogoutIcon } from "@/components/icons";
import AdminTabs from "./AdminTabs";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireAdmin();
  return (
    <div className="pb-10">
      <header className="flex items-center justify-between px-5 py-4 pt-safe">
        <div className="flex items-center gap-2">
          <GemLogo className="w-6 h-6" />
          <span className="font-semibold text-lg">Mimus</span>
          <span className="text-[10px] font-bold tracking-wide bg-foreground text-background rounded-full px-2 py-0.5">
            MENTOR
          </span>
        </div>
        <form action={logout}>
          <button
            aria-label="Log out"
            className="w-10 h-10 rounded-full bg-surface border border-line flex items-center justify-center"
          >
            <LogoutIcon className="w-5 h-5" />
          </button>
        </form>
      </header>
      <AdminTabs />
      {children}
    </div>
  );
}
