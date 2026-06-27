import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const categoryId = searchParams.get("catagory_id");
  try {
    if (categoryId) {
      const result = await prisma.categories.findUnique({
        where: {
          catagory_id: Number(categoryId),
        },
      });

      if (!result) {
        return NextResponse.json(
          { message: "No catagory found" },
          { status: 409 },
        );
      }

      return NextResponse.json({ result });
    }

    const result = await prisma.categories.findMany();

    if (!result) {
      return NextResponse.json(
        { message: "Failed to find any catagory" },
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
  const { catagory_name } = body;
  try {
    if (!catagory_name) {
      return NextResponse.json(
        { message: "Catagory name is required" },
        { status: 422 },
      );
    }

    const catagoryName = await prisma.categories.findFirst({
      where: { catagory_name },
    });
    if (catagoryName) {
      return NextResponse.json(
        { message: "Catagory name already exist." },
        { status: 409 },
      );
    }

    const result = await prisma.categories.create({
      data: {
        catagory_name,
      },
    });

    if (!result) {
      return NextResponse.json(
        { message: "Failed to add a catagory" },
        { status: 500 },
      );
    }

    return NextResponse.json(
      { result, message: "Category added" },
      { status: 201 },
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  const { searchParams } = new URL(req.url);
  const categoryId = searchParams.get("catagory_id");

  const body = await req.json();
  const { catagory_name } = body;
  try {
    if (!categoryId) {
      return NextResponse.json(
        { message: "Catagory id is required" },
        { status: 422 },
      );
    }

    const catagory = await prisma.categories.findUnique({
      where: {
        catagory_id: Number(categoryId),
      },
    });

    if (!catagory) {
      return NextResponse.json(
        { message: "No catagory found" },
        { status: 409 },
      );
    }

    const result = await prisma.categories.update({
      where: {
        catagory_id: Number(categoryId),
      },
      data: {
        catagory_name,
      },
    });

    return NextResponse.json(
      { result, message: "Category edited" },
      { status: 200 },
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const body = await req.json();
  const { catagory_ids } = body;

  try {
    if (!Array.isArray(catagory_ids) || catagory_ids.length === 0) {
      return NextResponse.json(
        { message: "Category IDs are required" },
        { status: 422 },
      );
    }

    const result = await prisma.categories.deleteMany({
      where: {
        catagory_id: {
          in: catagory_ids.map(Number),
        },
      },
    });

    return NextResponse.json(
      {
        result,
        message: `${result.count} categor${result.count === 1 ? "y" : "ies"} deleted`,
      },
      { status: 200 },
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
