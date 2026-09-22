"use client";

import Link from "next/link";
import { Suspense } from "react";
import { useSearchParams } from "next/navigation";

function CheckoutSuccessContent() {
  const searchParams = useSearchParams();
  const sessionId = searchParams.get("session_id");

  return (
    <div className="max-w-3xl mx-auto px-4 py-20 text-center">
      <span className="text-8xl block mb-6">🎉</span>

      <h1
        className="text-4xl md:text-5xl font-bold text-retro-dark mb-4"
        style={{ fontFamily: "var(--font-display)" }}
      >
        Pun-believable! Your order is confirmed!
      </h1>

      <p className="text-lg text-gray-600 mb-8">
        Thanks for your purchase! Your pun-tastic order is officially on its
        way.
      </p>

      {sessionId && (
        <p className="text-xs text-gray-400 mb-8 break-all">
          Order reference: {sessionId}
        </p>
      )}

      <Link
        href="/shop"
        className="btn-fun inline-flex items-center gap-2 bg-gradient-to-r from-bubblegum to-grape text-white font-bold text-lg px-8 py-4 rounded-full shadow-xl"
        style={{ fontFamily: "var(--font-display)" }}
      >
        🛍️ Keep Shopping
      </Link>
    </div>
  );
}

export default function CheckoutSuccessPage() {
  return (
    <Suspense fallback={null}>
      <CheckoutSuccessContent />
    </Suspense>
  );
}
