"use client";
import { useEffect, useMemo, useRef, useState } from "react";
import clsx from "clsx";

const SLIDES = [
  { src: "/home/hero-1.png", alt: "Memory Foam pillow" },
  { src: "/home/hero-2.png", alt: "Natural Latex pillow" },
  { src: "/home/hero-3.png", alt: "Arm Guard pillow" },
  { src: "/home/hero-4.png", alt: "Pillow 4" },
  { src: "/home/hero-5.png", alt: "Pillow 5" },
];

// change slide every 2500ms; adjust if you want ~2–3 seconds
const INTERVAL_MS = 1000;

export default function HeroScreensaver() {
  const [idx, setIdx] = useState(0);
  const [paused, setPaused] = useState(false);
  const timer = useRef<number | null>(null);

  const next = useMemo(() => () => setIdx((i) => (i + 1) % SLIDES.length), []);

  useEffect(() => {
    if (paused) return;
    timer.current && window.clearInterval(timer.current);
    timer.current = window.setInterval(next, INTERVAL_MS);
    return () => {
      if (timer.current) window.clearInterval(timer.current);
    };
  }, [paused, next]);

  return (
    <section
      className="snap-section relative overflow-hidden bg-[#eaf6f7] min-h-[60vh]"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      {/* slides stacked and cross-faded */}
      <div className="absolute inset-0">
        {SLIDES.map((s, i) => (
          <img
            key={s.src}
            src={s.src}
            alt={s.alt}
            className={clsx(
              "absolute inset-0 h-full w-full object-cover transition-opacity duration-700",
              i === idx ? "opacity-100" : "opacity-0"
            )}
            loading={i === 0 ? "eager" : "lazy"}
          />
        ))}
        {/* soft curved edges are part of the source image; the fade just swaps images */}
      </div>

      {/* overlay copy */}
      <div className="relative z-10 h-full flex flex-col items-center justify-center px-6">
        <h1 className="text-4xl md:text-6xl font-semibold text-[#362411] mt-40">
          Comfort is the key to Wellness
        </h1>
        <p className="mt-4 max-w-xl mx-auto text-zinc-600">
          Premium quality for your Wellness
        </p>
      </div>

      {/* gradient for legibility */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/0 to-white/40" />

      {/* dots */}
      <div className="absolute bottom-4 left-0 right-0 z-10 flex justify-center gap-2">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            aria-label={`Go to slide ${i + 1}`}
            onClick={() => setIdx(i)}
            className={clsx(
              "h-2 w-2 rounded-full",
              i === idx ? "bg-black/70" : "bg-white/60 border border-black/20"
            )}
          />
        ))}
      </div>
    </section>
  );
}
