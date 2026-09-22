"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";

type Category = {
  id: number;
  name: string;
};

type Product = {
  id: number;
  name: string;
  tagline: string;
  description: string;
  price: string;
  categoryId: number;
  image: string;
  images: string[];
  featured: boolean;
  bestSeller: boolean;
  stockCount: number;
};

export default function EditProductPage() {
  const params = useParams();
  const router = useRouter();
  const productId = String(params.id);

  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");

  const [imagePreviews, setImagePreviews] = useState<string[]>([]);

  const [form, setForm] = useState({
    name: "",
    tagline: "",
    description: "",
    price: "",
    categoryId: "",
    image: "",
    images: [] as string[],
    featured: false,
    bestSeller: false,
    stockCount: "100",
  });

  useEffect(() => {
    async function loadData() {
      try {
        const [productResponse, categoriesResponse] = await Promise.all([
          fetch(`/api/admin/products/${productId}`),
          fetch("/api/categories"),
        ]);

        const productData = await productResponse.json();
        const categoriesData = await categoriesResponse.json();

        if (!productResponse.ok) {
          throw new Error(
            productData.error || "Could not load product."
          );
        }

        if (!categoriesResponse.ok) {
          throw new Error("Could not load categories.");
        }

        const product: Product = productData.product;
        const images =
          Array.isArray(product.images) && product.images.length > 0
            ? product.images
            : product.image
              ? [product.image]
              : [];

        setForm({
          name: product.name,
          tagline: product.tagline,
          description: product.description,
          price: String(product.price),
          categoryId: String(product.categoryId),
          image: images[0] ?? product.image ?? "",
          images,
          featured: product.featured,
          bestSeller: product.bestSeller,
          stockCount: String(product.stockCount),
        });

        setImagePreviews(images);
        setCategories(categoriesData.categories ?? []);
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Could not load product."
        );
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, [productId]);

  function updateField(
    field: keyof typeof form,
    value: string | boolean
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function handleImageUpload(
    e: React.ChangeEvent<HTMLInputElement>
  ) {
    const files = Array.from(e.target.files ?? []);

    if (!files.length) return;

    setUploading(true);
    setError("");

    try {
      const uploadedUrls: string[] = [];

      for (const file of files) {
        if (!file.type.startsWith("image/")) {
          throw new Error("Please choose image files only.");
        }

        const previewUrl = URL.createObjectURL(file);

        setImagePreviews((current) => [
          ...current,
          previewUrl,
        ]);

        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch("/api/admin/upload", {
          method: "POST",
          body: formData,
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(
            data.error || "Could not upload image."
          );
        }

        uploadedUrls.push(data.url);

        setImagePreviews((current) => {
          const withoutTemporaryPreview = current.filter(
            (item) => item !== previewUrl
          );

          return [...withoutTemporaryPreview, data.url];
        });

        URL.revokeObjectURL(previewUrl);
      }

      setForm((current) => {
        const newImages = [
          ...current.images,
          ...uploadedUrls,
        ];

        return {
          ...current,
          image: newImages[0] ?? "",
          images: newImages,
        };
      });
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Could not upload image."
      );
    } finally {
      setUploading(false);
      e.target.value = "";
    }
  }

  function moveImage(index: number, direction: "up" | "down") {
    setForm((current) => {
      const newImages = [...current.images];
      const targetIndex =
        direction === "up" ? index - 1 : index + 1;

      if (
        targetIndex < 0 ||
        targetIndex >= newImages.length
      ) {
        return current;
      }

      [newImages[index], newImages[targetIndex]] = [
        newImages[targetIndex],
        newImages[index],
      ];

      return {
        ...current,
        image: newImages[0] ?? "",
        images: newImages,
      };
    });

    setImagePreviews((current) => {
      const newPreviews = [...current];
      const targetIndex =
        direction === "up" ? index - 1 : index + 1;

      if (
        targetIndex < 0 ||
        targetIndex >= newPreviews.length
      ) {
        return current;
      }

      [newPreviews[index], newPreviews[targetIndex]] = [
        newPreviews[targetIndex],
        newPreviews[index],
      ];

      return newPreviews;
    });
  }

  function removeImage(index: number) {
    setImagePreviews((current) =>
      current.filter((_, imageIndex) => imageIndex !== index)
    );

    setForm((current) => {
      const newImages = current.images.filter(
        (_, imageIndex) => imageIndex !== index
      );

      return {
        ...current,
        image: newImages[0] ?? "",
        images: newImages,
      };
    });
  }

  async function handleSubmit(
    e: React.FormEvent<HTMLFormElement>
  ) {
    e.preventDefault();

    if (!form.images.length) {
      setError("Please choose at least one image before saving.");
      return;
    }

    async function handleDelete() {
  const confirmed = window.confirm(
    "Are you sure you want to delete this product? This cannot be undone."
  );

  if (!confirmed) return;

  try {
    const response = await fetch(
      window.location.pathname.replace(
        "/admin/products/",
        "/api/admin/products/"
      ),
      {
        method: "DELETE",
      }
    );

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.error || "Failed to delete product.");
    }

    window.location.href = "/admin";
  } catch (error) {
    setError(
      error instanceof Error
        ? error.message
        : "Failed to delete product."
    );
  }
}

    setSaving(true);
    setError("");

    try {
      const response = await fetch(
        `/api/admin/products/${productId}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            ...form,
            price: Number(form.price),
            categoryId: Number(form.categoryId),
            stockCount: Number(form.stockCount),
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Could not update product."
        );
      }

      router.push("/admin");
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Could not update product."
      );
      setSaving(false);
    }
  }

  async function handleDelete() {
    const confirmed = window.confirm(
      "Are you sure you want to delete this product? This cannot be undone."
    );

    if (!confirmed) return;

    try {
      const response = await fetch(
        window.location.pathname.replace(
          "/admin/products/",
          "/api/admin/products/"
        ),
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error || "Could not delete product."
        );
      }

      router.push("/admin");
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Could not delete product."
      );
    }
  }
  
  if (loading) {
    return (
      <main className="min-h-screen bg-cream px-6 py-12">
        <div className="max-w-3xl mx-auto text-center py-20">
          <p className="font-bold text-retro-dark">
            Loading product...
          </p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-cream px-6 py-12">
      <div className="max-w-3xl mx-auto">
        <Link
          href="/admin"
          className="text-sm font-bold text-gray-500 hover:text-retro-dark"
        >
          ← Back to Products
        </Link>

        <div className="mt-6 mb-8">
          <h1
            className="text-4xl font-bold text-retro-dark"
            style={{ fontFamily: "var(--font-display)" }}
          >
            Edit Product ✏️
          </h1>

          <p className="mt-2 text-gray-600">
            Update your Pun House product.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-3xl shadow-lg p-8 space-y-6"
        >
          <div>
            <label className="block font-bold text-retro-dark mb-2">
              Product Name
            </label>

            <input
              required
              value={form.name}
              onChange={(e) =>
                updateField("name", e.target.value)
              }
              className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 outline-none focus:border-bubblegum"
            />
          </div>

          <div>
            <label className="block font-bold text-retro-dark mb-2">
              Tagline
            </label>

            <input
              required
              value={form.tagline}
              onChange={(e) =>
                updateField("tagline", e.target.value)
              }
              className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 outline-none focus:border-bubblegum"
            />
          </div>

          <div>
            <label className="block font-bold text-retro-dark mb-2">
              Description
            </label>

            <textarea
              required
              rows={7}
              value={form.description}
              onChange={(e) =>
                updateField("description", e.target.value)
              }
              className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 outline-none focus:border-bubblegum resize-y"
            />
          </div>

          <div className="grid sm:grid-cols-2 gap-5">
            <div>
              <label className="block font-bold text-retro-dark mb-2">
                Price
              </label>

              <div className="relative">
                <span className="absolute left-4 top-3 text-gray-500">
                  $
                </span>

                <input
                  required
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.price}
                  onChange={(e) =>
                    updateField("price", e.target.value)
                  }
                  className="w-full rounded-xl border-2 border-gray-200 pl-8 pr-4 py-3 outline-none focus:border-bubblegum"
                />
              </div>
            </div>

            <div>
              <label className="block font-bold text-retro-dark mb-2">
                Stock
              </label>

              <input
                required
                type="number"
                min="0"
                value={form.stockCount}
                onChange={(e) =>
                  updateField("stockCount", e.target.value)
                }
                className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 outline-none focus:border-bubblegum"
              />
            </div>
          </div>

          <div>
            <label className="block font-bold text-retro-dark mb-2">
              Category
            </label>

            <select
              required
              value={form.categoryId}
              onChange={(e) =>
                updateField("categoryId", e.target.value)
              }
              className="w-full rounded-xl border-2 border-gray-200 px-4 py-3 outline-none focus:border-bubblegum bg-white"
            >
              <option value="">Choose a category...</option>

              {categories.map((category) => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block font-bold text-retro-dark mb-2">
              Product Images
            </label>

            <label className="flex flex-col items-center justify-center w-full min-h-48 rounded-2xl border-2 border-dashed border-gray-300 hover:border-bubblegum cursor-pointer bg-gray-50 transition-colors">
              <div className="text-center p-8">
                <div className="text-4xl mb-3">📸</div>

                <p className="font-bold text-retro-dark">
                  Add more images
                </p>

                <p className="text-sm text-gray-500 mt-1">
                  Select one or more image files.
                </p>
              </div>

              <input
                type="file"
                accept="image/*"
                multiple
                onChange={handleImageUpload}
                disabled={uploading}
                className="hidden"
              />
            </label>

            {uploading && (
              <p className="text-sm font-bold text-gray-600 mt-2">
                Uploading images...
              </p>
            )}

            {imagePreviews.length > 0 && (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mt-4">
                {imagePreviews.map((preview, index) => (
                  <div
                    key={`${preview}-${index}`}
                    className="relative rounded-xl border-2 border-gray-200 bg-gray-50 overflow-hidden"
                  >
                    <img
                      src={preview}
                      alt={`Product preview ${index + 1}`}
                      className="w-full aspect-square object-contain p-2"
                    />

                    {index === 0 && (
                      <div className="absolute top-2 left-2 rounded-full bg-white px-2 py-1 text-xs font-bold text-retro-dark shadow">
                        Main image
                      </div>
                    )}

                    <div className="absolute bottom-2 left-2 right-2 flex justify-between gap-2">
                      <div className="flex gap-1">
                        <button
                          type="button"
                          onClick={() =>
                            moveImage(index, "up")
                          }
                          disabled={index === 0}
                          className="rounded-lg bg-white px-3 py-2 text-sm font-bold shadow disabled:opacity-30"
                          aria-label="Move image left"
                        >
                          ←
                        </button>

                        <button
                          type="button"
                          onClick={() =>
                            moveImage(index, "down")
                          }
                          disabled={
                            index === imagePreviews.length - 1
                          }
                          className="rounded-lg bg-white px-3 py-2 text-sm font-bold shadow disabled:opacity-30"
                          aria-label="Move image right"
                        >
                          →
                        </button>
                      </div>

                      <button
                        type="button"
                        onClick={() => removeImage(index)}
                        className="rounded-lg bg-white px-3 py-2 text-sm font-bold text-red-600 shadow hover:bg-red-50"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {form.images.length > 0 && !uploading && (
              <p className="text-sm text-green-700 font-bold mt-2">
                ✓ {form.images.length}{" "}
                {form.images.length === 1
                  ? "image"
                  : "images"}{" "}
                saved
              </p>
            )}
          </div>

          <div className="flex flex-wrap gap-6 pt-2">
            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(e) =>
                  updateField("featured", e.target.checked)
                }
                className="w-5 h-5"
              />

              <span className="font-bold">Featured</span>
            </label>

            <label className="flex items-center gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={form.bestSeller}
                onChange={(e) =>
                  updateField("bestSeller", e.target.checked)
                }
                className="w-5 h-5"
              />

              <span className="font-bold">Best Seller</span>
            </label>
          </div>

          {error && (
            <div className="rounded-xl bg-red-50 text-red-700 px-4 py-3">
              {error}
            </div>
          )}

          <button
            type="submit"
            disabled={saving || uploading}
            className="w-full rounded-xl bg-grape text-white font-bold py-4 hover:opacity-90 disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>

          <button
            type="button"
            onClick={handleDelete}
            disabled={saving || uploading}
            className="w-full rounded-xl border border-red-300 text-red-600 font-bold py-3 hover:bg-red-50 disabled:opacity-50"
          >
            Delete Product
          </button>

        </form>
      </div>
    </main>
  );
}
