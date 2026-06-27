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

export async function GET(req: NextRequest) {
  const access_token = req.cookies.get("access_token")?.value as string;
  const refresh_token = req.cookies.get("refresh_token")?.value as string;

  try {
    const verifiedData = jwt.verify(
      access_token,
      JWT_SECRET_ACCESS_TOKEN!,
    ) as jwt.JwtPayload;

    return NextResponse.json({
      ...verifiedData,
      access_token,
      refresh_token,
    });
  } catch (error) {
    // Access token expired — try auto-refresh using refresh token
    if (error instanceof jwt.TokenExpiredError && refresh_token) {
      try {
        const decodedRefresh = jwt.verify(
          refresh_token,
          JWT_SECRET_REFRESH_TOKEN!,
        ) as jwt.JwtPayload;

        if (decodedRefresh && decodedRefresh.user_id) {
          const userRecord = await prisma.users.findUnique({
            where: { user_id: decodedRefresh.user_id as number },
          });

          if (userRecord) {
            const userType = typeof decodedRefresh.user_type === "string"
              ? decodedRefresh.user_type
              : "";

            const { accessToken, refreshToken } =
              generateAccessTokenAndRefreshToken({
                isLoggedIn: true,
                user_id: decodedRefresh.user_id,
                user_type: userType,
                issuedAt: new Date(),
              });

            const response = NextResponse.json(
              {
                isLoggedIn: true,
                user_id: decodedRefresh.user_id,
                user_type: userType,
                access_token: accessToken,
                refresh_token: refreshToken,
                issuedAt: new Date(),
                message:
                  "Access token expired. Since the refresh token is still valid, new access token and refresh token have been generated.",
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
          }
        }
      } catch {
        // Refresh token also expired/invalid — fall through to "Please login."
      }
    }

    if (error instanceof jwt.JsonWebTokenError ||
        error instanceof jwt.TokenExpiredError) {
      return NextResponse.json(
        { message: "Please login." },
        { status: 401 },
      );
    }

    const message =
      error instanceof Error ? error.message : "Authentication failed";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
