import { NextResponse } from "next/server";

export async function POST() {
  try {
    const response = NextResponse.json({
      message: "Logged out successfully",
    });

    response.cookies.delete("access_token");
    response.cookies.delete("refresh_token");

    return response;
  } catch (error) {
    const message = error instanceof Error ? error.message : "Logout failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
