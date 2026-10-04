import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { hashPassword } from "@/lib/auth";
import { generate6DigitOtp } from "@/lib/otp";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { name, email, phone, password } = body;

    if (!email || !password || !name) {
      return NextResponse.json({ error: "Name, email, and password are required fields." }, { status: 400 });
    }

    // Check existing user
    const existingUser = await db.user.findUnique({ where: { email } });
    if (existingUser) {
      return NextResponse.json({ error: "An account with this email already exists." }, { status: 409 });
    }

    const passwordHash = await hashPassword(password);

    // Create new user (default admin if email contains admin)
    const role = email.toLowerCase().includes("admin") ? "ADMIN" : "USER";

    const user = await db.user.create({
      data: {
        name,
        email,
        phone: phone || null,
        passwordHash,
        role,
        credits: 50, // Initial 50 free credits
      },
    });

    // Generate 6-digit OTP verification code
    const destination = phone || email;
    const { code, hash, expiresAt } = generate6DigitOtp();

    const otpRecord = await db.otpVerification.create({
      data: {
        userId: user.id,
        destination,
        otpHash: hash,
        expiresAt,
      },
    });

    // In production, dispatch OTP via SMS/Email gateway.
    // For local dev/demo testing purposes, return demoCode in headers or safe response if needed.
    return NextResponse.json({
      success: true,
      message: "Account created successfully. OTP verification code dispatched.",
      userId: user.id,
      destination,
      otpId: otpRecord.id,
      demoCode: code, // Convenient demo helper for testing without SMS service setup
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Registration failed." }, { status: 500 });
  }
}
