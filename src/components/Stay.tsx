"use client";

import { motion } from "motion/react";
import { Check } from "lucide-react";
import { stay } from "@/lib/stay";
import { planTrip } from "@/lib/plan";
import { PhotoBox } from "./PhotoBox";
import { Reveal } from "./Reveal";

export function Stay({ photos }: { photos: Record<string, string> }) {
  return (
    <section id="stay" className="relative bg-cream py-24 sm:py-32">
      <div className="mx-auto max-w-6xl px-6">
        <div className="grid items-center gap-12 lg:grid-cols-2">
          <Reveal>
            <div className="relative aspect-[4/5] overflow-hidden rounded-[2rem] shadow-2xl shadow-forest/20">
              <PhotoBox src={photos["stay-main"]} slot="stay-main" alt="Our accommodation near Wilpattu" sizes="(min-width: 1024px) 45vw, 100vw" />
              <div className="absolute inset-0 bg-gradient-to-t from-forest/40 to-transparent" />
            </div>
          </Reveal>

          <div>
            <Reveal>
              <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold">01 &middot; Stay</p>
              <h2 className="mt-3 font-display text-4xl leading-tight text-forest sm:text-5xl">{stay.headline}</h2>
              <div className="mt-5 h-px w-16 bg-gold" />
              <p className="mt-6 text-lg leading-relaxed text-forest/75">{stay.intro}</p>
            </Reveal>
            <Reveal delay={0.1}>
              <ul className="mt-8 grid gap-3 sm:grid-cols-2">
                {stay.amenities.map((a) => (
                  <li key={a} className="flex items-center gap-2.5 text-forest">
                    <span className="grid size-6 place-items-center rounded-full bg-brand text-cream"><Check size={14} /></span>
                    {a}
                  </li>
                ))}
              </ul>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                type="button"
                onClick={() => planTrip("stay")}
                className="mt-9 rounded-full bg-brand px-8 py-3.5 font-semibold text-cream hover:bg-brand-dark"
              >
                Enquire about a stay
              </motion.button>
            </Reveal>
          </div>
        </div>

        <div className="mt-20 grid gap-6 md:grid-cols-3">
          {stay.rooms.map((r, i) => (
            <Reveal key={r.slot} delay={i * 0.1}>
              <motion.article whileHover={{ y: -8 }} transition={{ type: "spring", stiffness: 280, damping: 22 }} className="overflow-hidden rounded-3xl bg-white/70 shadow-sm ring-1 ring-brand/10">
                <div className="relative aspect-[4/3]">
                  <PhotoBox src={photos[r.slot]} slot={r.slot} alt={r.name} sizes="(min-width: 768px) 33vw, 100vw" className="transition duration-700 hover:scale-105" />
                </div>
                <div className="p-6">
                  <h3 className="font-display text-2xl text-forest">{r.name}</h3>
                  <p className="mt-2 text-forest/70">{r.text}</p>
                  <div className="mt-5 flex items-center justify-between">
                    <span className="text-sm text-forest/50">Rates on request</span>
                    <button type="button" onClick={() => planTrip("stay")} className="text-sm font-semibold text-brand hover:underline">Enquire</button>
                  </div>
                </div>
              </motion.article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
