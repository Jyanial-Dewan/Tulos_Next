import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const sizeId = searchParams.get("size_id");
  try {
    if (sizeId) {
      const result = await prisma.sizes.findUnique({
        where: {
          size_id: Number(sizeId),
        },
      });

      if (!result) {
        return NextResponse.json({ message: "No size found" }, { status: 409 });
      }

      return NextResponse.json({ result });
    }

    const result = await prisma.sizes.findMany();

    if (!result) {
      return NextResponse.json(
        { message: "Failed to find any size" },
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
  const { size_name, catagory_id } = body;
  try {
    if (!size_name || !catagory_id) {
      return NextResponse.json(
        { message: "Availability name and catergory id are required" },
        { status: 422 },
      );
    }

    const size = await prisma.sizes.findFirst({
      where: { size_name, catagory_id: Number(catagory_id) },
    });
    if (size) {
      return NextResponse.json(
        { message: "Size name already exist." },
        { status: 409 },
      );
    }

    const result = await prisma.sizes.create({
      data: {
        size_name,
        catagory_id: Number(catagory_id),
      },
    });

    if (!result) {
      return NextResponse.json(
        { message: "Failed to add a size" },
        { status: 500 },
      );
    }

    return NextResponse.json(
      { result, message: "Size added" },
      { status: 201 },
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  const { searchParams } = new URL(req.url);
  const sizeId = searchParams.get("size_id");

  const body = await req.json();
  const { size_name, catagory_id } = body;
  try {
    if (!sizeId) {
      return NextResponse.json(
        { message: "Size id is required" },
        { status: 422 },
      );
    }

    const size = await prisma.sizes.findFirst({
      where: { size_name, catagory_id: Number(catagory_id) },
    });

    if (!size) {
      return NextResponse.json({ message: "No size found" }, { status: 409 });
    }

    const sizeName = await prisma.sizes.findFirst({
      where: {
        size_name,
        catagory_id: Number(catagory_id),
        NOT: {
          size_id: Number(sizeId),
        },
      },
    });
    if (sizeName) {
      return NextResponse.json(
        { message: "Size name already exist." },
        { status: 409 },
      );
    }

    const result = await prisma.sizes.update({
      where: {
        size_id: Number(sizeId),
      },
      data: {
        size_name,
        catagory_id: Number(catagory_id),
      },
    });

    return NextResponse.json(
      { result, message: "Size edited" },
      { status: 200 },
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const body = await req.json();
  const { size_ids } = body;

  try {
    if (!Array.isArray(size_ids) || size_ids.length === 0) {
      return NextResponse.json(
        { message: "Size ids are required" },
        { status: 422 },
      );
    }

    const result = await prisma.sizes.deleteMany({
      where: {
        size_id: {
          in: size_ids.map(Number),
        },
      },
    });

    return NextResponse.json(
      {
        result,
        message: `${result.count} size${result.count === 1 ? "" : "s"} deleted`,
      },
      { status: 200 },
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
