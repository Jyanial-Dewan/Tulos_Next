import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();
  const { email, password, action } = body;

  if (action === "register") {
    const { name } = body;
    if (!name || !email || !password) {
      return NextResponse.json(
        { message: "Name, email, and password are required" },
        { status: 400 },
      );
    }
    return NextResponse.json(
      {
        user: { id: crypto.randomUUID(), name, email },
        token: "mock-jwt-token",
      },
      { status: 201 },
    );
  }

  if (!email || !password) {
    return NextResponse.json(
      { message: "Email and password are required" },
      { status: 400 },
    );
  }

  return NextResponse.json({
    user: { id: crypto.randomUUID(), name: "Test User", email },
    token: "mock-jwt-token",
  });
}

export async function DELETE() {
  return NextResponse.json({ message: "Logged out" });
}
