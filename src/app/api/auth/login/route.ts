import { prisma } from "@/lib/db";
import { comparePassword } from "@/utility/util";
import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { ACCESS_TOKEN_EXPIRED_TIME, JWT_SECRET_ACCESS_TOKEN, JWT_SECRET_REFRESH_TOKEN, REFRESH_TOKEN_EXPIRED_TIME } from "@/variables/variables";

function generateAccessTokenAndRefreshToken(props: object) {
  const accessToken = jwt.sign(props, JWT_SECRET_ACCESS_TOKEN!, {
    expiresIn: ACCESS_TOKEN_EXPIRED_TIME ?? "1h",
  } as jwt.SignOptions);
  const refreshToken = jwt.sign(props, JWT_SECRET_REFRESH_TOKEN!, {
    expiresIn: REFRESH_TOKEN_EXPIRED_TIME ?? "7d",
  } as jwt.SignOptions);
  return { accessToken, refreshToken };
}

export async function POST(req: Request) {
  const body = await req.json();
  const { password,user } = body;

  try { 
    if (!user || !password) {
      return NextResponse.json(
        { message: "Username and password are required." },
        { status: 400 },
      );
    }

    const userRecord = await prisma.users.findFirst({
      where: { username: user },
    });

    if (!userRecord) {
      return NextResponse.json(
        { message: "User not found." },
        { status: 404 },
      );
    }

    const userCredential = await prisma.credentials.findUnique({
      where: { user_id: userRecord.user_id },
    });
    if (!userCredential) {
      return NextResponse.json(
        { message: "Invalid credential" },
        { status: 401 },
      );
    }

    const passwordResult = comparePassword(password, userCredential.password);
    if (!passwordResult) {
      return NextResponse.json(
        { message: "Invalid password." },
        { status: 401 },
      );
    }

    const { accessToken, refreshToken } = generateAccessTokenAndRefreshToken({
      isLoggedIn: true,
      user_id: userCredential.user_id,
      user_type: userRecord.user_type,
      issuedAt: new Date(),
    });

    const response = NextResponse.json(
      {
        isLoggedIn: true,
        user_id: userCredential.user_id,
        user_type: userRecord.user_type,
        access_token: accessToken,
        refresh_token: refreshToken,
        issuedAt: new Date(),
        message: "Login Succesful",
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
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE() {
  return NextResponse.json({ message: "Logged out" });
}

