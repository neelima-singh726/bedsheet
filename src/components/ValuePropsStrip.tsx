"use client";

import LocalShippingIcon from "@mui/icons-material/LocalShipping";
import PaymentsIcon from "@mui/icons-material/Payments";
import AssignmentReturnIcon from "@mui/icons-material/AssignmentReturn";
import AccountBalanceWalletIcon from "@mui/icons-material/AccountBalanceWallet";

export default function ValuePropsStrip() {
  return (
    <section className="bg-[var(--cream)] py-8">
      {" "}
      {/* was bg-[#eaf6f7] */}
      <div className="mx-auto max-w-6xl grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
        {/* Free Shipping */}
        <div>
          <LocalShippingIcon
            fontSize="large"
            className="text-gray-800 mx-auto"
          />
          <p className="mt-2 text-sm font-semibold">FREE STANDARD SHIPPING</p>
        </div>

        {/* COD */}
        <div>
          <PaymentsIcon fontSize="large" className="text-gray-800 mx-auto" />
          <p className="mt-2 text-sm font-semibold">CASH ON DELIVERY</p>
        </div>

        {/* Returns */}
        <div>
          <AssignmentReturnIcon
            fontSize="large"
            className="text-gray-800 mx-auto"
          />
          <p className="mt-2 text-sm font-semibold">HASSLE-FREE RETURNS</p>
        </div>

        {/* EMI */}
        <div>
          <AccountBalanceWalletIcon
            fontSize="large"
            className="text-gray-800 mx-auto"
          />
          <p className="mt-2 text-sm font-semibold">EMI STARTS ₹126/MONTH</p>
        </div>
      </div>
    </section>
  );
}
