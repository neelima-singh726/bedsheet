"use client";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";

export default function EditProductPage() {
  const params = useParams();
  const id = Number(params?.id);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState<any>({});
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    async function load() {
      setLoading(true);
      const res = await fetch(`/api/products`);
      const all = await res.json();
      const p = all.find((x: any) => x.id === id);
      setForm({
        id,
        title: p?.title ?? "",
        price: p?.price ?? 0,
        stock: p?.stock ?? 0,
        product_type: p?.product_type ?? "",
        description: p?.description ?? "",
        images: p?.images_arr ?? (p?.images ? [p.images] : []),
      });
      setLoading(false);
    }
    if (id) load();
  }, [id]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    const fd = new FormData(e.currentTarget);
    const payload: any = {} as any;
    fd.forEach((value, key) => {
      if (key === "images[]") return;
      (payload as any)[key] = value as any;
    });
    payload.id = id;
    payload.price = Number(payload.price);
    payload.stock = Number(payload.stock);
    const enabled: string[] = [];
    if (Number(fd.get("sizes_stock.single") || 0) > 0) enabled.push("Single");
    if (Number(fd.get("sizes_stock.queen") || 0) > 0) enabled.push("Queen");
    if (Number(fd.get("sizes_stock.king") || 0) > 0) enabled.push("King");
    payload.sizes_stock = enabled;
    const images = fd.getAll("images[]").map(String).filter(Boolean);
    if (images.length) payload.images = images;
    const res = await fetch(`/api/products`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    setSaving(false);
    if (!res.ok) {
      const j = await res.json().catch(() => ({ error: "Save failed" }));
      alert(j.error);
      return;
    }
    router.replace("/admin");
  }

  if (loading) return <p>Loading…</p>;

  return (
    <form onSubmit={onSubmit} className="space-y-4 max-w-lg">
      <div>
        <label className="block text-sm mb-1">Title</label>
        <input name="title" defaultValue={form.title} required className="w-full border rounded px-3 py-2" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm mb-1">Price</label>
          <input name="price" type="number" step="0.01" defaultValue={form.price} required className="w-full border rounded px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm mb-1">Stock</label>
          <input name="stock" type="number" defaultValue={form.stock} required className="w-full border rounded px-3 py-2" />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm mb-1">Single Qty</label>
          <input name="sizes_stock.single" type="number" min="0" defaultValue={(form.sizes_stock?.single as any) ?? 0} className="w-full border rounded px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm mb-1">Queen Qty</label>
          <input name="sizes_stock.queen" type="number" min="0" defaultValue={(form.sizes_stock?.queen as any) ?? 0} className="w-full border rounded px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm mb-1">King Qty</label>
          <input name="sizes_stock.king" type="number" min="0" defaultValue={(form.sizes_stock?.king as any) ?? 0} className="w-full border rounded px-3 py-2" />
        </div>
      </div>
      <div>
        <label className="block text-sm mb-1">Bedsheet Type</label>
        <select name="product_type" defaultValue={form.product_type} className="w-full border rounded px-3 py-2">
          <option value="printed-sheets">Printed Sheets</option>
          <option value="fitted-sheets">Fitted Sheets</option>
          <option value="luxury-sheets">Luxury Sheets</option>
          <option value="duvet-covers">Duvet Covers</option>
          <option value="ac-comforters">AC Comforters</option>
          <option value="premium">Premium Collections</option>
        </select>
      </div>
      <div>
        <label className="block text-sm mb-1">Description</label>
        <textarea name="description" defaultValue={form.description} rows={4} className="w-full border rounded px-3 py-2" />
      </div>
      <div>
        <label className="block text-sm mb-2">Image URLs</label>
        {(form.images as string[]).map((val: string, i: number) => (
          <input key={i} name="images[]" defaultValue={val} className="w-full border rounded px-3 py-2 mb-2" />
        ))}
        <input name="images[]" className="w-full border rounded px-3 py-2 mb-2" placeholder="https://..." />
      </div>
      <button type="submit" disabled={saving} className="rounded bg-black text-white px-4 py-2">
        {saving ? "Saving…" : "Save Changes"}
      </button>
    </form>
  );
}


