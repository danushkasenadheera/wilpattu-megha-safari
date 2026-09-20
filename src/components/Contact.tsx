"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { CheckCircle2, Send } from "lucide-react";
import { site } from "@/lib/site";
import type { TripType } from "@/lib/plan";
import { Reveal } from "./Reveal";
import { SectionHeading } from "./SectionHeading";

const field =
  "w-full rounded-2xl border border-brand/15 bg-white px-4 py-3 text-forest outline-none transition focus:border-brand focus:ring-4 focus:ring-brand/10";

const types: { value: TripType; label: string }[] = [
  { value: "safari", label: "Safari" },
  { value: "stay", label: "Stay" },
  { value: "both", label: "Stay + Safari" },
];

export function Contact() {
  const [status, setStatus] = useState<"idle" | "sending" | "sent" | "error">("idle");
  const [error, setError] = useState("");
  const [type, setType] = useState<TripType>("both");

  useEffect(() => {
    const onPlan = (e: Event) => setType((e as CustomEvent<{ type: TripType }>).detail.type);
    window.addEventListener("plan-trip", onPlan);
    return () => window.removeEventListener("plan-trip", onPlan);
  }, []);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    setStatus("sending");
    setError("");
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...Object.fromEntries(new FormData(form)), type }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.error ?? "Something went wrong.");
      form.reset();
      setStatus("sent");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
      setStatus("error");
    }
  }

  return (
    <section id="book" className="relative overflow-hidden bg-forest py-24 text-cream sm:py-32">
      <div className="pointer-events-none absolute -right-40 top-10 size-96 rounded-full bg-brand/40 blur-3xl" />
      <div className="relative mx-auto max-w-6xl px-6">
        <SectionHeading light eyebrow="04 · Book" title="Your journey starts here" />
        <div className="mt-14 grid gap-10 lg:grid-cols-5">
          <Reveal className="lg:col-span-2">
            <p className="text-lg text-cream/75">
              Tell us what you have in mind - a safari, a stay, or both - and roughly when. We&apos;ll reply with availability and the best way to plan it.
            </p>
            <a
              href={`https://wa.me/${site.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-7 inline-block rounded-full bg-gold px-7 py-3.5 font-semibold text-forest transition hover:scale-105"
            >
              Chat on WhatsApp {site.whatsappDisplay}
            </a>
            <div className="mt-6 flex gap-5 text-sm text-cream/70">
              <a className="hover:text-gold" href={site.facebook} target="_blank" rel="noopener noreferrer">Facebook</a>
              <a className="hover:text-gold" href={site.instagram} target="_blank" rel="noopener noreferrer">Instagram</a>
            </div>
          </Reveal>

          <Reveal delay={0.1} className="lg:col-span-3">
            <form onSubmit={onSubmit} className="space-y-4 rounded-[2rem] bg-cream p-6 text-forest shadow-2xl sm:p-8">
              <fieldset>
                <legend className="text-sm font-medium">I&apos;m interested in</legend>
                <div className="mt-2 grid grid-cols-3 gap-2" role="radiogroup">
                  {types.map((t) => (
                    <button
                      key={t.value}
                      type="button"
                      role="radio"
                      aria-checked={type === t.value}
                      onClick={() => setType(t.value)}
                      className={`rounded-2xl py-3 text-sm font-semibold transition ${type === t.value ? "bg-brand text-cream" : "bg-white text-forest ring-1 ring-brand/15 hover:bg-sand"}`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </fieldset>

              <div className="grid gap-4 sm:grid-cols-2">
                <label className="block text-sm font-medium">Preferred date
                  <input name="date" type="date" className={`${field} mt-1.5`} />
                </label>
                <label className="block text-sm font-medium">Guests
                  <input name="guests" type="number" min={1} max={50} placeholder="2" className={`${field} mt-1.5`} />
                </label>
                <label className="block text-sm font-medium">Name
                  <input name="name" required maxLength={100} autoComplete="name" className={`${field} mt-1.5`} />
                </label>
                <label className="block text-sm font-medium">Email
                  <input name="email" type="email" required maxLength={200} autoComplete="email" className={`${field} mt-1.5`} />
                </label>
              </div>
              <label className="block text-sm font-medium">Contact number
                <input name="phone" type="tel" maxLength={40} autoComplete="tel" className={`${field} mt-1.5`} />
              </label>
              <label className="block text-sm font-medium">Message
                <textarea name="message" required rows={4} maxLength={4000} className={`${field} mt-1.5 resize-y`} />
              </label>
              {/* Honeypot */}
              <input name="website" tabIndex={-1} autoComplete="off" aria-hidden className="hidden" />

              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={status === "sending"}
                className="flex w-full items-center justify-center gap-2 rounded-full bg-brand py-3.5 font-semibold text-cream transition hover:bg-brand-dark disabled:opacity-60"
              >
                {status === "sending" ? "Sending..." : <>Send enquiry <Send size={16} /></>}
              </motion.button>

              <AnimatePresence mode="wait">
                {status === "sent" && (
                  <motion.p initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} role="status" className="flex items-center gap-2 text-sm font-medium text-brand">
                    <CheckCircle2 size={18} /> Thank you! We&apos;ll be in touch soon.
                  </motion.p>
                )}
                {status === "error" && (
                  <motion.p initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} role="alert" className="text-sm font-medium text-red-700">
                    {error}
                  </motion.p>
                )}
              </AnimatePresence>
            </form>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
