import { db } from "@/db";
import { products, categories } from "@/db/schema";
import { eq } from "drizzle-orm";
import Link from "next/link";
import { ProductCard } from "@/components/ProductCard";

export const dynamic = "force-dynamic";

async function getFeaturedProducts() {
  const results = await db
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
    .where(eq(products.featured, true))
    .limit(8);
  return results;
}

async function getCategories() {
  return await db.select().from(categories);
}

async function getBestSellers() {
  const results = await db
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
    .where(eq(products.bestSeller, true))
    .limit(4);
  return results;
}

export default async function HomePage() {
  const [featuredProducts, allCategories, bestSellers] = await Promise.all([
    getFeaturedProducts(),
    getCategories(),
    getBestSellers(),
  ]);

  return (
    <div>
      {/* Hero Section */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0">
          <img
            src="/images/hero-bg.jpg"
            alt=""
            className="w-full h-full object-cover opacity-30"
          />
          <div className="absolute inset-0 bg-gradient-to-br from-bubblegum/80 via-grape/60 to-sky/80" />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 py-20 md:py-32 text-center text-white">
          {/* Floating emojis */}
          <div className="absolute top-10 left-10 text-5xl animate-float opacity-60">
            🌮
          </div>
          <div className="absolute top-20 right-16 text-4xl animate-float stagger-2 opacity-60">
            🐝
          </div>
          <div className="absolute bottom-20 left-20 text-4xl animate-float stagger-3 opacity-60">
            🥑
          </div>
          <div className="absolute bottom-10 right-10 text-5xl animate-float stagger-4 opacity-60">
            🦕
          </div>
          <div className="absolute top-32 left-1/4 text-3xl animate-float stagger-5 opacity-50">
            ⭐
          </div>
          <div className="absolute bottom-32 right-1/4 text-3xl animate-float stagger-1 opacity-50">
            🌈
          </div>

          <div className="animate-pop-in">
            <span className="inline-block text-6xl md:text-8xl mb-4 animate-wiggle">
              🤣
            </span>
            <h1
              className="text-5xl md:text-7xl font-bold mb-4 drop-shadow-lg"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Welcome to{" "}
              <span className="rainbow-text drop-shadow-lg">PunStop!</span>
            </h1>
            <p className="text-xl md:text-2xl font-semibold mb-2 text-white/90 max-w-2xl mx-auto">
              Puns So Good, They Hurt 💫
            </p>
            <p className="text-lg md:text-xl text-white/80 max-w-xl mx-auto mb-8">
              Greeting cards, t-shirts, posters, mugs & more — all
              hilariously punny and guaranteed to make you smile!
            </p>

            <div className="flex flex-wrap justify-center gap-4">
              <Link
                href="/shop"
                className="btn-fun bg-sunshine text-retro-dark font-bold text-lg px-8 py-4 rounded-full shadow-xl hover:shadow-2xl inline-flex items-center gap-2"
                style={{ fontFamily: "var(--font-display)" }}
              >
                🛍️ Shop All Puns
              </Link>
              <Link
                href="/shop?category=greeting-cards"
                className="btn-fun bg-white/20 backdrop-blur-sm text-white border-2 border-white/50 font-bold text-lg px-8 py-4 rounded-full shadow-xl hover:bg-white/30 inline-flex items-center gap-2"
                style={{ fontFamily: "var(--font-display)" }}
              >
                💌 Browse Cards
              </Link>
            </div>
          </div>

          {/* Scrolling banner */}
          <div className="mt-12 overflow-hidden">
            <div className="flex animate-[slide-left_20s_linear_infinite] whitespace-nowrap">
              {[
                "🌮 Taco 'Bout Awesome",
                "🐝 Un-bee-lievable",
                "🥑 Avo Great Day",
                "🦥 Sloth Your Birthday",
                "🐱 Space Cat-det",
                "🍩 Donut Worry",
                "🏄 Surf's Pup",
                "☕ Espresso Yourself",
                "🌮 Taco 'Bout Awesome",
                "🐝 Un-bee-lievable",
              ].map((text, i) => (
                <span
                  key={i}
                  className="inline-block mx-6 text-white/70 font-semibold text-lg"
                >
                  {text} •
                </span>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="bg-white border-y-4 border-sunshine">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
            {[
              { emoji: "🚚", text: "Free Shipping $35+" },
              { emoji: "😂", text: "100% Pun Guaranteed" },
              { emoji: "🔄", text: "30-Day Returns" },
              { emoji: "💚", text: "Eco-Friendly Materials" },
            ].map((badge, i) => (
              <div key={i} className="flex items-center justify-center gap-2">
                <span className="text-2xl">{badge.emoji}</span>
                <span className="font-bold text-sm text-retro-dark">
                  {badge.text}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-10">
          <h2
            className="text-3xl md:text-4xl font-bold text-retro-dark"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Shop by <span className="text-bubblegum">Category</span> ✨
          </h2>
          <p className="text-gray-500 mt-2 text-lg">
            Find the perfect pun for every occasion!
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {allCategories.map((cat, i) => (
            <Link
              key={cat.id}
              href={`/shop?category=${cat.slug}`}
              className={`product-card bg-white rounded-2xl p-6 text-center shadow-md border-2 border-transparent hover:border-bubblegum group stagger-${i + 1}`}
            >
              <span className="text-5xl block mb-3 group-hover:scale-125 transition-transform">
                {cat.emoji}
              </span>
              <h3
                className="font-bold text-lg text-retro-dark"
                style={{ fontFamily: "var(--font-display)" }}
              >
                {cat.name}
              </h3>
              <p className="text-sm text-gray-400 mt-1">{cat.description}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="bg-gradient-to-r from-bubblegum/10 via-grape/10 to-sky/10 py-16">
        <div className="max-w-7xl mx-auto px-4">
          <div className="text-center mb-10">
            <h2
              className="text-3xl md:text-4xl font-bold text-retro-dark"
              style={{ fontFamily: "var(--font-display)" }}
            >
              ⭐ Featured <span className="text-grape">Puns</span>
            </h2>
            <p className="text-gray-500 mt-2 text-lg">
              Our most pun-derful picks, handpicked for you!
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product) => (
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

          <div className="text-center mt-10">
            <Link
              href="/shop"
              className="btn-fun inline-flex items-center gap-2 bg-gradient-to-r from-grape to-bubblegum text-white font-bold text-lg px-8 py-4 rounded-full shadow-xl"
              style={{ fontFamily: "var(--font-display)" }}
            >
              View All Products 🎉
            </Link>
          </div>
        </div>
      </section>

      {/* Best Sellers */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-10">
          <h2
            className="text-3xl md:text-4xl font-bold text-retro-dark"
            style={{ fontFamily: "var(--font-display)" }}
          >
            🔥 Best <span className="text-coral">Sellers</span>
          </h2>
          <p className="text-gray-500 mt-2 text-lg">
            The puns everyone can&apos;t stop buying!
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {bestSellers.map((product) => (
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
      </section>

      {/* Fun CTA Banner */}
      <section className="bg-gradient-to-r from-sunshine via-coral to-bubblegum py-16 relative overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-5 left-10 text-8xl rotate-12">🎈</div>
          <div className="absolute bottom-5 right-10 text-8xl -rotate-12">
            🎉
          </div>
          <div className="absolute top-10 right-1/3 text-6xl rotate-45">
            ⭐
          </div>
        </div>
        <div className="relative max-w-4xl mx-auto px-4 text-center text-white">
          <h2
            className="text-3xl md:text-5xl font-bold mb-4"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Warning: Puns May Cause Excessive Groaning 😆
          </h2>
          <p className="text-lg md:text-xl mb-8 text-white/90">
            Side effects include uncontrollable laughter, eye-rolling, and the
            urge to share with friends. Shop responsibly!
          </p>
          <Link
            href="/shop"
            className="btn-fun inline-flex items-center gap-2 bg-white text-retro-dark font-bold text-xl px-10 py-5 rounded-full shadow-2xl"
            style={{ fontFamily: "var(--font-display)" }}
          >
            I Accept the Risk! 🛍️
          </Link>
        </div>
      </section>

      {/* Reviews/Social Proof */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <div className="text-center mb-10">
          <h2
            className="text-3xl md:text-4xl font-bold text-retro-dark"
            style={{ fontFamily: "var(--font-display)" }}
          >
            💬 What Pun-Lovers Say
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[
            {
              name: "Sarah M.",
              avatar: "🦊",
              text: "I bought the taco shirt for my dad and he hasn't stopped wearing it. Or making taco puns. Send help. 😂",
              rating: 5,
            },
            {
              name: "Jake T.",
              avatar: "🐻",
              text: "The greeting cards are AMAZING. My friends groan every time they open one and I live for it. Best $6 ever spent!",
              rating: 5,
            },
            {
              name: "Emma R.",
              avatar: "🦄",
              text: "The Space Cat-det poster is hanging in my office and it makes everyone smile. Quality is top-notch too!",
              rating: 5,
            },
          ].map((review, i) => (
            <div
              key={i}
              className="bg-white rounded-2xl p-6 shadow-lg border-2 border-transparent hover:border-sunshine transition-colors"
            >
              <div className="flex items-center gap-3 mb-3">
                <span className="text-3xl">{review.avatar}</span>
                <div>
                  <p className="font-bold text-retro-dark">{review.name}</p>
                  <div className="text-sunshine">
                    {"⭐".repeat(review.rating)}
                  </div>
                </div>
              </div>
              <p className="text-gray-600 italic">&ldquo;{review.text}&rdquo;</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
