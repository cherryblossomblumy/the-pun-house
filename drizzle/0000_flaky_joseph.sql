CREATE TABLE "cart_items" (
	"id" serial PRIMARY KEY NOT NULL,
	"session_id" varchar(100) NOT NULL,
	"product_id" integer NOT NULL,
	"quantity" integer DEFAULT 1 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE "categories" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(100) NOT NULL,
	"slug" varchar(100) NOT NULL,
	"emoji" varchar(10) DEFAULT '🎉' NOT NULL,
	"description" text,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "categories_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
CREATE TABLE "order_items" (
	"id" serial PRIMARY KEY NOT NULL,
	"order_id" integer NOT NULL,
	"product_id" integer NOT NULL,
	"name" varchar(255) NOT NULL,
	"price" numeric(10, 2) NOT NULL,
	"quantity" integer NOT NULL,
	"image" varchar(500) NOT NULL
);
--> statement-breakpoint
CREATE TABLE "orders" (
	"id" serial PRIMARY KEY NOT NULL,
	"session_id" varchar(100) NOT NULL,
	"stripe_checkout_session_id" varchar(255) NOT NULL,
	"stripe_payment_intent_id" varchar(255),
	"status" varchar(50) DEFAULT 'pending' NOT NULL,
	"customer_email" varchar(255),
	"subtotal" numeric(10, 2) NOT NULL,
	"shipping" numeric(10, 2) NOT NULL,
	"total" numeric(10, 2) NOT NULL,
	"shipping_address" jsonb,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "orders_stripe_checkout_session_id_unique" UNIQUE("stripe_checkout_session_id")
);
--> statement-breakpoint
CREATE TABLE "products" (
	"id" serial PRIMARY KEY NOT NULL,
	"name" varchar(255) NOT NULL,
	"slug" varchar(255) NOT NULL,
	"tagline" varchar(255) NOT NULL,
	"description" text NOT NULL,
	"price" numeric(10, 2) NOT NULL,
	"compare_price" numeric(10, 2),
	"image" varchar(500) NOT NULL,
	"images" jsonb DEFAULT '[]'::jsonb NOT NULL,
	"category_id" integer NOT NULL,
	"featured" boolean DEFAULT false NOT NULL,
	"best_seller" boolean DEFAULT false NOT NULL,
	"stock_count" integer DEFAULT 100 NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "products_slug_unique" UNIQUE("slug")
);
--> statement-breakpoint
ALTER TABLE "cart_items" ADD CONSTRAINT "cart_items_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_order_id_orders_id_fk" FOREIGN KEY ("order_id") REFERENCES "public"."orders"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "order_items" ADD CONSTRAINT "order_items_product_id_products_id_fk" FOREIGN KEY ("product_id") REFERENCES "public"."products"("id") ON DELETE no action ON UPDATE no action;--> statement-breakpoint
ALTER TABLE "products" ADD CONSTRAINT "products_category_id_categories_id_fk" FOREIGN KEY ("category_id") REFERENCES "public"."categories"("id") ON DELETE no action ON UPDATE no action;