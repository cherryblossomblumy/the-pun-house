import Link from "next/link";

export const metadata = {
  title: "Contact Us | The Pun House",
  description:
    "Have a question about an order or The Pun House? Get in touch with our team.",
  alternates: {
    canonical: "https://thepunhouse.com/contact",
  },
};

export default function ContactPage() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-12 md:py-16">
      <div className="text-center mb-12">
        <h1
          className="text-4xl md:text-5xl font-bold text-retro-dark mb-4"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Contact Us
        </h1>

        <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
          Got a question, an order issue, or just something punny to tell us?
          We&apos;d love to hear from you.
        </p>
      </div>

      <section className="bg-cream rounded-3xl p-6 md:p-8 border-2 border-grape/10 mb-6">
        <h2
          className="text-2xl font-bold text-retro-dark mb-4"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Need Help With An Order?
        </h2>

        <p className="text-gray-700 leading-7 mb-4">
          If there&apos;s a problem with your order, please email our team.
          Include your order number and a brief description of what happened
          so we can take a look.
        </p>

        <a
          href="mailto:ruby@thepunhouse.com"
          className="inline-flex items-center justify-center bg-grape text-white px-6 py-3 rounded-full font-bold hover:bg-bubblegum transition-colors"
        >
          ruby@thepunhouse.com
        </a>
      </section>

      <section className="bg-white rounded-3xl p-6 md:p-8 border-2 border-sunshine/30 mb-10">
        <h2
          className="text-2xl font-bold text-retro-dark mb-4"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Before You Email Us
        </h2>

        <p className="text-gray-700 leading-7 mb-4">
          You may find the answer you&apos;re looking for on one of these
          pages:
        </p>

        <div className="flex flex-wrap gap-3">
          <Link
            href="/shipping"
            className="px-4 py-2 rounded-full border-2 border-grape/20 text-grape font-bold hover:border-bubblegum hover:text-bubblegum transition-colors"
          >
            Shipping
          </Link>

          <Link
            href="/returns"
            className="px-4 py-2 rounded-full border-2 border-grape/20 text-grape font-bold hover:border-bubblegum hover:text-bubblegum transition-colors"
          >
            Returns
          </Link>

          <Link
            href="/faq"
            className="px-4 py-2 rounded-full border-2 border-grape/20 text-grape font-bold hover:border-bubblegum hover:text-bubblegum transition-colors"
          >
            FAQ
          </Link>
        </div>
      </section>

      <div className="text-center border-t border-grape/10 pt-10">
        <p className="text-gray-600">
          We&apos;ll do our best to get back to you as soon as we can.
        </p>
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