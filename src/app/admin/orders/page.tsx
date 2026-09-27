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
  trackingNumber: string | null;
  carrier: string | null;
  trackingEmailSentAt: string | null;
    inProductionAt: string | null;
  shippedAt: string | null;
  deliveredAt: string | null;
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
  } | null;
  createdAt: string;
  items: OrderItem[];
};

function formatDuration(
  start: string | null,
  end: string | null
): string | null {
  if (!start || !end) {
    return null;
  }

  const milliseconds =
    new Date(end).getTime() -
    new Date(start).getTime();

  if (milliseconds < 0) {
    return null;
  }

  const totalHours = Math.round(
    milliseconds / (1000 * 60 * 60)
  );

  const days = Math.floor(totalHours / 24);
  const hours = totalHours % 24;

  if (days === 0) {
    return `${hours}h`;
  }

  if (hours === 0) {
    return `${days}d`;
  }

  return `${days}d ${hours}h`;
}

function getTrackingUrl(
  carrier: string | null,
  trackingNumber: string | null
): string | null {
  if (!carrier || !trackingNumber) {
    return null;
  }

  const encodedTrackingNumber =
    encodeURIComponent(trackingNumber);

  switch (carrier) {
    case "USPS":
      return `https://tools.usps.com/go/TrackConfirmAction?tLabels=${encodedTrackingNumber}`;
    case "UPS":
      return `https://www.ups.com/track?tracknum=${encodedTrackingNumber}`;
    case "FedEx":
      return `https://www.fedex.com/fedextrack/?trknbr=${encodedTrackingNumber}`;
    default:
      return null;
  }
}

export default function OrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [expandedOrderId, setExpandedOrderId] =
    useState<number | null>(null);

  const [shippingOrderId, setShippingOrderId] =
    useState<number | null>(null);
  const [shippingCarrier, setShippingCarrier] =
    useState("USPS");
  const [shippingTrackingNumber, setShippingTrackingNumber] =
    useState("");
  const [shippingSubmitting, setShippingSubmitting] =
    useState(false);

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

  async function updateOrderStatus(
    orderId: number,
    status: string
  ) {
    try {
      const response = await fetch("/api/admin/orders", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderId,
          status,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Could not update order status."
        );
      }

      setOrders((currentOrders) =>
        currentOrders.map((order) =>
          order.id === data.id
            ? { ...order, ...data }
            : order
        )
      );
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Could not update order status."
      );
    }
  }

  function handleStatusChange(
    orderId: number,
    status: string
  ) {
    setError("");

    if (status === "shipped") {
      setShippingOrderId(orderId);
      setShippingCarrier("USPS");
      setShippingTrackingNumber("");
      return;
    }

    updateOrderStatus(orderId, status);
  }

  function cancelShipping() {
    setShippingOrderId(null);
    setShippingCarrier("USPS");
    setShippingTrackingNumber("");
  }

  async function handleMarkAsShipped() {
    if (!shippingOrderId) {
      return;
    }

    const trackingNumber =
      shippingTrackingNumber.trim();

    if (!trackingNumber) {
      setError("Please enter a tracking number.");
      return;
    }

    setShippingSubmitting(true);
    setError("");

    try {
      const response = await fetch("/api/admin/orders", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          orderId: shippingOrderId,
          status: "shipped",
          carrier: shippingCarrier,
          trackingNumber,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Could not mark the order as shipped."
        );
      }

      setOrders((currentOrders) =>
        currentOrders.map((order) =>
          order.id === data.id
            ? { ...order, ...data }
            : order
        )
      );

      setShippingOrderId(null);
      setShippingCarrier("USPS");
      setShippingTrackingNumber("");
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Could not mark the order as shipped."
      );
    } finally {
      setShippingSubmitting(false);
    }
  }

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
              Orders
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
          <div className="bg-red-50 text-red-700 rounded-2xl px-5 py-4 mb-5">
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
                      expandedOrderId === order.id
                        ? null
                        : order.id
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
                        {new Date(
                          order.createdAt
                        ).toLocaleString()}
                      </p>

                      {order.customerEmail && (
                        <p className="text-sm text-gray-600 mt-1">
                          {order.customerEmail}
                        </p>
                      )}
                    </div>

                    <div className="text-right">
                      <select
  value={order.status}
  onChange={(e) =>
    handleStatusChange(
      order.id,
      e.target.value
    )
  }
  onClick={(e) => e.stopPropagation()}
  className="rounded-full border border-gray-200 bg-white px-3 py-1 text-sm font-bold text-retro-dark"
