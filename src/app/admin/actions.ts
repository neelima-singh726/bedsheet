// src/app/admin/actions.ts
"use server";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

export async function createProduct(payload: any) {
  const supabaseAdmin = getSupabaseAdmin();
  const { data, error } = await supabaseAdmin
    .from("products")
    .insert(payload)
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data;
}
