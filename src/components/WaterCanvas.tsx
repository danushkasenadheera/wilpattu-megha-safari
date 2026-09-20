"use client";

import { useEffect, useRef } from "react";

/* Lake scene + a real ripple simulation. Click / tap / move over the water and rings spread across it.
   - With a photo (public/images/hero-lake.jpg): the photo is used as-is and only its WATER area ripples.
   - Without one: a built-in black & white lake with dead trees and a mirrored reflection is drawn. */

function mulberry32(seed: number) {
  let a = seed;
  return () => {
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function drawTree(g: CanvasRenderingContext2D, x: number, y: number, len: number, angle: number, width: number, depth: number, rand: () => number) {
  if (depth === 0 || len < 2) return;
  const x2 = x + Math.cos(angle) * len;
  const y2 = y + Math.sin(angle) * len;
  g.lineWidth = Math.max(width, 0.6);
  g.beginPath();
  g.moveTo(x, y);
  g.lineTo(x2, y2);
  g.stroke();
  const branches = depth > 3 ? (rand() < 0.7 ? 2 : 3) : rand() < 0.5 ? 1 : 2;
  for (let i = 0; i < branches; i++) {
    const spread = (rand() - 0.5) * 1.7;
    drawTree(g, x2, y2, len * (0.66 + rand() * 0.18), angle + spread, width * 0.66, depth - 1, rand);
  }
}

const clamp = (v: number, lo: number, hi: number) => Math.min(hi, Math.max(lo, v));

/**
 * Where the water begins, as a fraction of the PHOTO's height, by fraction of its width.
 * Tuned for the mangrove-shore photo: open water on the left starts at the far shoreline,
 * while on the right the tree trunks stand in the water, so ripples start lower there.
 * If you swap the photo, adjust these numbers.
 */
function photoWaterTop(u: number): number {
  const leftTop = 0.47;
  const rightTop = 0.595;
  if (u <= 0.4) return leftTop;
  if (u >= 0.62) return rightTop;
  return leftTop + ((u - 0.4) / 0.22) * (rightTop - leftTop);
}

function buildScene(W: number, H: number, photo: HTMLImageElement | null, mono: boolean) {
  const c = document.createElement("canvas");
  c.width = W;
  c.height = H;
  const g = c.getContext("2d", { willReadFrequently: true })!;
  const top = new Int16Array(W);

  if (photo) {
    const s = Math.max(W / photo.width, H / photo.height);
    const w = photo.width * s;
    const h = photo.height * s;
    const ox = (W - w) / 2;
    const oy = (H - h) / 2;
    g.drawImage(photo, ox, oy, w, h);
    for (let x = 0; x < W; x++) top[x] = clamp(Math.round(oy + photoWaterTop(clamp((x - ox) / w, 0, 1)) * h), 0, H - 2);
    if (mono) {
      const img = g.getImageData(0, 0, W, H);
      const d = img.data;
      for (let i = 0; i < d.length; i += 4) d[i] = d[i + 1] = d[i + 2] = d[i] * 0.3 + d[i + 1] * 0.59 + d[i + 2] * 0.11;
      g.putImageData(img, 0, 0);
    }
    return { canvas: c, top };
  }

  const hy = Math.round(H * 0.56);
  top.fill(hy);

  const sky = g.createLinearGradient(0, 0, 0, hy);
  sky.addColorStop(0, "#0b0c0c");
  sky.addColorStop(0.55, "#353837");
  sky.addColorStop(1, "#a7aba8");
  g.fillStyle = sky;
  g.fillRect(0, 0, W, hy);

  const gx = W * 0.7;
  const gy = hy * 0.88;
  const glow = g.createRadialGradient(gx, gy, 0, gx, gy, W * 0.3);
  glow.addColorStop(0, "rgba(255,255,255,0.9)");
  glow.addColorStop(0.12, "rgba(235,237,235,0.4)");
  glow.addColorStop(1, "rgba(255,255,255,0)");
  g.fillStyle = glow;
  g.fillRect(0, 0, W, hy);

  const rand = mulberry32(11);
  g.fillStyle = "#171918";
  g.beginPath();
  g.moveTo(0, hy);
  for (let x = 0; x <= W; x += 5) g.lineTo(x, hy - H * (0.018 + 0.018 * Math.abs(Math.sin(x * 0.011) + Math.sin(x * 0.037 + 2)) * 0.5 + rand() * 0.006));
  g.lineTo(W, hy);
  g.closePath();
  g.fill();

  g.strokeStyle = "#080909";
  g.lineCap = "round";
  const trees = [
    { x: 0.07, s: 0.55 }, { x: 0.15, s: 1.0 }, { x: 0.3, s: 0.6 }, { x: 0.43, s: 0.85 },
    { x: 0.57, s: 0.4 }, { x: 0.79, s: 0.95 }, { x: 0.9, s: 0.6 },
  ];
  const tr = mulberry32(5);
  for (const t of trees) drawTree(g, W * t.x, hy + 1, H * 0.16 * t.s, -Math.PI / 2 + (tr() - 0.5) * 0.25, H * 0.012 * t.s, 8, tr);

  const mist = g.createLinearGradient(0, hy - H * 0.09, 0, hy + 2);
  mist.addColorStop(0, "rgba(205,208,206,0)");
  mist.addColorStop(1, "rgba(205,208,206,0.4)");
  g.fillStyle = mist;
  g.fillRect(0, hy - H * 0.09, W, H * 0.09 + 2);

  const tmp = document.createElement("canvas");
  tmp.width = W;
  tmp.height = hy;
  tmp.getContext("2d")!.drawImage(c, 0, 0, W, hy, 0, 0, W, hy);
  g.fillStyle = "#050505";
  g.fillRect(0, hy, W, H - hy);
  g.save();
  g.translate(0, 2 * hy);
  g.scale(1, -1);
  g.globalAlpha = 0.85;
  g.drawImage(tmp, 0, 0);
  g.restore();
  const deep = g.createLinearGradient(0, hy, 0, H);
  deep.addColorStop(0, "rgba(0,0,0,0.15)");
  deep.addColorStop(1, "rgba(0,0,0,0.7)");
  g.fillStyle = deep;
  g.fillRect(0, hy, W, H - hy);

  const img = g.getImageData(0, 0, W, H);
  const d = img.data;
  for (let i = 0; i < d.length; i += 4) d[i] = d[i + 1] = d[i + 2] = d[i] * 0.3 + d[i + 1] * 0.59 + d[i + 2] * 0.11;
  g.putImageData(img, 0, 0);
  return { canvas: c, top };
}

type Props = {
  /** URL of a same-origin lake photo. Omit to use the built-in illustrated lake. */
  photo?: string | null;
  /** Convert a supplied photo to black & white. */
  mono?: boolean;
};

export function WaterCanvas({ photo, mono = false }: Props) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const parent = canvas.parentElement!;
    const ctx = canvas.getContext("2d")!;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let raf = 0;
    let visible = true;
    let disposed = false;
    let photoImg: HTMLImageElement | null = null;
    let resizeTimer = 0;
    let teardown: (() => void) | null = null;

    function setup() {
      teardown?.();
      const cssW = parent.clientWidth;
      const cssH = parent.clientHeight;
      if (!cssW || !cssH) return;
      const scale = Math.min(photoImg ? 0.65 : 0.5, (photoImg ? 960 : 720) / cssW);
      const W = Math.max(64, Math.round(cssW * scale));
      const H = Math.max(64, Math.round(cssH * scale));
      canvas!.width = W;
      canvas!.height = H;

      const { canvas: sc, top } = buildScene(W, H, photoImg, mono);
      const src = sc.getContext("2d")!.getImageData(0, 0, W, H);
      const sd = src.data;
      ctx.putImageData(src, 0, 0);
      if (reduce) {
        teardown = null;
        return;
      }

      let minTop = H;
      for (let x = 0; x < W; x++) minTop = Math.min(minTop, top[x]);
      if (minTop >= H - 3) return;

      const out = ctx.createImageData(W, H);
      out.data.set(sd);
      const od = out.data;
      let cur = new Float32Array(W * H);
      let prev = new Float32Array(W * H);

      const drop = (px: number, py: number, radius: number, strength: number) => {
        const x = Math.round(px);
        const y = Math.round(py);
        if (x < 1 || x >= W - 1 || y < top[x]) return;
        for (let j = -radius; j <= radius; j++)
          for (let i = -radius; i <= radius; i++) {
            const xx = x + i;
            const yy = y + j;
            if (xx < 1 || yy < 1 || xx >= W - 1 || yy >= H - 1) continue;
            const dist = Math.hypot(i, j / 0.55);
            if (dist <= radius) cur[yy * W + xx] += strength * Math.cos((dist / radius) * Math.PI * 0.5);
          }
      };

      const toCanvas = (cx: number, cy: number) => {
        const r = canvas!.getBoundingClientRect();
        if (cx < r.left || cx > r.right || cy < r.top || cy > r.bottom) return null;
        return { x: ((cx - r.left) / r.width) * W, y: ((cy - r.top) / r.height) * H };
      };

      // A click on dry ground (trees, sky) drops the ripple at the nearest water below it.
      const waterPoint = (p: { x: number; y: number }) => {
        const x = clamp(Math.round(p.x), 1, W - 2);
        return { x, y: Math.max(p.y, top[x] + 4) };
      };

      const onDown = (e: PointerEvent) => {
        const p = toCanvas(e.clientX, e.clientY);
        if (!p) return;
        const w = waterPoint(p);
        drop(w.x, w.y, 4, photoImg ? 160 : 140);
      };
      let last = 0;
      const onMove = (e: PointerEvent) => {
        const now = performance.now();
        if (now - last < 70) return;
        const p = toCanvas(e.clientX, e.clientY);
        if (!p) return;
        const x = clamp(Math.round(p.x), 1, W - 2);
        if (p.y > top[x]) {
          last = now;
          drop(p.x, p.y, 2, 16);
        }
      };
      window.addEventListener("pointerdown", onDown);
      window.addEventListener("pointermove", onMove);

      const refr = photoImg ? 0.7 : 0.5;
      const light = photoImg ? 1.1 : 1.7;
      let nextAmbient = 0;
      const frame = (t: number) => {
        raf = requestAnimationFrame(frame);
        if (!visible || document.hidden) return;
        if (t > nextAmbient) {
          nextAmbient = t + 1400 + Math.random() * 1600;
          const ax = 4 + Math.random() * (W - 8);
          drop(ax, top[Math.round(ax)] + 6 + Math.random() * (H - top[Math.round(ax)] - 12), 3, 26);
        }
        for (let step = 0; step < 2; step++) {
          for (let y = minTop - 1; y < H - 1; y++) {
            const row = y * W;
            for (let x = 1; x < W - 1; x++) {
              const i = row + x;
              prev[i] = ((cur[i - 1] + cur[i + 1]) * 0.7 + (cur[i - W] + cur[i + W]) * 0.3 - prev[i]) * 0.988;
            }
          }
          const tmp = prev;
          prev = cur;
          cur = tmp;
        }
        for (let y = minTop; y < H - 1; y++) {
          const row = y * W;
          for (let x = 1; x < W - 1; x++) {
            const wt = top[x];
            if (y < wt) continue;
            const i = row + x;
            const dx = cur[i + 1] - cur[i - 1];
            const dy = cur[i + W] - cur[i - W];
            let sx = (x + dx * refr) | 0;
            let sy = (y + dy * refr) | 0;
            if (sx < 0) sx = 0; else if (sx > W - 1) sx = W - 1;
            if (sy < wt) sy = wt; else if (sy > H - 1) sy = H - 1;
            const si = (sy * W + sx) * 4;
            const shade = dx * light + dy * light * 0.65;
            const o = i * 4;
            od[o] = sd[si] + shade;
            od[o + 1] = sd[si + 1] + shade;
            od[o + 2] = sd[si + 2] + shade;
          }
        }
        ctx.putImageData(out, 0, 0, 0, minTop, W, H - minTop);
      };
      raf = requestAnimationFrame(frame);

      teardown = () => {
        cancelAnimationFrame(raf);
        window.removeEventListener("pointerdown", onDown);
        window.removeEventListener("pointermove", onMove);
      };
    }

    if (photo) {
      const im = new Image();
      im.onload = () => {
        if (disposed) return;
        photoImg = im;
        setup();
      };
      im.src = photo;
    }
    setup();

    const io = new IntersectionObserver(([e]) => (visible = e.isIntersecting));
    io.observe(parent);
    const ro = new ResizeObserver(() => {
      window.clearTimeout(resizeTimer);
      resizeTimer = window.setTimeout(setup, 200);
    });
    ro.observe(parent);

    return () => {
      disposed = true;
      window.clearTimeout(resizeTimer);
      teardown?.();
      io.disconnect();
      ro.disconnect();
    };
  }, [photo, mono]);

  return <canvas ref={ref} className="absolute inset-0 size-full" aria-hidden />;
}
