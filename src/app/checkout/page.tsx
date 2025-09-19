"use client";
import { useCart } from "@/lib/store";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

// This function loads the Razorpay script
const useRazorpayScript = () => {
  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);
};

export default function Checkout() {
  useRazorpayScript();
  const { items, total, clear } = useCart();
  const router = useRouter();

  // --- State Management ---
  const [loading, setLoading] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [discountCode, setDiscountCode] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    country: "India",
    firstName: "",
    lastName: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    phone: "",
  });

  const handleInputChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // --- Totals & Tax Calculation ---
  const subtotal = total();
  const taxRate = 0.12; // Assuming 12% tax
  const taxes = subtotal * taxRate;
  const finalTotal = subtotal + taxes;

  // --- Geolocation Logic ---
  const handleGeolocate = () => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser.");
      return;
    }
    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        const response = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
        );
        const data = await response.json();
        const { address } = data;

        setFormData((prev) => ({
          ...prev,
          city: address.city || address.town || "",
          state: address.state || "",
          pincode: address.postcode || "",
          address: `${address.road || ""}, ${address.suburb || ""}`.trim(),
        }));
        setIsLocating(false);
      },
      (error) => {
        alert("Unable to retrieve your location. Please enter manually.");
        console.error("Geolocation error:", error);
        setIsLocating(false);
      }
    );
  };

  // --- Payment Logic ---
 // --- Payment Logic ---
