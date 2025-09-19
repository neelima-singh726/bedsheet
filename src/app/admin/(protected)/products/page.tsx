"use client";
import useSWR from "swr";

const fetcher = (url: string) => fetch(url).then((r) => r.json());

export default function ProductsPage() {
  const { data, error, isLoading } = useSWR("/api/products", fetcher);
  if (isLoading) return <p>Loading…</p>;
  if (error) return <p className="text-red-600">Failed to load products</p>;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-semibold">Manage Products</h1>
      <div className="bg-white rounded-2xl shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100 text-left text-sm">
            <tr>
              <th className="px-6 py-3">Title</th>
              <th className="px-6 py-3">Price</th>
              <th className="px-6 py-3">Stock</th>
              <th className="px-6 py-3">Created</th>
              <th className="px-6 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {data?.map((p: any) => (
              <tr key={p.id} className="border-t">
                <td className="px-6 py-3">{p.title}</td>
                <td className="px-6 py-3">₹{p.price}</td>
                <td className="px-6 py-3">{p.stock}</td>
                <td className="px-6 py-3">
                  {new Date(p.created_at).toLocaleString()}
                </td>
                <td className="px-6 py-3">
                  <a className="text-sky-700" href={`/admin/products/${p.id}/edit`}>Edit</a>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
