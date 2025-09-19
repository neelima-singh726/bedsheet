import { NextResponse } from "next/server";
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";

type Body = {
  title: string;
  price: number;
  mrp?: number;
  description?: string;
  sku: string;
  sizes_stock: Record<"single" | "queen" | "king", number>; // per size
  images: string[]; // urls
  color?: string;
  pattern?: string;
  material?: string;
  type?: string; // product_type alias from form dropdown
  product_type?: string; // allow direct assignment too
  threadCount?: number;
  status?: "draft" | "published";
  isVisible?: boolean;
};

export async function GET() {
  if (!process.env.SUPABASE_SERVICE_KEY) {
    return NextResponse.json([]);
  }
  const supabaseAdmin = getSupabaseAdmin();
  const { data, error } = await supabaseAdmin
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });
  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data);
}

export async function POST(req: Request) {
  const body = (await req.json()) as Body;
  if (!process.env.SUPABASE_SERVICE_KEY) {
    return NextResponse.json(
      { error: "Database not configured" },
      { status: 503 }
    );
  }

  // total stock = sum of per-size
  const providedStock = typeof (body as any).stock === "number" ? (body as any).stock : undefined;
  const totalStock =
    providedStock ??
    ((body.sizes_stock?.single ?? 0) +
      (body.sizes_stock?.queen ?? 0) +
      (body.sizes_stock?.king ?? 0));

  const supabaseAdmin = getSupabaseAdmin();
  // Generate a URL-safe handle if not provided (based on title)
  const generatedHandle = (body.sku || body.title || "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  const { data, error } = await supabaseAdmin
    .from("products")
    .insert({
      title: body.title,
      price: body.price,
      description: body.description ?? "",
      stock: totalStock,
      quantity: totalStock, // keep legacy field
      images: body.images?.[0] ?? null, // legacy single for backward compat
      images_arr: body.images ?? [], // array of image urls for gallery
      // bonus metadata inside handle (optional)
      handle: generatedHandle || null,
      product_type: body.type ?? body.product_type ?? null,
      sizes_stock: body.sizes_stock ?? {},
    })
    .select()
    .single();

  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data, { status: 201 });
}

export async function PATCH(req: Request) {
  if (!process.env.SUPABASE_SERVICE_KEY) {
    return NextResponse.json({ error: "Database not configured" }, { status: 503 });
  }
  const supabaseAdmin = getSupabaseAdmin();
  const body = (await req.json()) as Partial<Body> & { id?: number };
  const { id, ...updates } = body;
  if (!id) return NextResponse.json({ error: "id is required" }, { status: 400 });

  const { data, error } = await supabaseAdmin
    .from("products")
    .update({
      title: updates.title,
      price: updates.price,
      description: updates.description,
      stock: (updates as any).stock,
      quantity: (updates as any).stock,
      images: updates.images?.[0] ?? null,
      images_arr: updates.images ?? undefined,
      handle:
        (updates.sku || updates.title)
          ?.toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/(^-|-$)/g, "") ?? undefined,
      product_type: updates.type ?? updates.product_type ?? undefined,
      sizes_stock: updates.sizes_stock ?? undefined,
    })
    .eq("id", id)
    .select()
    .single();

  if (error)
    return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json(data);
}
