import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const availabilityId = searchParams.get("availability_id");
  try {
    if (availabilityId) {
      const result = await prisma.availabilities.findUnique({
        where: {
          availability_id: Number(availabilityId),
        },
      });

      if (!result) {
        return NextResponse.json(
          { message: "No availability found" },
          { status: 409 },
        );
      }

      return NextResponse.json({ result });
    }

    const result = await prisma.availabilities.findMany();

    if (!result) {
      return NextResponse.json(
        { message: "Failed to find any availability" },
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
  const { availability_name } = body;
  try {
    if (!availability_name) {
      return NextResponse.json(
        { message: "Availability name is required" },
        { status: 422 },
      );
    }

    const availability = await prisma.availabilities.findFirst({
      where: { availability_name },
    });
    if (availability) {
      return NextResponse.json(
        { message: "Availability name already exist." },
        { status: 409 },
      );
    }

    const result = await prisma.availabilities.create({
      data: {
        availability_name,
      },
    });

    if (!result) {
      return NextResponse.json(
        { message: "Failed to add an availability" },
        { status: 500 },
      );
    }

    return NextResponse.json(
      { result, message: "Availability added" },
      { status: 201 },
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  const { searchParams } = new URL(req.url);
  const availabilityId = searchParams.get("availability_id");

  const body = await req.json();
  const { availability_name } = body;
  try {
    if (!availabilityId) {
      return NextResponse.json(
        { message: "Availability id is required" },
        { status: 422 },
      );
    }

    const availability = await prisma.availabilities.findUnique({
      where: {
        availability_id: Number(availabilityId),
      },
    });

    if (!availability) {
      return NextResponse.json(
        { message: "No availability found" },
        { status: 409 },
      );
    }

    const result = await prisma.availabilities.update({
      where: {
        availability_id: Number(availabilityId),
      },
      data: {
        availability_name,
      },
    });

    return NextResponse.json(
      { result, message: "Availability edited" },
      { status: 200 },
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const body = await req.json();
  const { availability_ids } = body;

  try {
    if (!Array.isArray(availability_ids) || availability_ids.length === 0) {
      return NextResponse.json(
        { message: "Availability ids are required" },
        { status: 422 },
      );
    }

    const result = await prisma.availabilities.deleteMany({
      where: {
        availability_id: {
          in: availability_ids.map(Number),
        },
      },
    });

    return NextResponse.json(
      {
        result,
        message: `${result.count} availability${result.count === 1 ? "" : "ies"} deleted`,
      },
      { status: 200 },
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
