"use client";

import { useCart } from "@/components/CartProvider";
import Link from "next/link";

export default function CartPage() {
  const {
    items,
    totalItems,
    totalPrice,
    removeFromCart,
    updateQuantity,
    isLoading,
  } = useCart();

  const freeShippingThreshold = 35;
  const remaining = Math.max(0, freeShippingThreshold - totalPrice);
  const progressPercent = Math.min(
    100,
    (totalPrice / freeShippingThreshold) * 100
  );

  if (items.length === 0) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <span className="text-8xl block mb-6 animate-float">🛒</span>
        <h1
          className="text-3xl md:text-4xl font-bold text-retro-dark mb-4"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Your cart is pun-believably empty!
        </h1>
        <p className="text-gray-500 text-lg mb-8">
          Looks like you haven&apos;t added any puns yet. Let&apos;s fix that!
        </p>
        <Link
          href="/shop"
          className="btn-fun inline-flex items-center gap-2 bg-gradient-to-r from-bubblegum to-grape text-white font-bold text-xl px-10 py-5 rounded-full shadow-xl"
          style={{ fontFamily: "var(--font-display)" }}
        >
          🛍️ Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <h1
        className="text-3xl md:text-4xl font-bold text-retro-dark mb-2 text-center"
        style={{ fontFamily: "var(--font-display)" }}
      >
        🛒 Your Pun Cart
      </h1>
      <p className="text-gray-500 text-center mb-8">
        {totalItems} {totalItems === 1 ? "item" : "items"} of pure pun-ness
      </p>

      {/* Free shipping progress */}
      <div className="bg-white rounded-2xl p-5 shadow-md mb-8 border-2 border-sunshine/30">
        {remaining > 0 ? (
          <>
            <p className="text-sm font-semibold text-retro-dark mb-2">
              🚚 Add <span className="text-bubblegum">${remaining.toFixed(2)}</span> more
              for FREE shipping!
            </p>
            <div className="w-full bg-gray-200 rounded-full h-3 overflow-hidden">
              <div
                className="bg-gradient-to-r from-sunshine to-coral h-full rounded-full transition-all duration-500"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </>
        ) : (
          <p className="text-sm font-bold text-mint flex items-center gap-2">
            🎉 You&apos;ve unlocked FREE shipping! You&apos;re pun-stoppable!
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-2xl p-4 shadow-md flex gap-4 items-center border-2 border-transparent hover:border-bubblegum transition-colors"
            >
              <img
                src={item.image}
                alt={item.name}
                className="w-24 h-24 rounded-xl object-cover flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <h3
                  className="font-bold text-retro-dark text-lg truncate"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {item.name}
                </h3>
                <p className="text-sm text-gray-500 truncate">
                  {item.tagline}
                </p>
                <p className="text-grape font-bold text-lg mt-1">
                  ${parseFloat(item.price).toFixed(2)}
                </p>
              </div>

              {/* Quantity Controls */}
              <div className="flex items-center gap-2">
                <button
                  onClick={() =>
                    item.quantity > 1
                      ? updateQuantity(item.id, item.quantity - 1)
                      : removeFromCart(item.id)
                  }
                  disabled={isLoading}
                  className="btn-fun w-9 h-9 rounded-full bg-gray-100 hover:bg-bubblegum hover:text-white font-bold text-lg flex items-center justify-center"
                >
                  −
                </button>
                <span className="font-bold text-lg w-8 text-center">
                  {item.quantity}
                </span>
                <button
                  onClick={() => updateQuantity(item.id, item.quantity + 1)}
                  disabled={isLoading}
                  className="btn-fun w-9 h-9 rounded-full bg-gray-100 hover:bg-grape hover:text-white font-bold text-lg flex items-center justify-center"
                >
                  +
                </button>
              </div>

              {/* Remove */}
              <button
                onClick={() => removeFromCart(item.id)}
                disabled={isLoading}
                className="text-gray-400 hover:text-coral transition-colors text-xl"
                aria-label="Remove item"
              >
                ✕
              </button>
            </div>
          ))}
        </div>

        {/* Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-2xl p-6 shadow-xl border-2 border-grape/20 sticky top-24">
            <h2
              className="text-xl font-bold text-retro-dark mb-4"
              style={{ fontFamily: "var(--font-display)" }}
            >
              📝 Order Summary
            </h2>

            <div className="space-y-3 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-500">Subtotal</span>
                <span className="font-bold">${totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Shipping</span>
                <span className="font-bold text-mint">
                  {remaining <= 0 ? "FREE! 🎉" : "$4.99"}
                </span>
              </div>
              <div className="border-t-2 border-dashed border-gray-200 pt-3 flex justify-between">
                <span
                  className="font-bold text-lg text-retro-dark"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  Total
                </span>
                <span
                  className="font-bold text-xl text-grape"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  $
                  {(remaining <= 0
                    ? totalPrice
                    : totalPrice + 4.99
                  ).toFixed(2)}
                </span>
              </div>
            </div>

            <button
              className="btn-fun w-full mt-6 bg-gradient-to-r from-bubblegum to-grape text-white font-bold text-lg py-4 rounded-2xl shadow-xl"
              style={{ fontFamily: "var(--font-display)" }}
            >
              💳 Checkout
            </button>

            <p className="text-center text-xs text-gray-400 mt-3">
              🔒 Secure checkout • 100% Pun Satisfaction Guarantee
            </p>

            <Link
              href="/shop"
              className="block text-center text-bubblegum font-semibold mt-4 hover:underline"
            >
              ← Continue Shopping
            </Link>
          </div>
        </div>
      </div>

      {/* Fun upsell */}
      <div className="mt-12 bg-gradient-to-r from-sunshine/20 via-coral/20 to-bubblegum/20 rounded-3xl p-8 text-center border-2 border-sunshine/30">
        <span className="text-4xl block mb-3">💡</span>
        <h3
          className="text-xl font-bold text-retro-dark mb-2"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Pun Fact: Did you know?
        </h3>
        <p className="text-gray-600 max-w-lg mx-auto">
          Studies show that people who give pun gifts are 73% more likely to be
          remembered fondly. (We made that up, but it sounds right!) 😄
        </p>
      </div>
    </div>
  );
}
