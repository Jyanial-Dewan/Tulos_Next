import { prisma } from "@/lib/db";
import { hashPassword } from "@/utility/util";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();
  const { username, user_type, email, phone, first_name, last_name, password } =
    body;
  try {
    if (!username || !user_type) {
      return NextResponse.json(
        { message: "User name, User type is Required" },
        { status: 422 },
      );
    }

    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password are required" },
        { status: 400 },
      );
    }

    const userName = await prisma.users.findFirst({
      where: { username },
    });
    if (userName) {
      return NextResponse.json(
        { message: "User Name already exist." },
        { status: 409 },
      );
    }

    const isEmailExist = await prisma.users.findFirst({
      where: { email },
    });
    if (isEmailExist) {
      return NextResponse.json(
        { message: "Email already exist." },
        { status: 409 },
      );
    }

    const result = await prisma.users.create({
      data: {
        username,
        user_type,
        email,
        phone,
        first_name,
        last_name,
      },
    });

    if (!result) {
      return NextResponse.json(
        { message: "Failed to create user" },
        { status: 500 },
      );
    }

    const newCredential = await prisma.credentials.create({
      data: {
        user_id: result.user_id,
        password: hashPassword(password),
      },
    });

    if (!newCredential) {
      return NextResponse.json(
        { message: "Failed to create credentials" },
        { status: 500 },
      );
    }

    return NextResponse.json(result, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

// GET /api/users - Get current user
// export async function GET(req: Request) {
//   const authHeader = req.headers.get("authorization");
//   if (!authHeader?.startsWith("Bearer ")) {
//     return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
//   }

//   return NextResponse.json({
//     id: crypto.randomUUID(),
//     name: "Demo User",
//     email: "demo@example.com",
//   });
// }

// export async function PATCH(req: Request) {
//   const body = await req.json();
//   return NextResponse.json({
//     id: crypto.randomUUID(),
//     name: body.name ?? "Demo User",
//     email: body.email ?? "demo@example.com",
//   });
// }
