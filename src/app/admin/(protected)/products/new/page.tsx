// src/app/admin/(protected)/products/new/page.tsx
"use client";
import { useState } from "react";

export default function NewProductPage() {
  const [posting, setPosting] = useState(false);
  const [imageInputs, setImageInputs] = useState<string[]>([""]);

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setPosting(true);
    const fd = new FormData(e.currentTarget);
    const payload: any = {} as any;
    // Build payload from known fields to satisfy TS on FormData in React types
    fd.forEach((value, key) => {
      if (key === "images[]") return; // handled separately below
      (payload as any)[key] = value as any;
    });
    // Build sizes_stock JSON from dotted fields
    // Store sizes as an array of enabled sizes for simplicity
    const enabled: string[] = [];
    if (Number(fd.get("sizes_stock.single") || 0) > 0) enabled.push("Single");
    if (Number(fd.get("sizes_stock.queen") || 0) > 0) enabled.push("Queen");
    if (Number(fd.get("sizes_stock.king") || 0) > 0) enabled.push("King");
    payload.sizes_stock = enabled;

    // Normalize images[] if provided
    const images = fd.getAll("images[]").map(String).filter(Boolean);
    if (images.length) payload.images = images;
    const res = await fetch("/api/products", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    setPosting(false);

    if (!res.ok) {
      const { error } = await res.json().catch(() => ({ error: "Failed" }));
      alert(error);
      return;
    }
    // success: navigate or toast
    window.location.href = "/admin/products";
  }

  return (
    <form onSubmit={onSubmit} className="space-y-4 max-w-lg">
      <div>
        <label className="block text-sm mb-1">Title</label>
        <input name="title" required className="w-full border rounded px-3 py-2" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm mb-1">Price</label>
          <input name="price" type="number" step="0.01" required className="w-full border rounded px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm mb-1">Stock</label>
          <input name="stock" type="number" required className="w-full border rounded px-3 py-2" />
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4">
        <div>
          <label className="block text-sm mb-1">Single Qty</label>
          <input name="sizes_stock.single" type="number" min="0" defaultValue={0} className="w-full border rounded px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm mb-1">Queen Qty</label>
          <input name="sizes_stock.queen" type="number" min="0" defaultValue={0} className="w-full border rounded px-3 py-2" />
        </div>
        <div>
          <label className="block text-sm mb-1">King Qty</label>
          <input name="sizes_stock.king" type="number" min="0" defaultValue={0} className="w-full border rounded px-3 py-2" />
        </div>
      </div>
      <div>
        <label className="block text-sm mb-1">Bedsheet Type</label>
        <select name="product_type" className="w-full border rounded px-3 py-2">
          <option value="printed-sheets">Printed Sheets</option>
          <option value="fitted-sheets">Fitted Sheets</option>
          <option value="luxury-sheets">Luxury Sheets</option>
          <option value="duvet-covers">Duvet Covers</option>
          <option value="ac-comforters">AC Comforters</option>
          <option value="premium">Premium Collections</option>
        </select>
      </div>
      <div>
        <label className="block text-sm mb-1">SKU (optional)</label>
        <input name="sku" className="w-full border rounded px-3 py-2" />
        <p className="text-xs text-zinc-500 mt-1">If left blank, we generate a product URL from the title.</p>
      </div>
      <div>
        <label className="block text-sm mb-1">Description</label>
        <textarea name="description" rows={4} className="w-full border rounded px-3 py-2" />
      </div>
      <div>
        <label className="block text-sm mb-2">Image URLs (add multiple)</label>
        {imageInputs.map((val, i) => (
          <input
            key={i}
            name="images[]"
            defaultValue={val}
            className="w-full border rounded px-3 py-2 mb-2"
            placeholder="https://..."
          />
        ))}
        <button
          type="button"
          className="text-sm text-sky-700"
          onClick={() => setImageInputs((a) => [...a, ""])}
        >
          + Add another image
        </button>
      </div>
      <button type="submit" disabled={posting} className="rounded bg-black text-white px-4 py-2">
        {posting ? "Saving…" : "Save Product"}
      </button>
    </form>
  );
}
