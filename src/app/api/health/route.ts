import { NextResponse, type NextRequest } from "next/server";

export async function GET(req: NextRequest) {
  console.log("All cookies:", req.cookies.getAll());
  console.log("access_token:", req.cookies.get("access_token")?.value);
  console.log("refresh_token:", req.cookies.get("refresh_token")?.value);

  return NextResponse.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    coockies: req.cookies.getAll()
  });
}
