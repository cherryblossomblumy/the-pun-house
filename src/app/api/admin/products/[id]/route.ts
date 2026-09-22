import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/db";
import { products } from "@/db/schema";
import { and, eq, ne } from "drizzle-orm";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json(
      { error: "Unauthorized." },
      { status: 401 }
    );
  }

  try {
    const { id } = await params;
    const productId = Number(id);

    if (!Number.isInteger(productId)) {
      return NextResponse.json(
        { error: "Invalid product ID." },
        { status: 400 }
      );
    }

    const [product] = await db
      .select()
      .from(products)
      .where(eq(products.id, productId))
      .limit(1);

    if (!product) {
      return NextResponse.json(
        { error: "Product not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({ product });
  } catch (error) {
    console.error("Get product error:", error);

    return NextResponse.json(
      { error: "Could not load product." },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();

if (!session?.user) {
  return NextResponse.json(
    { error: "Unauthorized." },
    { status: 401 }
  );
}
  try {
    const { id } = await params;
    const productId = Number(id);

    if (!Number.isInteger(productId)) {
      return NextResponse.json(
        { error: "Invalid product ID." },
        { status: 400 }
      );
    }

    const body = await request.json();

    const {
      name,
      tagline,
      description,
      price,
      categoryId,
      image,
      images,
      featured,
      bestSeller,
      stockCount,
    } = body;

    const numericPrice = Number(price);
const numericCategoryId = Number(categoryId);
const numericStockCount = Number(stockCount ?? 100);

if (
  typeof name !== "string" ||
  typeof tagline !== "string" ||
  typeof description !== "string" ||
  !Number.isFinite(numericPrice) ||
  numericPrice < 0 ||
  !Number.isInteger(numericCategoryId) ||
  numericCategoryId <= 0 ||
  !Number.isInteger(numericStockCount) ||
  numericStockCount < 0
) {
  return NextResponse.json(
    { error: "Invalid product data." },
    { status: 400 }
  );
}

    const imageList = Array.isArray(images)
      ? images.filter(
          (item): item is string =>
            typeof item === "string" && item.trim().length > 0
        )
      : [];

    const primaryImage =
      typeof image === "string" && image.trim()
        ? image.trim()
        : imageList[0];

    if (
      !name ||
      !tagline ||
      !description ||
      price === undefined ||
      !categoryId ||
      !primaryImage
    ) {
      return NextResponse.json(
        { error: "Please fill in all required fields." },
        { status: 400 }
      );
    }

    const finalImages =
      imageList.length > 0 ? imageList : [primaryImage];

    const slug = String(name)
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    const existing = await db
      .select({ id: products.id })
      .from(products)
      .where(
        and(
          eq(products.slug, slug),
          ne(products.id, productId)
        )
      )
      .limit(1);

    if (existing.length > 0) {
      return NextResponse.json(
        { error: "A product with this name already exists." },
        { status: 409 }
      );
    }

    const [product] = await db
      .update(products)
      .set({
        name: String(name).trim(),
        slug,
        tagline: String(tagline).trim(),
        description: String(description).trim(),
        price: numericPrice.toFixed(2),
        image: primaryImage,
        images: finalImages,
        categoryId: numericCategoryId,
        featured: Boolean(featured),
        bestSeller: Boolean(bestSeller),
        stockCount: numericStockCount,
      })
      .where(eq(products.id, productId))
      .returning();

    if (!product) {
      return NextResponse.json(
        { error: "Product not found." },
        { status: 404 }
      );
    }

    return NextResponse.json({ product });
  } catch (error) {
    console.error("Update product error:", error);

    return NextResponse.json(
      { error: "Could not update product." },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json(
      { error: "Unauthorized." },
      { status: 401 }
    );
  }

  const { id } = await params;
  const productId = Number(id);

  if (!Number.isInteger(productId) || productId <= 0) {
    return NextResponse.json(
      { error: "Invalid product ID." },
      { status: 400 }
    );
  }

  const [deletedProduct] = await db
    .delete(products)
    .where(eq(products.id, productId))
    .returning({ id: products.id });

  if (!deletedProduct) {
    return NextResponse.json(
      { error: "Product not found." },
      { status: 404 }
    );
  }

  return NextResponse.json({ success: true });
}