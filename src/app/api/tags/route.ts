import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const tagId = searchParams.get("tag_id");
  try {
    if (tagId) {
      const result = await prisma.tags.findUnique({
        where: {
          tag_id: Number(tagId),
        },
      });

      if (!result) {
        return NextResponse.json({ message: "No tag found" }, { status: 409 });
      }

      return NextResponse.json({ result });
    }

    const result = await prisma.tags.findMany();

    if (!result) {
      return NextResponse.json(
        { message: "Failed to find any tag" },
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
  const { tag_name } = body;
  try {
    if (!tag_name) {
      return NextResponse.json(
        { message: "Tag name is required" },
        { status: 422 },
      );
    }

    const tagName = await prisma.tags.findFirst({
      where: { tag_name },
    });
    if (tagName) {
      return NextResponse.json(
        { message: "Tag name already exist." },
        { status: 409 },
      );
    }

    const result = await prisma.tags.create({
      data: {
        tag_name,
      },
    });

    if (!result) {
      return NextResponse.json(
        { message: "Failed to add a tag" },
        { status: 500 },
      );
    }

    return NextResponse.json({ result, message: "Tag added" }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  const { searchParams } = new URL(req.url);
  const tagId = searchParams.get("tag_id");

  const body = await req.json();
  const { tag_name } = body;
  try {
    if (!tagId) {
      return NextResponse.json(
        { message: "Tag id is required" },
        { status: 422 },
      );
    }

    const tag = await prisma.tags.findUnique({
      where: {
        tag_id: Number(tagId),
      },
    });

    if (!tag) {
      return NextResponse.json({ message: "No tag found" }, { status: 409 });
    }

    const result = await prisma.tags.update({
      where: {
        tag_id: Number(tagId),
      },
      data: {
        tag_name,
      },
    });

    return NextResponse.json(
      { result, message: "Tag edited" },
      { status: 200 },
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const body = await req.json();
  const { tag_ids } = body;

  try {
    if (!Array.isArray(tag_ids) || tag_ids.length === 0) {
      return NextResponse.json(
        { message: "Tag ids are required" },
        { status: 422 },
      );
    }

    const result = await prisma.tags.deleteMany({
      where: {
        tag_id: {
          in: tag_ids.map(Number),
        },
      },
    });

    return NextResponse.json(
      {
        result,
        message: `${result.count} tag${result.count === 1 ? "" : "s"} deleted`,
      },
      { status: 200 },
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
