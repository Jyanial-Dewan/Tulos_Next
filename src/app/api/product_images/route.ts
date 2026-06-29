import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const productId = searchParams.get("product_id");
  try {
    if (!productId) {
      return NextResponse.json(
        { message: "Product id is required." },
        { status: 422 },
      );
    }

    const result = await prisma.product_images.findMany({
      where: {
        product_id: Number(productId),
      },
    });

    if (!result) {
      return NextResponse.json({ message: "No images found" }, { status: 409 });
    }

    return NextResponse.json({ result });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const body = await req.json();
  const { product_id, image_urls } = body;
  try {
    if (!product_id || !image_urls) {
      return NextResponse.json(
        { message: "Product id and image url required" },
        { status: 422 },
      );
    }

    const urls = [];

    for (const url of image_urls) {
      urls.push({
        product_id: Number(product_id),
        image_url: url,
      });
    }

    const result = await prisma.product_images.createMany({
      data: urls,
      skipDuplicates: true,
    });

    if (!result) {
      return NextResponse.json(
        { message: "Failed to add image URLs" },
        { status: 500 },
      );
    }

    return NextResponse.json(
      { result, message: "Image URLs added" },
      { status: 201 },
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  const { searchParams } = new URL(req.url);
  const productId = searchParams.get("product_id");

  const body = await req.json();

  const { urls } = body;
  try {
    if (!productId) {
      return NextResponse.json(
        { message: "Product id is required." },
        { status: 422 },
      );
    }

    await prisma.$transaction(async (tx) => {
      // Get existing variants
      const existingImageUrls = await tx.product_images.findMany({
        where: {
          product_id: Number(productId),
        },
        select: {
          image_id: true,
        },
      });

      const existingIds = existingImageUrls.map((u) => u.image_id);

      const incomingIds = urls
        .filter((u: any) => u.image_id)
        .map((url: any) => url.image_id);

      // Delete removed variants
      const deleteIds = existingIds.filter((id) => !incomingIds.includes(id));

      if (deleteIds.length > 0) {
        await tx.product_images.deleteMany({
          where: {
            image_id: {
              in: deleteIds,
            },
          },
        });
      }

      // Create new variants
      const newUrls = urls
        .filter((u: any) => !u.image_id)
        .map((url: any) => ({
          product_id: Number(productId),
          image_url: url,
        }));

      if (newUrls.length > 0) {
        await tx.product_images.createMany({
          data: newUrls,
        });
      }
    });

    return NextResponse.json({
      success: true,
      message: "URLs updated.",
    });
  } catch (error: any) {
    console.error(error);

    return NextResponse.json(
      {
        success: false,
        message: error.message,
      },
      {
        status: 500,
      },
    );
  }
}
