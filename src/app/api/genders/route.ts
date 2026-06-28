import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const genderId = searchParams.get("gender_id");
  try {
    if (genderId) {
      const result = await prisma.genders.findUnique({
        where: {
          gender_id: Number(genderId),
        },
      });

      if (!result) {
        return NextResponse.json(
          { message: "No gender found" },
          { status: 409 },
        );
      }

      return NextResponse.json({ result });
    }

    const result = await prisma.genders.findMany();

    if (!result) {
      return NextResponse.json(
        { message: "Failed to find any gender" },
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
  const { gender_name } = body;
  try {
    if (!gender_name) {
      return NextResponse.json(
        { message: "Gender name is required" },
        { status: 422 },
      );
    }

    const genderName = await prisma.genders.findFirst({
      where: { gender_name },
    });
    if (genderName) {
      return NextResponse.json(
        { message: "Gender name already exist." },
        { status: 409 },
      );
    }

    const result = await prisma.genders.create({
      data: {
        gender_name,
      },
    });

    if (!result) {
      return NextResponse.json(
        { message: "Failed to add a gender" },
        { status: 500 },
      );
    }

    return NextResponse.json(
      { result, message: "Gender added" },
      { status: 201 },
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  const { searchParams } = new URL(req.url);
  const genderId = searchParams.get("gender_id");

  const body = await req.json();
  const { gender_name } = body;
  try {
    if (!genderId) {
      return NextResponse.json(
        { message: "Gender id is required" },
        { status: 422 },
      );
    }

    const gender = await prisma.genders.findUnique({
      where: {
        gender_id: Number(genderId),
      },
    });

    if (!gender) {
      return NextResponse.json({ message: "No gender found" }, { status: 409 });
    }

    const result = await prisma.genders.update({
      where: {
        gender_id: Number(genderId),
      },
      data: {
        gender_name,
      },
    });

    return NextResponse.json(
      { result, message: "Gender edited" },
      { status: 200 },
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const body = await req.json();
  const { gender_ids } = body;

  try {
    if (!Array.isArray(gender_ids) || gender_ids.length === 0) {
      return NextResponse.json(
        { message: "Gender ids are required" },
        { status: 422 },
      );
    }

    const result = await prisma.genders.deleteMany({
      where: {
        gender_id: {
          in: gender_ids.map(Number),
        },
      },
    });

    return NextResponse.json(
      {
        result,
        message: `${result.count} gender${result.count === 1 ? "" : "s"} deleted`,
      },
      { status: 200 },
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
