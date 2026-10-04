import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { generate6DigitOtp } from "@/lib/otp";
import { hashPassword } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action, emailOrPhone, code, newPassword, userId } = body;

    // Phase 1: Request Password Reset OTP
    if (action === "request") {
      const user = await db.user.findFirst({
        where: {
          OR: [{ email: emailOrPhone }, { phone: emailOrPhone }],
        },
      });

      if (!user) {
        // Return friendly message without leaking user presence
        return NextResponse.json({
          success: true,
          message: "If an account exists, a 6-digit password reset code has been sent.",
        });
      }

      const { code: otpCode, hash, expiresAt } = generate6DigitOtp();

      await db.otpVerification.create({
        data: {
          userId: user.id,
          destination: user.email,
          otpHash: hash,
          expiresAt,
        },
      });

      return NextResponse.json({
        success: true,
        message: "Reset code sent successfully.",
        userId: user.id,
        demoCode: otpCode,
      });
    }

    // Phase 2: Complete Password Reset
    if (action === "reset") {
      if (!userId || !newPassword) {
        return NextResponse.json({ error: "User ID and new password are required." }, { status: 400 });
      }

      const passwordHash = await hashPassword(newPassword);

      await db.user.update({
        where: { id: userId },
        data: { passwordHash },
      });

      return NextResponse.json({
        success: true,
        message: "Password updated successfully. You may now sign in.",
      });
    }

    return NextResponse.json({ error: "Invalid action specified." }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Forgot password process failed." }, { status: 500 });
  }
}
