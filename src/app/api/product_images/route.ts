import { prisma } from "@/lib/db";
import { NextRequest, NextResponse } from "next/server";
import sharp from "sharp";
import path from "path";
import crypto from "crypto";
import { mkdir, unlink, writeFile } from "fs/promises";

const MAX_SIZE = 1 * 1024 * 1024; // 1MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp"];
const MAX_IMAGES_PER_PRODUCT = 3;

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
      where: { product_id: Number(productId) },
    });

    if (!result) {
      return NextResponse.json({ message: "No tags found" }, { status: 409 });
    }

    return NextResponse.json({ result });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const { searchParams } = new URL(req.url);
  const productId = searchParams.get("product_id");

  const writtenFilePaths: string[] = [];

  try {
    if (!productId || Number.isNaN(Number(productId))) {
      return NextResponse.json(
        { message: "Invalid product id" },
        { status: 400 },
      );
    }

    const productIdNum = Number(productId);

    const product = await prisma.products.findUnique({
      where: { product_id: productIdNum },
    });
    if (!product) {
      return NextResponse.json(
        { message: "Product not found" },
        { status: 404 },
      );
    }

    const formData = await req.formData();
    const files = formData
      .getAll("image")
      .filter((f): f is File => f instanceof File);

    if (files.length === 0) {
      return NextResponse.json(
        { message: "No images provided" },
        { status: 400 },
      );
    }

    if (files.length > MAX_IMAGES_PER_PRODUCT) {
      return NextResponse.json(
        {
          message: `You can upload at most ${MAX_IMAGES_PER_PRODUCT} images at once`,
        },
        { status: 400 },
      );
    }

    // Fail fast: check current count BEFORE doing any validation/disk work.
    // This covers both "create" (count = 0) and "update" (count > 0) —
    // there's no separate code path for either case.
    const existingCount = await prisma.product_images.count({
      where: { product_id: productIdNum },
    });

    const remainingSlots = MAX_IMAGES_PER_PRODUCT - existingCount;

    if (remainingSlots <= 0) {
      return NextResponse.json(
        {
          message: `This product already has the maximum of ${MAX_IMAGES_PER_PRODUCT} images. Delete one before adding more.`,
        },
        { status: 409 },
      );
    }

    if (files.length > remainingSlots) {
      return NextResponse.json(
        {
          message: `This product has ${existingCount} image(s) already. You can only add ${remainingSlots} more (max ${MAX_IMAGES_PER_PRODUCT} total).`,
        },
        { status: 409 },
      );
    }

    // Validate every file up front before writing anything to disk
    const validatedFiles: { buffer: Buffer; ext: string }[] = [];

    for (const file of files) {
      if (!ALLOWED_TYPES.includes(file.type)) {
        return NextResponse.json(
          {
            message: `"${file.name}" is not a valid type. Only JPEG, PNG, and WEBP are allowed`,
          },
          { status: 400 },
        );
      }

      if (file.size > MAX_SIZE) {
        return NextResponse.json(
          { message: `"${file.name}" exceeds 1MB` },
          { status: 400 },
        );
      }

      const buffer = Buffer.from(await file.arrayBuffer());

      const { width, height } = await sharp(buffer).metadata();
      if (!width || !height) {
        return NextResponse.json(
          { message: `Could not read dimensions for "${file.name}"` },
          { status: 400 },
        );
      }

      const ext =
        file.type === "image/png"
          ? "png"
          : file.type === "image/webp"
            ? "webp"
            : "jpg";

      validatedFiles.push({ buffer, ext });
    }

    // Re-check the count inside a transaction to close the race-condition
    // window between the earlier count check and now (e.g. two concurrent
    // requests both passing the initial check).
    const uploadDir = path.join(process.cwd(), "public", "uploads", "products");
    await mkdir(uploadDir, { recursive: true });

    try {
      const result = await prisma.$transaction(async (tx) => {
        const currentCount = await tx.product_images.count({
          where: { product_id: productIdNum },
        });

        if (currentCount + validatedFiles.length > MAX_IMAGES_PER_PRODUCT) {
          throw new Error("LIMIT_REACHED");
        }

        const created = [];
        for (const { buffer, ext } of validatedFiles) {
          const fileName = `${crypto.randomUUID()}.${ext}`;
          const filePath = path.join(uploadDir, fileName);
          await writeFile(filePath, buffer);
          writtenFilePaths.push(filePath);

          const image_url = `/uploads/products/${fileName}`;
          const image = await tx.product_images.create({
            data: { product_id: productIdNum, image_url },
          });
          created.push(image);
        }
        return created;
      });

      return NextResponse.json(
        { result, message: "Images added" },
        { status: 201 },
      );
    } catch (txErr: any) {
      await Promise.all(writtenFilePaths.map((p) => unlink(p).catch(() => {})));

      if (txErr.message === "LIMIT_REACHED") {
        return NextResponse.json(
          {
            message: `A product can have at most ${MAX_IMAGES_PER_PRODUCT} images total`,
          },
          { status: 409 },
        );
      }
      throw txErr;
    }
  } catch (err) {
    await Promise.all(writtenFilePaths.map((p) => unlink(p).catch(() => {})));
    console.error(err);
    return NextResponse.json(
      { message: "Something went wrong" },
      { status: 500 },
    );
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const imageId = searchParams.get("image_id");
    const productId = searchParams.get("product_id");

    if (!imageId || Number.isNaN(Number(imageId))) {
      return NextResponse.json(
        { message: "Invalid image id" },
        { status: 400 },
      );
    }

    if (!productId || Number.isNaN(Number(productId))) {
      return NextResponse.json(
        { message: "Invalid product id" },
        { status: 400 },
      );
    }

    const imageIdNum = Number(imageId);
    const productIdNum = Number(productId);

    // Scope the lookup to the product, not just the image_id.
    // This guards against a user (or a bug in your frontend) deleting
    // an image that belongs to a different product than the one they're editing.
    const image = await prisma.product_images.findFirst({
      where: { image_id: imageIdNum, product_id: productIdNum },
    });

    if (!image) {
      return NextResponse.json(
        { message: "Image not found for this product" },
        { status: 404 },
      );
    }

    await prisma.product_images.delete({ where: { image_id: imageIdNum } });

    const filePath = path.join(process.cwd(), "public", image.image_url);
    try {
      await unlink(filePath);
    } catch (fileErr: any) {
      console.error(`Failed to delete file at ${filePath}:`, fileErr.message);
    }

    return NextResponse.json({
      success: true,
      image_id: imageIdNum,
      message: "Image deleted",
    });
  } catch (err) {
    return NextResponse.json({ message: `${err}` }, { status: 500 });
  }
}
