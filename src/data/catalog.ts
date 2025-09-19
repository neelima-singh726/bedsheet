// src/data/catalog.ts

export type Product = {
  handle: string;
  title: string;
  price: number;
  originalPrice?: number; // For showing a sale price
  description?: string; // For the detailed product description
  images: string[];
  rating?: { stars: number; reviews: number }; // To include stars and review count
  collection: string; // slug of the collection
  badges?: string[]; // e.g. ["NEW ARRIVAL"]
  sizes?: ("Single" | "Queen" | "King")[];
};

export type Collection = {
  slug: string;
  title: string;
  hero?: string; // banner image under /public/banners/*.jpg
  description?: string; // optional subtitle
};

// ---- Collections (categories) ----
export const collections: Collection[] = [
  {
    slug: "printed-sheets",
    title: "Printed Bedsheets",
    hero: "/banners/printed.png",
    description: "Playful prints in breathable cotton.",
  },
  {
    slug: "fitted-sheets",
    title: "Fitted Sheets",
    hero: "/banners/fitted.png",
    description: "Snug fits, wrinkle-free corners.",
  },
  {
    slug: "luxury-sheets",
    title: "Luxury Sheets",
    hero: "/banners/luxury.png",
    description: "Premium weaves and jacquards.",
  },
  {
    slug: "duvet-covers",
    title: "Duvet Covers",
    hero: "/banners/duet.png",
  },
  {
    slug: "ac-comforters",
    title: "AC Comforters",
    hero: "/banners/ac.png",
  },
  {
    slug: "premium",
    title: "Premium Collections",
    hero: "/banners/premium.jpg",
  },
];

// ---- Products (sample data; with original handles) ----
export const products: Product[] = [
  // Printed Sheets
  {
    handle: "printed-sheets", // << Restored original handle
    title: "Solid - 300TC (Fitted)",
    price: 3999,
    originalPrice: 4499,
    collection: "printed-sheets",
    images: ["/demo/pink-1.png", "/demo/pink-1.png", "/demo/pink-1.png"],
    sizes: ["Single", "Queen", "King"],
    rating: { stars: 4.5, reviews: 12 },
    description: `Experience the perfect blend of comfort and style with our 300 Thread Count fitted bedsheets. Made from 100% breathable cotton, these sheets feature playful prints that brighten any bedroom. The deep pockets and all-around elastic ensure a snug, wrinkle-free fit.`,
  },
  // Fitted Sheets
  {
    handle: "solid-ivory-fitted", // << Restored original handle
    title: "Solid - 300TC (Fitted)",
    price: 3999,
    originalPrice: 4299,
    collection: "fitted-sheets",
    images: ["/demo/fitted.png", "/demo/fitted.png"],
    sizes: ["Single", "Queen", "King"],
    rating: { stars: 4.8, reviews: 25 },
    description: `Our 300TC Solid Ivory fitted sheet offers timeless elegance and unmatched comfort. Made from long-staple cotton for a soft, smooth feel. Its deep pockets fit mattresses up to 16 inches, ensuring a perfect, secure fit every night.`,
  },
  // Luxury Sheets
  {
    handle: "jacquard-sand", // << Restored original handle
    title: "Symmetrical - Jacquard Collection",
    price: 4291,
    originalPrice: 5000,
    collection: "luxury-sheets",
    images: ["/demo/jac.png", "/demo/jac.png"],
    sizes: ["Queen", "King"],
    rating: { stars: 4.9, reviews: 42 },
    description: `Elevate your bedroom with the Symmetrical Jacquard Collection. The intricate, woven pattern in a calming sand hue adds a touch of sophistication. Crafted from a premium cotton blend for a luxurious feel and lasting durability.`,
  },
  // Duvet Covers
  {
    handle: "duvet-linen", // << Restored original handle
    title: "Classic Linen Duvet Cover",
    price: 3299,
    collection: "duvet-covers",
    images: ["/demo/duvet.png", "/demo/duvet.png"],
    sizes: ["Single", "Queen"],
    rating: { stars: 4.6, reviews: 18 },
    description: `Wrap yourself in the breathable comfort of our Classic Linen Duvet Cover. Known for its natural texture and temperature-regulating properties, linen gets softer with every wash. Features interior corner ties and a hidden button closure.`,
  },
  // AC Comforters
  {
    handle: "ac-mint-bloom", // << Restored original handle
    title: "AC Comforter - Mint Bloom",
    price: 2599,
    originalPrice: 2999,
    collection: "ac-comforters",
    images: ["/demo/ac.png", "/demo/ac.png"],
    sizes: ["Single", "Queen", "King"],
    rating: { stars: 4.7, reviews: 31 },
    description: `Perfect for air-conditioned rooms, our Mint Bloom AC Comforter provides just the right amount of warmth without being heavy. The hypoallergenic microfiber fill and soft-touch fabric ensure a cozy and restful sleep.`,
  },
  // Premium
  {
    handle: "premium-sateen", // << Restored original handle
    title: "Premium Sateen 600TC",
    price: 6499,
    originalPrice: 7500,
    collection: "premium",
    images: ["/demo/premium.png", "/demo/premium.png"],
    sizes: ["Queen", "King"],
    rating: { stars: 4.9, reviews: 55 },
    description: `Indulge in the silky-smooth feel of our 600 Thread Count Premium Sateen sheets. The lustrous finish and rich drape of the sateen weave provide a five-star hotel experience in your own home.`,
  },
];

// ---- Helpers ----
export const byCollection = (slug: string) =>
  products.filter((p) => p.collection === slug);

export function findProduct(rawHandle: string) {
  const handle = decodeURIComponent(rawHandle).toLowerCase().trim();
  return products.find((p) => p.handle.toLowerCase() === handle);
}
