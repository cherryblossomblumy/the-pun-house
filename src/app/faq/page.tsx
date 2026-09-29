import Link from "next/link";

export const metadata = {
  title: "FAQ | The Pun House",
  description:
    "Find answers to common questions about The Pun House products, orders, production, shipping, returns, and more.",
  alternates: {
    canonical: "https://thepunhouse.com/faq",
  },
};

const faqs = [
  {
    question: "Are your products made to order?",
    answer:
      "Yes! Our products are made to order, which means we make your goodies after you place your order rather than keeping everything sitting around in a warehouse.",
  },
  {
    question: "How long does it take to make my order?",
    answer:
      "Production typically takes 2–4 business days. After production, your order is shipped and you’ll receive tracking information by email.",
  },
  {
    question: "How long does shipping take?",
    answer:
      "Standard U.S. delivery typically takes a few additional business days after production. Holidays, high order volume, and carrier delays can occasionally add extra time.",
  },
  {
    question: "Do you ship outside the U.S.?",
    answer:
      "At this time, The Pun House ships within the United States.",
  },
  {
    question: "Can I return my order?",
    answer:
      "Because our products are made to order, we do not accept returns or offer refunds for change of mind, incorrect selections, or orders you simply no longer want.",
  },
  {
    question: "What if there is a problem with my order?",
    answer:
      "If your order arrives damaged, there’s a mistake with your order, or something else isn’t right, please contact us at ruby@thepunhouse.com. We’ll review the issue and do our best to figure out what we can do to make it right.",
  },
  {
    question: "Will I receive tracking information?",
    answer:
      "Yes. Once your order ships, we’ll send tracking information to the email address provided with your order.",
  },
  {
    question: "Can I change or cancel my order?",
    answer:
      "Because orders are made to order, we may not be able to make changes or cancellations once production has begun. If you need help with an order, contact us as soon as possible at ruby@thepunhouse.com.",
  },
  {
    question: "How can I contact The Pun House?",
    answer:
      "You can reach our team at ruby@thepunhouse.com. If you’re contacting us about an order, please include your order number so we can help you more quickly.",
  },
];

export default function FAQPage() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-12 md:py-16">
      <div className="text-center mb-12">
        <h1
          className="text-4xl md:text-5xl font-bold text-retro-dark mb-4"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Frequently Asked Questions
        </h1>

        <p className="text-lg md:text-xl text-gray-600 max-w-2xl mx-auto">
          Got questions? We&apos;ve got answers. Probably with at least one
          pun.
        </p>
      </div>

      <div className="space-y-4">
        {faqs.map((faq, index) => (
          <section
            key={faq.question}
            className={`rounded-3xl p-6 md:p-7 border-2 ${
              index % 2 === 0
                ? "bg-cream border-grape/10"
                : "bg-white border-sunshine/30"
            }`}
          >
            <h2
              className="text-xl md:text-2xl font-bold text-retro-dark mb-3"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {faq.question}
            </h2>

            <p className="text-gray-700 leading-7">
              {faq.answer}
            </p>
          </section>
        ))}
      </div>

      <section className="text-center border-t border-grape/10 pt-10 mt-12">
        <h2
          className="text-2xl font-bold text-retro-dark mb-3"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Still Have A Question?
        </h2>

        <p className="text-gray-600">
          We&apos;re happy to help.{" "}
          <Link
            href="/contact"
            className="font-bold text-grape hover:text-bubblegum transition-colors"
          >
            Contact our team
          </Link>
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