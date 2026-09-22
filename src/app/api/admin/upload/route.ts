import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/auth";
import { put } from "@vercel/blob";

export async function POST(request: NextRequest) {
    const session = await auth();

  if (!session?.user) {
    return NextResponse.json(
      { error: "Unauthorized." },
      { status: 401 }
    );
  }
  try {
    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json(
        { error: "No image file provided." },
        { status: 400 }
      );
    }

    if (file.size > 10 * 1024 * 1024) {
  return NextResponse.json(
    { error: "Image must be 10MB or smaller." },
    { status: 400 }
  );
}

    const allowedTypes = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "image/gif",
];

if (!allowedTypes.includes(file.type)) {
  return NextResponse.json(
    { error: "Please upload a JPG, PNG, WEBP, or GIF image." },
    { status: 400 }
  );
}

    const extension = file.name.split(".").pop()?.toLowerCase() || "jpg";
const filename = `products/${crypto.randomUUID()}.${extension}`;

const blob = await put(filename, file, {
  access: "public",
});

    return NextResponse.json({ url: blob.url });
  } catch (error) {
    console.error("Image upload error:", error);

    return NextResponse.json(
      { error: "Could not upload image." },
      { status: 500 }
    );
  }
}
