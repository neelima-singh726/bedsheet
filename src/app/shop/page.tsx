import ProductGrid from "@/components/ProductGrid";
import { fetchByCollectionSlug, fetchTrending } from "@/lib/productsrepo";

export default async function ShopPage({ searchParams }: { searchParams?: Promise<{ search?: string }> }) {
  // Fetch all products from DB across all collections; fall back only if zero
  const groups = await Promise.all([
    "printed-sheets",
    "fitted-sheets",
    "luxury-sheets",
    "duvet-covers",
    "ac-comforters",
    "premium",
  ].map((s) => fetchByCollectionSlug(s, 100)));
  const dbProducts = groups.flat();
  const all = dbProducts.length > 0 ? dbProducts : await fetchTrending(100);
  const resolvedSearchParams = (await searchParams) ?? {};
  const term = (resolvedSearchParams.search ?? "").toLowerCase().trim();
  const products = term
    ? all.filter((p) =>
        p.title.toLowerCase().includes(term) ||
        (p.collection?.toLowerCase?.() ?? "").includes(term)
      )
    : all;

  return (
    <>
      <main className="mx-auto max-w-7xl px-4 py-10">
        <div className="grid gap-10 md:grid-cols-[260px_1fr]">
          <aside className="space-y-8 md:sticky md:top-24 self-start border-r pr-6">
            <div>
              <h3 className="font-semibold mb-3">Size</h3>
              <div className="space-y-2 text-sm">
                {["Single", "Queen", "King"].map((s) => (
                  <label key={s} className="flex items-center gap-2">
                    <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-sky-600" />
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
              <p className="text-xs text-gray-500">All products</p>
            </div>
          </aside>

          <section>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-semibold">All Products</h2>
              <p className="text-sm text-gray-600">{products.length} products</p>
            </div>
            <ProductGrid items={products as any} />
          </section>
        </div>
      </main>
    </>
  );
}
