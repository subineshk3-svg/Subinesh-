import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { calculateGenerationCredits, reserveCreditsForUser } from "@/lib/credits";
import { submitGpuGenerationJob, checkGpuWorkerHealth } from "@/lib/gpuBackend";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const {
      userId,
      name = "Untitled AI Motion Video",
      model = "ltx-video",
      prompt,
      negativePrompt,
      imageUrl,
      duration = 5,
      aspectRatio = "16:9",
      resolution = "1080p",
      width = 832,
      height = 480,
      fps = 16,
      steps = 30,
      guidanceScale = 6.0,
      seed = -1,
      isEnhancedPrompt = false,
      hasAudio = false,
    } = body;

    // 1. Strict Server-Side Validation
    if (!userId) {
      return NextResponse.json({ error: "User authentication required." }, { status: 401 });
    }
    if (!prompt || typeof prompt !== "string" || prompt.trim().length === 0) {
      return NextResponse.json({ error: "Generation prompt is required." }, { status: 400 });
    }
    if (imageUrl && (typeof imageUrl !== "string" || !imageUrl.startsWith("http"))) {
      return NextResponse.json({ error: "Invalid image URL format." }, { status: 400 });
    }

    // 2. Check GPU Worker Availability
    const workerHealth = await checkGpuWorkerHealth();
    if (!workerHealth) {
      // Create DB project in FAILED status with honest error message
      const failedProject = await db.project.create({
        data: {
          userId,
          name,
          prompt,
          negativePrompt,
          model,
          duration: Number(duration),
          aspectRatio,
          resolution,
          width: Number(width),
          height: Number(height),
          fps: Number(fps),
          steps: Number(steps),
          guidanceScale: Number(guidanceScale),
          seed: Number(seed),
          isEnhancedPrompt: Boolean(isEnhancedPrompt),
          originalImageUrl: imageUrl || null,
          status: "FAILED",
          stage: "FAILED",
          creditsUsed: 0,
        },
      });

      return NextResponse.json(
        {
          error: `Selected model '${model}' is currently unavailable. Python GPU worker at http://localhost:8000 is offline. Please start GPU inference worker service.`,
          projectId: failedProject.id,
          modelUnavailable: true,
        },
        { status: 503 }
      );
    }

    // 3. Estimate & Reserve Credits
    const requiredCredits = calculateGenerationCredits({
      model,
      duration: Number(duration),
      resolution,
      hasAudio,
    });

    const reservation = await reserveCreditsForUser(userId, requiredCredits);
    if (!reservation.success) {
      return NextResponse.json({ error: reservation.message }, { status: 402 });
    }

    // 4. Create Project Entry in DB
    const project = await db.project.create({
      data: {
        userId,
        name,
        prompt,
        negativePrompt,
        model,
        duration: Number(duration),
        aspectRatio,
        resolution,
        width: Number(width),
        height: Number(height),
        fps: Number(fps),
        steps: Number(steps),
        guidanceScale: Number(guidanceScale),
        seed: Number(seed),
        isEnhancedPrompt: Boolean(isEnhancedPrompt),
        originalImageUrl: imageUrl || null,
        status: "QUEUED",
        stage: "QUEUED",
        creditsUsed: requiredCredits,
      },
    });

    // 5. Submit to Python GPU Worker Inference Engine
    const gpuResult = await submitGpuGenerationJob({
      model: model.toLowerCase(),
      prompt,
      negative_prompt: negativePrompt,
      image_url: imageUrl,
      duration: Number(duration),
      width: Number(width),
      height: Number(height),
      fps: Number(fps),
      steps: Number(steps),
      guidance_scale: Number(guidanceScale),
      seed: Number(seed),
      is_enhanced_prompt: Boolean(isEnhancedPrompt),
    });

    if (!gpuResult.success || !gpuResult.job_id) {
      await db.project.update({
        where: { id: project.id },
        data: { status: "FAILED", stage: "FAILED" },
      });
      return NextResponse.json(
        { error: gpuResult.error || "GPU worker failed to queue generation job." },
        { status: 500 }
      );
    }

    // 6. Save Generation DB Record
    const generation = await db.generation.create({
      data: {
        projectId: project.id,
        userId,
        provider: model,
        model,
        prompt,
        negativePrompt,
        duration: Number(duration),
        resolution,
        aspectRatio,
        width: Number(width),
        height: Number(height),
        fps: Number(fps),
        steps: Number(steps),
        guidanceScale: Number(guidanceScale),
        seed: Number(seed),
        isEnhancedPrompt: Boolean(isEnhancedPrompt),
        status: "QUEUED",
        stage: "QUEUED",
        progress: 0,
        providerJobId: gpuResult.job_id,
        creditsReserved: requiredCredits,
        creditsConsumed: requiredCredits,
      },
    });

    return NextResponse.json({
      success: true,
      jobId: gpuResult.job_id,
      projectId: project.id,
      generationId: generation.id,
      model,
      creditsReserved: requiredCredits,
      message: "Video generation job submitted successfully to GPU worker.",
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Video generation submission failed." }, { status: 500 });
  }
}
