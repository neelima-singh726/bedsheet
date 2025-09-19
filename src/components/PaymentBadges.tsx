export default function PaymentBadges() {
  return (
    <div className="bg-[#e9f6f7]">
      <div className="mx-auto max-w-7xl px-4 py-8 grid gap-8 md:grid-cols-4">
        {[
          "FREE STANDARD SHIPPING",
          "CASH ON DELIVERY",
          "HASSLE-FREE RETURNS",
          "EMI STARTS FROM ₹126*/MONTH",
        ].map((t, i) => (
          <div key={i} className="text-sm">
            {t}
          </div>
        ))}
      </div>
    </div>
  );
}
