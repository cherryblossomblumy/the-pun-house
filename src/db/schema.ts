import {
  pgTable,
  serial,
  varchar,
  text,
  integer,
  numeric,
  timestamp,
  boolean,
  jsonb,
} from "drizzle-orm/pg-core";

export const categories = pgTable("categories", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  slug: varchar("slug", { length: 100 }).notNull().unique(),
  emoji: varchar("emoji", { length: 10 }).notNull().default("🎉"),
  description: text("description"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const products = pgTable("products", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  slug: varchar("slug", { length: 255 }).notNull().unique(),
  tagline: varchar("tagline", { length: 255 }).notNull(),
  description: text("description").notNull(),
  price: numeric("price", { precision: 10, scale: 2 }).notNull(),
  comparePrice: numeric("compare_price", { precision: 10, scale: 2 }),
  image: varchar("image", { length: 500 }).notNull(),
images: jsonb("images").$type<string[]>().notNull().default([]),
categoryId: integer("category_id")
    .references(() => categories.id)
    .notNull(),
  featured: boolean("featured").default(false).notNull(),
  bestSeller: boolean("best_seller").default(false).notNull(),
  stockCount: integer("stock_count").default(100).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const orders = pgTable("orders", {
  id: serial("id").primaryKey(),
  sessionId: varchar("session_id", { length: 100 }).notNull(),
  stripeCheckoutSessionId: varchar("stripe_checkout_session_id", {
    length: 255,
  })
    .notNull()
    .unique(),
  stripePaymentIntentId: varchar("stripe_payment_intent_id", {
    length: 255,
  }),
  status: varchar("status", { length: 50 }).notNull().default("pending"),
  customerEmail: varchar("customer_email", { length: 255 }),
  customerPhone: varchar("customer_phone", { length: 50 }),
  subtotal: numeric("subtotal", { precision: 10, scale: 2 }).notNull(),
  shipping: numeric("shipping", { precision: 10, scale: 2 }).notNull(),
  total: numeric("total", { precision: 10, scale: 2 }).notNull(),
  shippingAddress: jsonb("shipping_address"),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});

export const orderItems = pgTable("order_items", {
  id: serial("id").primaryKey(),
  orderId: integer("order_id")
    .references(() => orders.id)
    .notNull(),
  productId: integer("product_id")
    .references(() => products.id)
    .notNull(),
  name: varchar("name", { length: 255 }).notNull(),
  price: numeric("price", { precision: 10, scale: 2 }).notNull(),
  quantity: integer("quantity").notNull(),
  image: varchar("image", { length: 500 }).notNull(),
});
export const cartItems = pgTable("cart_items", {
  id: serial("id").primaryKey(),
  sessionId: varchar("session_id", { length: 100 }).notNull(),
  productId: integer("product_id")
    .references(() => products.id)
    .notNull(),
  quantity: integer("quantity").default(1).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
});
