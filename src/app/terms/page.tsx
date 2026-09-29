import Link from "next/link";

export const metadata = {
  title: "Terms of Service | The Pun House",
  description:
    "Read the Terms of Service for shopping and using The Pun House website.",
  alternates: {
    canonical: "https://thepunhouse.com/terms",
  },
};

export default function TermsPage() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-12 md:py-16">
      <div className="text-center mb-12">
        <h1
          className="text-4xl md:text-5xl font-bold text-retro-dark mb-4"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Terms of Service
        </h1>

        <p className="text-lg text-gray-600">
          A few simple ground rules for using The Pun House.
        </p>

        <p className="text-sm text-gray-500 mt-3">
          Last updated: September 29, 2026
        </p>
      </div>

      <div className="space-y-6">
        <section className="bg-white rounded-3xl p-6 md:p-8 border-2 border-grape/10">
          <h2
            className="text-2xl font-bold text-retro-dark mb-4"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Using The Pun House
          </h2>

          <p className="text-gray-700 leading-7">
            By using this website, you agree to use it lawfully and
            respectfully. You may browse the site, shop for products, and use
            the website&apos;s features for their intended purposes.
          </p>
        </section>

        <section className="bg-cream rounded-3xl p-6 md:p-8 border-2 border-grape/10">
          <h2
            className="text-2xl font-bold text-retro-dark mb-4"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Products & Orders
          </h2>

          <p className="text-gray-700 leading-7 mb-4">
            We do our best to make sure product descriptions, images, pricing,
            and availability are accurate. Product availability and pricing may
            change without notice.
          </p>

          <p className="text-gray-700 leading-7">
            When you place an order, you agree to provide accurate information
            needed to process and fulfill that order. We reserve the right to
            correct errors, cancel an order, or contact you if information
            needed to complete an order is inaccurate or unavailable.
          </p>
        </section>

        <section className="bg-white rounded-3xl p-6 md:p-8 border-2 border-sunshine/30">
          <h2
            className="text-2xl font-bold text-retro-dark mb-4"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Made-To-Order Products
          </h2>

          <p className="text-gray-700 leading-7">
            Products are made to order. Because of this, orders cannot
            generally be cancelled, returned, or refunded simply because you
            change your mind or no longer want the item.
          </p>

          <p className="text-gray-700 leading-7 mt-4">
            If there is a problem with your order, please contact us at{" "}
            <a
              href="mailto:ruby@thepunhouse.com"
              className="font-bold text-grape hover:text-bubblegum transition-colors"
            >
              ruby@thepunhouse.com
            </a>
            . We&apos;ll review the issue and do our best to determine what we
            can do to resolve it.
          </p>
        </section>

        <section className="bg-cream rounded-3xl p-6 md:p-8 border-2 border-grape/10">
          <h2
            className="text-2xl font-bold text-retro-dark mb-4"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Shipping
          </h2>

          <p className="text-gray-700 leading-7">
            Production and shipping information is provided on our{" "}
            <Link
              href="/shipping"
              className="font-bold text-grape hover:text-bubblegum transition-colors"
            >
              Shipping page
            </Link>
            . Delivery times can vary due to production schedules, holidays,
            order volume, and carrier delays.
          </p>
        </section>

        <section className="bg-white rounded-3xl p-6 md:p-8 border-2 border-grape/10">
          <h2
            className="text-2xl font-bold text-retro-dark mb-4"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Intellectual Property
          </h2>

          <p className="text-gray-700 leading-7">
            The content of this website, including product artwork, designs,
            logos, text, graphics, photographs, and other original materials,
            belongs to The Pun House or its respective licensors and may not
            be copied, reproduced, modified, or distributed without permission.
          </p>
        </section>

        <section className="bg-cream rounded-3xl p-6 md:p-8 border-2 border-grape/10">
          <h2
            className="text-2xl font-bold text-retro-dark mb-4"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Website Availability
          </h2>

          <p className="text-gray-700 leading-7">
            We work to keep The Pun House available and functioning properly,
            but we cannot guarantee that the website will always be available,
            uninterrupted, or free from errors.
          </p>
        </section>

        <section className="bg-white rounded-3xl p-6 md:p-8 border-2 border-grape/10">
          <h2
            className="text-2xl font-bold text-retro-dark mb-4"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Limitation of Liability
          </h2>

          <p className="text-gray-700 leading-7">
            To the extent permitted by applicable law, The Pun House is not
            responsible for indirect, incidental, or consequential losses
            arising from your use of the website or products purchased through
            it.
          </p>
        </section>

        <section className="bg-cream rounded-3xl p-6 md:p-8 border-2 border-grape/10">
          <h2
            className="text-2xl font-bold text-retro-dark mb-4"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Changes To These Terms
          </h2>

          <p className="text-gray-700 leading-7">
            We may update these Terms of Service from time to time. The
            updated version will be posted on this page with a revised date.
          </p>
        </section>

        <section className="text-center border-t border-grape/10 pt-10">
          <h2
            className="text-2xl font-bold text-retro-dark mb-3"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Questions?
          </h2>

          <p className="text-gray-600">
            Contact us at{" "}
            <a
              href="mailto:ruby@thepunhouse.com"
              className="font-bold text-grape hover:text-bubblegum transition-colors"
            >
              ruby@thepunhouse.com
            </a>
            .
          </p>
        </section>
      </div>

      <div className="text-center mt-10">
        <Link
          href="/shop"
          className="inline-flex items-center justify-center bg-grape text-white px-6 py-3 rounded-full font-bold hover:bg-bubblegum transition-colors"
        >
          Shop The Pun House
        </Link>
      </div>
    </main>
  );
}