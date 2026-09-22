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