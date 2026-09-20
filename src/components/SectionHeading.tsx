import { Reveal } from "./Reveal";

export function SectionHeading({
  eyebrow, title, light = false, center = true,
}: { eyebrow: string; title: string; light?: boolean; center?: boolean }) {
  return (
    <Reveal className={center ? "mx-auto max-w-2xl text-center" : "max-w-2xl"}>
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-gold">{eyebrow}</p>
      <h2 className={`mt-3 font-display text-4xl leading-tight sm:text-5xl ${light ? "text-cream" : "text-forest"}`}>
        {title}
      </h2>
      <div className={`mt-5 h-px w-16 bg-gold ${center ? "mx-auto" : ""}`} />
    </Reveal>
  );
}
