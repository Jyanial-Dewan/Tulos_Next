import { prisma } from "@/lib/db";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);

  const orderId = searchParams.get("order_id");
  const pageParam = searchParams.get("page");
  const limitParam = searchParams.get("limit");
  const fromParam = searchParams.get("from");
  const toParam = searchParams.get("to");

  const page = pageParam ? parseInt(pageParam, 10) : 1;
  const limit = limitParam ? parseInt(limitParam, 10) : 20;

  const skip = (page - 1) * limit;

  try {
    // Get a single order by ID
    if (orderId) {
      const result = await prisma.order_view.findUnique({
        where: {
          order_id: Number(orderId),
        },
      });

      if (!result) {
        return NextResponse.json(
          { message: "No order found" },
          { status: 404 },
        );
      }

      return NextResponse.json({ result });
    }

    if (fromParam && toParam) {
      const from = new Date(fromParam);
      const to = new Date(toParam);

      if (isNaN(from.getTime()) || isNaN(to.getTime())) {
        return NextResponse.json(
          { error: "Invalid date format. Use YYYY-MM-DD." },
          { status: 400 },
        );
      }

      if (from > to) {
        return NextResponse.json(
          { error: '"from" date must be before "to" date' },
          { status: 400 },
        );
      }

      // Make "to" inclusive of the whole day
      const toEnd = new Date(to);
      toEnd.setHours(23, 59, 59, 999);

      const where = {
        created_at: {
          gte: from,
          lte: toEnd,
        },
      };

      const total = await prisma.order_view.count({
        where,
      });

      const result = await prisma.order_view.findMany({
        where,
        orderBy: { created_at: "desc" },
        skip,
        take: limit,
      });

      if (result) {
        return NextResponse.json({
          result,
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
        });
      }
    }

    const total = await prisma.order_view.count();

    const result = await prisma.order_view.findMany({
      orderBy: { created_at: "desc" },
      skip,
      take: limit,
    });

    if (result) {
      return NextResponse.json({
        result,
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      });
    }
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
    customer_id,
    total_amount,
    payment_status,
    payment_method,
    delivery_address,
    notes,
    order_items,
  } = body;
  try {
    if (
      !customer_id ||
      !total_amount ||
      !payment_method ||
      !delivery_address ||
      !order_items
    ) {
      return NextResponse.json(
        {
          message:
            "Customer id, total amount, payment status, payment method, delivery address and order items are required",
        },
        { status: 422 },
      );
    }

    const result = await prisma.orders.create({
      data: {
        customer_id: Number(customer_id),
        total_amount,
        payment_status,
        payment_method,
        delivery_address,
        notes,
      },
    });

    if (!result) {
      return NextResponse.json(
        { message: "Failed to register the order" },
        { status: 500 },
      );
    }

    if (result) {
      for (const item of order_items) {
        await prisma.order_items.create({
          data: {
            order_id: result.order_id,
            variant_id: Number(item.variant_id),
            quantity: Number(item.quantity),
          },
        });
      }
    }
    return NextResponse.json(
      { result, message: "Order received" },
      { status: 201 },
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
