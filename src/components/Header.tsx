"use client";

import Link from "next/link";
import { useCart } from "./CartProvider";
import { useState } from "react";

export function Header() {
  const { totalItems, showCartNotification } = useCart();
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <>
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b-4 border-bubblegum shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group">
            <span className="text-3xl md:text-4xl animate-wiggle inline-block">
              🤣
            </span>
            <span
              className="text-2xl md:text-3xl font-bold rainbow-text"
              style={{ fontFamily: "var(--font-display)" }}
            >
              PunStop
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/"
              className="font-semibold text-retro-dark hover:text-bubblegum transition-colors text-lg"
            >
              Home
            </Link>
            <Link
              href="/shop"
              className="font-semibold text-retro-dark hover:text-bubblegum transition-colors text-lg"
            >
              Shop All
            </Link>
            <Link
              href="/shop?category=greeting-cards"
              className="font-semibold text-retro-dark hover:text-bubblegum transition-colors text-lg"
            >
              💌 Cards
            </Link>
            <Link
              href="/shop?category=t-shirts"
              className="font-semibold text-retro-dark hover:text-bubblegum transition-colors text-lg"
            >
              👕 Shirts
            </Link>
            <Link
              href="/shop?category=posters"
              className="font-semibold text-retro-dark hover:text-bubblegum transition-colors text-lg"
            >
              🖼️ Posters
            </Link>
          </nav>

          {/* Cart + Mobile Menu */}
          <div className="flex items-center gap-4">
            <Link
              href="/cart"
              className="relative btn-fun bg-gradient-to-r from-bubblegum to-grape text-white px-4 py-2 rounded-full font-bold text-lg shadow-lg flex items-center gap-2"
            >
              🛒
              {totalItems > 0 && (
                <span className="absolute -top-2 -right-2 bg-sunshine text-retro-dark rounded-full w-6 h-6 flex items-center justify-center text-sm font-bold animate-pop-in">
                  {totalItems}
                </span>
              )}
              <span className="hidden sm:inline">Cart</span>
            </Link>

            <button
              className="md:hidden text-2xl"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Toggle menu"
            >
              {menuOpen ? "✕" : "☰"}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        {menuOpen && (
          <div className="md:hidden bg-white border-t-2 border-bubblegum-light px-4 py-4 space-y-3 animate-slide-up">
            <Link
              href="/"
              className="block font-semibold text-lg text-retro-dark hover:text-bubblegum"
              onClick={() => setMenuOpen(false)}
            >
              🏠 Home
            </Link>
            <Link
              href="/shop"
              className="block font-semibold text-lg text-retro-dark hover:text-bubblegum"
              onClick={() => setMenuOpen(false)}
            >
              🛍️ Shop All
            </Link>
            <Link
              href="/shop?category=greeting-cards"
              className="block font-semibold text-lg text-retro-dark hover:text-bubblegum"
              onClick={() => setMenuOpen(false)}
            >
              💌 Greeting Cards
            </Link>
            <Link
              href="/shop?category=t-shirts"
              className="block font-semibold text-lg text-retro-dark hover:text-bubblegum"
              onClick={() => setMenuOpen(false)}
            >
              👕 T-Shirts
            </Link>
            <Link
              href="/shop?category=posters"
              className="block font-semibold text-lg text-retro-dark hover:text-bubblegum"
              onClick={() => setMenuOpen(false)}
            >
              🖼️ Posters
            </Link>
            <Link
              href="/shop?category=mugs"
              className="block font-semibold text-lg text-retro-dark hover:text-bubblegum"
              onClick={() => setMenuOpen(false)}
            >
              ☕ Mugs
            </Link>
            <Link
              href="/shop?category=stickers"
              className="block font-semibold text-lg text-retro-dark hover:text-bubblegum"
              onClick={() => setMenuOpen(false)}
            >
              ✨ Stickers
            </Link>
          </div>
        )}
      </header>

      {/* Cart notification toast */}
      {showCartNotification && (
        <div className="fixed top-20 right-4 z-50 bg-gradient-to-r from-mint to-sky text-white px-6 py-3 rounded-2xl shadow-2xl animate-pop-in font-bold text-lg">
          ✅ Added to cart! You&apos;re pun-stoppable! 🎉
        </div>
      )}
    </>
  );
}
