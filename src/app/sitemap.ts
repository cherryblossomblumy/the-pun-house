import { MetadataRoute } from "next";
import { db } from "@/db";
import { products } from "@/db/schema";
import { eq } from "drizzle-orm";

const BASE_URL = "https://thepunhouse.com";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const publishedProducts = await db
    .select({
      slug: products.slug,
      createdAt: products.createdAt,
    })
    .from(products)
    .where(eq(products.published, true));

  return [
    {
      url: BASE_URL,
      lastModified: new Date(),
    },
    {
      url: `${BASE_URL}/shop`,
      lastModified: new Date(),
    },
    {
      url: `${BASE_URL}/shipping`,
      lastModified: new Date(),
    },
    {
      url: `${BASE_URL}/returns`,
      lastModified: new Date(),
    },
    {
      url: `${BASE_URL}/faq`,
      lastModified: new Date(),
    },
    {
      url: `${BASE_URL}/contact`,
      lastModified: new Date(),
    },
    {
      url: `${BASE_URL}/privacy`,
      lastModified: new Date(),
    },
    {
      url: `${BASE_URL}/terms`,
      lastModified: new Date(),
    },
    ...publishedProducts.map((product) => ({
      url: `${BASE_URL}/product/${product.slug}`,
      lastModified: product.createdAt,
    })),
  ];
}