import { prisma } from "@/lib/db";
import {
  ACCESS_TOKEN_EXPIRED_TIME,
  JWT_SECRET_ACCESS_TOKEN,
  JWT_SECRET_REFRESH_TOKEN,
  REFRESH_TOKEN_EXPIRED_TIME,
} from "@/variables/variables";
import jwt from "jsonwebtoken";
import { NextRequest, NextResponse } from "next/server";

export interface AuthUser {
  user_id: number;
  user_type: string;
  [key: string]: unknown;
}

export interface AuthResult {
  authorized: true;
  decoded: AuthUser;
  access_token: string;
  refresh_token: string;
  isRefreshed?: boolean;
}

export interface AuthError {
  authorized: false;
}

export function generateAccessTokenAndRefreshToken(props: object) {
  const accessToken = jwt.sign(props, JWT_SECRET_ACCESS_TOKEN!, {
    expiresIn: ACCESS_TOKEN_EXPIRED_TIME ?? "1h",
  } as jwt.SignOptions);
  const refreshToken = jwt.sign(props, JWT_SECRET_REFRESH_TOKEN!, {
    expiresIn: REFRESH_TOKEN_EXPIRED_TIME ?? "7d",
  } as jwt.SignOptions);
  return { accessToken, refreshToken };
}

export async function verifyAuth(req: NextRequest): Promise<AuthResult | AuthError> {
  const access_token = req.cookies.get("access_token")?.value;
  const refresh_token = req.cookies.get("refresh_token")?.value;

  if (!access_token) {
    return { authorized: false };
  }

  try {
    const decoded = jwt.verify(
      access_token,
      JWT_SECRET_ACCESS_TOKEN!,
    ) as jwt.JwtPayload;

    return {
      authorized: true,
      decoded: decoded as unknown as AuthUser,
      access_token,
      refresh_token: refresh_token ?? "",
    };
  } catch (error) {
    // Access token expired — try auto-refresh
    if (error instanceof jwt.TokenExpiredError && refresh_token) {
      try {
        const decodedRefresh = jwt.verify(
          refresh_token,
          JWT_SECRET_REFRESH_TOKEN!,
        ) as jwt.JwtPayload;

        if (decodedRefresh?.user_id) {
          const userRecord = await prisma.users.findUnique({
            where: { user_id: decodedRefresh.user_id as number },
          });

          if (userRecord) {
            const userType =
              typeof decodedRefresh.user_type === "string"
                ? decodedRefresh.user_type
                : "";

            const { accessToken, refreshToken } =
              generateAccessTokenAndRefreshToken({
                isLoggedIn: true,
                user_id: decodedRefresh.user_id,
                user_type: userType,
                issuedAt: new Date(),
              });

            const refreshedDecoded = jwt.verify(
              accessToken,
              JWT_SECRET_ACCESS_TOKEN!,
            ) as jwt.JwtPayload;

            return {
              authorized: true,
              decoded: { ...refreshedDecoded, user_type: userType } as unknown as AuthUser,
              access_token: accessToken,
              refresh_token: refreshToken,
              isRefreshed: true,
            };
          }
        }
      } catch {
        // Refresh token also expired — unauthorized
      }
    }

    return { authorized: false };
  }
}

export function setTokenCookies(
  response: NextResponse,
  accessToken: string,
  refreshToken: string,
) {
  response.cookies.set("access_token", accessToken, {
    httpOnly: true,
    secure: false,
    path: "/",
  });
  response.cookies.set("refresh_token", refreshToken, {
    httpOnly: true,
    secure: true,
    path: "/",
  });
}
