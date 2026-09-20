/**
 * Every photo spot on the site. To use your own photo, save it in /public/images
 * named exactly "<slot>.jpg" (or .webp/.png) - e.g. public/images/hero.jpg.
 * Until then a keyword-matched SAMPLE photo from loremflickr.com is shown, and if
 * that can't load either, a branded graphic. "brief" says what photo belongs here.
 */
export type PhotoSlot = { brief: string; sample: string; lock: number; w: number; h: number };

export const photoSlots: Record<string, PhotoSlot> = {
  hero: { brief: "Tall/portrait hero: a leopard resting on a branch or rock, golden light", sample: "leopard", lock: 11, w: 900, h: 1200 },

  "stay-main": { brief: "Warm exterior or veranda of your accommodation, ideally at sunrise", sample: "villa,tropical,resort", lock: 21, w: 1000, h: 1250 },
  "room-1": { brief: "Your standard room, bed made, natural light", sample: "hotel,bedroom", lock: 22, w: 900, h: 700 },
  "room-2": { brief: "Your family room", sample: "bedroom,cozy", lock: 23, w: 900, h: 700 },
  "room-3": { brief: "Group / shared stay option, or dining & lounge area", sample: "lounge,terrace", lock: 24, w: 900, h: 700 },

  "sighting-leopard": { brief: "Sri Lankan leopard", sample: "leopard", lock: 31, w: 700, h: 900 },
  "sighting-bear": { brief: "Sloth bear", sample: "bear", lock: 32, w: 700, h: 900 },
  "sighting-elephant": { brief: "Elephant near a villu", sample: "elephant", lock: 33, w: 700, h: 900 },
  "sighting-birds": { brief: "Painted storks, peacock or another Wilpattu bird", sample: "stork,peacock", lock: 34, w: 700, h: 900 },
  "sighting-deer": { brief: "Spotted deer", sample: "deer", lock: 35, w: 700, h: 900 },

};

export const gallerySamples: { sample: string; lock: number; alt: string }[] = [
  { sample: "leopard", lock: 51, alt: "Leopard in the wild" },
  { sample: "elephant", lock: 52, alt: "Elephant in a villu" },
  { sample: "jeep,safari", lock: 53, alt: "Safari jeep on a forest track" },
  { sample: "lake,sunrise", lock: 54, alt: "Sunrise over a lake" },
  { sample: "peacock", lock: 55, alt: "Peacock" },
  { sample: "deer,forest", lock: 56, alt: "Spotted deer" },
  { sample: "crocodile", lock: 57, alt: "Crocodile at the water's edge" },
  { sample: "stork,bird", lock: 58, alt: "Painted stork" },
];

export const sampleUrl = (sample: string, lock: number, w: number, h: number) =>
  `https://loremflickr.com/${w}/${h}/${sample}?lock=${lock}`;
