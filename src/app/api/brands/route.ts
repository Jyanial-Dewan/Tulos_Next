import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const brandId = searchParams.get("brand_id");
  try {
    if (brandId) {
      const result = await prisma.brands.findUnique({
        where: {
          brand_id: Number(brandId),
        },
      });

      if (!result) {
        return NextResponse.json(
          { message: "No brand found" },
          { status: 409 },
        );
      }

      return NextResponse.json({ result });
    }

    const result = await prisma.brands.findMany();

    if (!result) {
      return NextResponse.json(
        { message: "Failed to find any brand" },
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
  const { brand_name } = body;
  try {
    if (!brand_name) {
      return NextResponse.json(
        { message: "Brand name is required" },
        { status: 422 },
      );
    }

    const brandName = await prisma.brands.findFirst({
      where: { brand_name },
    });
    if (brandName) {
      return NextResponse.json(
        { message: "Brand name already exist." },
        { status: 409 },
      );
    }

    const result = await prisma.brands.create({
      data: {
        brand_name,
      },
    });

    if (!result) {
      return NextResponse.json(
        { message: "Failed to add a brand" },
        { status: 500 },
      );
    }

    return NextResponse.json(
      { result, message: "Brand added" },
      { status: 201 },
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  const { searchParams } = new URL(req.url);
  const brandId = searchParams.get("brand_id");

  const body = await req.json();
  const { brand_name } = body;
  try {
    if (!brandId) {
      return NextResponse.json(
        { message: "Brand id is required" },
        { status: 422 },
      );
    }

    const brand = await prisma.brands.findUnique({
      where: {
        brand_id: Number(brandId),
      },
    });

    if (!brand) {
      return NextResponse.json({ message: "No brand found" }, { status: 409 });
    }

    const result = await prisma.brands.update({
      where: {
        brand_id: Number(brandId),
      },
      data: {
        brand_name,
      },
    });

    return NextResponse.json(
      { result, message: "Brand edited" },
      { status: 200 },
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const body = await req.json();
  const { brand_ids } = body;

  try {
    if (!Array.isArray(brand_ids) || brand_ids.length === 0) {
      return NextResponse.json(
        { message: "Brand ids are required" },
        { status: 422 },
      );
    }

    const result = await prisma.brands.deleteMany({
      where: {
        brand_id: {
          in: brand_ids.map(Number),
        },
      },
    });

    return NextResponse.json(
      {
        result,
        message: `${result.count} brand${result.count === 1 ? "" : "s"} deleted`,
      },
      { status: 200 },
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
