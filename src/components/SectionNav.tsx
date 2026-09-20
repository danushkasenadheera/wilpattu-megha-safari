"use client";

import { useEffect, useState } from "react";
import { motion, useScroll, useSpring } from "motion/react";
import { BedDouble, CalendarCheck, Compass, Images } from "lucide-react";
import { journey } from "@/lib/site";

const ids = journey.map((j) => j.id);

function useActiveSection() {
  const [active, setActive] = useState<string>(ids[0]);
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-45% 0px -50% 0px" },
    );
    ids.forEach((id) => {
      const el = document.getElementById(id);
      if (el) observer.observe(el);
    });
    return () => observer.disconnect();
  }, []);
  return active;
}

const go = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

/** Desktop: thin progress rail with a dot per stop. Phones: app-style bottom dock. */
export function SectionNav() {
  const active = useActiveSection();
  const { scrollYProgress } = useScroll();
  const fill = useSpring(scrollYProgress, { stiffness: 120, damping: 24 });

  const dock = [
    { id: "stay", label: "Stay", icon: BedDouble },
    { id: "safari", label: "Safari", icon: Compass },
    { id: "gallery", label: "Gallery", icon: Images },
    { id: "book", label: "Book", icon: CalendarCheck },
  ];

  return (
    <>
      {/* Desktop rail */}
      <nav aria-label="Page journey" className="fixed right-4 top-1/2 z-40 hidden -translate-y-1/2 lg:block">
        <div className="relative rounded-full border border-cream/15 bg-forest/70 px-2.5 py-5 shadow-xl backdrop-blur-md">
          <div className="absolute inset-y-5 left-1/2 w-px -translate-x-1/2 bg-cream/15" />
          <motion.div style={{ scaleY: fill }} className="absolute inset-y-5 left-1/2 w-px origin-top -translate-x-1/2 bg-gold" />
          <ul className="relative flex flex-col gap-6">
            {journey.map((j) => {
              const on = active === j.id;
              return (
                <li key={j.id} className="group relative">
                  <button type="button" onClick={() => go(j.id)} aria-label={j.label} aria-current={on ? "true" : undefined} className="grid size-5 place-items-center">
                    <span className={`block rounded-full border transition-all duration-300 ${on ? "size-3.5 border-gold bg-gold" : "size-2.5 border-cream/50 bg-forest group-hover:border-gold"}`} />
                  </button>
                  <span
                    className={`pointer-events-none absolute right-full top-1/2 mr-4 -translate-y-1/2 whitespace-nowrap rounded-full bg-forest px-3 py-1 text-xs text-cream shadow-lg transition ${
                      on ? "opacity-100" : "opacity-0 group-hover:opacity-100"
                    }`}
                  >
                    {j.label}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>
      </nav>

      {/* Mobile dock */}
      <nav aria-label="Quick navigation" className="fixed inset-x-3 bottom-3 z-50 lg:hidden">
        <ul className="mx-auto flex max-w-md items-center justify-between rounded-3xl border border-cream/15 bg-forest/90 p-1.5 shadow-2xl backdrop-blur-md">
          {dock.map(({ id, label, icon: Icon }) => {
            const on = active === id;
            return (
              <li key={id} className="flex-1">
                <button type="button" onClick={() => go(id)} aria-current={on ? "true" : undefined} className="relative flex w-full flex-col items-center gap-0.5 rounded-2xl py-2 text-[11px] font-medium">
                  {on && <motion.span layoutId="dock-pill" className="absolute inset-0 rounded-2xl bg-gold" transition={{ type: "spring", stiffness: 380, damping: 32 }} />}
                  <span className={`relative flex flex-col items-center gap-0.5 ${on ? "text-forest" : "text-cream/75"}`}>
                    <Icon size={19} />
                    {label}
                  </span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>
    </>
  );
}
