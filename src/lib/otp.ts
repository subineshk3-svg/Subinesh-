import crypto from "crypto";

export interface OtpGenerateResult {
  code: string;
  hash: string;
  expiresAt: Date;
}

export function generate6DigitOtp(): OtpGenerateResult {
  // Generate random 6-digit number
  const code = Math.floor(100000 + Math.random() * 900000).toString();
  
  // Hash the code with SHA-256 for secure DB storage
  const hash = crypto.createHash("sha256").update(code).digest("hex");
  
  // 5 minutes expiration
  const expiresAt = new Date(Date.now() + 5 * 60 * 1000);

  return { code, hash, expiresAt };
}

export function hashOtp(code: string): string {
  return crypto.createHash("sha256").update(code.trim()).digest("hex");
}

export function verifyOtpCode(inputCode: string, storedHash: string, expiresAt: Date, attempts: number): {
  success: boolean;
  message: string;
} {
  if (attempts >= 5) {
    return { success: false, message: "Maximum OTP verification attempts exceeded. Please request a new code." };
  }

  if (new Date() > new Date(expiresAt)) {
    return { success: false, message: "OTP code has expired. Please request a new code." };
  }

  const inputHash = hashOtp(inputCode);
  if (inputHash !== storedHash) {
    return { success: false, message: "Invalid 6-digit verification code. Please check and try again." };
  }

  return { success: true, message: "Account verified successfully." };
}
