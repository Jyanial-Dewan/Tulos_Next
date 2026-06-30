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

    const result = await prisma.product_tags.findMany({
      where: {
        product_id: Number(productId),
      },
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
  const body = await req.json();
  const { product_id, tag_ids } = body;
  try {
    if (!product_id || !tag_ids) {
      return NextResponse.json(
        { message: "Product id and tags are required" },
        { status: 422 },
      );
    }

    const tags = [];

    for (const tag of tag_ids) {
      tags.push({
        product_id: Number(product_id),
        tag_id: Number(tag),
      });
    }

    const result = await prisma.product_tags.createMany({
      data: tags,
      skipDuplicates: true,
    });

    if (!result) {
      return NextResponse.json(
        { message: "Failed to product" },
        { status: 500 },
      );
    }

    return NextResponse.json(
      { result, message: "Product added" },
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

  const { tag_ids } = body;
  try {
    if (!productId) {
      return NextResponse.json(
        { message: "Product id is required." },
        { status: 422 },
      );
    }

    await prisma.$transaction(async (tx) => {
      // Get existing variants
      const existingTags = await tx.product_tags.findMany({
        where: {
          product_id: Number(productId),
        },
        select: {
          tag_id: true,
        },
      });

      const existingIds = existingTags.map((v) => v.tag_id);

      const incomingIds = tag_ids.filter((t: any) => t).map((tag: any) => tag);

      // Delete removed variants
      const deleteIds = existingIds.filter((id) => !incomingIds.includes(id));

      if (deleteIds.length > 0) {
        await tx.product_tags.deleteMany({
          where: {
            tag_id: {
              in: deleteIds,
            },
          },
        });
      }

      // Create new variants
      const newTags = tag_ids
        .filter((t: any) => !t)
        .map((tag: any) => ({
          product_id: Number(productId),
          tag_id: Number(tag),
        }));

      if (newTags.length > 0) {
        await tx.product_tags.createMany({
          data: newTags,
        });
      }
    });

    return NextResponse.json({
      success: true,
      message: "Tags updated.",
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
