import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const userId = searchParams.get("user_id");

  try {
    const user = await prisma.users.findUnique({
      where: {
        user_id: Number(userId),
      },
    });

    if (!user) {
      return NextResponse.json({ message: "No user found" }, { status: 404 });
    }

    // Get all cart items
    const result = await prisma.cart_items_view.findMany({
      where: {
        user_id: Number(userId),
      },
      orderBy: {
        added_at: "desc",
      },
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
  const { user_id, variant_id, quantity } = body;
  try {
    if (!user_id || !variant_id || !quantity) {
      return NextResponse.json(
        { message: "User, variant and quantity required" },
        { status: 422 },
      );
    }

    const result = await prisma.cart_items.create({
      data: {
        user_id: Number(user_id),
        variant_id: Number(variant_id),
        quantity: Number(quantity),
      },
    });

    if (!result) {
      return NextResponse.json(
        { message: "Failed to add to cart" },
        { status: 500 },
      );
    }

    return NextResponse.json(
      { result, message: "Item added to cart" },
      { status: 201 },
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req: Request) {
  const { searchParams } = new URL(req.url);

  const itemId = searchParams.get("cart_item_id");
  const body = await req.json();
  const { quantity } = body;
  try {
    if (!quantity) {
      return NextResponse.json(
        { message: "Quantity required" },
        { status: 422 },
      );
    }

    const item = await prisma.cart_items.findUnique({
      where: {
        cart_item_id: Number(itemId),
      },
    });

    if (!item) {
      return NextResponse.json({ message: "No item found" }, { status: 404 });
    }

    const result = await prisma.cart_items.update({
      where: {
        cart_item_id: Number(itemId),
      },
      data: {
        quantity: Number(quantity),
      },
    });

    if (!result) {
      return NextResponse.json(
        { message: "Failed to update to cart" },
        { status: 500 },
      );
    }

    return NextResponse.json(
      { result, message: "Item updated" },
      { status: 200 },
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req: Request) {
  const { searchParams } = new URL(req.url);
  const itemId = searchParams.get("cart_item_id");

  try {
    if (!itemId) {
      return NextResponse.json(
        { message: "Cart item id is required" },
        { status: 422 },
      );
    }

    const result = await prisma.cart_items.delete({
      where: {
        cart_item_id: Number(itemId),
      },
    });

    return NextResponse.json(
      {
        result,
        message: `Item deleted`,
      },
      { status: 200 },
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
