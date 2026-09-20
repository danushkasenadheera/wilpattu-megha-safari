import type { Photo } from "@/lib/photos";
import { GalleryGrid } from "./GalleryGrid";
import { SectionHeading } from "./SectionHeading";

export function GallerySection({ photos }: { photos: Photo[] }) {
  return (
    <section id="gallery" className="bg-cream py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <SectionHeading eyebrow="03 · Gallery" title="Moments from the wild" />
        <div className="mt-14">
          <GalleryGrid photos={photos} />
        </div>
      </div>
    </section>
  );
}
