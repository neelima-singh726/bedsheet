"use client";
import { Suspense, useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";

export default function TrackOrderPage() {
  return (
    <Suspense fallback={<main className="mx-auto max-w-xl px-4 py-10">Loading…</main>}>
      <TrackOrderInner />
    </Suspense>
  );
}

function TrackOrderInner() {
  const searchParams = useSearchParams();
  const [trackingId, setTrackingId] = useState("");
  const [phone, setPhone] = useState("");
  const [orderId, setOrderId] = useState("");
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    const q = new URLSearchParams();
    if (trackingId) q.set("trackingId", trackingId);
    if (!trackingId) {
      if (phone) q.set("phone", phone);
      if (orderId) q.set("orderId", orderId);
    }
    const res = await fetch(`/api/orders/track?${q.toString()}`);
    const j = await res.json();
    setLoading(false);
    setResult(j);
  }

  // Auto fetch if trackingId present in URL
  useEffect(() => {
    const tid = searchParams?.get("trackingId") || "";
    if (tid) {
      setTrackingId(tid);
      (async () => {
        setLoading(true);
        const res = await fetch(`/api/orders/track?trackingId=${encodeURIComponent(tid)}`);
        const j = await res.json();
        setLoading(false);
        setResult(j);
      })();
    }
  }, [searchParams]);

  return (
    <main className="mx-auto max-w-xl px-4 py-10 space-y-6">
      <h1 className="text-2xl font-semibold">Track your order</h1>
      {!result && !trackingId && (
        <form onSubmit={onSubmit} className="space-y-3">
          <input value={trackingId} onChange={(e) => setTrackingId(e.target.value)} placeholder="Tracking ID (e.g., BV-XXXX)" className="w-full border rounded px-3 py-2" />
          <div className="text-sm text-zinc-500">or use phone + order id</div>
          <input value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Phone" className="w-full border rounded px-3 py-2" />
          <input value={orderId} onChange={(e) => setOrderId(e.target.value)} placeholder="Order ID" className="w-full border rounded px-3 py-2" />
          <button disabled={loading} className="rounded bg-black text-white px-4 py-2">{loading ? "Searching…" : "Track Order"}</button>
        </form>
      )}

      {result && !result.error && (
        <div className="mt-6 border rounded p-4">
          <div className="font-medium">Order #{result.id}</div>
          <div className="text-sm text-zinc-600">Placed: {new Date(result.placedAt).toLocaleString()}</div>
          <div className="mt-2">Status: <span className="text-green-700">{result.status}</span></div>
          <div className="mt-1">Expected delivery: {new Date(result.expectedDate).toLocaleDateString()}</div>
          {/* Map placeholder */}
          <div className="mt-4 h-48 bg-zinc-100 rounded flex items-center justify-center text-zinc-500">Live map tracking coming soon</div>
        </div>
      )}
      {result && result.error && <div className="text-red-600">{result.error}</div>}
    </main>
  );
}
