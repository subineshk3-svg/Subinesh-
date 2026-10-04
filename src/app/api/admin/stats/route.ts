import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET() {
  try {
    const totalUsers = await db.user.count();
    const totalProjects = await db.project.count();
    const totalGenerations = await db.generation.count();
    const failedGenerations = await db.generation.count({ where: { status: "FAILED" } });
    const completedGenerations = await db.generation.count({ where: { status: "COMPLETED" } });

    const totalCreditsConsumed = await db.creditTransaction.aggregate({
      where: { type: "GENERATION" },
      _sum: { amount: true },
    });

    const recentGenerations = await db.generation.findMany({
      take: 10,
      orderBy: { createdAt: "desc" },
      include: {
        user: { select: { name: true, email: true } },
        project: { select: { name: true, originalImageUrl: true } },
      },
    });

    return NextResponse.json({
      success: true,
      stats: {
        totalUsers,
        totalProjects,
        totalGenerations,
        completedGenerations,
        failedGenerations,
        successRate: totalGenerations > 0 ? Math.round((completedGenerations / totalGenerations) * 100) : 100,
        creditsConsumed: Math.abs(totalCreditsConsumed._sum.amount || 0),
        estimatedRevenueUSD: Math.round((totalGenerations * 0.45) * 100) / 100,
      },
      recentGenerations,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to load admin statistics." }, { status: 500 });
  }
}
