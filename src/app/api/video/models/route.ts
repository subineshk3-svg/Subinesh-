import { NextResponse } from "next/server";
import { checkGpuWorkerHealth, fetchGpuModels } from "@/lib/gpuBackend";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const health = await checkGpuWorkerHealth();
    const isWorkerOnline = !!health;
    const gpuModels = await fetchGpuModels();

    // Default static open-source model catalog fallback if worker is starting up
    const fallbackCatalog = {
      "wan2.1": {
        id: "wan2.1",
        name: "Wan 2.1",
        version: "2.1",
        description: "High-quality general-purpose video generation with superior temporal consistency.",
        license: "Apache-2.0",
        license_type: "Commercial-friendly Open Source",
        commercial_use: true,
        vram_required_gb: 16,
        supported_modes: ["t2v", "i2v"],
        supported_resolutions: ["480p", "720p", "1080p"],
        is_active: false,
        is_available: isWorkerOnline,
      },
      "wan2.2": {
        id: "wan2.2",
        name: "Wan 2.2 Turbo",
        version: "2.2",
        description: "Ultra-fast high-resolution motion video generation.",
        license: "Apache-2.0",
        license_type: "Commercial-friendly Open Source",
        commercial_use: true,
        vram_required_gb: 12,
        supported_modes: ["t2v", "i2v"],
        supported_resolutions: ["480p", "720p", "1080p"],
        is_active: false,
        is_available: isWorkerOnline,
      },
      "ltx-video": {
        id: "ltx-video",
        name: "LTX-Video",
        version: "0.9.1",
        description: "Fast video generation and real-time image-to-video motion control.",
        license: "Open-RAIL-M",
        license_type: "Open Weights / Non-Commercial Commercial License",
        commercial_use: true,
        vram_required_gb: 12,
        supported_modes: ["t2v", "i2v"],
        supported_resolutions: ["480p", "720p"],
        is_active: isWorkerOnline,
        is_available: isWorkerOnline,
      },
      "hunyuan": {
        id: "hunyuan",
        name: "HunyuanVideo",
        version: "1.0",
        description: "High-quality cinematic generation requiring powerful GPU hardware.",
        license: "Tencent-Hunyuan-NonCommercial",
        license_type: "Research & Non-Commercial License",
        commercial_use: false,
        vram_required_gb: 24,
        supported_modes: ["t2v"],
        supported_resolutions: ["720p", "1080p"],
        is_active: false,
        is_available: isWorkerOnline,
      },
      "cogvideo": {
        id: "cogvideo",
        name: "CogVideoX-5B",
        version: "5B",
        description: "Text-to-video and image-to-video generation by THUDM.",
        license: "Apache-2.0",
        license_type: "Commercial-friendly Open Source",
        commercial_use: true,
        vram_required_gb: 16,
        supported_modes: ["t2v", "i2v"],
        supported_resolutions: ["480p", "720p"],
        is_active: false,
        is_available: isWorkerOnline,
      },
      "mochi": {
        id: "mochi",
        name: "Mochi-1 Preview",
        version: "1.0",
        description: "Open-source high-fidelity text-to-video generation by Genmo.",
        license: "Apache-2.0",
        license_type: "Commercial-friendly Open Source",
        commercial_use: true,
        vram_required_gb: 20,
        supported_modes: ["t2v"],
        supported_resolutions: ["480p"],
        is_active: false,
        is_available: isWorkerOnline,
      },
    };

    const finalModels = Object.keys(gpuModels).length > 0 ? gpuModels : fallbackCatalog;

    return NextResponse.json({
      success: true,
      workerOnline: isWorkerOnline,
      health: health || { status: "OFFLINE", message: "GPU Inference Worker is currently offline." },
      models: finalModels,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to fetch model catalog." }, { status: 500 });
  }
}
