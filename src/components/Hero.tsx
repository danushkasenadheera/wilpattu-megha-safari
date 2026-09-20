"use client";

import { useRef, useState } from "react";
import { motion, useScroll, useTransform } from "motion/react";
import { ArrowDown, BedDouble, Compass, Layers } from "lucide-react";
import { site } from "@/lib/site";
import { planTrip, type TripType } from "@/lib/plan";
import { PhotoBox } from "./PhotoBox";
import { WaterCanvas } from "./WaterCanvas";

const words = ["Stay.", "Safari.", "Wilpattu."];
const choices: { type: TripType; label: string; icon: typeof Compass }[] = [
  { type: "safari", label: "Safari", icon: Compass },
  { type: "stay", label: "Stay", icon: BedDouble },
  { type: "both", label: "Both", icon: Layers },
];

/* Fade the leopard photo's left and top edges into the scene so it emerges from the shadows. */
const leopardMask =
  "linear-gradient(to right, transparent 0%, #000 34%), linear-gradient(to bottom, transparent 0%, #000 16%)";

export function Hero({ photo, lake }: { photo: string; lake?: string | null }) {
  const ref = useRef<HTMLElement>(null);
  const [type, setType] = useState<TripType>("both");
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const leopardX = useTransform(scrollYProgress, [0, 1], ["0%", "6%"]);
  const textY = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);

  return (
    <section id="welcome" ref={ref} className="relative isolate flex min-h-svh items-center overflow-hidden bg-forest text-cream">
      <WaterCanvas photo={lake} />

      {/* The leopard, emerging from the forest on the right (large screens) */}
      <motion.div
        initial={{ opacity: 0, x: 40 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ delay: 0.4, duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
        className="pointer-events-none absolute inset-y-0 right-0 hidden w-[62%] lg:block"
        style={{
          WebkitMaskImage: leopardMask,
          maskImage: leopardMask,
          WebkitMaskComposite: "source-in",
          maskComposite: "intersect",
        }}
      >
        <motion.div style={{ x: leopardX }} className="absolute inset-0 scale-105">
          <PhotoBox src={photo} slot="hero" alt="A Sri Lankan leopard resting in Wilpattu" sizes="62vw" priority className="object-[50%_16%]" />
        </motion.div>
      </motion.div>

      <div
        className={`pointer-events-none absolute inset-0 bg-gradient-to-r ${
          lake ? "from-forest/85 via-forest/45 to-forest/25" : "from-forest/75 via-forest/25 to-transparent"
        }`}
      />
      <div className="pointer-events-none absolute inset-x-0 top-0 h-40 bg-gradient-to-b from-forest/70 to-transparent" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-forest/60 to-transparent" />

      <div className="relative mx-auto w-full max-w-6xl px-6 pb-28 pt-28 lg:pb-14">
        <motion.div style={{ y: textY }} className="max-w-xl">
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-xs font-semibold uppercase tracking-[0.35em] text-gold"
          >
            Wilpattu National Park &middot; Sri Lanka
          </motion.p>

          <h1 className="mt-4 font-display text-6xl leading-[0.98] sm:text-7xl xl:text-8xl">
            {words.map((w, i) => (
              <span key={w} className="block overflow-hidden pb-1.5">
                <motion.span
                  className={`block ${i === 2 ? "italic text-gold" : ""}`}
                  initial={{ y: "105%" }}
                  animate={{ y: "0%" }}
                  transition={{ duration: 0.95, delay: 0.35 + i * 0.14, ease: [0.22, 1, 0.36, 1] }}
                >
                  {w}
                </motion.span>
              </span>
            ))}
          </h1>

          <motion.p
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="mt-5 max-w-lg text-lg text-cream/85"
          >
            Comfortable stays and expert-guided jeep safaris at the gateway to Sri Lanka&apos;s largest national park.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.2, duration: 0.8 }}
            className="mt-7 max-w-md rounded-3xl border border-cream/15 bg-forest/40 p-4 backdrop-blur-md"
          >
            <p className="px-1 text-xs font-semibold uppercase tracking-[0.25em] text-cream/60">Plan my trip</p>
            <div className="mt-3 grid grid-cols-3 gap-2" role="radiogroup" aria-label="What are you looking for?">
              {choices.map(({ type: t, label, icon: Icon }) => (
                <button
                  key={t}
                  type="button"
                  role="radio"
                  aria-checked={type === t}
                  onClick={() => setType(t)}
                  className={`flex flex-col items-center gap-1 rounded-2xl py-3 text-sm font-medium transition ${
                    type === t ? "bg-gold text-forest" : "bg-forest/50 text-cream/80 hover:bg-forest/70"
                  }`}
                >
                  <Icon size={18} />
                  {label}
                </button>
              ))}
            </div>
            <div className="mt-3 flex gap-2">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={() => planTrip(type)}
                className="flex-1 rounded-full bg-cream py-3 text-sm font-semibold text-forest"
              >
                Start planning
              </motion.button>
              <a
                href={`https://wa.me/${site.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-cream/30 px-5 py-3 text-sm font-semibold hover:bg-cream/10"
              >
                WhatsApp
              </a>
            </div>
          </motion.div>

          <div className="mt-6 border-l-2 border-gold/60 pl-3 lg:hidden">
            <p className="text-[11px] uppercase tracking-[0.3em] text-gold">Kumbukwila &middot; Wilpattu</p>
            <p className="mt-0.5 font-display text-lg italic text-cream/85">Touch the water to feel it</p>
          </div>
        </motion.div>
      </div>

      <motion.div
        animate={{ y: [0, -8, 0] }}
        transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
        className="pointer-events-none absolute bottom-32 left-[47%] hidden rounded-2xl border border-gold/30 bg-forest/80 px-4 py-3 text-sm shadow-xl backdrop-blur lg:block"
      >
        <span className="block text-[10px] uppercase tracking-[0.25em] text-gold">Guided by</span>
        Experienced trackers
      </motion.div>

      <div className="pointer-events-none absolute bottom-8 right-20 hidden rounded-2xl bg-forest/55 px-4 py-2 text-right backdrop-blur-sm lg:block">
        <p className="text-[11px] uppercase tracking-[0.3em] text-gold">Kumbukwila &middot; Wilpattu</p>
        <p className="mt-0.5 font-display text-lg italic text-cream/85">Touch the water to feel it</p>
      </div>

      <a href="#stay" aria-label="Scroll down" className="absolute bottom-24 left-1/2 hidden -translate-x-1/2 text-cream/60 lg:block">
        <motion.span animate={{ y: [0, 8, 0] }} transition={{ repeat: Infinity, duration: 1.8 }} className="block">
          <ArrowDown />
        </motion.span>
      </a>
    </section>
  );
}
