"use client";

import { useState } from "react";

interface ProductGalleryProps {
  images: string[];
  name: string;
  bestSeller?: boolean;
  discount?: number;
}

export function ProductGallery({
  images,
  name,
  bestSeller,
  discount = 0,
}: ProductGalleryProps) {
  const [selectedImage, setSelectedImage] = useState(0);

  const galleryImages = images.length > 0 ? images : ["/images/placeholder.jpg"];

  return (
    <div className="relative">
      <div className="bg-white rounded-3xl overflow-hidden shadow-xl border-4 border-transparent hover:border-bubblegum transition-colors animate-rainbow-border">
        <img
          src={galleryImages[selectedImage]}
          alt={name}
          className="w-full h-[400px] md:h-[500px] object-cover"
        />
      </div>

      {galleryImages.length > 1 && (
        <div className="flex gap-3 mt-4 overflow-x-auto pb-2">
          {galleryImages.map((image, index) => (
            <button
              key={image}
              type="button"
              onClick={() => setSelectedImage(index)}
              className={`flex-shrink-0 w-20 h-20 rounded-xl overflow-hidden border-2 transition-all ${
                selectedImage === index
                  ? "border-bubblegum scale-105"
                  : "border-gray-200 hover:border-bubblegum/50"
              }`}
              aria-label={`View image ${index + 1} of ${galleryImages.length}`}
            >
              <img
                src={image}
                alt={`${name} view ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}

      <div className="absolute top-4 left-4 flex flex-col gap-2">
        {bestSeller && (
          <span className="bg-gradient-to-r from-sunshine to-coral text-retro-dark text-sm font-bold px-4 py-1.5 rounded-full shadow-lg">
            🔥 Best Seller
          </span>
        )}
        {discount > 0 && (
          <span className="sale-badge bg-gradient-to-r from-bubblegum to-grape text-white text-sm font-bold px-4 py-1.5 rounded-full shadow-lg">
            💥 Save {discount}%!
          </span>
        )}
      </div>
    </div>
  );
}
