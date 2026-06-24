import { NextResponse } from "next/server";

export async function GET(req: Request) {
  const authHeader = req.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  return NextResponse.json({
    id: crypto.randomUUID(),
    name: "Demo User",
    email: "demo@example.com",
  });
}

export async function PATCH(req: Request) {
  const body = await req.json();
  return NextResponse.json({
    id: crypto.randomUUID(),
    name: body.name ?? "Demo User",
    email: body.email ?? "demo@example.com",
  });
}
