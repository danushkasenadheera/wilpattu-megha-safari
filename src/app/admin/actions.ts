"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

export type LoginState = { error?: string };
export type SaveResult = { ok: true; id: string } | { ok: false; error: string };

export type PriceInput = { label: string; price: number | string; price_to: number | string | null; unit: string };
export type PackageInput = {
  id?: string;
  name: string;
  duration: string;
  schedule: string;
  description: string;
  inclusions: string[];
  sort_order: number | string;
  is_active: boolean;
  prices: PriceInput[];
};

async function requireUser() {
  const supabase = await createClient();
  const { data } = await supabase.auth.getUser();
  if (!data.user) redirect("/admin/login");
  return supabase;
}

export async function login(_prev: LoginState, formData: FormData): Promise<LoginState> {
  const email = String(formData.get("email") ?? "").trim();
  const password = String(formData.get("password") ?? "");
  if (!email || !password) return { error: "Enter your email and password." };

  const supabase = await createClient();
  const { error } = await supabase.auth.signInWithPassword({ email, password });
  if (error) return { error: "Incorrect email or password." };
  redirect("/admin");
}

export async function logout() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/admin/login");
}

const num = (v: number | string | null): number | null => {
  if (v === null || v === "") return null;
  const n = Number(v);
  return Number.isFinite(n) ? n : NaN;
};

export async function savePackage(input: PackageInput): Promise<SaveResult> {
  const supabase = await requireUser();

  const name = input.name.trim();
  if (!name) return { ok: false, error: "Package name is required." };

  const prices = [];
  for (const [i, p] of input.prices.entries()) {
    const label = p.label.trim();
    const price = num(p.price);
    const priceTo = num(p.price_to);
    if (!label) return { ok: false, error: `Price row ${i + 1}: enter a label such as "2-3 persons".` };
    if (price === null || Number.isNaN(price) || price < 0) return { ok: false, error: `Price row ${i + 1}: enter a valid price.` };
    if (Number.isNaN(priceTo) || (priceTo !== null && priceTo < 0)) return { ok: false, error: `Price row ${i + 1}: the "to" price is not valid.` };
    prices.push({ label, price, price_to: priceTo, unit: p.unit.trim() || "per person", sort_order: i + 1 });
  }

  const row = {
    name,
    duration: input.duration.trim(),
    schedule: input.schedule.trim(),
    description: input.description.trim(),
    inclusions: input.inclusions.map((s) => s.trim()).filter(Boolean),
    sort_order: Number.isFinite(Number(input.sort_order)) ? Number(input.sort_order) : 0,
    is_active: input.is_active,
    updated_at: new Date().toISOString(),
  };

  let id = input.id;
  if (id) {
    const { error } = await supabase.from("packages").update(row).eq("id", id);
    if (error) return { ok: false, error: error.message };
  } else {
    const { data, error } = await supabase.from("packages").insert(row).select("id").single();
    if (error || !data) return { ok: false, error: error?.message ?? "Could not create the package." };
    id = data.id as string;
  }

  // Replace this package's price rows with the submitted set.
  const { error: delErr } = await supabase.from("package_prices").delete().eq("package_id", id);
  if (delErr) return { ok: false, error: delErr.message };
  if (prices.length) {
    const { error: insErr } = await supabase.from("package_prices").insert(prices.map((p) => ({ ...p, package_id: id })));
    if (insErr) return { ok: false, error: insErr.message };
  }

  revalidatePath("/");
  revalidatePath("/admin");
  return { ok: true, id: id! };
}

export async function deletePackage(id: string): Promise<{ ok: boolean; error?: string }> {
  const supabase = await requireUser();
  const { error } = await supabase.from("packages").delete().eq("id", id);
  if (error) return { ok: false, error: error.message };
  revalidatePath("/");
  revalidatePath("/admin");
  return { ok: true };
}
