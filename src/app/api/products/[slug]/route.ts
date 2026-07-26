import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { products, categories } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const { slug } = await params;

  const results = await db
    .select({
      id: products.id,
      name: products.name,
      slug: products.slug,
      tagline: products.tagline,
      description: products.description,
      price: products.price,
      comparePrice: products.comparePrice,
      image: products.image,
      images: products.images,
      categoryId: products.categoryId,
      featured: products.featured,
      bestSeller: products.bestSeller,
      stockCount: products.stockCount,
      categoryName: categories.name,
      categorySlug: categories.slug,
      categoryEmoji: categories.emoji,
    })
    .from(products)
    .innerJoin(categories, eq(products.categoryId, categories.id))
    .where(eq(products.slug, slug))
    .limit(1);

  if (results.length === 0) {
    return NextResponse.json({ error: "Product not found" }, { status: 404 });
  }

  return NextResponse.json({ product: results[0] });
}
