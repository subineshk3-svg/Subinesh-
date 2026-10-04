import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get("userId");
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status");

    if (!userId) {
      return NextResponse.json({ error: "User ID parameter is required." }, { status: 400 });
    }

    const whereClause: any = {
      userId,
    };

    if (search) {
      whereClause.name = { contains: search };
    }

    if (status && status !== "ALL") {
      whereClause.status = status;
    }

    const projects = await db.project.findMany({
      where: whereClause,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({
      success: true,
      projects,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to fetch projects." }, { status: 500 });
  }
}
