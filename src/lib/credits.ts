import { db } from "./db";

export interface CalculateCreditOptions {
  model?: string;
  duration?: number; // 5, 10, 15
  resolution?: string; // 720p, 1080p, 4K
  hasAudio?: boolean;
}

export function calculateGenerationCredits(options: CalculateCreditOptions): number {
  const { model = "VJ17 Auto Dynamic", duration = 5, resolution = "1080p", hasAudio = false } = options;

  let base = 10;
  if (model.includes("Pro") || model.includes("Quality") || model.includes("Sora")) {
    base = 15;
  } else if (model.includes("Speed") || model.includes("Fast")) {
    base = 6;
  }

  // Duration multiplier
  let durationMult = 1.0;
  if (duration === 10) durationMult = 1.8;
  if (duration >= 15) durationMult = 2.5;

  // Resolution multiplier
  let resMult = 1.0;
  if (resolution === "4K") resMult = 1.5;

  // Audio add-on
  const audioCost = hasAudio ? 2 : 0;

  return Math.round(base * durationMult * resMult) + audioCost;
}

export async function reserveCreditsForUser(userId: string, requiredCredits: number): Promise<{ success: boolean; message?: string }> {
  const user = await db.user.findUnique({ where: { id: userId } });
  if (!user) {
    return { success: false, message: "User account not found." };
  }

  if (user.credits < requiredCredits) {
    return {
      success: false,
      message: `Insufficient credit balance. Required: ${requiredCredits} credits, Available: ${user.credits} credits.`,
    };
  }

  // Temporarily deduct reserved credits
  await db.user.update({
    where: { id: userId },
    data: { credits: user.credits - requiredCredits },
  });

  await db.creditTransaction.create({
    data: {
      userId,
      amount: -requiredCredits,
      type: "RESERVATION",
      description: `Reserved ${requiredCredits} credits for video generation.`,
    },
  });

  return { success: true };
}

export async function refundReservedCredits(userId: string, refundedAmount: number, reason: string): Promise<void> {
  const user = await db.user.findUnique({ where: { id: userId } });
  if (!user) return;

  await db.user.update({
    where: { id: userId },
    data: { credits: user.credits + refundedAmount },
  });

  await db.creditTransaction.create({
    data: {
      userId,
      amount: refundedAmount,
      type: "REFUND",
      description: `Refunded ${refundedAmount} credits. Reason: ${reason}`,
    },
  });
}
