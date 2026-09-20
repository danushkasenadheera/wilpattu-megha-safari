import Image from "next/image";
import Link from "next/link";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import { sortPackages } from "@/lib/packages";
import type { SafariPackage } from "@/lib/types";
import { logout } from "./actions";
import { PackageManager } from "./PackageManager";

export const dynamic = "force-dynamic";

export default async function AdminPage() {
  const supabase = await createClient();
  const { data: auth } = await supabase.auth.getUser();
  if (!auth.user) redirect("/admin/login");

  const { data, error } = await supabase.from("packages").select("*, package_prices(*)");
  const packages = sortPackages((data ?? []) as SafariPackage[]);

  return (
    <main className="min-h-svh bg-sand">
      <header className="border-b border-brand/10 bg-cream">
        <div className="mx-auto flex max-w-4xl items-center justify-between gap-4 px-4 py-3">
          <div className="flex items-center gap-3">
            <Image src="/logo.png" alt="Wilpattu Megha Safari" width={150} height={52} className="h-10 w-auto" />
            <span className="hidden font-display text-lg text-forest sm:inline">Package admin</span>
          </div>
          <div className="flex items-center gap-2 text-sm">
            <Link href="/" target="_blank" className="rounded-full px-4 py-2 text-forest hover:bg-sand">View site</Link>
            <form action={logout}>
              <button className="rounded-full bg-forest px-4 py-2 font-medium text-cream hover:bg-brand">Sign out</button>
            </form>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-4xl px-4 py-8">
        {error && <p className="mb-4 rounded-xl bg-red-50 p-4 text-sm text-red-800">Could not load packages: {error.message}</p>}
        <PackageManager packages={packages} />
      </div>
    </main>
  );
}
