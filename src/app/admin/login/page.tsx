"use client";

import Image from "next/image";
import { useActionState } from "react";
import { login, type LoginState } from "../actions";

export default function LoginPage() {
  const [state, action, pending] = useActionState<LoginState, FormData>(login, {});
  return (
    <main className="grid min-h-svh place-items-center bg-forest px-4">
      <form action={action} className="w-full max-w-sm space-y-4 rounded-3xl bg-cream p-8 shadow-2xl">
        <Image src="/logo.png" alt="Wilpattu Megha Safari" width={150} height={52} className="mx-auto h-12 w-auto" />
        <h1 className="text-center font-display text-2xl text-forest">Admin sign in</h1>
        <label className="block text-sm font-medium text-forest">Email
          <input name="email" type="email" required autoComplete="email" className="mt-1.5 w-full rounded-xl border border-brand/20 bg-white px-4 py-2.5 outline-none focus:border-brand focus:ring-4 focus:ring-brand/10" />
        </label>
        <label className="block text-sm font-medium text-forest">Password
          <input name="password" type="password" required autoComplete="current-password" className="mt-1.5 w-full rounded-xl border border-brand/20 bg-white px-4 py-2.5 outline-none focus:border-brand focus:ring-4 focus:ring-brand/10" />
        </label>
        {state.error && <p role="alert" className="text-sm font-medium text-red-700">{state.error}</p>}
        <button disabled={pending} className="w-full rounded-full bg-brand py-3 font-semibold text-cream hover:bg-brand-dark disabled:opacity-60">
          {pending ? "Signing in..." : "Sign in"}
        </button>
      </form>
    </main>
  );
}
