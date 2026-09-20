"use client";

import Image from "next/image";
import { useState } from "react";
import { photoSlots } from "@/lib/photo-slots";
import { TopoArt } from "./TopoArt";

type Props = {
  src?: string | null;
  slot?: string;
  alt: string;
  sizes?: string;
  priority?: boolean;
  className?: string;
};

/**
 * Fills its (relative) parent with a photo. Falls back to a branded graphic if the
 * image is missing or can't load. In development it shows which file to add.
 */
export function PhotoBox({ src, slot, alt, sizes = "100vw", priority, className = "" }: Props) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div className="absolute inset-0 overflow-hidden bg-gradient-to-br from-brand via-forest-2 to-forest">
        <TopoArt className="absolute inset-0 size-full" opacity={0.5} />
        {process.env.NODE_ENV !== "production" && slot && (
          <p className="absolute inset-x-3 bottom-3 rounded-lg bg-black/50 p-2 text-[11px] leading-snug text-cream/90">
            Add public/images/{slot}.jpg - {photoSlots[slot]?.brief}
          </p>
        )}
      </div>
    );
  }

  return (
    <Image
      src={src}
      alt={alt}
      fill
      sizes={sizes}
      priority={priority}
      unoptimized={src.startsWith("http")}
      onError={() => setFailed(true)}
      className={`object-cover ${className}`}
    />
  );
}
