import ProductCard from "./ProductCard";
import { byCollection, products as allProducts } from "@/data/catalog";
import { Product } from "@/data/catalog";

export default function ProductGrid({
  collection,
  limit,
  items, // <-- ADD THIS NEW PROP
}: {
  collection?: string; // Make optional
  limit?: number;
  items?: Product[]; // Make optional
}) {
  // If `items` are passed directly, use them. Otherwise, fetch by collection.
  const productsToShow = items
    ? items
    : (collection ? byCollection(collection) : allProducts).slice(
        0,
        limit || 100
      );

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
      {productsToShow.map((p) => (
        <ProductCard key={p.handle} p={p} />
      ))}
    </div>
  );
}