const makePayment = async (e: React.FormEvent) => {
  e.preventDefault();
  setLoading(true);
  const demoMode = !process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || process.env.NEXT_PUBLIC_DEMO_PAYMENT === "true";

  async function runDemo() {
    try {
      const resp = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer: { phone: formData.phone, name: `${formData.firstName} ${formData.lastName}` || undefined, email: formData.email || undefined, address: `${formData.address}, ${formData.city}, ${formData.state} ${formData.pincode}` },
          items: items.map((it) => ({ product_id: 0, qty: it.qty, price: it.price })),
        }),
      });
      
      let trackingId = "";
      if (resp.ok) {
        const j = await resp.json();
        trackingId = j.trackingId;
      } else {
        trackingId = `BV-${Date.now().toString(36).toUpperCase()}`;
      }

      // --- SEND NOTIFICATIONS IN DEMO MODE ---
      // We add the same notification call here
      await fetch('/api/send-notification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          phone: formData.phone,
          orderId: trackingId, // Use the generated tracking ID as the order ID
        }),
      });
      // --- END OF ADDED CODE ---

      const link = `/orders/track?trackingId=${encodeURIComponent(trackingId)}`;
      alert(`Payment successful (demo). Tracking ID: ${trackingId}`);
      
      clear();
      router.push(link);
    } catch {
      alert("Demo payment failed. Please try again.");
    } finally {
      setLoading(false);
    }
  }

  // Demo flow: skip Razorpay entirely
  if (demoMode) return runDemo();

  const res = await fetch("/api/payments", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ amount: finalTotal }),
  });

  if (!res.ok) return runDemo();

  const order = await res.json();
  const options = {
    key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
    amount: order.amount,
    currency: order.currency,
    name: "Blue Veil",
    description: "Bedsheet Purchase",
    order_id: order.id,
    handler: async function (response: any) {
      // 1. Save the order to your database
      const orderResponse = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer: { phone: formData.phone, name: `${formData.firstName} ${formData.lastName}` || undefined, email: formData.email || undefined, address: `${formData.address}, ${formData.city}, ${formData.state} ${formData.pincode}` },
          items: items.map((it) => ({ product_id: 0, qty: it.qty, price: it.price })),
          payment_id: response.razorpay_payment_id,
          tracking_id: `BV-${response.razorpay_order_id.slice(-6)}`
        }),
      });
      
      // 2. Send Notifications
      await fetch('/api/send-notification', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          email: formData.email,
          phone: formData.phone,
          orderId: response.razorpay_order_id,
        }),
      });
      
      const { trackingId } = await orderResponse.json();

      alert(`Payment successful!`);
      clear();
      router.push(`/orders/track?trackingId=${encodeURIComponent(trackingId)}`);
    },
    prefill: {
      name: `${formData.firstName} ${formData.lastName}`,
      email: formData.email,
      contact: formData.phone,
    },
    theme: { color: "#3399cc" },
  };
  const paymentObject = new (window as any).Razorpay(options);
  paymentObject.open();
  paymentObject.on("payment.failed", function (response: any) {
    alert("Payment failed. Please try again.");
    console.error(response.error);
    setLoading(false);
  });
};

  return (
    <main className="bg-white min-h-screen">
      <div className="mx-auto max-w-5xl px-4 py-10 grid gap-12 lg:grid-cols-[1fr_420px]">
        {/* --- Form Section --- */}
        <section>
          <form onSubmit={makePayment} className="space-y-6">
            <div>
              <h2 className="text-xl font-semibold">Contact</h2>
              <div className="mt-3">
                <input
                  id="email"
                  name="email"
                  type="email"
                  required
                  onChange={handleInputChange}
                  value={formData.email}
                  className="w-full border border-gray-300 rounded-md p-3 text-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition"
                  placeholder="Email"
                />
              </div>
            </div>

            <div className="pt-4">
              <h2 className="text-xl font-semibold">Delivery</h2>
              <div className="mt-3">
                <select
                  id="country"
                  name="country"
                  onChange={handleInputChange}
                  value={formData.country}
                  className="w-full border border-gray-300 rounded-md p-3 text-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition bg-white"
                >
                  <option>India</option>
                  <option>United States</option>
                  <option>Canada</option>
                </select>
              </div>
              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-2">
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  required
                  onChange={handleInputChange}
                  value={formData.firstName}
                  className="w-full border border-gray-300 rounded-md p-3 text-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition"
                  placeholder="First name"
                />
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  required
                  onChange={handleInputChange}
                  value={formData.lastName}
                  className="w-full border border-gray-300 rounded-md p-3 text-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition"
                  placeholder="Last name"
                />
              </div>
              <div className="mt-4">
                <input
                  id="address"
                  name="address"
                  type="text"
                  required
                  onChange={handleInputChange}
                  value={formData.address}
                  className="w-full border border-gray-300 rounded-md p-3 text-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition"
                  placeholder="Address"
                />
              </div>
              <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
                <input
                  id="city"
                  name="city"
                  type="text"
                  required
                  onChange={handleInputChange}
                  value={formData.city}
                  className="w-full border border-gray-300 rounded-md p-3 text-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition"
                  placeholder="City"
                />
                <input
                  id="state"
                  name="state"
                  type="text"
                  required
                  onChange={handleInputChange}
                  value={formData.state}
                  className="w-full border border-gray-300 rounded-md p-3 text-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition"
                  placeholder="State"
                />
                <input
                  id="pincode"
                  name="pincode"
                  type="text"
                  required
                  pattern="\d{6}"
                  onChange={handleInputChange}
                  value={formData.pincode}
                  className="w-full border border-gray-300 rounded-md p-3 text-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition"
                  placeholder="PIN code"
                />
              </div>
              <div className="mt-4">
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  required
                  onChange={handleInputChange}
                  value={formData.phone}
                  className="w-full border border-gray-300 rounded-md p-3 text-sm focus:ring-2 focus:ring-sky-500 focus:border-sky-500 transition"
                  placeholder="Phone"
                />
              </div>
            </div>

            <div className="pt-4 space-y-4">
              <button
                type="button"
                onClick={handleGeolocate}
                disabled={isLocating}
                className="w-full flex items-center justify-center gap-2 rounded-md border border-sky-600 text-sky-600 py-3 font-semibold disabled:opacity-50 hover:bg-sky-50 transition"
              >
                {isLocating ? "Locating..." : "Auto-fill with Current Location"}
              </button>

              <button
                type="submit"
                disabled={loading || items.length === 0}
                className="w-full rounded-md bg-sky-600 text-white py-3 font-semibold disabled:bg-sky-300 disabled:cursor-not-allowed hover:bg-sky-700 transition"
              >
                {loading
                  ? "Processing..."
                  : `Pay ₹${finalTotal.toLocaleString("en-IN")}`}
              </button>
            </div>
          </form>
        </section>

        {/* --- Order Summary Section --- */}
        <aside className="bg-zinc-50 rounded-lg p-6 h-fit border">
          <ul className="space-y-4">
            {items.map((it) => (
              <li key={it.handle} className="flex gap-4 text-sm items-start">
                <div className="relative w-16 h-16 rounded-md overflow-hidden border bg-white">
                  <img
                    src={it.image}
                    alt={it.title}
                    className="w-full h-full object-cover"
                  />
                  <span className="absolute -top-2 -right-2 bg-zinc-600 text-white text-xs font-medium rounded-full w-5 h-5 flex items-center justify-center">
                    {it.qty}
                  </span>
                </div>
                <div className="flex-1">
                  <p className="font-medium">{it.title}</p>
                  <p className="text-zinc-500 text-xs">King / blue</p>{" "}
                  {/* Placeholder for variant */}
                </div>
                <p className="font-medium">
                  ₹{(it.price * it.qty).toLocaleString("en-IN")}
                </p>
              </li>
            ))}
          </ul>

          <div className="mt-6 flex gap-3">
            <input
              type="text"
              value={discountCode}
              onChange={(e) => setDiscountCode(e.target.value)}
              placeholder="Discount code or gift card"
              className="w-full border border-gray-300 rounded-md p-3 text-sm focus:ring-2 focus:ring-sky-500 transition"
            />
            <button
              type="button"
              className="rounded-md bg-zinc-200 text-zinc-700 font-medium px-5 text-sm hover:bg-zinc-300 disabled:opacity-50 disabled:cursor-not-allowed"
              disabled={!discountCode}
            >
              Apply
            </button>
          </div>

          <div className="mt-6 border-t border-zinc-200 pt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-zinc-600">Subtotal</span>
              <span className="font-medium">
                ₹{subtotal.toLocaleString("en-IN")}
              </span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-zinc-600">Shipping</span>
              <span className="text-zinc-500">Free</span>
            </div>
            <div className="mt-4 border-t border-zinc-200 pt-4 flex justify-between font-bold text-lg">
              <span>Total</span>
              <span>
                INR ₹
                {finalTotal.toLocaleString("en-IN", {
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                })}
              </span>
            </div>
            <p className="text-xs text-zinc-500">
              Including ₹
              {taxes.toLocaleString("en-IN", {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}{" "}
              in taxes
            </p>
          </div>
        </aside>
      </div>
    </main>
  );
}