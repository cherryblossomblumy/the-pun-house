import { db } from "@/db";
import { products, categories } from "@/db/schema";
import { eq } from "drizzle-orm";
import Link from "next/link";
import { ProductCard } from "@/components/ProductCard";

export const dynamic = "force-dynamic";

interface ShopPageProps {
  searchParams: Promise<{ category?: string }>;
}

export default async function ShopPage({ searchParams }: ShopPageProps) {
  const params = await searchParams;
  const categorySlug = params.category;

  const allCategories = await db.select().from(categories);

  const allProducts = await db
    .select({
      id: products.id,
      name: products.name,
      slug: products.slug,
      tagline: products.tagline,
      price: products.price,
      comparePrice: products.comparePrice,
      image: products.image,
      featured: products.featured,
      bestSeller: products.bestSeller,
      categorySlug: categories.slug,
      categoryEmoji: categories.emoji,
    })
    .from(products)
    .innerJoin(categories, eq(products.categoryId, categories.id));

  const filteredProducts = categorySlug
    ? allProducts.filter((p) => p.categorySlug === categorySlug)
    : allProducts;

  const currentCategory = categorySlug
    ? allCategories.find((c) => c.slug === categorySlug)
    : null;

  return (
    <div>
      {/* Hero Banner */}
      <section className="bg-gradient-to-r from-grape via-bubblegum to-sky py-12 md:py-16 text-white text-center relative overflow-hidden">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-5 left-10 text-6xl animate-float">
            🛍️
          </div>
          <div className="absolute bottom-5 right-10 text-6xl animate-float stagger-3">
            🎁
          </div>
        </div>
        <div className="relative max-w-4xl mx-auto px-4">
          <h1
            className="text-4xl md:text-5xl font-bold mb-3"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {currentCategory
              ? `${currentCategory.emoji} ${currentCategory.name}`
              : "🛍️ Shop All Puns"}
          </h1>
          <p className="text-lg text-white/80">
            {currentCategory
              ? currentCategory.description
              : "Browse our entire collection of pun-tastic goodies!"}
          </p>
        </div>
      </section>

      <div className="max-w-7xl mx-auto px-4 py-10">
        {/* Category Filter */}
        <div className="flex flex-wrap gap-3 mb-8 justify-center">
          <Link
            href="/shop"
            className={`btn-fun px-5 py-2.5 rounded-full font-bold text-sm shadow-md transition-all ${
              !categorySlug
                ? "bg-gradient-to-r from-bubblegum to-grape text-white"
                : "bg-white text-retro-dark border-2 border-gray-200 hover:border-bubblegum"
            }`}
          >
            🌟 All
          </Link>
          {allCategories.map((cat) => (
            <Link
              key={cat.id}
              href={`/shop?category=${cat.slug}`}
              className={`btn-fun px-5 py-2.5 rounded-full font-bold text-sm shadow-md transition-all ${
                categorySlug === cat.slug
                  ? "bg-gradient-to-r from-bubblegum to-grape text-white"
                  : "bg-white text-retro-dark border-2 border-gray-200 hover:border-bubblegum"
              }`}
            >
              {cat.emoji} {cat.name}
            </Link>
          ))}
        </div>

        {/* Results count */}
        <p className="text-gray-500 mb-6 text-center">
          Showing{" "}
          <span className="font-bold text-grape">
            {filteredProducts.length}
          </span>{" "}
          pun-derful products
        </p>

        {/* Product Grid */}
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                name={product.name}
                slug={product.slug}
                tagline={product.tagline}
                price={product.price}
                comparePrice={product.comparePrice}
                image={product.image}
                bestSeller={product.bestSeller}
                featured={product.featured}
                categoryEmoji={product.categoryEmoji}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-20">
            <span className="text-6xl block mb-4">😢</span>
            <h3
              className="text-2xl font-bold text-retro-dark"
              style={{ fontFamily: "var(--font-display)" }}
            >
              No puns found!
            </h3>
            <p className="text-gray-500 mt-2">
              That&apos;s un-pun-acceptable! Try another category.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
