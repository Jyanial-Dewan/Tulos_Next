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

    return NextResponse.json({ result, message: "Product added" });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
