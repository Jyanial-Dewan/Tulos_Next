import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const colorId = searchParams.get("color_id");
  try {
    if (colorId) {
      const result = await prisma.colors.findUnique({
        where: {
          color_id: Number(colorId),
        },
      });

      if (!result) {
        return NextResponse.json(
          { message: "No color found" },
          { status: 409 },
        );
      }

      return NextResponse.json({ result });
    }

    const result = await prisma.colors.findMany();

    if (!result) {
      return NextResponse.json(
        { message: "Failed to find any color" },
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
  const { color_name } = body;
  try {
    if (!color_name) {
      return NextResponse.json(
        { message: "Color name is required" },
        { status: 422 },
      );
    }

    const colorName = await prisma.colors.findFirst({
      where: { color_name },
    });
    if (colorName) {
      return NextResponse.json(
        { message: "Color name already exist." },
        { status: 409 },
      );
    }

    const result = await prisma.colors.create({
      data: {
        color_name,
      },
    });

    if (!result) {
      return NextResponse.json(
        { message: "Failed to add a color" },
        { status: 500 },
      );
    }

    return NextResponse.json(
      { result, message: "Color added" },
      { status: 201 },
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  const { searchParams } = new URL(req.url);
  const colorId = searchParams.get("color_id");

  const body = await req.json();
  const { color_name } = body;
  try {
    if (!colorId) {
      return NextResponse.json(
        { message: "Color id is required" },
        { status: 422 },
      );
    }

    const color = await prisma.colors.findUnique({
      where: {
        color_id: Number(colorId),
      },
    });

    if (!color) {
      return NextResponse.json({ message: "No color found" }, { status: 409 });
    }

    const result = await prisma.colors.update({
      where: {
        color_id: Number(colorId),
      },
      data: {
        color_name,
      },
    });

    return NextResponse.json(
      { result, message: "Color edited" },
      { status: 200 },
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const body = await req.json();
  const { color_ids } = body;

  try {
    if (!Array.isArray(color_ids) || color_ids.length === 0) {
      return NextResponse.json(
        { message: "Color ids are required" },
        { status: 422 },
      );
    }

    const result = await prisma.colors.deleteMany({
      where: {
        color_id: {
          in: color_ids.map(Number),
        },
      },
    });

    return NextResponse.json(
      {
        result,
        message: `${result.count} color${result.count === 1 ? "" : "s"} deleted`,
      },
      { status: 200 },
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
