"use client";
import { useState } from "react";

export default function ProductGallery({ images }: { images: string[] }) {
  const [i, setI] = useState(0);
  return (
    <div className="grid gap-4 lg:grid-cols-[90px_1fr]">
      <div className="hidden lg:flex flex-col gap-3">
        {images.map((src, idx) => (
          <button
            key={idx}
            onClick={() => setI(idx)}
            className={`aspect-square rounded border ${
              i === idx ? "border-black" : "border-transparent"
            }`}
          >
            <img
              src={src}
              alt=""
              className="w-full h-full object-cover rounded"
            />
          </button>
        ))}
      </div>
      <div className="aspect-[5/4] bg-zinc-100 rounded-lg overflow-hidden">
        <img src={images[i]} alt="" className="w-full h-full object-cover" />
      </div>
      {/* mobile thumbs */}
      <div className="lg:hidden flex gap-3 overflow-x-auto">
        {images.map((src, idx) => (
          <button
            key={idx}
            onClick={() => setI(idx)}
            className={`w-20 h-20 rounded border ${
              i === idx ? "border-black" : "border-transparent"
            }`}
          >
            <img
              src={src}
              alt=""
              className="w-full h-full object-cover rounded"
            />
          </button>
        ))}
      </div>
    </div>
  );
}
