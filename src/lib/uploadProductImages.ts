"use client";

import { supabaseBrowser } from "@/lib/supabaseClient";

/**
 * Uploads images to the Supabase storage bucket "product-images"
 * at path: product-images/products/<skuOrSlug>/<uuid>.<ext>
 * Returns public URLs.
 */
export async function uploadProductImages(files: File[], skuOrSlug: string) {
  const urls: string[] = [];

  for (const file of files) {
    const ext = file.name.split(".").pop() || "webp";
    const path = `products/${skuOrSlug}/${crypto.randomUUID()}.${ext}`;

    const { error } = await supabaseBrowser.storage
      .from("product-images") // 👈 your bucket
      .upload(path, file, { cacheControl: "3600", upsert: false });

    if (error) throw error;

    const { data: pub } = supabaseBrowser.storage
      .from("product-images") // 👈 your bucket
      .getPublicUrl(path);

    urls.push(pub.publicUrl);
  }

  return urls;
}
