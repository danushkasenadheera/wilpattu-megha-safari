"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "motion/react";
import { MessageCircle } from "lucide-react";
import { site } from "@/lib/site";
import { planTrip } from "@/lib/plan";

/** Deliberately minimal: logo + one action. Navigation lives in the journey rail / dock. */
export function Navbar() {
  return (
    <motion.header
      initial={{ y: -40, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
      className="fixed inset-x-0 top-0 z-50 flex items-start justify-between px-4 pt-4 sm:px-8"
    >
      {/* The logo has black lettering, so it sits on a light tile to stay legible on dark sections */}
      <Link href="/" aria-label={`${site.name} home`} className="rounded-2xl bg-cream/95 px-3 py-1.5 shadow-lg shadow-black/20 backdrop-blur">
        <Image src="/logo.png" alt={site.name} width={150} height={52} priority className="h-10 w-auto sm:h-11" />
      </Link>

      <div className="flex items-center gap-2 lg:mr-14">
        <a
          href={`https://wa.me/${site.whatsapp}`}
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Chat on WhatsApp"
          className="grid size-11 place-items-center rounded-full bg-cream/95 text-brand shadow-lg shadow-black/20 backdrop-blur transition hover:scale-105"
        >
          <MessageCircle size={20} />
        </a>
        <button
          type="button"
          onClick={() => planTrip("both")}
          className="rounded-full bg-gold px-5 py-3 text-sm font-semibold text-forest shadow-lg shadow-black/20 transition hover:scale-105"
        >
          Book now
        </button>
      </div>
    </motion.header>
  );
}
