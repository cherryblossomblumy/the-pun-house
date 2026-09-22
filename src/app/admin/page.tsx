import Link from "next/link";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { db } from "@/db";
import { products, categories } from "@/db/schema";
import { eq } from "drizzle-orm";

export default async function AdminPage() {
    const session = await auth();

  if (!session?.user) {
    redirect("/admin/login");
  }
  
  const productRows = await db
    .select({
      id: products.id,
      name: products.name,
      price: products.price,
      image: products.image,
      categoryName: categories.name,
      featured: products.featured,
      bestSeller: products.bestSeller,
    })
    .from(products)
    .innerJoin(categories, eq(products.categoryId, categories.id))
    .orderBy(products.id);

  return (
    <main className="min-h-screen bg-cream px-6 py-12">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1
              className="text-4xl font-bold text-retro-dark"
              style={{ fontFamily: "var(--font-display)" }}
            >
              Pun House Admin 🏠
            </h1>
            <p className="mt-2 text-gray-600">
              Manage your products.
            </p>
          </div>

          <Link
            href="/admin/products/new"
            className="rounded-xl bg-grape text-white font-bold px-5 py-3 hover:opacity-90"
          >
            + Add Product
          </Link>
        </div>

        <div className="bg-white rounded-3xl shadow-lg overflow-hidden">
          <div className="px-6 py-4 border-b border-gray-100">
            <h2 className="text-xl font-bold text-retro-dark">
              Products ({productRows.length})
            </h2>
          </div>

          <div className="divide-y divide-gray-100">
            {productRows.map((product) => (
              <div
                key={product.id}
                className="flex items-center gap-5 px-6 py-4"
              >
                <div className="w-20 h-20 rounded-xl bg-gray-100 overflow-hidden flex-shrink-0">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="font-bold text-retro-dark truncate">
                    {product.name}
                  </h3>
                  <p className="text-sm text-gray-500">
                    {product.categoryName}
                  </p>
                </div>

                <div className="text-right">
                  <p className="font-bold text-retro-dark">
                    ${product.price}
                  </p>

                  <div className="flex gap-2 mt-1 justify-end">
                    {product.featured && (
                      <span className="text-xs bg-yellow-100 px-2 py-1 rounded-full">
                        Featured
                      </span>
                    )}

                    {product.bestSeller && (
                      <span className="text-xs bg-pink-100 px-2 py-1 rounded-full">
                        Best Seller
                      </span>
                    )}
                  </div>

                  <Link
                    href={`/admin/products/${product.id}`}
                    className="inline-block mt-2 rounded-lg bg-gray-100 px-3 py-2 text-sm font-bold text-retro-dark hover:bg-gray-200"
                  >
                    Edit
                  </Link>
                </div>
              </div>
            ))}

            {productRows.length === 0 && (
              <div className="px-6 py-12 text-center text-gray-500">
                No products yet.
              </div>
            )}
          </div>
        </div>
      </div>
    </main>
  );
}
