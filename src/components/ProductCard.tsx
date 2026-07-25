"use client";

import Link from "next/link";
import { useCart } from "./CartProvider";

interface ProductCardProps {
  id: number;
  name: string;
  slug: string;
  tagline: string;
  price: string;
  comparePrice: string | null;
  image: string;
  bestSeller: boolean;
  featured: boolean;
  categoryEmoji?: string;
}

export function ProductCard({
  id,
  name,
  slug,
  tagline,
  price,
  comparePrice,
  image,
  bestSeller,
  featured,
  categoryEmoji,
}: ProductCardProps) {
  const { addToCart, isLoading } = useCart();

  const discount = comparePrice
    ? Math.round(
        ((parseFloat(comparePrice) - parseFloat(price)) /
          parseFloat(comparePrice)) *
          100
      )
    : 0;

  return (
    <div className="product-card bg-white rounded-3xl overflow-hidden shadow-lg border-2 border-transparent hover:border-bubblegum relative group">
      {/* Badges */}
      <div className="absolute top-3 left-3 z-10 flex flex-col gap-2">
        {bestSeller && (
          <span className="bg-gradient-to-r from-sunshine to-coral text-retro-dark text-xs font-bold px-3 py-1 rounded-full shadow-md animate-bounce-gentle">
            🔥 Best Seller
          </span>
        )}
        {discount > 0 && (
          <span className="sale-badge bg-gradient-to-r from-bubblegum to-grape text-white text-xs font-bold px-3 py-1 rounded-full shadow-md">
            💥 {discount}% OFF
          </span>
        )}
      </div>

      {categoryEmoji && (
        <span className="absolute top-3 right-3 z-10 text-2xl opacity-70 group-hover:opacity-100 group-hover:scale-125 transition-all">
          {categoryEmoji}
        </span>
      )}

      {/* Image */}
      <Link href={`/product/${slug}`}>
        <div className="relative overflow-hidden">
          <img
            src={image}
            alt={name}
            className="w-full h-56 object-cover group-hover:scale-110 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>
      </Link>

      {/* Content */}
      <div className="p-5">
        <Link href={`/product/${slug}`}>
          <h3
            className="font-bold text-lg text-retro-dark group-hover:text-bubblegum transition-colors leading-tight"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {name}
          </h3>
        </Link>
        <p className="text-sm text-gray-500 mt-1 line-clamp-1">{tagline}</p>

        {/* Price */}
        <div className="flex items-center gap-2 mt-3">
          <span
            className="text-xl font-bold text-grape"
            style={{ fontFamily: "var(--font-display)" }}
          >
            ${parseFloat(price).toFixed(2)}
          </span>
          {comparePrice && (
            <span className="text-sm text-gray-400 line-through">
              ${parseFloat(comparePrice).toFixed(2)}
            </span>
          )}
        </div>

        {/* Add to Cart Button */}
        <button
          onClick={() => addToCart(id)}
          disabled={isLoading}
          className="btn-fun mt-4 w-full bg-gradient-to-r from-bubblegum to-grape text-white font-bold py-3 rounded-2xl shadow-lg text-sm disabled:opacity-50"
        >
          {isLoading ? "Adding..." : "🛒 Add to Cart"}
        </button>
      </div>
    </div>
  );
}
