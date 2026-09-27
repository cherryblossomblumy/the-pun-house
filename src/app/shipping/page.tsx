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
    <main className="max-w-5xl mx-auto px-4 py-12 md:py-16">
      {/* Hero */}
      <div className="text-center mb-12 md:mb-14">
        <h1
          className="text-4xl md:text-5xl font-bold text-retro-dark mb-4"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Shipping
        </h1>

        <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
          Good things are on the way! Here&apos;s what to expect from the
          time you place your order to the moment it arrives.
        </p>
      </div>

      {/* Shipping steps */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
        <div className="bg-cream rounded-3xl p-6 md:p-7 border-2 border-grape/10">
          <div className="text-sm font-bold text-grape mb-4">01</div>

          <h2
            className="text-xl md:text-2xl font-bold text-retro-dark mb-3"
            style={{ fontFamily: "var(--font-display)" }}
          >
            We Make It
          </h2>

          <p className="text-gray-700 leading-relaxed">
            Your order is made to order, because we don&apos;t believe in
            one-size-fits-all fun. Production takes{" "}
            <strong>2–4 business days</strong>.
          </p>
        </div>

        <div className="bg-cream rounded-3xl p-6 md:p-7 border-2 border-grape/10">
          <div className="text-sm font-bold text-grape mb-4">02</div>

          <h2
            className="text-xl md:text-2xl font-bold text-retro-dark mb-3"
            style={{ fontFamily: "var(--font-display)" }}
          >
            We Ship It
          </h2>

          <p className="text-gray-700 leading-relaxed">
            Once your order is ready, it heads your way! We currently ship
            within the U.S., and you&apos;ll receive tracking information by
            email when your order ships.
          </p>
        </div>

        <div className="bg-cream rounded-3xl p-6 md:p-7 border-2 border-grape/10">
          <div className="text-sm font-bold text-grape mb-4">03</div>

          <h2
            className="text-xl md:text-2xl font-bold text-retro-dark mb-3"
            style={{ fontFamily: "var(--font-display)" }}
          >
            You Get It
          </h2>

          <p className="text-gray-700 leading-relaxed">
            Standard U.S. delivery typically takes a few additional
            business days after production. Then the fun begins!
          </p>
        </div>
      </section>

      {/* Good to know */}
      <section className="bg-white rounded-3xl p-6 md:p-8 border-2 border-sunshine/30 mb-12">
        <h2
          className="text-xl md:text-2xl font-bold text-retro-dark mb-3"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Good To Know
        </h2>

        <p className="text-gray-700 leading-relaxed">
          Holidays, high order volume, and carrier delays can occasionally
          add some extra time. We&apos;ll always send tracking once your
          order is on its way.
        </p>
      </section>

      {/* Contact */}
      <section className="text-center border-t border-grape/10 pt-10">
        <h2
          className="text-2xl md:text-3xl font-bold text-retro-dark mb-3"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Need Help With An Order?
        </h2>

        <p className="text-gray-600">
          We&apos;re happy to help!{" "}
          <a
            href="mailto:ruby@thepunhouse.com"
            className="font-semibold text-grape hover:underline"
          >
            ruby@thepunhouse.com
          </a>
        </p>
      </section>

      {/* CTA */}
      <div className="text-center mt-10">
        <Link
          href="/shop"
          className="inline-flex items-center justify-center rounded-full bg-grape px-7 py-3 font-bold text-white hover:opacity-90 transition-opacity"
        >
          Shop The Pun House
        </Link>
      </div>
    </main>
  );
}