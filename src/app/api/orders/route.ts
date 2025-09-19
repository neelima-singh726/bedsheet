import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

export async function GET() {
  // Use foreign table join: orders -> customers via customer_phone
  if (!process.env.SUPABASE_SERVICE_KEY) {
    return NextResponse.json([]);
  }
  const supabaseAdmin = getSupabaseAdmin();
  const { data, error } = await supabaseAdmin
    .from("orders")
    .select(
      `
      id, created_at, status, customer_phone, order_details,
      customers:customer_phone ( name, email, address )
    `
    )
    .order("created_at", { ascending: false });

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

type CreateOrderBody = {
  customer: { name?: string; email?: string; address?: string; phone: string };
  items: Array<{ product_id: number; qty: number; price: number }>;
};

export async function POST(req: Request) {
  if (!process.env.SUPABASE_SERVICE_KEY) {
    return NextResponse.json({ error: "Database not configured" }, { status: 503 });
  }
  const supabase = getSupabaseAdmin();
  const body = (await req.json()) as CreateOrderBody;
  const phone = body.customer.phone;
  if (!phone) return NextResponse.json({ error: "phone required" }, { status: 400 });

  // Upsert customer by phone
  const { error: custErr } = await supabase
    .from("customers")
    .upsert({
      phone,
      name: body.customer.name ?? null,
      email: body.customer.email ?? null,
      address: body.customer.address ?? null,
    })
    .eq("phone", phone);
  if (custErr) return NextResponse.json({ error: custErr.message }, { status: 400 });

  // Reduce stock for each product (simple atomic updates)
  for (const it of body.items) {
    const { error: updErr } = await supabase.rpc("decrement_stock", {
      pid: it.product_id,
      qty: it.qty,
    });
    if (updErr) return NextResponse.json({ error: updErr.message }, { status: 400 });
  }

  // Insert order with generated tracking id
  const trackingId = `BV-${Date.now().toString(36).toUpperCase()}`;
  const expectedDate = new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString();
  const { data, error } = await supabase
    .from("orders")
    .insert({
      customer_phone: phone,
      order_details: { items: body.items, trackingId, expectedDate },
      status: "Placed",
    })
    .select()
    .single();
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ id: data.id, trackingId, expectedDate });
}
