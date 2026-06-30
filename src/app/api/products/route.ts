import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const productId = searchParams.get("product_id");
  try {
    if (productId) {
      const result = await prisma.products.findUnique({
        where: {
          product_id: Number(productId),
        },
      });

      if (!result) {
        return NextResponse.json(
          { message: "No product found" },
          { status: 409 },
        );
      }

      return NextResponse.json({ result });
    }

    const result = await prisma.products.findMany();

    if (!result) {
      return NextResponse.json(
        { message: "Failed to find any product" },
        { status: 500 },
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
    product_name,
    description,
    catagory_id,
    brand_id,
    collection_id,
    gender_id,
    availability_id,
    tag_ids,
  } = body;
  try {
    if (!product_name || !catagory_id || !availability_id) {
      return NextResponse.json(
        { message: "Product name, category and availability are required" },
        { status: 422 },
      );
    }

    const productName = await prisma.products.findFirst({
      where: { product_name },
    });
    if (productName) {
      return NextResponse.json(
        { message: "Product Name already exist." },
        { status: 409 },
      );
    }

    const result = await prisma.products.create({
      data: {
        product_name,
        description,
        catagory_id: Number(catagory_id),
        brand_id: Number(brand_id),
        collection_id: Number(collection_id),
        gender_id: Number(gender_id),
        availability_id: Number(availability_id),
      },
    });

    if (!result) {
      return NextResponse.json(
        { message: "Failed to add product" },
        { status: 500 },
      );
    }

    if (result) {
      for (const tag of tag_ids) {
        await prisma.product_tags.create({
          data: {
            product_id: result.product_id,
            tag_id: Number(tag),
          },
        });
      }
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
  const {
    product_name,
    description,
    catagory_id,
    brand_id,
    collection_id,
    gender_id,
    availability_id,
  } = body;
  try {
    if (!productId) {
      return NextResponse.json(
        { message: "Product id is required" },
        { status: 422 },
      );
    }

    const product = await prisma.products.findUnique({
      where: {
        product_id: Number(productId),
      },
    });

    if (!product) {
      return NextResponse.json(
        { message: "No product found" },
        { status: 409 },
      );
    }

    const productName = await prisma.products.findFirst({
      where: { product_name },
    });
    if (productName) {
      return NextResponse.json(
        { message: "Product Name already exist." },
        { status: 409 },
      );
    }

    const result = await prisma.products.update({
      where: {
        product_id: Number(productId),
      },
      data: {
        product_name,
        description,
        catagory_id: Number(catagory_id),
        brand_id: Number(brand_id),
        collection_id: Number(collection_id),
        gender_id: Number(gender_id),
        availability_id: Number(availability_id),
      },
    });

    return NextResponse.json(
      { result, message: "Product edited" },
      { status: 200 },
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
