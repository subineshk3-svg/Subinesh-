import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { cancelGpuJob } from "@/lib/gpuBackend";
import { refundReservedCredits } from "@/lib/credits";

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const providerJobId = params.id;
    if (!providerJobId) {
      return NextResponse.json({ error: "Job ID required." }, { status: 400 });
    }

    const cancelledOnGpu = await cancelGpuJob(providerJobId);

    const generation = await db.generation.findFirst({
      where: { providerJobId },
    });

    if (generation && generation.status !== "CANCELLED") {
      await db.generation.update({
        where: { id: generation.id },
        data: { status: "CANCELLED", stage: "CANCELLED" },
      });

      await db.project.update({
        where: { id: generation.projectId },
        data: { status: "CANCELLED", stage: "CANCELLED" },
      });

      await refundReservedCredits(
        generation.userId,
        generation.creditsReserved,
        "Refund due to user cancelled video generation job."
      );
    }

    return NextResponse.json({
      success: true,
      jobId: providerJobId,
      status: "CANCELLED",
      cancelledOnGpu,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to cancel job." }, { status: 500 });
  }
}
