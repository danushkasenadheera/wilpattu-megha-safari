// Lists the photos in /public/images into src/lib/photo-manifest.json at build/dev start,
// so the site never needs to read the file system at runtime (works on any host, incl. Netlify).
import fs from "node:fs";
import path from "node:path";

const dir = path.join(process.cwd(), "public", "images");
let files = [];
try {
  files = fs.readdirSync(dir).filter((f) => /\.(jpe?g|png|webp|avif)$/i.test(f)).sort();
} catch {
  // no images folder yet
}
fs.writeFileSync(path.join(process.cwd(), "src", "lib", "photo-manifest.json"), JSON.stringify({ files }, null, 2) + "\n");
console.log(`[photos] ${files.length} local photo(s) found`);