>
  <option value={order.status}>
    {order.status === "paid"
      ? "Paid"
      : order.status === "in_production"
      ? "In Production"
      : order.status === "shipped"
      ? "Shipped"
      : order.status === "delivered"
      ? "Delivered"
      : order.status === "cancelled"
      ? "Cancelled"
      : "Refunded"}
  </option>

  {order.status === "paid" && (
    <option value="in_production">
      Move to In Production
    </option>
  )}

  {order.status === "in_production" && (
    <option value="shipped">
      Mark as Shipped
    </option>
  )}

  {order.status === "shipped" && (
    <option value="delivered">
      Mark as Delivered
    </option>
  )}

  {!["cancelled", "refunded", "delivered"].includes(
    order.status
  ) && (
    <>
      <option value="cancelled">
        Cancelled
      </option>

      <option value="refunded">
        Refunded
      </option>
    </>
  )}

  {order.status === "delivered" && (
    <option value="refunded">
      Refunded
    </option>
  )}
</select>

                      <p className="text-2xl font-bold text-retro-dark mt-2">
                        ${order.total}
                      </p>
                    </div>
                  </div>
                </button>

                {shippingOrderId === order.id && (
                  <div className="bg-cream rounded-2xl p-5 mt-5 border-2 border-grape/10">
                    <h3
                      className="text-lg font-bold text-retro-dark mb-1"
                      style={{
                        fontFamily:
                          "var(--font-display)",
                      }}
                    >
                      Mark as Shipped
                    </h3>

                    <p className="text-sm text-gray-600 mb-4">
                      Enter the tracking details. The
                      customer will receive a shipping
                      email after you submit this.
                    </p>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label
                          htmlFor={`carrier-${order.id}`}
                          className="block text-sm font-bold text-retro-dark mb-2"
                        >
                          Carrier
                        </label>

                        <select
                          id={`carrier-${order.id}`}
                          value={shippingCarrier}
                          onChange={(e) =>
                            setShippingCarrier(
                              e.target.value
                            )
                          }
                          className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm"
                        >
                          <option value="USPS">
                            USPS
                          </option>
                          <option value="UPS">
                            UPS
                          </option>
                          <option value="FedEx">
                            FedEx
                          </option>
                          <option value="Other">
                            Other
                          </option>
                        </select>
                      </div>

                      <div>
                        <label
                          htmlFor={`tracking-${order.id}`}
                          className="block text-sm font-bold text-retro-dark mb-2"
                        >
                          Tracking Number
                        </label>

                        <input
                          id={`tracking-${order.id}`}
                          type="text"
                          value={shippingTrackingNumber}
                          onChange={(e) =>
                            setShippingTrackingNumber(
                              e.target.value
                            )
                          }
                          placeholder="Enter tracking number"
                          className="w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm"
                        />
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-3 mt-5">
                      <button
                        type="button"
                        onClick={handleMarkAsShipped}
                        disabled={shippingSubmitting}
                        className="rounded-full bg-grape px-5 py-3 text-sm font-bold text-white hover:opacity-90 transition disabled:opacity-50"
                      >
                        {shippingSubmitting
                          ? "Sending..."
                          : "Mark as Shipped & Email Customer"}
                      </button>

                      <button
                        type="button"
                        onClick={cancelShipping}
                        disabled={shippingSubmitting}
                        className="rounded-full border border-gray-200 bg-white px-5 py-3 text-sm font-bold text-retro-dark hover:bg-gray-50 transition disabled:opacity-50"
                      >
                        Cancel
                      </button>
                    </div>
                  </div>
                )}

                {expandedOrderId === order.id && (
  <>
    <div className="border-t border-gray-100 pt-5 space-y-3 mt-5">

      {/* ORDER TIMELINE */}
      <div className="bg-cream rounded-2xl p-5 mb-5">
        <h3
          className="font-bold text-retro-dark mb-4"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Order Timeline
        </h3>

        <div className="space-y-3 text-sm">
          <div className="flex justify-between gap-4">
            <span className="font-semibold text-retro-dark">
              Paid
            </span>
            <span className="text-gray-600 text-right">
              {new Date(order.createdAt).toLocaleString()}
            </span>
          </div>

          <div className="flex justify-between gap-4">
            <span className="font-semibold text-retro-dark">
              In Production
            </span>
            <span className="text-gray-600 text-right">
              {order.inProductionAt
                ? new Date(
                    order.inProductionAt
                  ).toLocaleString()
                : "—"}
            </span>
          </div>

          {order.inProductionAt &&
            order.shippedAt && (
              <div className="flex justify-between gap-4">
                <span className="text-gray-500">
                  Production Time
                </span>
                <span className="font-bold text-retro-dark">
                  {formatDuration(
                    order.inProductionAt,
                    order.shippedAt
                  )}
                </span>
              </div>
            )}

          <div className="flex justify-between gap-4">
            <span className="font-semibold text-retro-dark">
              Shipped
            </span>
            <span className="text-gray-600 text-right">
              {order.shippedAt
                ? new Date(
                    order.shippedAt
                  ).toLocaleString()
                : "—"}
            </span>
          </div>

          {order.shippedAt &&
            order.deliveredAt && (
              <div className="flex justify-between gap-4">
                <span className="text-gray-500">
                  Shipping Time
                </span>
                <span className="font-bold text-retro-dark">
                  {formatDuration(
                    order.shippedAt,
                    order.deliveredAt
                  )}
                </span>
              </div>
            )}

          <div className="flex justify-between gap-4">
            <span className="font-semibold text-retro-dark">
              Delivered
            </span>
            <span className="text-gray-600 text-right">
              {order.deliveredAt
                ? new Date(
                    order.deliveredAt
                  ).toLocaleString()
                : "—"}
            </span>
          </div>
        </div>
      </div>

      {/* CUSTOMER */}
      <div className="pt-1 mb-5">
        <h3 className="font-bold text-retro-dark mb-2">
          Customer
        </h3>
                        <h3 className="font-bold text-retro-dark mb-2">
                          Customer
                        </h3>

                        {order.customerEmail && (
                          <p className="text-sm text-gray-600">
                            Email:{" "}
                            {order.customerEmail}
                          </p>
                        )}

                        {order.customerPhone && (
                          <p className="text-sm text-gray-600 mt-1">
                            Phone:{" "}
                            {order.customerPhone}
                          </p>
                        )}

                        {order.shippingAddress && (
                          <div className="text-sm text-gray-600 mt-3">
                            <p className="font-bold text-retro-dark mb-1">
                              Shipping Address
                            </p>

                            <p>
                              <strong>Name:</strong>{" "}
                              {String(
                                order.shippingAddress
                                  .name ?? ""
                              )}
                              <br />
                              {String(
                                order.shippingAddress
                                  .address?.line1 ?? ""
                              )}
                              {order.shippingAddress
                                .address?.line2 && (
                                <>
                                  <br />
                                  {String(
                                    order.shippingAddress
                                      .address.line2
                                  )}
                                </>
                              )}
                              <br />
                              {String(
                                order.shippingAddress
                                  .address?.city ?? ""
                              )}
                              ,{" "}
                              {String(
                                order.shippingAddress
                                  .address?.state ?? ""
                              )}{" "}
                              {String(
                                order.shippingAddress
                                  .address
                                  ?.postal_code ?? ""
                              )}
                              <br />
                              {String(
                                order.shippingAddress
                                  .address
                                  ?.country ?? ""
                              )}
                            </p>
                          </div>
                        )}
                      </div>

                      {order.trackingNumber && (
                        <div className="bg-cream rounded-2xl p-4 mb-5">
                          <h3 className="font-bold text-retro-dark mb-2">
                            Shipping
                          </h3>

                          <p className="text-sm text-gray-600">
                            <strong>Carrier:</strong>{" "}
                            {order.carrier}
                          </p>

                          <p className="text-sm text-gray-600 mt-1">
                            <strong>
                              Tracking Number:
                            </strong>{" "}
                            {order.trackingNumber}
                          </p>

                          {order.trackingEmailSentAt && (
                            <p className="text-sm text-gray-500 mt-2">
                              Shipping email sent.
                            </p>
                          )}

                          {getTrackingUrl(
                            order.carrier,
                            order.trackingNumber
                          ) && (
                            <a
                              href={getTrackingUrl(
                                order.carrier,
                                order.trackingNumber
                              )!}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-block mt-3 text-sm font-bold text-grape hover:underline"
                            >
                              View Tracking →
                            </a>
                          )}
                        </div>
                      )}

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
                              Qty {item.quantity} × $
                              {item.price}
                            </p>
                          </div>

                          <p className="font-bold text-retro-dark">
                            $
                            {(
                              Number(item.price) *
                              item.quantity
                            ).toFixed(2)}
                          </p>
                        </div>
                      ))}
                    </div>

                    <div className="border-t border-gray-100 mt-5 pt-5 flex justify-between text-sm">
                      <span className="text-gray-500">
                        Subtotal ${order.subtotal} +
                        Shipping ${order.shipping}
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