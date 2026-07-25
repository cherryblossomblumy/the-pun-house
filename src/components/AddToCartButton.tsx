"use client";

import { useCart } from "./CartProvider";
import { useState } from "react";

export function AddToCartButton({ productId }: { productId: number }) {
  const { addToCart } = useCart();
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);

  const handleAdd = async () => {
    setAdding(true);
    await addToCart(productId);
    setAdding(false);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="flex gap-3">
      <button
        onClick={handleAdd}
        disabled={adding}
        className={`btn-fun flex-1 font-bold text-lg py-4 rounded-2xl shadow-xl transition-all ${
          added
            ? "bg-gradient-to-r from-mint to-sky text-white"
            : "bg-gradient-to-r from-bubblegum to-grape text-white"
        } disabled:opacity-60`}
        style={{ fontFamily: "var(--font-display)" }}
      >
        {adding ? (
          <span className="inline-flex items-center gap-2">
            <span className="animate-spin">🔄</span> Adding...
          </span>
        ) : added ? (
          <span>✅ Added to Cart!</span>
        ) : (
          <span>🛒 Add to Cart</span>
        )}
      </button>
    </div>
  );
}
