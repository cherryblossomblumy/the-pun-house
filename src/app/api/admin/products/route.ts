import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/db";
import { products } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(request: NextRequest) {
  const session = await auth();

  if (!session?.user) {
    return NextResponse.json(
      { error: "Unauthorized." },
      { status: 401 }
    );
  }

  try {
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

    const finalImages = imageList.length > 0 ? imageList : [primaryImage];

    const slug = name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    const existing = await db
      .select({ id: products.id })
      .from(products)
      .where(eq(products.slug, slug))
      .limit(1);

    if (existing.length > 0) {
      return NextResponse.json(
        { error: "A product with this name already exists." },
        { status: 409 }
      );
    }

    const [product] = await db
      .insert(products)
      .values({
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
      .returning();

    return NextResponse.json({ product }, { status: 201 });
  } catch (error) {
    console.error("Create product error:", error);

    return NextResponse.json(
      { error: "Could not create product." },
      { status: 500 }
    );
  }
}
