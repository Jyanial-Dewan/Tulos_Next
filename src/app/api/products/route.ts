import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const productId = searchParams.get("product_id");
  const page = searchParams.get("page");
  const limit = searchParams.get("limit");
  const productName = searchParams.get("product_name");

  try {
    // Get a single product by ID
    if (productId) {
      const result = await prisma.products.findUnique({
        where: {
          product_id: Number(productId),
        },
      });

      if (!result) {
        return NextResponse.json(
          { message: "No product found" },
          { status: 404 },
        );
      }

      return NextResponse.json({ result });
    }

    // Build the where clause dynamically
    const where = {
      ...(productName && {
        product_name: {
          contains: productName,
          mode: "insensitive" as const,
        },
      }),
    };

    // Pagination
    if (page && limit) {
      const pageNumber = Number(page);
      const limitNumber = Number(limit);

      const total = await prisma.products.count({
        where,
      });

      const result = await prisma.products.findMany({
        where,
        skip: (pageNumber - 1) * limitNumber,
        take: limitNumber,
      });

      return NextResponse.json({
        result,
        page: pageNumber,
        limit: limitNumber,
        total,
        totalPages: Math.ceil(total / limitNumber),
      });
    }

    // Get all products (with optional search)
    const result = await prisma.products.findMany({
      where,
    });

    return NextResponse.json({ result });
  } catch (error: any) {
    return NextResponse.json(
      {
        error: error.message,
      },
      { status: 500 },
    );
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

export async function DELETE(req: Request) {
  const body = await req.json();
  const { product_ids } = body;

  try {
    if (!Array.isArray(product_ids) || product_ids.length === 0) {
      return NextResponse.json(
        { message: "Product ids are required" },
        { status: 422 },
      );
    }

    const result = await prisma.products.deleteMany({
      where: {
        product_id: {
          in: product_ids.map(Number),
        },
      },
    });

    return NextResponse.json(
      {
        result,
        message: `${result.count} product${result.count === 1 ? "" : "s"} deleted`,
      },
      { status: 200 },
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
