import fs from "node:fs";
import path from "node:path";
import { gallerySamples, photoSlots, sampleUrl } from "./photo-slots";

const dir = path.join(process.cwd(), "public", "images");
const exts = ["jpg", "jpeg", "webp", "png", "avif"];

function localFiles(): string[] {
  try {
    return fs.readdirSync(dir);
  } catch {
    return [];
  }
}

export type Photo = { src: string; alt: string };

// Extra file names accepted for a slot (e.g. hero-leopard.jpg also fills the "hero" slot).
const aliases: Record<string, string[]> = { hero: ["hero-leopard"] };

/** slot -> your own file if present in /public/images, otherwise a sample photo URL. */
export function resolvePhotos(): Record<string, string> {
  const files = localFiles();
  const out: Record<string, string> = {};
  for (const [slot, s] of Object.entries(photoSlots)) {
    const names = [slot, ...(aliases[slot] ?? [])];
    const hit = names.flatMap((n) => exts.map((e) => `${n}.${e}`)).find((f) => files.includes(f));
    out[slot] = hit ? `/images/${hit}` : sampleUrl(s.sample, s.lock, s.w, s.h);
  }
  return out;
}

/** Gallery: any files named gallery-*.jpg in /public/images, else samples. */
export function resolveGallery(): Photo[] {
  const own = localFiles()
    .filter((f) => /^gallery-.+\.(jpe?g|webp|png|avif)$/i.test(f))
    .sort()
    .map((f) => ({ src: `/images/${f}`, alt: "Wilpattu Megha Safari" }));
  if (own.length) return own;
  return gallerySamples.map((g) => ({ src: sampleUrl(g.sample, g.lock, 900, 700), alt: g.alt }));
}

/** A photo you added to /public/images (e.g. "hero-lake"), or null. */
export function localPhoto(name: string): string | null {
  const files = localFiles();
  const hit = exts.map((e) => `${name}.${e}`).find((f) => files.includes(f));
  return hit ? `/images/${hit}` : null;
}
