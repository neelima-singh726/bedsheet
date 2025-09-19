// app/admin/page.tsx
import { redirect } from "next/navigation";

// This page's only job is to redirect to the main admin dashboard page.
export default function AdminRootPage() {
  redirect("/admin/orders");
}
