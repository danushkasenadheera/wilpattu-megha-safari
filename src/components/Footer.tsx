import Image from "next/image";
import Link from "next/link";
import { nav, site } from "@/lib/site";

export function Footer() {
  return (
    <footer className="bg-forest text-cream/80">
      <div className="mx-auto grid max-w-6xl gap-10 px-6 py-14 md:grid-cols-3">
        <div>
          <div className="inline-block rounded-2xl bg-cream px-4 py-2">
            <Image src="/logo.png" alt={site.name} width={150} height={52} className="h-11 w-auto" />
          </div>
          <p className="mt-4 max-w-xs text-sm">{site.description}</p>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gold">Explore</p>
          <ul className="mt-4 space-y-2 text-sm">
            {nav.map((n) => (
              <li key={n.href}><Link href={n.href} className="hover:text-gold">{n.label}</Link></li>
            ))}
          </ul>
        </div>
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-gold">Get in touch</p>
          <ul className="mt-4 space-y-2 text-sm">
            <li><a className="hover:text-gold" href={`https://wa.me/${site.whatsapp}`} target="_blank" rel="noopener noreferrer">WhatsApp {site.whatsappDisplay}</a></li>
            <li><a className="hover:text-gold" href={site.facebook} target="_blank" rel="noopener noreferrer">Facebook</a></li>
            <li><a className="hover:text-gold" href={site.instagram} target="_blank" rel="noopener noreferrer">Instagram</a></li>
          </ul>
        </div>
      </div>
      <div className="border-t border-cream/10 py-5 text-center text-xs text-cream/50">
        &copy; {new Date().getFullYear()} {site.name}. All rights reserved.
      </div>
    </footer>
  );
}
