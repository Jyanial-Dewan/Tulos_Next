import { NextResponse } from "next/server";
import { NextRequestWithUser, setTokenCookies, verifyAuth } from "@/lib/auth";

export async function GET(req: NextRequestWithUser) {
  const auth = await verifyAuth(req);

  if (!auth.authorized) {
    return NextResponse.json({ message: "Please login." }, { status: 401 });
  }

  const response = NextResponse.json({
    isLoggedIn: true,
    user_id: req.user!.user_id,
    user_type: req.user!.user_type,
    access_token: auth.access_token,
    refresh_token: auth.refresh_token,
    issuedAt: new Date(),
    ...(auth.isRefreshed && {
      message:
        "Access token expired. Since the refresh token is still valid, new access token and refresh token have been generated.",
    }),
  });

  if (auth.isRefreshed) {
    setTokenCookies(response, auth.access_token, auth.refresh_token);
  }

  return response;
}

