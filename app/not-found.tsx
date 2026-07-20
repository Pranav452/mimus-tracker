import Link from "next/link";
import Image from "next/image";

export default function NotFound() {
  return (
    <main className="min-h-dvh flex flex-col items-center justify-center px-8 text-center">
      <Image
        src="/assets/05-empty-no-data.png"
        alt=""
        width={140}
        height={140}
        className="rounded-3xl mb-5"
      />
      <h1 className="font-display text-3xl mb-1">Nothing here</h1>
      <p className="text-muted text-sm mb-6">
        This page doesn&apos;t exist or isn&apos;t available.
      </p>
      <Link
        href="/"
        className="rounded-full bg-foreground text-background px-6 py-3 text-sm font-semibold"
      >
        Go home
      </Link>
    </main>
  );
}
