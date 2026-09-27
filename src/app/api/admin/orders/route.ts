import { auth } from "@/auth";
import { db } from "@/db";
import { orders, orderItems } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import { NextResponse } from "next/server";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

const allowedStatuses = [
  "paid",
  "in_production",
  "shipped",
  "delivered",
  "cancelled",
  "refunded",
];

const allowedCarriers = ["USPS", "UPS", "FedEx", "Other"];

function getTrackingUrl(
  carrier: string,
  trackingNumber: string
): string | null {
  const encodedTrackingNumber = encodeURIComponent(trackingNumber);

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

export async function GET() {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json(
      { error: "Unauthorized." },
      { status: 401 }
    );
  }

  const orderRows = await db
    .select()
    .from(orders)
    .orderBy(desc(orders.createdAt));

  const ordersWithItems = await Promise.all(
    orderRows.map(async (order) => {
      const items = await db
        .select()
        .from(orderItems)
        .where(eq(orderItems.orderId, order.id));

      return {
        ...order,
        items,
      };
    })
  );

  return NextResponse.json(ordersWithItems);
}

export async function PATCH(request: Request) {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json(
      { error: "Unauthorized." },
      { status: 401 }
    );
  }

  const body = await request.json();
  const orderId = Number(body.orderId);
  const status = body.status;
  const now = new Date();

  const validStatuses = [
    "paid",
    "in_production",
    "shipped",
    "delivered",
    "cancelled",
    "refunded",
  ];

  if (
    !Number.isInteger(orderId) ||
    orderId <= 0 ||
    typeof status !== "string" ||
    !validStatuses.includes(status)
  ) {
    return NextResponse.json(
      { error: "Invalid order status." },
      { status: 400 }
    );
  }

  const [existingOrder] = await db
    .select()
    .from(orders)
    .where(eq(orders.id, orderId));

  if (!existingOrder) {
    return NextResponse.json(
      { error: "Order not found." },
      { status: 404 }
    );
  }

  const allowedNextStatuses: Record<string, string[]> = {
    paid: ["in_production", "cancelled", "refunded"],
    in_production: ["shipped", "cancelled", "refunded"],
    shipped: ["delivered", "cancelled", "refunded"],
    delivered: ["refunded"],
    cancelled: [],
    refunded: [],
  };

  const allowedStatuses =
    allowedNextStatuses[existingOrder.status] ?? [];

  if (!allowedStatuses.includes(status)) {
    return NextResponse.json(
      {
        error: `An order can only move from ${existingOrder.status} to an allowed next status.`,
      },
      { status: 400 }
    );
  }

  // Normal status changes do not require shipping information.
  if (status !== "shipped") {
  const timestampUpdate: {
    status: string;
    inProductionAt?: Date;
    deliveredAt?: Date;
  } = {
    status,
  };

  if (
    status === "in_production" &&
    !existingOrder.inProductionAt
  ) {
    timestampUpdate.inProductionAt = now;
  }

  if (
    status === "delivered" &&
    !existingOrder.deliveredAt
  ) {
    timestampUpdate.deliveredAt = now;
  }

  const [updatedOrder] = await db
    .update(orders)
    .set(timestampUpdate)
    .where(eq(orders.id, orderId))
    .returning();

  return NextResponse.json(updatedOrder);
}

  const carrier = body.carrier;
  const trackingNumber =
    typeof body.trackingNumber === "string"
      ? body.trackingNumber.trim()
      : "";

  if (
    typeof carrier !== "string" ||
    !allowedCarriers.includes(carrier) ||
    !trackingNumber
  ) {
    return NextResponse.json(
      {
        error:
          "Carrier and tracking number are required when marking an order as shipped.",
      },
      { status: 400 }
    );
  }

  if (!existingOrder.customerEmail) {
    return NextResponse.json(
      {
        error:
          "This order does not have a customer email address, so the shipping email cannot be sent.",
      },
      { status: 400 }
    );
  }

  // Never automatically send the shipping email twice.
  if (existingOrder.trackingEmailSentAt) {
    const [updatedOrder] = await db
      .update(orders)
      .set({
        status: "shipped",
        carrier,
        trackingNumber,
      })
      .where(eq(orders.id, orderId))
      .returning();

    return NextResponse.json(updatedOrder);
  }

  const [updatedOrder] = await db
    .update(orders)
    .set({
  status: "shipped",
  carrier,
  trackingNumber,
  shippedAt: existingOrder.shippedAt ?? now,
})
    .where(eq(orders.id, orderId))
    .returning();

  if (!updatedOrder) {
    return NextResponse.json(
      { error: "Order not found." },
      { status: 404 }
    );
  }

  const items = await db
    .select()
    .from(orderItems)
    .where(eq(orderItems.orderId, orderId));

  const shippingAddress = existingOrder.shippingAddress as {
    name?: string | null;
    address?: {
      line1?: string | null;
      line2?: string | null;
      city?: string | null;
      state?: string | null;
      postal_code?: string | null;
      country?: string | null;
    } | null;
  } | null;

  const customerName =
  shippingAddress?.name?.trim().split(/\s+/)[0] ||
  "there";

  const trackingUrl = getTrackingUrl(
    carrier,
    trackingNumber
  );

  const itemsHtml = items
    .map(
      (item) => `
        <tr>
          <td style="padding: 8px 0; border-bottom: 1px solid #eee;">
            ${item.name}
          </td>
          <td style="padding: 8px 0; border-bottom: 1px solid #eee; text-align: center;">
            ${item.quantity}
          </td>
          <td style="padding: 8px 0; border-bottom: 1px solid #eee; text-align: right;">
            $${Number(item.price).toFixed(2)}
          </td>
        </tr>
      `
    )
    .join("");

  const trackingButton = trackingUrl
    ? `
      <div style="text-align: center; margin: 28px 0;">
        <a
          href="${trackingUrl}"
          style="
            display: inline-block;
            background: #6b3fa0;
            color: #ffffff;
            text-decoration: none;
            font-weight: 700;
            padding: 13px 24px;
            border-radius: 999px;
          "
        >
          Track Your Order
        </a>
      </div>
    `
    : "";

  try {
    await resend.emails.send(
      {
        from: "The Pun House <orders@thepunhouse.com>",
        to: [existingOrder.customerEmail],
        subject: `Your Pun House Order Has Shipped!`,
        html: `
  <div style="margin: 0; padding: 40px 16px; background-color: #f8f3e9; font-family: Arial, Helvetica, sans-serif; color: #292323;">
    <div style="max-width: 600px; margin: 0 auto;">

      <!-- Brand -->
      <div style="text-align: center; padding: 8px 20px 24px;">
        <div style="font-size: 30px; line-height: 1.2; font-weight: 800; color: #6b3fa0;">
          The Pun House
        </div>
      </div>

      <!-- Main Card -->
<div style="background-color: #ffffff; border-radius: 24px; padding: 40px 32px;">

  <!-- Headline -->
  <h1 style="margin: 0 0 22px; font-size: 30px; line-height: 1.2; font-weight: 800; color: #292323; text-align: left;">
    There's dumpling you should know!
  </h1>

  <!-- Greeting -->
  <p style="margin: 0 0 16px; font-size: 17px; line-height: 1.6; color: #292323;">
    Hi ${customerName}!
  </p>

  <p style="margin: 0 0 26px; font-size: 17px; line-height: 1.6; color: #292323;">
    Your order from <strong>The Pun House</strong> has shipped and tracking is now available!
  </p>

  <!-- Tracking Details -->
  <div style="background-color: #f8f3e9; border-radius: 18px; padding: 24px; margin: 0 0 24px;">

    <h2 style="margin: 0 0 16px; font-size: 20px; line-height: 1.3; font-weight: 800; color: #292323;">
      Your Tracking Details
    </h2>

    <p style="margin: 0 0 10px; font-size: 15px; line-height: 1.5; color: #555555;">
      <strong style="color: #292323;">Carrier:</strong> ${carrier}
    </p>

    <p style="margin: 0; font-size: 15px; line-height: 1.5; color: #555555; word-break: break-word;">
      <strong style="color: #292323;">Tracking Number:</strong> ${trackingNumber}
    </p>

  </div>

  <!-- Tracking Button -->
  ${trackingButton}

  <!-- Brand Voice -->
  <p style="margin: 28px 0 0; font-size: 17px; line-height: 1.6; text-align: left; color: #292323;">
    We hope you love your goodies as much as we loved making them!
  </p>

  <p style="margin: 10px 0 0; font-size: 17px; line-height: 1.6; text-align: left; color: #292323;">
    And remember, we have <strong>so mushroom in our hearts for you!</strong> 💜
  </p>

</div>

<!-- Footer -->
<div style="text-align: left; padding: 22px 32px 8px;">

  <p style="margin: 0 0 5px; font-size: 14px; line-height: 1.5; color: #777777;">
    Questions about your order?
  </p>

  <p style="margin: 0; font-size: 14px; line-height: 1.5;">
    <a
      href="mailto:ruby@thepunhouse.com"
      style="color: #6b3fa0; font-weight: 700; text-decoration: none;"
    >
      ruby@thepunhouse.com
    </a>
  </p>

  <p style="margin: 14px 0 0; font-size: 13px; line-height: 1.5; color: #999999;">
    Thanks for shopping The Pun House!
  </p>

</div>
`,
      },
      {
        idempotencyKey: `order-shipped/${orderId}`,
      }
    );

    const [emailUpdatedOrder] = await db
      .update(orders)
      .set({
        trackingEmailSentAt: new Date(),
      })
      .where(eq(orders.id, orderId))
      .returning();

    return NextResponse.json(emailUpdatedOrder);
  } catch (error) {
    console.error("Shipping email failed:", error);

    return NextResponse.json(
      {
        error:
          "The order was marked as shipped, but the shipping email could not be sent. Please try again.",
      },
      { status: 500 }
    );
  }
}