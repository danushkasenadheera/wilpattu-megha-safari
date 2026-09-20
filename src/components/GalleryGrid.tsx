"use client";

import Image from "next/image";
import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ChevronLeft, ChevronRight, X } from "lucide-react";

type Photo = { src: string; alt: string };

export function GalleryGrid({ photos }: { photos: Photo[] }) {
  const [active, setActive] = useState<number | null>(null);
  const close = useCallback(() => setActive(null), []);
  const step = useCallback(
    (d: number) => setActive((i) => (i === null ? null : (i + d + photos.length) % photos.length)),
    [photos.length],
  );

  useEffect(() => {
    if (active === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      if (e.key === "ArrowRight") step(1);
      if (e.key === "ArrowLeft") step(-1);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active, close, step]);

  return (
    <>
      <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
        {photos.map((p, i) => (
          <motion.button
            key={p.src}
            type="button"
            onClick={() => setActive(i)}
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-60px" }}
            transition={{ duration: 0.6, delay: (i % 3) * 0.08 }}
            className="group relative mb-4 block w-full overflow-hidden rounded-2xl bg-forest"
          >
            <Image src={p.src} alt={p.alt} width={900} height={700} unoptimized={p.src.startsWith("http")} sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw" className="h-auto w-full transition duration-700 group-hover:scale-105" />
            <span className="absolute inset-0 bg-forest/0 transition group-hover:bg-forest/25" />
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {active !== null && (
          <motion.div
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] grid place-items-center bg-forest/95 p-4 backdrop-blur"
            onClick={close} role="dialog" aria-modal="true" aria-label="Photo viewer"
          >
            <button aria-label="Close" onClick={close} className="absolute right-5 top-5 rounded-full bg-cream/10 p-3 text-cream hover:bg-cream/20"><X /></button>
            <button aria-label="Previous" onClick={(e) => { e.stopPropagation(); step(-1); }} className="absolute left-4 rounded-full bg-cream/10 p-3 text-cream hover:bg-cream/20"><ChevronLeft /></button>
            <button aria-label="Next" onClick={(e) => { e.stopPropagation(); step(1); }} className="absolute right-4 rounded-full bg-cream/10 p-3 text-cream hover:bg-cream/20"><ChevronRight /></button>
            <motion.div
              key={active}
              initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="relative h-[80vh] w-full max-w-5xl"
              onClick={(e) => e.stopPropagation()}
            >
              <Image src={photos[active].src} alt={photos[active].alt} fill unoptimized={photos[active].src.startsWith("http")} sizes="90vw" className="object-contain" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
