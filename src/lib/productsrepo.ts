// src/lib/productsrepo.ts
import { supabaseServer } from "@/lib/supabaseServer";
import type { Product } from "@/data/catalog";
import { products as localProducts, byCollection } from "@/data/catalog";
import { toCatalogProduct, type DBProduct } from "./catalogAdapter";

function isDbConfigured() {
  return (
    !!process.env.NEXT_PUBLIC_SUPABASE_URL &&
    !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  );
}

const useDemoData = process.env.NEXT_PUBLIC_USE_DEMO_DATA === "true";

/** Trending list for home */
export async function fetchTrending(limit = 4): Promise<Product[]> {
  if (!isDbConfigured() || useDemoData) {
    // Prefer items from Printed Sheets when using demo data
    const printed = byCollection("printed-sheets");
    const base = printed.length > 0 ? printed : localProducts;
    return base.slice(0, limit);
  }
  try {
    const supabase = await supabaseServer();
    const { data, error } = await supabase
      .from("products")
      .select(
        "id,handle,title,price,stock,images,images_arr,product_type,created_at,sizes_stock"
      )
      .order("created_at", { ascending: false })
      .limit(limit);
    if (error) throw new Error(error.message);
    const rows = ((data as DBProduct[]) ?? []);
    if (rows.length === 0) return localProducts.slice(0, limit);
    return rows.map((r) => toCatalogProduct(r, r.product_type ?? "trending"));
  } catch (e) {
    console.error("[fetchTrending]", (e as any)?.message ?? e);
    return localProducts.slice(0, limit);
  }
}

/** Products for a given collection slug */
export async function fetchByCollectionSlug(
  slug: string,
  limit = 100
): Promise<Product[]> {
  if (!isDbConfigured() || useDemoData) {
    return byCollection(slug).slice(0, limit);
  }
  try {
    const supabase = await supabaseServer();
    const { data, error } = await supabase
      .from("products")
      .select(
        "id,handle,title,price,stock,images,images_arr,product_type,created_at,sizes_stock"
      )
      .eq("product_type", slug)
      .limit(limit);
    if (error) throw new Error(error.message);
    const rows = ((data as DBProduct[]) ?? []);
    if (rows.length === 0) return byCollection(slug).slice(0, limit);
    return rows.map((r) => toCatalogProduct(r, slug));
  } catch (e) {
    console.error("[fetchByCollectionSlug]", (e as any)?.message ?? e);
    return byCollection(slug).slice(0, limit);
  }
}

/** Single product by handle */
export async function fetchByHandle(handle: string): Promise<Product | null> {
  if (!isDbConfigured() || useDemoData) {
    return (localProducts.find((p) => p.handle === handle) ?? null) as
      | Product
      | null;
  }
  try {
    const supabase = await supabaseServer();
    const { data, error } = await supabase
      .from("products")
      .select(
        "id,handle,title,price,stock,images,images_arr,product_type,created_at,description,sizes_stock"
      )
      .eq("handle", handle)
      .single();
    if (error || !data) throw new Error(error?.message || "not found");
    return toCatalogProduct(
      data as DBProduct,
      (data as DBProduct).product_type ?? "general"
    );
  } catch (e) {
    if ((e as any)?.code !== "PGRST116")
      console.error("[fetchByHandle]", (e as any)?.message ?? e);
    return (localProducts.find((p) => p.handle === handle) ?? null) as
      | Product
      | null;
  }
}
