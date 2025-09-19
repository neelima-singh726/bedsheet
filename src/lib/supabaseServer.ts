// src/lib/supabaseServer.ts
import { createServerClient, type CookieOptions } from "@supabase/ssr";
import { cookies } from "next/headers";

/**
 * Returns a per-request Supabase client (Server Component / Route Handler safe).
 * Next 15+: cookies() is async -> await it.
 */
export async function supabaseServer() {
  // Next 15+ requires awaiting cookies() before using its value
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!, // e.g. https://xxxx.supabase.co
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!, // anon public key
    {
      cookies: {
        get(name: string) {
          return cookieStore.get(name)?.value;
        },
        set(name: string, value: string, options: CookieOptions) {
          try {
            // @ts-ignore - set may be unavailable in RSC context
            cookieStore.set?.({ name, value, ...options });
          } catch {
            /* no-op on RSC */
          }
        },
        remove(name: string, options: CookieOptions) {
          try {
            // @ts-ignore - set may be unavailable in RSC context
            cookieStore.set?.({ name, value: "", ...options });
          } catch {
            /* no-op on RSC */
          }
        },
      },
    }
  );
}
