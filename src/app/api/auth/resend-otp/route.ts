import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { generate6DigitOtp } from "@/lib/otp";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { userId } = body;

    if (!userId) {
      return NextResponse.json({ error: "User ID is required." }, { status: 400 });
    }

    const user = await db.user.findUnique({ where: { id: userId } });
    if (!user) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    // Check recent OTP resend cooldown (30s minimum)
    const recentOtp = await db.otpVerification.findFirst({
      where: { userId },
      orderBy: { createdAt: "desc" },
    });

    if (recentOtp) {
      const secondsSince = (Date.now() - new Date(recentOtp.createdAt).getTime()) / 1000;
      if (secondsSince < 30) {
        const remaining = Math.ceil(30 - secondsSince);
        return NextResponse.json(
          { error: `Please wait ${remaining} seconds before requesting a new OTP.` },
          { status: 429 }
        );
      }
    }

    const destination = user.phone || user.email;
    const { code, hash, expiresAt } = generate6DigitOtp();

    const otpRecord = await db.otpVerification.create({
      data: {
        userId: user.id,
        destination,
        otpHash: hash,
        expiresAt,
      },
    });

    return NextResponse.json({
      success: true,
      message: "New 6-digit verification code sent.",
      destination,
      otpId: otpRecord.id,
      demoCode: code, // Demo helper for developer testing
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to resend OTP." }, { status: 500 });
  }
}
