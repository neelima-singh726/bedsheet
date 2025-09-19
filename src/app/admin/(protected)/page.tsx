// app/admin/(protected)/products/page.tsx
import { getSupabaseAdmin } from "@/lib/supabaseAdmin";
import Link from "next/link";

export default async function ManageProductsPage() {
  const supabaseAdmin = getSupabaseAdmin();
  const { data: products, error } = await supabaseAdmin
    .from("products")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return (
      <p className="text-red-500">Error loading products: {error.message}</p>
    );
  }

  return (
    <div className="bg-white p-8 rounded-xl shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-gray-800">Manage Products</h1>
        <Link
          href="/admin/products/new"
          className="bg-sky-600 text-white px-4 py-2 rounded-md hover:bg-sky-700"
        >
          + Add New Product
        </Link>
      </div>
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          {/* ... table headers ... */}
          <thead>
            <tr className="bg-gray-100">
              <th className="p-3 font-semibold">Image</th>
              <th className="p-3 font-semibold">Title</th>
              <th className="p-3 font-semibold">Price</th>
              <th className="p-3 font-semibold">Stock</th>
              <th className="p-3 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody>
            {products?.map((product: any) => (
              <tr key={product.id} className="border-b">
                <td className="p-3">
                  <img
                    src={(product.images_arr && product.images_arr[0]) || product.images || "/demo/premium.png"}
                    alt={product.title}
                    className="w-16 h-16 object-cover rounded-md"
                  />
                </td>
                <td className="p-3 font-medium">{product.title}</td>
                <td className="p-3">₹{product.price}</td>
                <td className="p-3">{product.stock}</td>
                <td className="p-3">
                  <Link className="text-sky-700" href={`/admin/products/${product.id}/edit`}>Edit</Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
