import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { db } from "@/db";
import { cartItems, products } from "@/db/schema";
import { eq } from "drizzle-orm";

const stripeSecretKey = process.env.STRIPE_SECRET_KEY;

if (!stripeSecretKey) {
  throw new Error("STRIPE_SECRET_KEY is required");
}

const stripe = new Stripe(stripeSecretKey);

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { sessionId } = body;

    if (!sessionId) {
      return NextResponse.json(
        { error: "Missing sessionId" },
        { status: 400 }
      );
    }

    const items = await db
      .select({
        id: cartItems.id,
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
      return NextResponse.json(
        { error: "Your cart is empty." },
        { status: 400 }
      );
    }

    for (const item of items) {
      if (item.quantity > item.stockCount) {
        return NextResponse.json(
          {
            error: `${item.name} does not have enough stock available.`,
          },
          { status: 400 }
        );
      }
    }

    const subtotal = items.reduce(
      (sum, item) => sum + Number(item.price) * item.quantity,
      0
    );

    const shipping = subtotal >= 35 ? 0 : 4.99;

    const lineItems: Stripe.Checkout.SessionCreateParams.LineItem[] =
      items.map((item) => ({
        price_data: {
          currency: "usd",
          product_data: {
            name: item.name,
          },
          unit_amount: Math.round(Number(item.price) * 100),
        },
        quantity: item.quantity,
      }));

    if (shipping > 0) {
      lineItems.push({
        price_data: {
          currency: "usd",
          product_data: {
            name: "Shipping",
          },
          unit_amount: 499,
        },
        quantity: 1,
      });
    }

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL;

if (!siteUrl) {
  return NextResponse.json(
    { error: "Site URL is not configured." },
    { status: 500 }
  );
}

    const checkoutSession = await stripe.checkout.sessions.create({
      mode: "payment",
      line_items: lineItems,
      shipping_address_collection: {
        allowed_countries: ["US"],
      },
      phone_number_collection: {
        enabled: true,
      },
      metadata: {
        sessionId,
      },
      success_url: `${siteUrl}/checkout/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${siteUrl}/cart`,
    });

    return NextResponse.json({
      url: checkoutSession.url,
    });
  } catch (error) {
    console.error("Checkout error:", error);

    return NextResponse.json(
      { error: "Could not start checkout." },
      { status: 500 }
    );
  }
}
