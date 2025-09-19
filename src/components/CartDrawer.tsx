"use client";
import { useEffect, useState } from "react";
import { useCart } from "@/lib/store";
import Link from "next/link";
import clsx from "clsx";

export default function CartDrawer() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);
  const { items, total, opened, setOpened, remove, clear } = useCart();
  const count = items.reduce((s, i) => s + i.qty, 0);

  return (
    <div
      className={clsx(
        "fixed inset-0 z-50",
        opened ? "pointer-events-auto" : "pointer-events-none"
      )}
    >
      {/* overlay */}
      <div
        onClick={() => setOpened(false)}
        className={clsx(
          "absolute inset-0 bg-black/40 transition-opacity",
          opened ? "opacity-100" : "opacity-0"
        )}
      />
      {/* panel */}
      <aside
        className={clsx(
          "absolute right-0 top-0 h-full w-[92vw] max-w-md bg-white shadow-xl p-5 transition-transform duration-300",
          opened ? "translate-x-0" : "translate-x-full"
        )}
      >
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-medium">Your Cart</h3>
          <button onClick={() => setOpened(false)} className="text-2xl">
            &times;
          </button>
        </div>

        <div className="mt-4 space-y-4 max-h-[70vh] overflow-auto">
          {count === 0 && (
            <div className="text-sm text-zinc-500">Cart is empty.</div>
          )}
          {items.map((it) => (
            <div key={it.handle} className="flex gap-3 items-center">
              <img
                src={it.image}
                className="w-16 h-16 rounded object-cover"
                alt=""
              />
              <div className="flex-1">
                <div className="text-sm">{it.title}</div>
                <div className="text-xs opacity-70">Qty {it.qty}</div>
              </div>
              <div className="text-sm">₹ {it.price * it.qty}</div>
              <button
                onClick={() => remove(it.handle)}
                className="text-xs underline ml-2"
              >
                remove
              </button>
            </div>
          ))}
        </div>

        <div className="mt-6 border-t pt-4 space-y-3">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <p suppressHydrationWarning>
              ₹ {mounted ? total().toLocaleString("en-IN") : "0"}
            </p>{" "}
          </div>
          <div className="flex gap-3">
            <Link
              href="/checkout"
              onClick={() => setOpened(false)}
              className="flex-1 text-center rounded-md bg-black text-white py-3"
            >
              Check out
            </Link>
            <button onClick={clear} className="rounded-md border px-3">
              Clear
            </button>
          </div>
        </div>
      </aside>
    </div>
  );
}
