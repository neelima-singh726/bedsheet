// src/app/page.tsx
import HeroScreensaver from "@/components/HeroScreensaver";
import CategoriesCarousel from "@/components/CategoriesCarousel";
import ProductGrid from "@/components/ProductGrid";
import { fetchTrending } from "@/lib/productsrepo";

export default async function Home() {
  const products = await fetchTrending(4);
  return (
    <main>
      <HeroScreensaver />

      <section className="mx-auto max-w-7xl px-4 py-10">
        <CategoriesCarousel />
      </section>

      <section className="mx-auto max-w-7xl px-4 py-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-semibold">Trending</h2>
          <a href="/shop" className="text-sm font-medium text-sky-700 hover:underline">View all</a>
        </div>
        <ProductGrid items={products as any} />
      </section>
    </main>
  );
}
