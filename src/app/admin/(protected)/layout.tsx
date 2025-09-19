// src/app/admin/(protected)/layout.tsx
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import Link from "next/link";
import { verify } from "@/lib/jwt";

const COOKIE_NAME = "admin_session";

// 👇 make the layout async and await cookies()
export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies(); // ✅
  const token = cookieStore.get(COOKIE_NAME)?.value; // ✅
  const payload = token
    ? await verify(token, process.env.ADMIN_COOKIE_SECRET || "dev")
    : null;

  if (!payload) {
    redirect("/admin/sign-in?redirect=/admin");
  }

  return (
    <div className="flex min-h-screen bg-gray-100">
      <aside className="w-64 bg-gray-800 text-white p-6">
        <h1 className="text-2xl font-bold mb-8">Admin</h1>
        <nav className="space-y-4">
          <Link
            href="/admin/products"
            className="block py-2 px-4 rounded hover:bg-gray-700"
          >
            Manage Products
          </Link>
          <Link
            href="/admin/orders"
            className="block py-2 px-4 rounded hover:bg-gray-700"
          >
            View Orders
          </Link>
          <Link
            href="/admin/customers"
            className="block py-2 px-4 rounded hover:bg-gray-700"
          >
            View Customers
          </Link>

          <Link
            href="/admin/products/new"
            className="block py-2 px-4 rounded hover:bg-gray-700"
          >
            Add New Product
          </Link>

          <form action="/api/admin/logout" method="post">
            <button className="mt-6 block py-2 px-4 rounded bg-red-600">
              Logout
            </button>
          </form>
        </nav>
      </aside>
      <main className="flex-1 p-10">{children}</main>
    </div>
  );
}
