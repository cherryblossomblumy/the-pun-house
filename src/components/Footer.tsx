import Link from "next/link";

export function Footer() {
  return (
    <footer className="bg-retro-dark text-white mt-16">
      {/* Fun wave divider */}
      <div className="relative -mt-1">
        <svg
          viewBox="0 0 1440 100"
          className="w-full h-16"
          preserveAspectRatio="none"
        >
          <path
            d="M0,50 C360,100 720,0 1080,50 C1260,75 1350,25 1440,50 L1440,100 L0,100 Z"
            fill="#2d1b69"
          />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-1">
            <span
              className="text-3xl font-bold rainbow-text"
              style={{ fontFamily: "var(--font-display)" }}
            >
              🤣 PunStop
            </span>
            <p className="mt-3 text-gray-300 text-sm">
              Life&apos;s too short for boring gifts. We make puns so good,
              they&apos;ll make you groan AND grin.
            </p>
            <div className="flex gap-3 mt-4 text-2xl">
              <span className="cursor-pointer hover:scale-125 transition-transform">
                📸
              </span>
              <span className="cursor-pointer hover:scale-125 transition-transform">
                🐦
              </span>
              <span className="cursor-pointer hover:scale-125 transition-transform">
                📘
              </span>
              <span className="cursor-pointer hover:scale-125 transition-transform">
                🎵
              </span>
            </div>
          </div>

          {/* Shop */}
          <div>
            <h3
              className="text-lg font-bold text-sunshine mb-3"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Shop Puns
            </h3>
            <ul className="space-y-2 text-gray-300">
              <li>
                <Link
                  href="/shop?category=greeting-cards"
                  className="hover:text-bubblegum transition-colors"
                >
                  💌 Greeting Cards
                </Link>
              </li>
              <li>
                <Link
                  href="/shop?category=t-shirts"
                  className="hover:text-bubblegum transition-colors"
                >
                  👕 T-Shirts
                </Link>
              </li>
              <li>
                <Link
                  href="/shop?category=posters"
                  className="hover:text-bubblegum transition-colors"
                >
                  🖼️ Posters
                </Link>
              </li>
              <li>
                <Link
                  href="/shop?category=mugs"
                  className="hover:text-bubblegum transition-colors"
                >
                  ☕ Mugs
                </Link>
              </li>
              <li>
                <Link
                  href="/shop?category=stickers"
                  className="hover:text-bubblegum transition-colors"
                >
                  ✨ Stickers
                </Link>
              </li>
            </ul>
          </div>

          {/* Help */}
          <div>
            <h3
              className="text-lg font-bold text-sunshine mb-3"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Help & Info
            </h3>
            <ul className="space-y-2 text-gray-300">
              <li>
                <span className="hover:text-bubblegum transition-colors cursor-pointer">
                  📦 Shipping Info
                </span>
              </li>
              <li>
                <span className="hover:text-bubblegum transition-colors cursor-pointer">
                  🔄 Returns & Exchanges
                </span>
              </li>
              <li>
                <span className="hover:text-bubblegum transition-colors cursor-pointer">
                  ❓ FAQ
                </span>
              </li>
              <li>
                <span className="hover:text-bubblegum transition-colors cursor-pointer">
                  📧 Contact Us
                </span>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3
              className="text-lg font-bold text-sunshine mb-3"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Get Punny Updates!
            </h3>
            <p className="text-gray-300 text-sm mb-3">
              Subscribe for new puns, deals, and bad jokes delivered right to
              your inbox! 📬
            </p>
            <div className="flex gap-2">
              <input
                type="email"
                placeholder="your@email.com"
                className="flex-1 px-3 py-2 rounded-full bg-white/10 border border-grape-light text-white placeholder-gray-400 text-sm focus:outline-none focus:border-bubblegum"
              />
              <button className="btn-fun bg-gradient-to-r from-bubblegum to-coral text-white px-4 py-2 rounded-full font-bold text-sm">
                Join!
              </button>
            </div>
          </div>
        </div>

        <div className="border-t border-white/10 mt-10 pt-6 text-center text-gray-400 text-sm">
          <p>© 2026 PunStop. All puns reserved. 🤓</p>
          <p className="mt-1">Made with 💖 and way too many dad jokes.</p>
        </div>
      </div>
    </footer>
  );
}
