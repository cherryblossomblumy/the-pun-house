import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { cartItems, products } from "@/db/schema";
import { eq, and } from "drizzle-orm";

// GET cart items
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const sessionId = searchParams.get("sessionId");

  if (!sessionId) {
    return NextResponse.json({ items: [] });
  }

  const items = await db
    .select({
      id: cartItems.id,
      productId: cartItems.productId,
      quantity: cartItems.quantity,
      name: products.name,
      price: products.price,
      image: products.image,
      tagline: products.tagline,
    })
    .from(cartItems)
    .innerJoin(products, eq(cartItems.productId, products.id))
    .where(eq(cartItems.sessionId, sessionId));

  return NextResponse.json({ items });
}

// ADD to cart
export async function POST(request: NextRequest) {
  const body = await request.json();
  const { sessionId, productId } = body;

  if (!sessionId || !productId) {
    return NextResponse.json({ error: "Missing fields" }, { status: 400 });
  }

  // Check if item already in cart
  const existing = await db
    .select()
    .from(cartItems)
    .where(
      and(
        eq(cartItems.sessionId, sessionId),
        eq(cartItems.productId, productId)
      )
    )
    .limit(1);

  if (existing.length > 0) {
    // Increment quantity
    await db
      .update(cartItems)
      .set({ quantity: existing[0].quantity + 1 })
      .where(eq(cartItems.id, existing[0].id));
  } else {
    await db.insert(cartItems).values({
      sessionId,
      productId,
      quantity: 1,
    });
  }

  return NextResponse.json({ success: true });
}

// UPDATE quantity
export async function PATCH(request: NextRequest) {
  const body = await request.json();
  const { itemId, quantity } = body;

  if (!itemId || quantity < 1) {
    return NextResponse.json({ error: "Invalid" }, { status: 400 });
  }

  await db
    .update(cartItems)
    .set({ quantity })
    .where(eq(cartItems.id, itemId));

  return NextResponse.json({ success: true });
}

// DELETE from cart
export async function DELETE(request: NextRequest) {
  const body = await request.json();
  const { itemId } = body;

  if (!itemId) {
    return NextResponse.json({ error: "Missing itemId" }, { status: 400 });
  }

  await db.delete(cartItems).where(eq(cartItems.id, itemId));

  return NextResponse.json({ success: true });
}
