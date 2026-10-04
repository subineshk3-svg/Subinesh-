import { NextResponse } from "next/server";
import { checkGpuWorkerHealth } from "@/lib/gpuBackend";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const health = await checkGpuWorkerHealth();
    return NextResponse.json({
      success: true,
      health: health || {
        status: "OFFLINE",
        message: "GPU Inference service not responding at http://localhost:8000",
        cuda_available: false,
        device_name: "GPU Worker Offline",
        vram_free_gb: 0,
        vram_total_gb: 0,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Failed to fetch GPU status." }, { status: 500 });
  }
}
