import Link from "next/link";
import { Product } from "@/data/catalog";

export default function ProductCard({ p }: { p: Product }) {
  return (
    <Link href={`/products/${p.handle}`} className="group block">
      <div className="aspect-[4/5] bg-zinc-100 overflow-hidden rounded-lg">
        <img
          src={p.images[0]}
          alt={p.title}
          className="h-full w-full object-cover group-hover:scale-105 transition"
        />
      </div>
      <div className="mt-3">
        {p.badges?.[0] && (
          <div className="text-xs text-sky-700">{p.badges[0]}</div>
        )}
        <div className="font-medium">{p.title}</div>
        <div className="text-sm text-zinc-700">
          from ₹ {p.price.toLocaleString("en-IN")}
        </div>
      </div>
    </Link>
  );
}
