import Link from "next/link";

export const metadata = {
  title: "Returns & Exchanges | The Pun House",
  description:
    "Learn about returns, refunds, and what to do if there is a problem with your order from The Pun House.",
  alternates: {
    canonical: "https://thepunhouse.com/returns",
  },
};

export default function ReturnsPage() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-12 md:py-16">
      <div className="text-center mb-12">
        <h1
          className="text-4xl md:text-5xl font-bold text-retro-dark mb-4"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Returns & Exchanges
        </h1>

        <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
          We make every order just for you, so here&apos;s what to know if
          something isn&apos;t quite right.
        </p>
      </div>

      <section className="bg-cream rounded-3xl p-6 md:p-8 border-2 border-grape/10 mb-6">
        <h2
          className="text-2xl font-bold text-retro-dark mb-4"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Made To Order
        </h2>

        <p className="text-gray-700 leading-7">
          Every Pun House order is made to order. Because of this, we do not
          accept returns or offer refunds for change of mind, incorrect
          selections, or orders you simply no longer want.
        </p>
      </section>

      <section className="bg-white rounded-3xl p-6 md:p-8 border-2 border-sunshine/30 mb-6">
        <h2
          className="text-2xl font-bold text-retro-dark mb-4"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Something Wrong With Your Order?
        </h2>

        <p className="text-gray-700 leading-7 mb-4">
          If there&apos;s a problem with your order — for example, it arrives
          damaged, there&apos;s a mistake with your order, or something just
          isn&apos;t right — please reach out to our team.
        </p>

        <p className="text-gray-700 leading-7">
          Email us at{" "}
          <a
            href="mailto:ruby@thepunhouse.com"
            className="font-bold text-grape hover:text-bubblegum transition-colors"
          >
            ruby@thepunhouse.com
          </a>
          . We&apos;ll review the issue and do our best to figure out what we
          can do to make it right.
        </p>
      </section>

      <section className="text-center border-t border-grape/10 pt-10">
        <h2
          className="text-2xl font-bold text-retro-dark mb-3"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Have A Question?
        </h2>

        <p className="text-gray-600">
          We&apos;re happy to help.{" "}
          <a
            href="mailto:ruby@thepunhouse.com"
            className="font-bold text-grape hover:text-bubblegum transition-colors"
          >
            Contact our team
          </a>
          .
        </p>
      </section>

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