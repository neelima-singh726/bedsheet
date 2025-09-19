// src/lib/supabaseClient.ts
import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!, // e.g. https://xxx.supabase.co
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY! // anon/public key
);

export const supabaseBrowser = supabase;
