import { createPublicClient } from "@/lib/supabase/public";
import type { SafariPackage } from "@/lib/types";

const inclusions = [
  "Entrance ticket",
  "Park taxes",
  "Bird guide book reference",
  "Mammals guide book reference",
  "Cool box",
  "Refreshment pack",
  "Hotel pick up and drop off (within 7km)",
];

// Shown only until Supabase is configured, so the site still runs locally.
const fallback: SafariPackage[] = [
  {
    id: "half", name: "Half Day Safari", duration: "4.5 hours",
    schedule: "Morning 6:00am - 10:30am  |  Evening 1:30pm - 6:00pm",
    description: "A relaxed half-day game drive through Wilpattu's lakes and forest trails with an experienced tracker.",
    inclusions, sort_order: 1, is_active: true,
    package_prices: [
      { id: "h1", package_id: "half", label: "1 person", price: 100, price_to: null, unit: "per person", sort_order: 1 },
      { id: "h2", package_id: "half", label: "2-3 persons", price: 70, price_to: 60, unit: "per person", sort_order: 2 },
      { id: "h3", package_id: "half", label: "4-6 persons", price: 52, price_to: 45, unit: "per person", sort_order: 3 },
    ],
  },
  {
    id: "full", name: "Full Day Safari", duration: "10 hours", schedule: "6:00am - 6:00pm",
    description: "The complete Wilpattu experience: dawn to dusk with the best chance of leopard, sloth bear and elephant sightings.",
    inclusions, sort_order: 2, is_active: true,
    package_prices: [
      { id: "f1", package_id: "full", label: "1 person", price: 140, price_to: null, unit: "per person", sort_order: 1 },
      { id: "f2", package_id: "full", label: "2-3 persons", price: 90, price_to: 75, unit: "per person", sort_order: 2 },
      { id: "f3", package_id: "full", label: "4-6 persons", price: 65, price_to: 57, unit: "per person", sort_order: 3 },
    ],
  },
];

export function sortPackages(list: SafariPackage[]): SafariPackage[] {
  return [...list]
    .sort((a, b) => a.sort_order - b.sort_order)
    .map((p) => ({
      ...p,
      package_prices: [...(p.package_prices ?? [])].sort((a, b) => a.sort_order - b.sort_order),
    }));
}

export async function getPublicPackages(): Promise<SafariPackage[]> {
  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
    console.warn("[packages] Supabase env vars missing - showing built-in sample packages.");
    return fallback;
  }
  const { data, error } = await createPublicClient()
    .from("packages")
    .select("*, package_prices(*)")
    .eq("is_active", true);
  if (error) {
    console.error("[packages] fetch failed:", error.message);
    return fallback;
  }
  return sortPackages((data ?? []) as SafariPackage[]);
}

export function formatPrice(price: number, priceTo: number | null): string {
  const n = (v: number) => (Number.isInteger(v) ? String(v) : v.toFixed(2));
  return priceTo != null ? `$${n(price)} - $${n(priceTo)}` : `$${n(price)}`;
}
