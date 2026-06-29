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

    const result = await prisma.product_variants.findMany({
      where: {
        product_id: Number(productId),
      },
    });

    if (!result) {
      return NextResponse.json(
        { message: "No variants found" },
        { status: 409 },
      );
    }

    return NextResponse.json({ result });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  const body = await req.json();
  const {
    product_id,
    colors,
    sizes,
    price,
    compare_at_price,
    cost_price,
    stock,
    weight,
  } = body;
  try {
    if (!product_id || !colors || !sizes) {
      return NextResponse.json(
        { message: "Product id, colors and sizes are required" },
        { status: 422 },
      );
    }
    const variants = [];

    for (const color_id of colors) {
      for (const size_id of sizes) {
        variants.push({
          product_id: Number(product_id),
          color_id: Number(color_id),
          size_id: Number(size_id),
          sku: `${product_id}_${color_id}_${size_id}`,
          barcode: null,
          price,
          compare_at_price,
          cost_price,
          stock,
          weight,
        });
      }
    }

    const result = await prisma.product_variants.createMany({
      data: variants,
      skipDuplicates: true,
    });

    if (!result) {
      return NextResponse.json(
        { message: "Failed to add variants" },
        { status: 500 },
      );
    }

    return NextResponse.json(
      { result, message: "Variants added" },
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

  const { variants } = body;
  try {
    if (!productId) {
      return NextResponse.json(
        { message: "Product id is required." },
        { status: 422 },
      );
    }

    await prisma.$transaction(async (tx) => {
      // Get existing variants
      const existingVariants = await tx.product_variants.findMany({
        where: {
          product_id: Number(productId),
        },
        select: {
          variant_id: true,
        },
      });

      const existingIds = existingVariants.map((v) => v.variant_id);

      const incomingIds = variants
        .filter((v: any) => v.variant_id)
        .map((v: any) => v.variant_id);

      // Delete removed variants
      const deleteIds = existingIds.filter((id) => !incomingIds.includes(id));

      if (deleteIds.length > 0) {
        await tx.product_variants.deleteMany({
          where: {
            variant_id: {
              in: deleteIds,
            },
          },
        });
      }

      // Update existing variants
      await Promise.all(
        variants
          .filter((v: any) => v.variant_id)
          .map((variant: any) =>
            tx.product_variants.update({
              where: {
                variant_id: variant.variant_id,
              },
              data: {
                color_id: variant.color_id,
                size_id: variant.size_id,
                sku: variant.sku,
                barcode: variant.barcode,
                price: variant.price,
                compare_at_price: variant.compare_at_price,
                cost_price: variant.cost_price,
                stock: variant.stock,
                weight: variant.weight,
              },
            }),
          ),
      );

      // Create new variants
      const newVariants = variants
        .filter((v: any) => !v.variant_id)
        .map((variant: any) => ({
          product_id: Number(productId),
          color_id: variant.color_id,
          size_id: variant.size_id,
          sku: variant.sku,
          barcode: variant.barcode,
          price: variant.price,
          compare_at_price: variant.compare_at_price,
          cost_price: variant.cost_price,
          stock: variant.stock,
          weight: variant.weight,
        }));

      if (newVariants.length > 0) {
        await tx.product_variants.createMany({
          data: newVariants,
        });
      }
    });

    return NextResponse.json({
      success: true,
      message: "Variants updated.",
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
