import Link from "next/link";

export const metadata = {
  title: "Shipping | The Pun House",
  description:
    "Learn about production times, U.S. shipping, delivery, and order tracking at The Pun House.",
  alternates: {
    canonical: "https://thepunhouse.com/shipping",
  },
};

export default function ShippingPage() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-12 md:py-16">
      <div className="text-center mb-12">
        <div className="text-5xl mb-4">📦</div>

        <h1
          className="text-4xl md:text-5xl font-bold text-retro-dark mb-4"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Shipping
        </h1>

        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Here&apos;s what to expect from the time you place your order
          to the moment it arrives.
        </p>
      </div>

      <div className="space-y-8">
        <section className="bg-cream rounded-3xl p-6 md:p-8 border-2 border-sunshine/30">
          <h2
            className="text-2xl font-bold text-retro-dark mb-3"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Production time
          </h2>

          <p className="text-gray-700 leading-relaxed">
            Our products are made to order. Production takes{" "}
            <strong>2–4 business days</strong> before your order ships.
          </p>
        </section>

        <section>
          <h2
            className="text-2xl font-bold text-retro-dark mb-3"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Delivery
          </h2>

          <p className="text-gray-700 leading-relaxed">
            We currently ship within the United States. After production,
            standard U.S. delivery typically takes a few additional
            business days.
          </p>
        </section>

        <section>
          <h2
            className="text-2xl font-bold text-retro-dark mb-3"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Tracking
          </h2>

          <p className="text-gray-700 leading-relaxed">
            You&apos;ll receive tracking information by email once your
            order ships.
          </p>
        </section>

        <section>
          <h2
            className="text-2xl font-bold text-retro-dark mb-3"
            style={{ fontFamily: "var(--font-display)" }}
          >
            A quick heads-up
          </h2>

          <p className="text-gray-700 leading-relaxed">
            Production and delivery can occasionally take longer during
            holidays or periods of high order volume. Carrier delays can
            also affect delivery times after an order has shipped.
          </p>
        </section>

        <section className="bg-white rounded-3xl p-6 md:p-8 border-2 border-grape/10">
          <h2
            className="text-2xl font-bold text-retro-dark mb-3"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Questions about your order?
          </h2>

          <p className="text-gray-700 leading-relaxed">
            We&apos;re happy to help. Email us at{" "}
            <a
              href="mailto:ruby@thepunhouse.com"
              className="font-semibold text-grape hover:underline"
            >
              ruby@thepunhouse.com
            </a>
            .
          </p>
        </section>
      </div>

      <div className="text-center mt-12">
        <Link
          href="/shop"
          className="inline-flex items-center justify-center rounded-full bg-grape px-6 py-3 font-bold text-white hover:opacity-90 transition-opacity"
        >
          Shop The Pun House
        </Link>
      </div>
    </main>
  );
}