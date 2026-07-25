import { NextResponse } from "next/server";
import { db } from "@/db";
import { categories, products, cartItems } from "@/db/schema";

export async function POST() {
  // Check if already seeded
  const existing = await db.select().from(categories).limit(1);
  if (existing.length > 0) {
    return NextResponse.json({ message: "Already seeded" });
  }

  // Insert categories
  const [greetingCards, shirts, posters, mugs, stickers] = await db
    .insert(categories)
    .values([
      {
        name: "Greeting Cards",
        slug: "greeting-cards",
        emoji: "💌",
        description: "Pun-tastic cards for every occasion!",
      },
      {
        name: "T-Shirts",
        slug: "t-shirts",
        emoji: "👕",
        description: "Wear your puns with pride!",
      },
      {
        name: "Posters",
        slug: "posters",
        emoji: "🖼️",
        description: "Decorate your walls with wordplay!",
      },
      {
        name: "Mugs",
        slug: "mugs",
        emoji: "☕",
        description: "Start your morning with a groan!",
      },
      {
        name: "Stickers",
        slug: "stickers",
        emoji: "✨",
        description: "Stick puns everywhere!",
      },
    ])
    .returning();

  await db.insert(products).values([
    {
      name: "You're Un-BEE-lievable",
      slug: "unbeelievable-card",
      tagline: "Bee-cause you're the best! 🐝",
      description:
        "This adorable bee card is perfect for telling someone they're un-bee-lievably awesome. Features a cute bee with sunglasses giving a thumbs up. Printed on premium cardstock with a glossy finish. Blank inside for your personal message.",
      price: "5.99",
      comparePrice: "8.99",
      image: "/images/card-1.jpg",
      categoryId: greetingCards.id,
      featured: true,
      bestSeller: true,
    },
    {
      name: "Sloth Your Birthday!",
      slug: "sloth-birthday-card",
      tagline: "Take it slow, it's your special day! 🦥",
      description:
        "A hilariously cute sloth birthday card for that friend who loves to take it easy. Features a cartoon sloth hanging from a branch with a tiny birthday cake. Premium cardstock, blank inside.",
      price: "5.99",
      image: "/images/card-2.jpg",
      categoryId: greetingCards.id,
      featured: true,
      bestSeller: false,
    },
    {
      name: "You're Grate!",
      slug: "youre-grate-card",
      tagline: "A cheesy card for a cheesy person! 🧀",
      description:
        "Show someone they're truly grate with this cheese-themed pun card. Features a happy cheese grater with a block of cheese. Perfect for foodies and pun lovers alike. Premium cardstock.",
      price: "4.99",
      image: "/images/card-1.jpg",
      categoryId: greetingCards.id,
      featured: false,
      bestSeller: true,
    },
    {
      name: "Lettuce Celebrate!",
      slug: "lettuce-celebrate-card",
      tagline: "Romaine calm and party on! 🥬",
      description:
        "The perfect card for any celebration! This punny lettuce card will make anyone smile. Features dancing lettuce characters at a party. Printed on eco-friendly cardstock.",
      price: "5.49",
      image: "/images/card-2.jpg",
      categoryId: greetingCards.id,
      featured: false,
      bestSeller: false,
    },
    {
      name: "Taco 'Bout Awesome",
      slug: "taco-bout-awesome-tee",
      tagline: "Let's taco 'bout how cool you are! 🌮",
      description:
        "This taco-rific t-shirt features a dapper taco wearing a sombrero and mustache. Made from 100% organic cotton, pre-shrunk, and incredibly soft. Available in sizes S-3XL. Machine washable.",
      price: "24.99",
      comparePrice: "34.99",
      image: "/images/shirt-1.jpg",
      categoryId: shirts.id,
      featured: true,
      bestSeller: true,
    },
    {
      name: "Dino-Mite Dancer",
      slug: "dinomite-dancer-tee",
      tagline: "You're dino-mite on the dance floor! 🦕",
      description:
        "Get your groove on with this adorable dancing dinosaur tee! Features a T-Rex wearing headphones and busting moves. Ultra-soft cotton blend, vibrant print that won't fade. Sizes S-3XL.",
      price: "24.99",
      image: "/images/shirt-2.jpg",
      categoryId: shirts.id,
      featured: true,
      bestSeller: false,
    },
    {
      name: "Nacho Average Human",
      slug: "nacho-average-tee",
      tagline: "Because you're nacho ordinary person! 🧀",
      description:
        "Stand out from the crowd with this cheesy pun tee! Features a cool nacho chip wearing sunglasses. Premium cotton, screen-printed design. Sizes S-3XL.",
      price: "22.99",
      image: "/images/shirt-1.jpg",
      categoryId: shirts.id,
      featured: false,
      bestSeller: true,
    },
    {
      name: "Space Cat-det",
      slug: "space-catdet-poster",
      tagline: "One small step for cat, one giant leap for cat-kind! 🐱",
      description:
        "This out-of-this-world poster features a brave cat astronaut exploring the cosmos! Vaporwave-inspired colors, printed on premium matte paper. Available in 11x17 and 18x24 sizes.",
      price: "18.99",
      comparePrice: "24.99",
      image: "/images/poster-1.jpg",
      categoryId: posters.id,
      featured: true,
      bestSeller: true,
    },
    {
      name: "Surf's Pup!",
      slug: "surfs-pup-poster",
      tagline: "Hang ten with this rad pupper! 🏄",
      description:
        "Cowabunga! This totally tubular poster features a gnarly dog surfing a rainbow wave at sunset. Retro 80s/90s vibes that'll transport you straight to summer. Premium matte finish.",
      price: "18.99",
      image: "/images/poster-2.jpg",
      categoryId: posters.id,
      featured: true,
      bestSeller: false,
    },
    {
      name: "Donut Worry, Be Happy",
      slug: "donut-worry-poster",
      tagline: "Sprinkle some joy on your walls! 🍩",
      description:
        "A cheerful poster featuring a smiling donut surrounded by sprinkles and good vibes. Retro-inspired design with bright colors. Printed on premium matte paper. 18x24 inches.",
      price: "16.99",
      image: "/images/poster-1.jpg",
      categoryId: posters.id,
      featured: false,
      bestSeller: false,
    },
    {
      name: "Avo Great Day!",
      slug: "avo-great-day-mug",
      tagline: "This mug is avo-lutely perfect! 🥑",
      description:
        "Start your mornings right with this adorable avocado yoga mug! Features a zen avocado in various yoga poses. Dishwasher and microwave safe. 11oz ceramic mug with comfortable handle.",
      price: "14.99",
      comparePrice: "19.99",
      image: "/images/mug-1.jpg",
      categoryId: mugs.id,
      featured: true,
      bestSeller: true,
    },
    {
      name: "Espresso Yourself",
      slug: "espresso-yourself-mug",
      tagline: "Don't hold back, espresso yourself! ☕",
      description:
        "A mug about mugs! This meta masterpiece features a cheerful espresso cup encouraging you to be yourself. Perfect for coffee lovers with a sense of humor. 11oz ceramic.",
      price: "13.99",
      image: "/images/mug-1.jpg",
      categoryId: mugs.id,
      featured: false,
      bestSeller: true,
    },
    {
      name: "Pun-derful Sticker Pack",
      slug: "punderful-sticker-pack",
      tagline: "A pun-ch of fun in every pack! 🎉",
      description:
        "Get 10 hilarious pun stickers featuring your favorite food characters! Includes pizza, donut, french fries, and more. Waterproof, scratch-resistant vinyl. Perfect for laptops, water bottles, and phones.",
      price: "9.99",
      comparePrice: "14.99",
      image: "/images/sticker-1.jpg",
      categoryId: stickers.id,
      featured: true,
      bestSeller: true,
    },
    {
      name: "Pawsitive Vibes Sticker Pack",
      slug: "pawsitive-vibes-stickers",
      tagline: "Stay pawsitive, friends! 🐾",
      description:
        "8 adorable animal pun stickers to brighten your day! Features cats, dogs, and other critters with punny sayings. Waterproof vinyl, perfect for any surface.",
      price: "8.99",
      image: "/images/sticker-1.jpg",
      categoryId: stickers.id,
      featured: false,
      bestSeller: false,
    },
  ]);

  return NextResponse.json({ message: "Seeded!" });
}
