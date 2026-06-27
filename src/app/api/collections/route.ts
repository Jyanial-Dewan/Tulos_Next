import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const collectionId = searchParams.get("collection_id");
  try {
    if (collectionId) {
      const result = await prisma.collections.findUnique({
        where: {
          collection_id: Number(collectionId),
        },
      });

      if (!result) {
        return NextResponse.json(
          { message: "No collection found" },
          { status: 409 },
        );
      }

      return NextResponse.json({ result });
    }

    const result = await prisma.collections.findMany();

    if (!result) {
      return NextResponse.json(
        { message: "Failed to find any collection" },
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
  const { collection_name } = body;
  try {
    if (!collection_name) {
      return NextResponse.json(
        { message: "Collection name is required" },
        { status: 422 },
      );
    }

    const collectionName = await prisma.collections.findFirst({
      where: { collection_name },
    });
    if (collectionName) {
      return NextResponse.json(
        { message: "Collection name already exist." },
        { status: 409 },
      );
    }

    const result = await prisma.collections.create({
      data: {
        collection_name,
      },
    });

    if (!result) {
      return NextResponse.json(
        { message: "Failed to add a collection" },
        { status: 500 },
      );
    }

    return NextResponse.json(
      { result, message: "Collection added" },
      { status: 201 },
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  const { searchParams } = new URL(req.url);
  const collectionId = searchParams.get("collection_id");

  const body = await req.json();
  const { collection_name } = body;
  try {
    if (!collectionId) {
      return NextResponse.json(
        { message: "Collection id is required" },
        { status: 422 },
      );
    }

    const collection = await prisma.collections.findUnique({
      where: {
        collection_id: Number(collectionId),
      },
    });

    if (!collection) {
      return NextResponse.json(
        { message: "No collection found" },
        { status: 409 },
      );
    }

    const result = await prisma.collections.update({
      where: {
        collection_id: Number(collectionId),
      },
      data: {
        collection_name,
      },
    });

    return NextResponse.json(
      { result, message: "Collection edited" },
      { status: 200 },
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const body = await req.json();
  const { collection_ids } = body;

  try {
    if (!Array.isArray(collection_ids) || collection_ids.length === 0) {
      return NextResponse.json(
        { message: "Collection ids are required" },
        { status: 422 },
      );
    }

    const result = await prisma.collections.deleteMany({
      where: {
        collection_id: {
          in: collection_ids.map(Number),
        },
      },
    });

    return NextResponse.json(
      {
        result,
        message: `${result.count} collection${result.count === 1 ? "" : "s"} deleted`,
      },
      { status: 200 },
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
