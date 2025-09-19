// lib/supabaseAdmin.ts
import "server-only";
import { createClient } from "@supabase/supabase-js";

// IMPORTANT: These are server-side credentials and must be kept secret.
// They are used for tasks that require bypassing Row Level Security.
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;

export function getSupabaseAdmin() {
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_KEY;
  if (!supabaseServiceKey) {
    throw new Error("SUPABASE_SERVICE_KEY is not set in .env.local");
  }
  return createClient(supabaseUrl, supabaseServiceKey);
}
