import type { Metadata } from "next";
import { collections } from "@/data/catalog";
import CollectionClient from "./CollectionClient";
import { fetchByCollectionSlug } from "@/lib/productsrepo";

export function generateStaticParams() {
  return collections.map((c) => ({ slug: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const c = collections.find((x) => x.slug === slug);
  return {
    title: c
      ? `${c.title} | ${process.env.NEXT_PUBLIC_SITE_NAME ?? "Store"}`
      : "Collection",
    description: c?.description,
  };
}

export default async function CollectionPage(props: any) {
  const params = await Promise.resolve(props?.params);
  const slug: string = params?.slug ?? "";
  const c = collections.find((x) => x.slug === slug);

  const items = await fetchByCollectionSlug(slug, 100); // Product[]

  if (!c) {
    return (
      <main className="mx-auto max-w-7xl px-4 py-12">
        Collection not found.
      </main>
    );
  }

  return (
    <main>
      {c.hero && (
        <div className="h-56 w-full overflow-hidden border-b">
          <img src={c.hero} alt={c.title} className="w-full h-full object-cover" />
        </div>
      )}

      <div className="mx-auto max-w-7xl px-4 py-8">
        <h1 className="text-3xl font-semibold">{c.title}</h1>
        {c.description && <p className="mt-2 text-zinc-600">{c.description}</p>}

        {/* ✅ now items is typed as Product[] and matches ProductGrid expectations */}
        <CollectionClient slug={slug} items={items} />
      </div>
    </main>
  );
}
