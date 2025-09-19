import Link from "next/link";

const CATS = [
  {
    slug: "printed-sheets",
    title: "Printed Sheets",
    img: "/home/cat-printed.png",
  },
  {
    slug: "fitted-sheets",
    title: "Fitted Sheets",
    img: "/home/cat-fitted.png",
  },
  {
    slug: "luxury-sheets",
    title: "Luxury Sheets",
    img: "/home/cat-luxury.png",
  },
  { slug: "duvet-covers", title: "Duvet Covers", img: "/home/cat-duvet.png" },
  { slug: "ac-comforters", title: "AC Comforters", img: "/home/cat-ac.png" },
  {
    slug: "premium",
    title: "Premium Collections",
    img: "/home/cat-luxury.png",
  },
];

export default function CategoriesCarousel() {
  return (
    <section className="snap-section">
      <div className="mx-auto max-w-7xl px-4 py-12">
        <h2 className="text-3xl font-semibold mb-6">Categories</h2>
        <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 xl:grid-cols-6">
          {CATS.map((c) => (
            <Link
              key={c.slug}
              href={`/collections/${c.slug}`}
              className="text-center group"
            >
              <div className="mx-auto w-48 h-48 rounded-full overflow-hidden bg-zinc-100">
                <img
                  src={c.img}
                  alt={c.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition"
                />
              </div>
              <div className="mt-3 text-sm font-medium">{c.title}</div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
