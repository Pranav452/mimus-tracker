"use client";

import { useActionState } from "react";
import Image from "next/image";
import { login, type AuthState } from "@/app/actions/auth";
import { GemLogo } from "@/components/icons";

export default function LoginPage() {
  const [state, action, pending] = useActionState<AuthState, FormData>(login, {});

  return (
    <main className="min-h-dvh flex flex-col px-6 pt-safe pb-safe">
      <div className="flex-1 flex flex-col justify-center py-10">
        <div className="flex items-center gap-2 mb-8">
          <GemLogo className="w-8 h-8" />
          <span className="font-semibold text-2xl tracking-tight">Mimus</span>
        </div>

        <h1 className="font-display text-5xl leading-tight mb-1">
          Welcome
          <br />
          <span className="italic text-muted">back</span>
        </h1>
        <p className="text-muted mb-8">Sign in to continue your prep.</p>

        <form action={action} className="space-y-4">
          <input
            name="email"
            type="email"
            required
            placeholder="Email"
            autoComplete="email"
            className="w-full h-14 rounded-2xl bg-surface border border-line px-5 outline-none focus:border-foreground/40 text-[15px]"
          />
          <input
            name="password"
            type="password"
            required
            placeholder="Password"
            autoComplete="current-password"
            className="w-full h-14 rounded-2xl bg-surface border border-line px-5 outline-none focus:border-foreground/40 text-[15px]"
          />
          {state.error && (
            <p className="text-red text-sm px-1">{state.error}</p>
          )}
          <button
            type="submit"
            disabled={pending}
            className="w-full h-14 rounded-full bg-foreground text-background font-semibold text-[15px] disabled:opacity-60"
          >
            {pending ? "Signing in…" : "Sign in"}
          </button>
        </form>
      </div>

      <div className="relative h-44 -mx-6">
        <Image
          src="/assets/01-hero-study-scene.png"
          alt=""
          fill
          className="object-cover object-top rounded-t-3xl"
          priority
        />
      </div>
    </main>
  );
}
