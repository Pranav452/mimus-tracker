import { requireUser } from "@/lib/auth";
import BottomNav from "@/components/BottomNav";
import PwaSetup from "@/components/PwaSetup";

export const dynamic = "force-dynamic";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  await requireUser();
  return (
    <div className="pb-24">
      <PwaSetup />
      {children}
      <BottomNav />
    </div>
  );
}
