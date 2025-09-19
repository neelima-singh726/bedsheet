"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useCart } from "@/lib/store";
import { Search, ShoppingCart, Instagram, Facebook, Youtube, ChevronDown } from "lucide-react";
import { useRouter } from "next/navigation";

export default function Navbar() {
  const items = useCart((s) => s.items);
  const setOpened = useCart((s) => s.setOpened);
  const count = items.reduce((s, i) => s + i.qty, 0);
  const router = useRouter();
  const [q, setQ] = React.useState("");

  return (
    <header className="sticky top-0 z-40 bg-[var(--brand)] backdrop-blur text-white">
      {/* Announcement bar */}
      <div className="bg-white text-sm text-blue-700">
        {/* <div className="mx-auto max-w-7xl px-4 h-8 flex items-center justify-between">
          <div className="hidden md:flex items-center gap-4 text-zinc-800">
            <a aria-label="Instagram" href="#">
              <Instagram size={16} />
            </a>
            <a aria-label="Facebook" href="#">
              <Facebook size={16} />
            </a>
            <a aria-label="YouTube" href="#">
              <Youtube size={16} />
            </a>
          </div>
        </div> */}
      </div>

      {/* Main bar */}
      <div className="bg-[var(--brand)]">
        <div className="mx-auto max-w-7xl px-4 h-[68px] flex items-center gap-6 text-white">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3">
            <Image
              src="/newlogo.png"
              alt="Blue Veil"
              width={44}
              height={44}
              priority
              className="rounded-full border border-slate-300"
            />
            <div className="leading-[1.05]">
              <div className="text-[22px] font-semibold tracking-wide">
                BLUE
              </div>
              <div className="text-[22px] font-semibold tracking-wide -mt-1">
                VEIL
              </div>
            </div>
          </Link>

          {/* Nav links */}
          <nav className="ml-auto hidden md:flex items-center gap-8 uppercase tracking-[0.3em] text-[14px]">
            <Link href="/" className="hover:opacity-90">
              Home
            </Link>

            <Link
              href="/collections/printed-sheets"
              className="hover:opacity-90"
            >
              New Arrivals
            </Link>
            <Link
              href="/collections/luxury-sheets"
              className="hover:opacity-90"
            >
              End of Design Sale
            </Link>
            <Link
              href="/collections/ac-comforters"
              className="hover:opacity-90"
            >
              Wellness
            </Link>
          </nav>

          {/* Right icons */}
          <div className="ml-auto flex items-center gap-5">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                const term = q.trim();
                if (term) router.push(`/shop?search=${encodeURIComponent(term)}`);
              }}
              className="hidden md:flex items-center gap-2 bg-white/15 rounded px-2 py-1"
            >
              <Search size={18} />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search products..."
                className="bg-transparent outline-none text-sm placeholder-white/70 w-40"
              />
            </form>
            <button
              aria-label="Cart"
              onClick={() => setOpened(true)}
              className="relative hover:opacity-90"
            >
              <ShoppingCart size={22} />
              {count > 0 && (
                <span className="absolute -top-2 -right-2 bg-white text-[11px] text-[var(--brand)] w-5 h-5 grid place-items-center rounded-full font-medium">
                  {count}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* faint bottom rule like the screenshot */}
      <div className="h-[1px] bg-white/40" />
    </header>
  );
}
