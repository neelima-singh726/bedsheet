"use client";
import useSWR from "swr";
const fetcher = (u: string) => fetch(u).then((r) => r.json());

export default function CustomersPage() {
  const { data, error, isLoading } = useSWR("/api/customers", fetcher);
  if (isLoading) return <p>Loading…</p>;
  if (error) return <p className="text-red-600">Failed to load customers</p>;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-semibold">All Customers</h1>
      <div className="bg-white rounded-2xl shadow overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-100 text-left text-sm">
            <tr>
              <th className="px-6 py-3">Name</th>
              <th className="px-6 py-3">Phone</th>
              <th className="px-6 py-3">Email</th>
              <th className="px-6 py-3">Address</th>
              <th className="px-6 py-3">Created</th>
            </tr>
          </thead>
          <tbody className="text-sm">
            {data?.map((c: any) => (
              <tr key={c.phone} className="border-t">
                <td className="px-6 py-3">{c.name ?? "—"}</td>
                <td className="px-6 py-3">{c.phone}</td>
                <td className="px-6 py-3">{c.email ?? "—"}</td>
                <td className="px-6 py-3">{c.address ?? "—"}</td>
                <td className="px-6 py-3">
                  {new Date(c.created_at).toLocaleDateString()}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
