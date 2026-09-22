"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

type OrderItem = {
  id: number;
  orderId: number;
  productId: number;
  name: string;
  price: string;
  quantity: number;
  image: string;
};

type Order = {
  id: number;
  stripeCheckoutSessionId: string;
  stripePaymentIntentId: string | null;
  status: string;
  customerEmail: string | null;
  customerPhone: string | null;
  subtotal: string;
  shipping: string;
  total: string;
  shippingAddress: {
  name: string | null;
  address: {
    line1: string | null;
    line2?: string | null;
    city: string | null;
    state: string | null;
    postal_code: string | null;
    country: string | null;
  };
} | null;  createdAt: string;
  items: OrderItem[];
};

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedOrderId, setExpandedOrderId] = useState<number | null>(null);

  useEffect(() => {
    async function loadOrders() {
      try {
        const response = await fetch("/api/admin/orders");

        if (!response.ok) {
          throw new Error("Could not load orders.");
        }

        const data = await response.json();
        setOrders(data);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Could not load orders."
        );
      } finally {
        setLoading(false);
      }
    }

    loadOrders();
  }, []);

  return (
    <main className="min-h-screen bg-cream px-6 py-12">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <Link
              href="/admin"
              className="text-sm font-bold text-gray-500 hover:text-retro-dark"
            >
              ← Back to Admin
            </Link>

            <h1
              className="mt-4 text-4xl font-bold text-retro-dark"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Orders 📦
            </h1>

            <p className="mt-2 text-gray-600">
              View and manage customer orders.
            </p>
          </div>
        </div>

        {loading && (
          <div className="bg-white rounded-3xl shadow-lg p-8 text-center">
            <p className="font-bold text-retro-dark">
              Loading orders...
            </p>
          </div>
        )}

        {error && (
          <div className="bg-red-50 text-red-700 rounded-2xl px-5 py-4">
            {error}
          </div>
        )}

        {!loading && !error && orders.length === 0 && (
          <div className="bg-white rounded-3xl shadow-lg p-12 text-center">
            <p className="text-4xl mb-4">📭</p>
            <h2 className="text-xl font-bold text-retro-dark">
              No orders yet
            </h2>
            <p className="mt-2 text-gray-500">
              Orders will appear here after customers make purchases.
            </p>
          </div>
        )}

        {!loading && !error && orders.length > 0 && (
          <div className="space-y-5">
            {orders.map((order) => (
              <div
                key={order.id}
                className="bg-white rounded-3xl shadow-lg p-6"
                >
    
                <button
  type="button"
  onClick={() =>
    setExpandedOrderId(
      expandedOrderId === order.id ? null : order.id
    )
  }
  className="w-full text-left cursor-pointer hover:bg-gray-50 rounded-2xl p-2 -m-2 transition"
>
                <div className="flex flex-wrap items-start justify-between gap-4 mb-5">
                  <div>
                    <h2 className="text-xl font-bold text-retro-dark">
                      Order #{order.id}
                    </h2>

                    <p className="text-sm text-gray-500 mt-1">
                      {new Date(order.createdAt).toLocaleString()}
                    </p>

                    {order.customerEmail && (
                      <p className="text-sm text-gray-600 mt-1">
                        {order.customerEmail}
                      </p>
                    )}
                  </div>

                  <div className="text-right">
                    <span className="inline-block rounded-full bg-green-100 text-green-700 px-3 py-1 text-sm font-bold">
                      {order.status}
                    </span>

                    <p className="text-2xl font-bold text-retro-dark mt-2">
                      ${order.total}
                    </p>
                  </div>
                </div>
                </button>

                 {expandedOrderId === order.id && (
                  <>
                    <div className="border-t border-gray-100 pt-5 space-y-3">

                        <div className="pt-1 mb-5">
  <h3 className="font-bold text-retro-dark mb-2">
    Customer
  </h3>

  {order.customerEmail && (
    <p className="text-sm text-gray-600">
      Email: {order.customerEmail}
    </p>
  )}

  {order.customerPhone && (
    <p className="text-sm text-gray-600 mt-1">
      Phone: {order.customerPhone}
    </p>
  )}

  {order.shippingAddress && (
    <div className="text-sm text-gray-600 mt-3">
      <p className="font-bold text-retro-dark mb-1">
        Shipping Address
      </p>

      <p>
        {String(order.shippingAddress.name ?? "")}
        <br />
        {String(order.shippingAddress.address?.line1 ?? "")}
        {order.shippingAddress.address?.line2 && (
          <>
            <br />
            {String(order.shippingAddress.address.line2)}
          </>
        )}
        <br />
        {String(order.shippingAddress.address?.city ?? "")},{" "}
        {String(order.shippingAddress.address?.state ?? "")}{" "}
        {String(order.shippingAddress.address?.postal_code ?? "")}
        <br />
        {String(order.shippingAddress.address?.country ?? "")}
      </p>
    </div>
  )}
</div>

                      {order.items.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-center gap-4"
                        >
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-16 h-16 rounded-xl object-cover bg-gray-100"
                          />

                          <div className="flex-1">
                            <p className="font-bold text-retro-dark">
                              {item.name}
                            </p>

                            <p className="text-sm text-gray-500">
                              Qty {item.quantity} × ${item.price}
                            </p>
                          </div>

                          <p className="font-bold text-retro-dark">
                            $
                            {(
                              Number(item.price) * item.quantity
                            ).toFixed(2)}
                          </p>
                        </div>
                      ))}
                    </div>

                    <div className="border-t border-gray-100 mt-5 pt-5 flex justify-between text-sm">
                      <span className="text-gray-500">
                        Subtotal ${order.subtotal} + Shipping $
                        {order.shipping}
                      </span>

                      <span className="font-bold text-retro-dark">
                        Total ${order.total}
                      </span>
                    </div>
                  </>
                                  )}
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}