import Link from "next/link";

export const metadata = {
  title: "Privacy Policy | The Pun House",
  description:
    "Learn how The Pun House collects, uses, and protects information when you visit our website or place an order.",
  alternates: {
    canonical: "https://thepunhouse.com/privacy",
  },
};

export default function PrivacyPage() {
  return (
    <main className="max-w-4xl mx-auto px-4 py-12 md:py-16">
      <div className="text-center mb-12">
        <h1
          className="text-4xl md:text-5xl font-bold text-retro-dark mb-4"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Privacy Policy
        </h1>

        <p className="text-lg text-gray-600">
          We like puns. We also take your privacy seriously.
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
            What Information We Collect
          </h2>

          <p className="text-gray-700 leading-7 mb-4">
            When you place an order with The Pun House, we collect the
            information needed to process and fulfill your order. This may
            include your name, email address, phone number, shipping address,
            order details, and payment-related information.
          </p>

          <p className="text-gray-700 leading-7">
            We may also receive information you choose to provide when you
            contact us about an order or another question.
          </p>
        </section>

        <section className="bg-cream rounded-3xl p-6 md:p-8 border-2 border-grape/10">
          <h2
            className="text-2xl font-bold text-retro-dark mb-4"
            style={{ fontFamily: "var(--font-display)" }}
          >
            How We Use Your Information
          </h2>

          <p className="text-gray-700 leading-7 mb-3">
            We use information we collect to:
          </p>

          <ul className="list-disc pl-6 space-y-2 text-gray-700 leading-7">
            <li>Process and fulfill orders.</li>
            <li>Arrange shipping and provide order tracking.</li>
            <li>Communicate with you about your order.</li>
            <li>Respond to customer support requests.</li>
            <li>Maintain and improve our website and services.</li>
            <li>Understand website usage when analytics consent is provided.</li>
            <li>Protect the website and our customers from fraud or misuse.</li>
          </ul>
        </section>

        <section className="bg-white rounded-3xl p-6 md:p-8 border-2 border-sunshine/30">
          <h2
            className="text-2xl font-bold text-retro-dark mb-4"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Payments
          </h2>

          <p className="text-gray-700 leading-7">
            Payments are processed through Stripe. The Pun House does not
            directly store your full payment card number on our servers.
            Stripe may collect and process payment information according to
            its own privacy policy and terms.
          </p>
        </section>

        <section className="bg-cream rounded-3xl p-6 md:p-8 border-2 border-grape/10">
          <h2
            className="text-2xl font-bold text-retro-dark mb-4"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Analytics & Cookies
          </h2>

          <p className="text-gray-700 leading-7 mb-4">
            We use Google Analytics to understand how visitors use The Pun
            House website and to help us improve the experience.
          </p>

          <p className="text-gray-700 leading-7">
            Analytics is only enabled after you choose to accept analytics
            cookies through our consent banner. If you decline analytics, we
            do not load our Google Analytics tracking.
          </p>
        </section>

        <section className="bg-white rounded-3xl p-6 md:p-8 border-2 border-grape/10">
          <h2
            className="text-2xl font-bold text-retro-dark mb-4"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Other Service Providers
          </h2>

          <p className="text-gray-700 leading-7">
            We use trusted third-party services to operate parts of The Pun
            House, including website hosting, database services, image
            storage, payment processing, email delivery, and analytics. These
            providers may process information as necessary to provide their
            services to us.
          </p>
        </section>

        <section className="bg-cream rounded-3xl p-6 md:p-8 border-2 border-grape/10">
          <h2
            className="text-2xl font-bold text-retro-dark mb-4"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Order & Customer Information
          </h2>

          <p className="text-gray-700 leading-7">
            We retain order and customer information for purposes such as
            fulfilling orders, providing customer support, maintaining business
            records, and handling disputes or other legitimate business needs.
          </p>
        </section>

        <section className="bg-white rounded-3xl p-6 md:p-8 border-2 border-grape/10">
          <h2
            className="text-2xl font-bold text-retro-dark mb-4"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Your Choices
          </h2>

          <p className="text-gray-700 leading-7 mb-4">
            You can decline analytics cookies when you visit the website. You
            can also contact us with questions about information associated
            with your orders or communications with us.
          </p>

          <p className="text-gray-700 leading-7">
            To contact us, email{" "}
            <a
              href="mailto:ruby@thepunhouse.com"
              className="font-bold text-grape hover:text-bubblegum transition-colors"
            >
              ruby@thepunhouse.com
            </a>
            .
          </p>
        </section>

        <section className="bg-cream rounded-3xl p-6 md:p-8 border-2 border-grape/10">
          <h2
            className="text-2xl font-bold text-retro-dark mb-4"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Changes To This Policy
          </h2>

          <p className="text-gray-700 leading-7">
            We may update this Privacy Policy from time to time as our
            website, services, or business practices change. The updated
            version will be posted on this page with a revised date.
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