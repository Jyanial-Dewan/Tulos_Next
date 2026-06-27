import { NextRequest, NextResponse } from "next/server";
import { verifyAuth } from "@/lib/auth";

export async function POST(req: NextRequest) {
  const auth = await verifyAuth(req);

  if (!auth.authorized) {
    return NextResponse.json({ message: "Please login." }, { status: 401 });
  }

  const response = NextResponse.json({
    message: "Logged out successfully",
  });

  response.cookies.delete("access_token");
  response.cookies.delete("refresh_token");

  return response;
}
