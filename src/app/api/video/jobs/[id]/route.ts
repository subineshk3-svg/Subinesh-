import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { fetchGpuJobStatus } from "@/lib/gpuBackend";
import { refundReservedCredits } from "@/lib/credits";

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const providerJobId = params.id;

    if (!providerJobId) {
      return NextResponse.json({ error: "Job ID parameter is required." }, { status: 400 });
    }

    // 1. Check GPU worker for live progress
    const gpuJob = await fetchGpuJobStatus(providerJobId);

    // 2. Fetch Generation DB record
    const generation = await db.generation.findFirst({
      where: { providerJobId },
      include: { project: true },
    });

    if (!generation && !gpuJob) {
      return NextResponse.json({ error: "Job ID not found." }, { status: 404 });
    }

    // Combine GPU job status with DB record
    const currentStatus = gpuJob?.status || generation?.status || "QUEUED";
    const currentStage = gpuJob?.stage || generation?.stage || "QUEUED";
    const currentProgress = gpuJob?.progress ?? generation?.progress ?? 0;
    const videoUrl = gpuJob?.video_url || generation?.project?.generatedVideoUrl;
    const thumbnailUrl = gpuJob?.thumbnail_url || generation?.project?.thumbnailUrl;
    const errorMessage = gpuJob?.error || generation?.errorMessage;

    // 3. Update DB records if status has changed
    if (generation) {
      if (currentStatus === "COMPLETED" && generation.status !== "COMPLETED") {
        await db.generation.update({
          where: { id: generation.id },
          data: {
            status: "COMPLETED",
            stage: "COMPLETED",
            progress: 100,
            completedAt: new Date(),
          },
        });

        if (videoUrl) {
          await db.project.update({
            where: { id: generation.projectId },
            data: {
              status: "COMPLETED",
              stage: "COMPLETED",
              generatedVideoUrl: videoUrl,
              thumbnailUrl: thumbnailUrl || null,
            },
          });
        }
      } else if (currentStatus === "FAILED" && generation.status !== "FAILED") {
        await db.generation.update({
          where: { id: generation.id },
          data: {
            status: "FAILED",
            stage: "FAILED",
            errorMessage: errorMessage || "GPU Video generation failed.",
          },
        });

        await db.project.update({
          where: { id: generation.projectId },
          data: { status: "FAILED", stage: "FAILED" },
        });

        // Refund reserved credits automatically on failure
        await refundReservedCredits(
          generation.userId,
          generation.creditsReserved,
          `Refund due to GPU generation error: ${errorMessage || "Unknown error"}`
        );
      } else if (generation.status !== currentStatus || generation.progress !== currentProgress) {
        await db.generation.update({
          where: { id: generation.id },
          data: {
            status: currentStatus,
            stage: currentStage,
            progress: currentProgress,
          },
        });
        await db.project.update({
          where: { id: generation.projectId },
          data: { status: currentStatus, stage: currentStage },
        });
      }
    }

    return NextResponse.json({
      success: true,
      job: {
        jobId: providerJobId,
        status: currentStatus,
        stage: currentStage,
        progress: currentProgress,
        videoUrl: videoUrl || null,
        thumbnailUrl: thumbnailUrl || null,
        error: errorMessage || null,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to fetch job status." }, { status: 500 });
  }
}
