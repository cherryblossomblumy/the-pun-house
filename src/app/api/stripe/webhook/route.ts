import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { Resend } from "resend";
import { db } from "@/db";
import { cartItems, orderItems, orders, products } from "@/db/schema";
import { eq, and, gte, sql } from "drizzle-orm";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;
const webhookSecretValue = process.env.STRIPE_WEBHOOK_SECRET;
const resendApiKey = process.env.RESEND_API_KEY;
const adminEmail = process.env.ADMIN_EMAIL;

if (!stripeSecretKey) {
  throw new Error("STRIPE_SECRET_KEY is required");
}

if (!webhookSecretValue) {
  throw new Error("STRIPE_WEBHOOK_SECRET is required");
}

if (!resendApiKey) {
  throw new Error("RESEND_API_KEY is required");
}

if (!adminEmail) {
  throw new Error("ADMIN_EMAIL is required");
}

const webhookSecret = webhookSecretValue;

const stripe = new Stripe(stripeSecretKey);
const resend = new Resend(resendApiKey);

export async function POST(request: NextRequest) {
  const signature = request.headers.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "Missing Stripe signature" },
      { status: 400 }
    );
  }

  const body = await request.text();

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      webhookSecret
    );
  } catch (error) {
    console.error("Stripe webhook signature verification failed:", error);

    return NextResponse.json(
      { error: "Invalid webhook signature" },
      { status: 400 }
    );
  }

  if (
    event.type !== "checkout.session.completed" &&
    event.type !== "checkout.session.async_payment_succeeded"
  ) {
    return NextResponse.json({ received: true });
  }

  const session = event.data.object as Stripe.Checkout.Session;

  if (session.payment_status !== "paid") {
    return NextResponse.json({ received: true });
  }

  const sessionId = session.metadata?.sessionId;

  if (!sessionId) {
    console.error("Stripe checkout session is missing sessionId metadata.");

    return NextResponse.json(
      { error: "Missing session metadata" },
      { status: 400 }
    );
  }

  try {
    const result = await db.transaction(async (tx) => {
      // Stripe may send the same event more than once.
      const existingOrder = await tx
        .select({ id: orders.id })
        .from(orders)
        .where(eq(orders.stripeCheckoutSessionId, session.id))
        .limit(1);

      if (existingOrder.length > 0) {
        return { alreadyProcessed: true };
      }

      const items = await tx
        .select({
          productId: cartItems.productId,
          quantity: cartItems.quantity,
          name: products.name,
          price: products.price,
          image: products.image,
          stockCount: products.stockCount,
        })
        .from(cartItems)
        .innerJoin(products, eq(cartItems.productId, products.id))
        .where(eq(cartItems.sessionId, sessionId));

      if (items.length === 0) {
        throw new Error("Cart is empty when processing paid order.");
      }

      for (const item of items) {
        if (item.quantity > item.stockCount) {
          throw new Error(`Insufficient stock for ${item.name}.`);
        }
      }

      const subtotal = items.reduce(
        (sum, item) => sum + Number(item.price) * item.quantity,
        0
      );

      const shipping = subtotal >= 35 ? 0 : 4.99;
      const total = subtotal + shipping;

      const paymentIntentId =
        typeof session.payment_intent === "string"
          ? session.payment_intent
          : session.payment_intent?.id ?? null;

      const customerEmail =
        session.customer_details?.email ?? null;

      const customerPhone =
        session.customer_details?.phone ?? null;

      const shippingAddress =
        session.collected_information?.shipping_details
          ? {
              name:
                session.collected_information.shipping_details.name ?? null,
              address:
                session.collected_information.shipping_details.address,
            }
          : null;

      const [order] = await tx
        .insert(orders)
        .values({
          sessionId,
          stripeCheckoutSessionId: session.id,
          stripePaymentIntentId: paymentIntentId,
          status: "paid",
          customerEmail,
          customerPhone,
          subtotal: subtotal.toFixed(2),
          shipping: shipping.toFixed(2),
          total: total.toFixed(2),
          shippingAddress,
        })
        .returning({ id: orders.id });

      for (const item of items) {
        await tx.insert(orderItems).values({
          orderId: order.id,
          productId: item.productId,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          image: item.image,
        });

        const updated = await tx
          .update(products)
          .set({
            stockCount: sql`${products.stockCount} - ${item.quantity}`,
          })
          .where(
            and(
              eq(products.id, item.productId),
              gte(products.stockCount, item.quantity)
            )
          )
          .returning({ id: products.id });

        if (updated.length === 0) {
          throw new Error(`Could not update stock for ${item.name}.`);
        }
      }

      await tx
        .delete(cartItems)
        .where(eq(cartItems.sessionId, sessionId));

      return {
  alreadyProcessed: false,
  orderId: order.id,
  customerEmail,
  customerName: shippingAddress?.name ?? null,
  customerPhone,
  shippingAddress: shippingAddress?.address ?? null,
  subtotal: subtotal.toFixed(2),
  shipping: shipping.toFixed(2),
  total: total.toFixed(2),
  items: items.map((item) => ({
    name: item.name,
    quantity: item.quantity,
    price: item.price,
  })),
};

});

    console.log(
      result.alreadyProcessed
        ? `Stripe order already processed: ${session.id}`
        : `Stripe order created: ${result.orderId}`
    );

    if (!result.alreadyProcessed) {
      const itemsHtml = (result.items ?? [])
  .map(
    (item: {
      name: string;
      quantity: number;
      price: string;
    }) =>
      `<li>${item.name} × ${item.quantity} — $${(
        Number(item.price) * item.quantity
      ).toFixed(2)}</li>`
  )
  .join("");

      const { error: emailError } = await resend.emails.send({
        from: "The Pun House <orders@thepunhouse.com>",
        to: [adminEmail!],
        subject: `New Pun House Order #${result.orderId}`,
        html: `
  <h2>🎉 New Pun House Order #${result.orderId}</h2>

  <p><strong>Status:</strong> Paid — Ready for fulfillment</p>

  <p>${new Date().toLocaleString("en-US", {
    dateStyle: "long",
    timeStyle: "short",
    timeZone: "America/New_York",
  })}</p>

  <hr />

  <h3>Customer</h3>
  <p>
    <strong>Name:</strong> ${result.customerName ?? "Not provided"}<br />
    <strong>Email:</strong> ${
      result.customerEmail ?? "Not provided"
    }<br />
    <strong>Phone:</strong> ${
      result.customerPhone ?? "Not provided"
    }
  </p>

  <h3>Ship To</h3>
  <p>
    ${result.customerName ?? "Not provided"}<br />
    ${result.shippingAddress?.line1 ?? ""}<br />
    ${
      result.shippingAddress?.line2
        ? `${result.shippingAddress.line2}<br />`
        : ""
    }
    ${result.shippingAddress?.city ?? ""}, ${
      result.shippingAddress?.state ?? ""
    } ${result.shippingAddress?.postal_code ?? ""}<br />
    ${result.shippingAddress?.country ?? ""}
  </p>

  <h3>Items</h3>
  <ul>
    ${itemsHtml}
  </ul>

  <p><strong>Subtotal:</strong> $${result.subtotal}</p>
  <p><strong>Shipping:</strong> $${result.shipping}</p>
  <p><strong>Total:</strong> $${result.total}</p>

  <hr />

  <p>
    <strong>Next step:</strong> Place this order with Gooten,
    then mark the order <strong>In Production</strong> in Admin.
  </p>

  <p>
    Log in to The Pun House admin to view the complete order.
  </p>
`,
      });

      if (emailError) {
        console.error(
          "New order email failed to send:",
          emailError
        );
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Stripe webhook processing failed:", error);

    return NextResponse.json(
      { error: "Webhook processing failed" },
      { status: 500 }
    );
  }
}