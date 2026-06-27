import { prisma } from "@/lib/db";
import {
  ACCESS_TOKEN_EXPIRED_TIME,
  JWT_SECRET_ACCESS_TOKEN,
  JWT_SECRET_REFRESH_TOKEN,
  REFRESH_TOKEN_EXPIRED_TIME,
} from "@/variables/variables";
import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

function generateAccessTokenAndRefreshToken(props: object) {
  const accessToken = jwt.sign(props, JWT_SECRET_ACCESS_TOKEN!, {
    expiresIn: ACCESS_TOKEN_EXPIRED_TIME ?? "1h",
  } as jwt.SignOptions);
  const refreshToken = jwt.sign(props, JWT_SECRET_REFRESH_TOKEN!, {
    expiresIn: REFRESH_TOKEN_EXPIRED_TIME ?? "7d",
  } as jwt.SignOptions);
  return { accessToken, refreshToken };
}

export async function POST(req: NextRequest) {
  let refreshTokenValue =
    req.cookies.get("refresh_token")?.value ||
    req.headers.get("Authorization")?.replace("Bearer ", "");

  if (!refreshTokenValue) {
    const body = await req.json().catch(() => ({}));
    refreshTokenValue = body?.refresh_token;
  }

  if (!refreshTokenValue) {
    return NextResponse.json(
      { message: "No refresh token provided" },
      { status: 401 },
    );
  }

  try {
    const decoded = jwt.verify(
      refreshTokenValue,
      JWT_SECRET_REFRESH_TOKEN!,
    ) as jwt.JwtPayload;

    if (!decoded || !decoded.user_id) {
      return NextResponse.json(
        { message: "Forbidden: Invalid token" },
        { status: 403 },
      );
    }

    const userRecord = await prisma.users.findUnique({
      where: { user_id: decoded.user_id as number },
    });

    if (!userRecord) {
      return NextResponse.json(
        { message: "Invalid or expired refresh token" },
        { status: 401 },
      );
    }

    const { accessToken, refreshToken } = generateAccessTokenAndRefreshToken({
      isLoggedIn: true,
      user_id: decoded.user_id,
      sub: String(decoded.user_id),
    });

    const response = NextResponse.json(
      {
        isLoggedIn: true,
        user_id: decoded.user_id,
        access_token: accessToken,
        refresh_token: refreshToken,
      },
      { status: 200 },
    );

    response.cookies.set("refresh_token", refreshToken, {
      httpOnly: true,
      secure: true,
      path: "/",
    });
    response.cookies.set("access_token", accessToken, {
      httpOnly: true,
      secure: false,
      path: "/",
    });

    return response;
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      const response = NextResponse.json(
        { message: "Unauthorized Access: Token has expired" },
        { status: 401 },
      );
      response.cookies.delete("access_token");
      response.cookies.delete("refresh_token");
      return response;
    }
    if (error instanceof jwt.JsonWebTokenError) {
      return NextResponse.json(
        { message: "Forbidden: Invalid token" },
        { status: 403 },
      );
    }
    return NextResponse.json(
      { error: "Invalid or expired refresh token" },
      { status: 500 },
    );
  }
}
