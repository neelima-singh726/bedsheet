"use client";

import React from "react";
import { useCart } from "@/lib/store";
import { useRouter } from "next/navigation";

export default function ProductActions({
  handle,
  title,
  price,
  image,
  description,
  sizes,
  article: initialArticle,
}: {
  handle: string;
  title: string;
  price: number;
  image: string;
  description?: string;
  sizes?: Array<"Single" | "Queen" | "King">;
  article?: string;
}) {
  const { add, setIsBuyNow } = useCart();
  const router = useRouter();
  const [qty, setQty] = React.useState(1);
  const [article, setArticle] = React.useState(() => {
    const map: Record<string, string> = {
      "printed-sheets": "Bedsheet Set",
      "fitted-sheets": "Fitted Set",
      "duvet-covers": "Duvet Cover",
      "ac-comforters": "AC Comforter",
      "luxury-sheets": "Bedsheet Set",
      premium: "Bedsheet Set",
    };
    return map[initialArticle ?? ""] || "Bedsheet Set";
  });
  const [size] = React.useState("Single");
  const [color, setColor] = React.useState("Default");

  const onAdd = () => {
    setIsBuyNow(false);
    add({ handle, title: `${title} • ${article} • ${size}`, price, qty, image });
  };

  const onBuyNow = () => {
    setIsBuyNow(true);
    add({ handle, title: `${title} • ${article} • ${size}`, price, qty, image });
    router.push("/checkout");
  };

  return (
    <section className="flex flex-col gap-6">
      <div>
        <h1 className="text-3xl font-semibold">{title}</h1>
        <div className="mt-2 text-2xl font-medium">
          ₹ {price.toLocaleString("en-IN")}
        </div>
      </div>

      <div>
        <div className="text-sm font-medium">Article</div>
        <div className="mt-2 flex flex-wrap gap-2">
          {["Bedsheet Set", "Fitted Set", "Duvet Cover", "Pillow Cover", "AC Comforter"].map((a) => (
            <span
              key={a}
              className={`rounded border px-3 py-1.5 text-sm ${a === article ? "bg-black text-white" : "bg-white text-zinc-400"}`}
            >
              {a}
            </span>
          ))}
        </div>
      </div>

      <div>
        <div className="text-sm font-medium">
          Size — <span className="underline">Size chart</span>
        </div>
        <div className="mt-2 flex flex-wrap gap-2">
          {["Single", "Queen", "King"].map((s) => {
            // 👇 THIS IS THE ONLY LINE THAT CHANGES 👇
            const enabled = sizes?.includes(s as "Single" | "Queen" | "King") ?? false;
            return (
              <span
                key={s}
                className={`rounded border px-3 py-1.5 text-sm ${enabled ? "bg-black text-white" : "bg-white text-zinc-400"}`}
              >
                {s}
              </span>
            );
          })}
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
              className={`h-8 w-8 rounded-full border ${c === color ? "ring-2 ring-black" : ""}`}
              style={{ backgroundColor: "#eee" }}
            />
          ))}
        </div>
      </div>

      <div>
        <div className="text-sm font-medium">Quantity</div>
        <div className="mt-2 inline-flex items-center rounded-md border">
          <button className="px-4 py-2" onClick={() => setQty(Math.max(1, qty - 1))}>-</button>
          <span className="px-4 py-2">{qty}</span>
          <button className="px-4 py-2" onClick={() => setQty(qty + 1)}>+</button>
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row">
        <button onClick={onAdd} className="flex-1 rounded-md bg-black text-white px-6 py-3">Add to cart</button>
        <button onClick={onBuyNow} className="flex-1 rounded-md border px-6 py-3">Buy Now</button>
      </div>

      {description && <div className="text-zinc-700">{description}</div>}
    </section>
  );
}