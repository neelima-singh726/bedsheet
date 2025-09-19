"use client";
import useSWR from "swr";
const fetcher = (u: string) => fetch(u).then((r) => r.json());

export default function OrdersPage() {
  const { data, error, isLoading } = useSWR("/api/orders", fetcher);
  if (isLoading) return <p>Loading…</p>;
  if (error) return <p className="text-red-600">Failed to load orders</p>;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-semibold">All Orders</h1>
      <div className="bg-white rounded-2xl shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100 text-left text-sm">
            <tr>
              <th className="px-6 py-3">Order #</th>
              <th className="px-6 py-3">Date</th>
              <th className="px-6 py-3">Customer</th>
              <th className="px-6 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {data?.map((o: any) => (
              <tr key={o.id} className="border-t">
                <td className="px-6 py-3">{o.id}</td>
                <td className="px-6 py-3">
                  {new Date(o.created_at).toLocaleString()}
                </td>
                <td className="px-6 py-3">
                  {o.customers?.name ?? "—"}{" "}
                  <span className="text-xs text-gray-500">
                    ({o.customer_phone ?? "—"})
                  </span>
                </td>
                <td className="px-6 py-3">{o.status}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
