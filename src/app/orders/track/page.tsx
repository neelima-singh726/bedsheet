import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET(req: Request) {
  if (!process.env.SUPABASE_SERVICE_KEY) {
    return NextResponse.json({ error: "Database not configured" }, { status: 503 });
  }
  const url = new URL(req.url);
  const trackingId = url.searchParams.get("trackingId");
  const phone = url.searchParams.get("phone");
  const orderId = url.searchParams.get("orderId");
  const supabase = getSupabaseAdmin();

  if (!trackingId && !(phone && orderId)) {
    return NextResponse.json({ error: "Provide trackingId or phone+orderId" }, { status: 400 });
  }

  let q = supabase.from("orders").select("id, created_at, status, order_details, customer_phone").limit(1);
  if (trackingId) q = q.contains("order_details", { trackingId });
  else q = q.eq("customer_phone", phone!).eq("id", Number(orderId));

  const { data, error } = await q.single();
  if (error) return NextResponse.json({ error: error.message }, { status: 404 });

  const details = (data as any).order_details || {};
  return NextResponse.json({
    id: data.id,
    phone: data.customer_phone,
    status: data.status,
    placedAt: data.created_at,
    trackingId: details.trackingId,
    expectedDate: details.expectedDate,
  });
}
