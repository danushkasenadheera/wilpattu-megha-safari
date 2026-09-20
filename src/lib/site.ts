export const site = {
  name: "Wilpattu Megha Safari",
  tagline: "Safari with experienced trackers",
  description:
    "Wilpattu National Park jeep safaris with highly experienced game drivers. Half day and full day safaris - leopards, sloth bears, elephants and the land of lakes.",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://www.wilpattumeghasafari.com",
  whatsapp: "94712884790",
  whatsappDisplay: "+94 71 288 4790",
  facebook: "https://www.facebook.com/meghasafariwilpattu",
  instagram: "https://www.instagram.com/nuwandevinda/",
};

export const journey = [
  { id: "welcome", label: "Welcome" },
  { id: "stay", label: "Stay" },
  { id: "safari", label: "Safari" },
  { id: "gallery", label: "Gallery" },
  { id: "book", label: "Book" },
] as const;

export const nav = journey.slice(1).map((j) => ({ href: `/#${j.id}`, label: j.label }));
