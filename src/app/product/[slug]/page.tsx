import { db } from "@/db";
import { products, categories } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import Link from "next/link";
import { AddToCartButton } from "@/components/AddToCartButton";
import { ProductGallery } from "@/components/ProductGallery";

export const dynamic = "force-dynamic";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProductPage({ params }: ProductPageProps) {
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
    notFound();
  }

  const product = results[0];

  const discount = product.comparePrice
    ? Math.round(
        ((parseFloat(product.comparePrice) - parseFloat(product.price)) /
          parseFloat(product.comparePrice)) *
          100
      )
    : 0;

  // Get related products from same category
  const related = await db
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
      categoryEmoji: categories.emoji,
    })
    .from(products)
    .innerJoin(categories, eq(products.categoryId, categories.id))
    .where(eq(categories.slug, product.categorySlug))
    .limit(4);

  const relatedProducts = related.filter((p) => p.id !== product.id);

  return (
    <div>
      {/* Breadcrumbs */}
      <div className="max-w-7xl mx-auto px-4 py-4">
        <nav className="flex items-center gap-2 text-sm text-gray-500">
          <Link href="/" className="hover:text-bubblegum">
            Home
          </Link>
          <span>›</span>
          <Link href="/shop" className="hover:text-bubblegum">
            Shop
          </Link>
          <span>›</span>
          <Link
            href={`/shop?category=${product.categorySlug}`}
            className="hover:text-bubblegum"
          >
            {product.categoryEmoji} {product.categoryName}
          </Link>
          <span>›</span>
          <span className="text-retro-dark font-semibold">{product.name}</span>
        </nav>
      </div>

      {/* Product Detail */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* Product Gallery */}
<ProductGallery
  images={
    product.images.length > 0 ? product.images : [product.image]
  }
  name={product.name}
  bestSeller={product.bestSeller}
  discount={discount}
/>

          {/* Details */}
          <div className="flex flex-col justify-center">
            <div className="flex items-center gap-2 mb-2">
              <Link
                href={`/shop?category=${product.categorySlug}`}
                className="bg-grape/10 text-grape font-semibold text-sm px-3 py-1 rounded-full hover:bg-grape/20 transition-colors"
              >
                {product.categoryEmoji} {product.categoryName}
              </Link>
            </div>

            <h1
              className="text-3xl md:text-4xl font-bold text-retro-dark mb-2"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {product.name}
            </h1>

            <p className="text-lg text-gray-500 mb-4">{product.tagline}</p>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-4">
              <span className="text-sunshine text-xl">⭐⭐⭐⭐⭐</span>
              <span className="text-gray-500 text-sm">(127 reviews)</span>
            </div>

            {/* Price */}
            <div className="flex items-center gap-3 mb-6">
              <span
                className="text-4xl font-bold text-grape"
                style={{ fontFamily: "var(--font-display)" }}
              >
                ${parseFloat(product.price).toFixed(2)}
              </span>
              {product.comparePrice && (
                <>
                  <span className="text-xl text-gray-400 line-through">
                    ${parseFloat(product.comparePrice).toFixed(2)}
                  </span>
                  <span className="bg-bubblegum/10 text-bubblegum font-bold text-sm px-3 py-1 rounded-full">
                    You save $
                    {(
                      parseFloat(product.comparePrice) -
                      parseFloat(product.price)
                    ).toFixed(2)}
                    !
                  </span>
                </>
              )}
            </div>

            {/* Description */}
            <div className="bg-cream rounded-2xl p-6 mb-6 border-2 border-sunshine/30">
              <p className="text-gray-700 leading-relaxed">
                {product.description}
              </p>
            </div>

            {/* Stock */}
            <div className="flex items-center gap-2 mb-6">
              <span className="w-3 h-3 bg-mint rounded-full animate-pulse" />
              <span className="text-mint font-semibold text-sm">
                In Stock — {product.stockCount} left!
              </span>
              {product.stockCount < 20 && (
                <span className="text-coral font-bold text-sm ml-2 animate-bounce-gentle">
                  🔥 Selling fast!
                </span>
              )}
            </div>

            {/* Add to Cart */}
            <AddToCartButton productId={product.id} />

            {/* Perks */}
            <div className="grid grid-cols-2 gap-3 mt-6">
              {[
                { emoji: "🚚", text: "Free shipping $35+" },
                { emoji: "🔄", text: "30-day returns" },
                { emoji: "💚", text: "Eco-friendly" },
                { emoji: "🎁", text: "Gift-ready" },
              ].map((perk, i) => (
                <div
                  key={i}
                  className="flex items-center gap-2 text-sm text-gray-600"
                >
                  <span>{perk.emoji}</span>
                  <span>{perk.text}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Related Products */}
      {relatedProducts.length > 0 && (
        <section className="max-w-7xl mx-auto px-4 py-16">
          <h2
            className="text-2xl md:text-3xl font-bold text-retro-dark text-center mb-8"
            style={{ fontFamily: "var(--font-display)" }}
          >
            You Might Also Like 💝
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {relatedProducts.map((p) => (
              <div
                key={p.id}
                className="product-card bg-white rounded-3xl overflow-hidden shadow-lg border-2 border-transparent hover:border-bubblegum"
              >
                <Link href={`/product/${p.slug}`}>
                  <img
                    src={p.image}
                    alt={p.name}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h3
                      className="font-bold text-retro-dark"
                      style={{ fontFamily: "var(--font-display)" }}
                    >
                      {p.name}
                    </h3>
                    <p className="text-sm text-gray-500">{p.tagline}</p>
                    <span className="text-grape font-bold text-lg mt-2 block">
                      ${parseFloat(p.price).toFixed(2)}
                    </span>
                  </div>
                </Link>
              </div>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
