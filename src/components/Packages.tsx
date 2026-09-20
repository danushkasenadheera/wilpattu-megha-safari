"use client";

import { motion } from "motion/react";
import { Check, Clock, CalendarDays } from "lucide-react";
import { formatPrice } from "@/lib/packages";
import { site } from "@/lib/site";
import type { SafariPackage } from "@/lib/types";
import { sightings } from "@/lib/stay";
import { PhotoBox } from "./PhotoBox";
import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";

export function Packages({ packages, photos }: { packages: SafariPackage[]; photos: Record<string, string> }) {
  return (
    <section id="safari" className="relative overflow-hidden bg-forest py-24 text-cream sm:py-32">
      <div className="pointer-events-none absolute -left-40 top-20 size-96 rounded-full bg-brand/40 blur-3xl" />
      <div className="pointer-events-none absolute -right-40 bottom-10 size-96 rounded-full bg-gold/10 blur-3xl" />

      <div className="relative mx-auto max-w-6xl px-6">
        <SectionHeading light eyebrow="02 · Safari" title="Choose your Wilpattu adventure" />
        <Reveal delay={0.1} className="mx-auto mt-6 max-w-xl text-center text-cream/70">
          Prices are in US dollars, per person. The more of you there are, the less each person pays.
        </Reveal>

        {packages.length === 0 ? (
          <p className="mt-16 text-center text-cream/70">Packages will be listed here soon. Message us on WhatsApp for current rates.</p>
        ) : (
          <div className="mt-16 grid gap-8 lg:grid-cols-2">
            {packages.map((pkg, i) => (
              <Reveal key={pkg.id} delay={i * 0.15}>
                <motion.article
                  whileHover={{ y: -8 }}
                  transition={{ type: "spring", stiffness: 260, damping: 22 }}
                  className="relative h-full overflow-hidden rounded-[2rem] border border-gold/20 bg-forest-2/80 p-8 shadow-2xl shadow-black/30 backdrop-blur sm:p-10"
                >
                  <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-brand via-gold to-brand" />
                  <h3 className="font-display text-3xl sm:text-4xl">{pkg.name}</h3>
                  <div className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-sm text-gold-soft">
                    {pkg.duration && <span className="flex items-center gap-1.5"><Clock size={15} />{pkg.duration}</span>}
                    {pkg.schedule && <span className="flex items-center gap-1.5"><CalendarDays size={15} />{pkg.schedule}</span>}
                  </div>
                  {pkg.description && <p className="mt-5 text-cream/75">{pkg.description}</p>}

                  <ul className="mt-8 divide-y divide-cream/10 rounded-2xl border border-cream/10 bg-forest/60">
                    {pkg.package_prices.map((p, k) => (
                      <motion.li
                        key={p.id}
                        initial={{ opacity: 0, x: -16 }}
                        whileInView={{ opacity: 1, x: 0 }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.25 + k * 0.1 }}
                        className="flex items-baseline justify-between px-5 py-4"
                      >
                        <span className="text-cream/85">{p.label}</span>
                        <span className="text-right">
                          <span className="font-display text-2xl text-gold">{formatPrice(p.price, p.price_to)}</span>
                          <span className="ml-1.5 text-xs text-cream/50">{p.unit}</span>
                        </span>
                      </motion.li>
                    ))}
                  </ul>

                  {pkg.inclusions.length > 0 && (
                    <>
                      <p className="mt-8 text-xs font-semibold uppercase tracking-[0.25em] text-cream/50">Included</p>
                      <ul className="mt-3 grid gap-2 text-sm text-cream/80 sm:grid-cols-2">
                        {pkg.inclusions.map((inc) => (
                          <li key={inc} className="flex items-start gap-2">
                            <Check size={16} className="mt-0.5 shrink-0 text-gold" />
                            {inc}
                          </li>
                        ))}
                      </ul>
                    </>
                  )}

                  <motion.a
                    whileHover={{ scale: 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    href={`https://wa.me/${site.whatsapp}?text=${encodeURIComponent(`Hi! I'd like to book the ${pkg.name}.`)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="mt-8 block rounded-full bg-gold py-3.5 text-center font-semibold text-forest"
                  >
                    Book the {pkg.name}
                  </motion.a>
                </motion.article>
              </Reveal>
            ))}
          </div>
        )}

        <div className="mt-24">
          <Reveal className="text-center">
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold">On the tracks</p>
            <h3 className="mt-3 font-display text-3xl sm:text-4xl">What you might see</h3>
          </Reveal>
          <div className="-mx-6 mt-10 flex snap-x snap-mandatory gap-4 overflow-x-auto px-6 pb-4 md:mx-0 md:grid md:grid-cols-5 md:overflow-visible md:px-0">
            {sightings.map((s, i) => (
              <Reveal key={s.slot} delay={i * 0.08} className="w-56 shrink-0 snap-center md:w-auto">
                <motion.figure whileHover={{ y: -8 }} className="group relative aspect-[3/4] overflow-hidden rounded-3xl bg-forest-2">
                  <PhotoBox src={photos[s.slot]} slot={s.slot} alt={s.name} sizes="(min-width: 768px) 20vw, 224px" className="transition duration-700 group-hover:scale-110" />
                  <div className="absolute inset-0 bg-gradient-to-t from-forest via-forest/20 to-transparent" />
                  <figcaption className="absolute inset-x-0 bottom-0 p-4 font-display text-lg">{s.name}</figcaption>
                </motion.figure>
              </Reveal>
            ))}
          </div>
          <p className="mt-4 text-center text-sm text-cream/50">Wildlife is wild - sightings can&apos;t be guaranteed, but our trackers know where to look.</p>
        </div>
      </div>
    </section>
  );
}
