import { fetchByHandle } from "@/lib/productsrepo";
import ProductGallery from "@/components/ProductGallery";
import ProductActions from "./ProductActions.client";

export default async function ProductDetail(props: any) {
  const params = await Promise.resolve(props?.params);
  const handle: string = params?.handle ?? "";
  const p = await fetchByHandle(handle);
  if (!p) {
    return (
      <div className="mx-auto max-w-5xl px-4 py-12">Product not found.</div>
    );
  }
  return (
    <div className="mx-auto max-w-6xl px-4 py-10 grid gap-10 lg:grid-cols-2">
      <ProductGallery images={p.images} />
      {/* Client component for actions */}
      <ProductActions
        handle={p.handle}
        title={p.title}
        price={p.price}
        image={p.images[0]}
        description={""}
        sizes={p.sizes as any}
        article={p.collection}
      />
    </div>
  );
}
