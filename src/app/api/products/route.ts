import { NextRequest, NextResponse } from "next/server";
import { db } from "@/db";
import { products, categories } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get("category");
  const featured = searchParams.get("featured");

  let query = db
    .select({
      id: products.id,
      name: products.name,
      slug: products.slug,
      tagline: products.tagline,
      description: products.description,
      price: products.price,
      comparePrice: products.comparePrice,
      image: products.image,
      categoryId: products.categoryId,
      featured: products.featured,
      bestSeller: products.bestSeller,
      categoryName: categories.name,
      categorySlug: categories.slug,
      categoryEmoji: categories.emoji,
    })
    .from(products)
    .innerJoin(categories, eq(products.categoryId, categories.id));

  const results = await query;

  let filtered = results;
  if (category) {
    filtered = filtered.filter((p) => p.categorySlug === category);
  }
  if (featured === "true") {
    filtered = filtered.filter((p) => p.featured);
  }

  return NextResponse.json({ products: filtered });
}
