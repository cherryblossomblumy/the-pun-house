import { auth } from "@/auth";
import { db } from "@/db";
import { orders, orderItems } from "@/db/schema";
import { desc, eq } from "drizzle-orm";
import { NextResponse } from "next/server";

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

  const allowedStatuses = [
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
    !allowedStatuses.includes(status)
  ) {
    return NextResponse.json(
      { error: "Invalid order status." },
      { status: 400 }
    );
  }

  const [updatedOrder] = await db
    .update(orders)
    .set({ status })
    .where(eq(orders.id, orderId))
    .returning();

  if (!updatedOrder) {
    return NextResponse.json(
      { error: "Order not found." },
      { status: 404 }
    );
  }

  return NextResponse.json(updatedOrder);
}