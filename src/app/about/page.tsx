export default function AboutPage() {
  return (
    <main className="mx-auto max-w-6xl px-4 py-12">
      <section className="mb-10">
        <div className="h-60 w-full overflow-hidden rounded-lg border">
          <img src="/home/hero-4.png" alt="Our Story" className="w-full h-full object-cover" />
        </div>
      </section>
      <section className="prose max-w-none text-zinc-800">
        <h1 className="font-semibold">Our Story</h1>
        <p>
          We combine an elevated product philosophy with roots in traditional textile craft. With decades of
          experience in weaving and finishing, our team focuses on sustainability and quality that lasts.
        </p>
        <h2>Founder’s Note</h2>
        <p>
          Blue Veil was created to deliver everyday performance at an affordable price. We engineer each fabric to
          be soft, breathable and easy to care for. We are constantly evolving to reduce water usage and improve our
          processes.
        </p>
        <h2>Our Core Values</h2>
        <ul>
          <li>Amazing product that balances comfort and durability</li>
          <li>Economic pricing for everyday luxury</li>
          <li>Sustainability at each stage of production</li>
          <li>Empowerment and fair practices for our partners</li>
        </ul>
      </section>
    </main>
  );
}


