"use client";

import { useState } from "react";
import { useCart } from "@/lib/store";
import { useRouter } from "next/navigation";
import ProductGallery from "@/components/ProductGallery";
import PaymentBadges from "@/components/PaymentBadges";

type ProductLite = {
  handle: string;
  title: string;
  price: number;
  images: string[];
  description?: string;
};

export default function ProductClient({ product }: { product: ProductLite }) {
  const add = useCart((s) => s.add);
  const setIsBuyNow = useCart((s) => s.setIsBuyNow);
  const router = useRouter();

  const [quantity, setQuantity] = useState(1);
  const [article, setArticle] = useState<string>("Bedsheet Set");
  const [size, setSize] = useState<string>("Single");
  const [color, setColor] = useState<string>("Default");

  const priceLabel = `₹ ${product.price.toLocaleString("en-IN")}`;

  const onAdd = () => {
    setIsBuyNow(false);
    add({
      handle: product.handle,
      title: `${product.title} • ${article} • ${size}`,
      price: product.price,
      qty: quantity,
      image: product.images[0],
    });
  };

  const onBuyNow = () => {
    setIsBuyNow(true);
    add({
      handle: product.handle,
      title: `${product.title} • ${article} • ${size}`,
      price: product.price,
      qty: quantity,
      image: product.images[0],
    });
    router.push("/checkout");
  };

  return (
    <>
      <main className="mx-auto max-w-7xl px-4 py-8">
        <div className="grid gap-10 lg:grid-cols-2">
          <ProductGallery images={product.images} />
          <section className="flex flex-col gap-6">
            <div>
              <h1 className="text-3xl font-bold">{product.title}</h1>
              <div className="mt-4 text-2xl font-semibold">{priceLabel}</div>
            </div>

            <div>
              <div className="text-sm font-medium">Article</div>
              <div className="mt-2 flex flex-wrap gap-2">
                {[
                  "Bedsheet Set",
                  "Fitted Set",
                  "Duvet Cover",
                  "Pillow Cover",
                  "AC Comforter",
                ].map((a) => (
                  <button
                    key={a}
                    onClick={() => setArticle(a)}
                    className={`rounded border px-3 py-1.5 text-sm ${
                      a === article ? "bg-black text-white" : "bg-white"
                    }`}
                  >
                    {a}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="text-sm font-medium">Size — <span className="underline cursor-pointer">Size chart</span></div>
              <div className="mt-2 flex flex-wrap gap-2">
                {["Single", "King"].map((s) => (
                  <button
                    key={s}
                    onClick={() => setSize(s)}
                    className={`rounded border px-3 py-1.5 text-sm ${
                      s === size ? "bg-black text-white" : "bg-white"
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="text-sm font-medium">Color — {color.toLowerCase()}</div>
              <div className="mt-2 flex gap-2">
                {["Default"].map((c) => (
                  <button
                    key={c}
                    aria-label={c}
                    onClick={() => setColor(c)}
                    className={`h-8 w-8 rounded-full border ${
                      c === color ? "ring-2 ring-black" : ""
                    }`}
                    style={{ backgroundColor: "#eee" }}
                  />
                ))}
              </div>
            </div>

            <div>
              <div className="text-sm font-medium">Quantity</div>
              <div className="mt-2 inline-flex items-center rounded-md border">
                <button className="px-4 py-2" onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
                <span className="px-4 py-2">{quantity}</span>
                <button className="px-4 py-2" onClick={() => setQuantity(quantity + 1)}>+</button>
              </div>
            </div>

            <div className="flex flex-col gap-3 sm:flex-row">
              <button onClick={onAdd} className="flex-1 rounded-md bg-black text-white px-6 py-3">Add to cart</button>
              <button onClick={onBuyNow} className="flex-1 rounded-md border px-6 py-3">Buy Now</button>
            </div>

            {product.description && (
              <div className="prose prose-sm max-w-none text-zinc-700">
                <h3 className="font-medium">Description</h3>
                <p>{product.description.trim()}</p>
              </div>
            )}
          </section>
        </div>
      </main>
      <PaymentBadges />
    </>
  );
}
