import Link from 'next/link'; // 1. Import the Link component

export default function Footer() {
  return (
    <footer className="mt-16 bg-[var(--brand)] text-white">
      <div className="mx-auto max-w-7xl px-4 py-10 grid gap-6 md:grid-cols-3">
        <div>
          <div className="font-semibold text-lg">BLUE VEIL</div>
          <p className="text-sm opacity-80">
            Premium bed linen · Sustainable · Comfortable
          </p>
        </div>
        <ul className="space-y-2 text-sm">
          {/* 2. Wrap the text in Link components */}
          <li>About Us</li>
          <li><Link href="/about" className="hover:underline">Our Story</Link></li>
          <li><Link href="/contact" className="hover:underline">Contact Us</Link></li>
        </ul>
        <div className="space-y-2">
          <div className="font-medium">Get in touch</div>
          <p className="text-sm">+91 7015449574</p>
          <p className="text-sm">bluevei@gmail.com</p>
        </div>
      </div>
      <div className="border-t border-white/20 py-4 text-center text-xs opacity-80">
        © {new Date().getFullYear()} Blue Veil
      </div>
    </footer>
  );
}