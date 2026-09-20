"use client";

const round = (n: number) => Math.round(n * 10) / 10;

function contour(k: number, cx: number, cy: number): string {
  const pts: string[] = [];
  const steps = 90;
  for (let i = 0; i <= steps; i++) {
    const t = (i / steps) * Math.PI * 2;
    const wobble = 1 + 0.09 * Math.sin(3 * t + k * 0.55) + 0.05 * Math.sin(5 * t - k * 0.8) + 0.03 * Math.cos(7 * t + k);
    const r = 34 * k * wobble;
    pts.push(`${round(cx + r * 1.55 * Math.cos(t))},${round(cy + r * Math.sin(t))}`);
  }
  return `M${pts.join("L")}Z`;
}

const paths = Array.from({ length: 16 }, (_, i) => contour(i + 2, 600, 400));

/** Slow-drifting contour lines - a nod to a park map, used as background art. */
export function TopoArt({ className = "", opacity = 0.35 }: { className?: string; opacity?: number }) {
  return (
    <svg viewBox="0 0 1200 800" preserveAspectRatio="xMidYMid slice" className={className} aria-hidden>
      <g
        style={{ opacity }}
        fill="none"
        stroke="#d9a441"
        strokeWidth="1"
      >
        {paths.map((d, i) => (
          <path key={i} d={d} strokeOpacity={0.25 + (i % 4) * 0.12} />
        ))}
      </g>
    </svg>
  );
}
