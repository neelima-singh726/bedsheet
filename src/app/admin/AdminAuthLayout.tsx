"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AdminAuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for the 'isAdminLoggedIn' flag in localStorage
    const isLoggedIn = localStorage.getItem("isAdminLoggedIn");

    if (isLoggedIn === "true") {
      setIsAuthorized(true);
    } else {
      router.push("/admin/sign-in");
    }
    setLoading(false);
  }, [router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        Verifying credentials...
      </div>
    );
  }

  if (isAuthorized) {
    return <>{children}</>;
  }

  return null;
}
