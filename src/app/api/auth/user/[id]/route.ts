import { prisma } from "@/lib/db";
import { setTokenCookies, verifyAuth } from "@/lib/auth";
import { NextRequest, NextResponse } from "next/server";

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> },
) {
  const auth = await verifyAuth(req);

  if (!auth.authorized) {
    return NextResponse.json({ message: "Please login." }, { status: 401 });
  }

  try {
    const { id } = await params;
    const user_id = Number(id);

    if (!user_id || isNaN(user_id)) {
      return NextResponse.json(
        { message: "Valid User ID is required" },
        { status: 422 },
      );
    }

    const userRecord = await prisma.users.findUnique({
      where: { user_id },
    });

    if (!userRecord) {
      return NextResponse.json(
        { message: "User not found" },
        { status: 404 },
      );
    }

    const response = NextResponse.json({
      user_id: userRecord.user_id,
      username: userRecord.username,
      user_type: userRecord.user_type,
      email: userRecord.email,
      phone: userRecord.phone,
      first_name: userRecord.first_name,
      last_name: userRecord.last_name,
      created_at: userRecord.created_at,
    });

    if (auth.isRefreshed) {
      setTokenCookies(response, auth.access_token, auth.refresh_token);
    }

    return response;
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Failed to fetch user";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
