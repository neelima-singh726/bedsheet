import type { Product } from "@/data/catalog";

// What your DB row looks like (adjust if you have more columns)
export type DBProduct = {
  id: number;
  handle: string | null;
  title: string | null;
  price: number | null;
  stock: number | null;
  images: string | null; // legacy single url
  images_arr?: string[] | null; // preferred array column (optional)
  product_type?: string | null; // optional: your collection/category slug
  created_at: string;
  description?: string | null;
  // optional: per-size stock in DB (jsonb). Can be either
  // { single:number, queen:number, king:number } or ["Single","Queen",...]
  sizes_stock?:
    | Partial<Record<"single" | "queen" | "king", number>>
    | Array<"Single" | "Queen" | "King">
    | null;
};

/**
 * Map a DB row to your catalog Product type.
 * IMPORTANT: 'collection' is required by your Product.
 */
export function toCatalogProduct(
  row: DBProduct,
  collectionFallback: string = "general"
): Product {
  const images: string[] =
    row.images_arr && row.images_arr.length > 0
      ? row.images_arr
      : row.images
      ? [row.images]
      : [];

  const sizesFromStock: string[] = [];
  const ss = (row as any).sizes_stock as DBProduct["sizes_stock"] | undefined | null;
  if (Array.isArray(ss)) {
    // New format: array of enabled sizes
    for (const s of ss) if (s) sizesFromStock.push(String(s));
  } else if (ss && typeof ss === "object") {
    // Legacy numeric map format
    if (((ss as any).single ?? 0) > 0) sizesFromStock.push("Single");
    if (((ss as any).queen ?? 0) > 0) sizesFromStock.push("Queen");
    if (((ss as any).king ?? 0) > 0) sizesFromStock.push("King");
  }

  return {
    // required by your Product type
    handle: row.handle ?? String(row.id),
    title: row.title ?? "Untitled",
    price: row.price ?? 0,
    images,
    // provide required field 'collection'
    collection: row.product_type ?? collectionFallback,
    // optional fields your UI may read safely
    badges: undefined,
    sizes: sizesFromStock.length ? (sizesFromStock as any) : undefined,
  };
}
