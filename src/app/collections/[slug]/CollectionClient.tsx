"use client";

import ProductGrid from "@/components/ProductGrid";
import type { Product } from "@/data/catalog";
import { useMemo, useState } from "react";

export default function CollectionClient({
  slug,
  items,
}: {
  slug: string;
  items?: Product[];
}) {
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);

  const toggleSize = (size: string) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  const filteredItems = useMemo(() => {
    if (!items) return items;
    if (selectedSizes.length === 0) return items;
    return items.filter((p) => (p.sizes ?? []).some((s) => selectedSizes.includes(String(s))));
  }, [items, selectedSizes]);

  return (
    <div className="mt-8 grid gap-10 md:grid-cols-[260px_1fr]">
      {/* Left filters */}
      <aside className="space-y-8 md:sticky md:top-24 self-start border-r pr-6">
        <div>
          <h3 className="font-semibold mb-3">Size</h3>
          <div className="space-y-2 text-sm">
            {(["Single", "Queen", "King"] as const).map((s) => (
              <label key={s} className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={selectedSizes.includes(s)}
                  onChange={() => toggleSize(s)}
                  className="h-4 w-4 rounded border-gray-300 text-sky-600"
                />
                <span>{s}</span>
              </label>
            ))}
          </div>
        </div>
        <div>
          <h3 className="font-semibold mb-3">Price</h3>
          <p className="text-xs text-gray-500">Price filter coming soon.</p>
        </div>
        <div>
          <h3 className="font-semibold mb-3">Product type</h3>
          <p className="text-xs text-gray-500">This is a {slug.replace("-", " ")} collection.</p>
        </div>
      </aside>

      {/* Right content */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-semibold">{filteredItems?.length ?? 0} products</h2>
          <div className="flex items-center gap-3 text-sm text-gray-600">
            <button className="px-3 py-1 rounded border">Featured</button>
            <div className="hidden md:flex gap-1">
              <div className="h-5 w-5 border rounded" />
              <div className="h-5 w-5 border rounded" />
            </div>
          </div>
        </div>
        <ProductGrid items={filteredItems} />
      </section>
    </div>
  );
}
