import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { verifyOtpCode } from "@/lib/otp";
import { signToken } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId, code } = body;

    if (!userId || !code) {
      return NextResponse.json({ error: "User ID and 6-digit verification code are required." }, { status: 400 });
    }

    const otpRecord = await db.otpVerification.findFirst({
      where: { userId, verifiedAt: null },
      orderBy: { createdAt: "desc" },
    });

    if (!otpRecord) {
      return NextResponse.json({ error: "No active verification code found. Please request a new OTP." }, { status: 404 });
    }

    // Check attempts limit
    const verification = verifyOtpCode(code, otpRecord.otpHash, otpRecord.expiresAt, otpRecord.attempts);

    if (!verification.success) {
      // Increment attempt counter
      await db.otpVerification.update({
        where: { id: otpRecord.id },
        data: { attempts: otpRecord.attempts + 1 },
      });
      return NextResponse.json({ error: verification.message }, { status: 400 });
    }

    // Mark OTP as verified
    await db.otpVerification.update({
      where: { id: otpRecord.id },
      data: { verifiedAt: new Date() },
    });

    // Update user record verified status
    const updatedUser = await db.user.update({
      where: { id: userId },
      data: {
        emailVerified: true,
        phoneVerified: true,
      },
    });

    // Issue session token
    const token = signToken({
      userId: updatedUser.id,
      email: updatedUser.email,
      name: updatedUser.name,
      role: updatedUser.role,
    });

    const response = NextResponse.json({
      success: true,
      message: "Account verified successfully.",
      user: {
        id: updatedUser.id,
        name: updatedUser.name,
        email: updatedUser.email,
        phone: updatedUser.phone,
        role: updatedUser.role,
        credits: updatedUser.credits,
        emailVerified: true,
        phoneVerified: true,
      },
      token,
    });

    response.cookies.set("vj17_session", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      path: "/",
      maxAge: 7 * 24 * 60 * 60,
    });

    return response;
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "OTP verification failed." }, { status: 500 });
  }
}
