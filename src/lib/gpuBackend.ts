const GPU_WORKER_URL = process.env.GPU_WORKER_URL || "http://localhost:8000";

export interface GpuModelMeta {
  id: string;
  name: string;
  version: string;
  description: string;
  huggingface_repo: string;
  license: string;
  license_type: string;
  commercial_use: boolean;
  vram_required_gb: number;
  supported_modes: string[];
  default_params: {
    duration: number;
    fps: number;
    width: number;
    height: number;
    steps: number;
    guidance_scale: number;
  };
  supported_resolutions: string[];
  is_active: boolean;
  is_available: boolean;
  is_loaded: boolean;
}

export interface GpuHealthResponse {
  status: string;
  service: string;
  cuda_available: boolean;
  device_name: string;
  vram_free_gb: number;
  vram_total_gb: number;
  active_model?: string;
  queue_metrics?: {
    total_jobs: number;
    active_jobs: number;
    queued_jobs: number;
    completed_jobs: number;
    failed_jobs: number;
  };
}

export interface GpuJobResponse {
  job_id: string;
  model_id: string;
  prompt: string;
  status: "QUEUED" | "LOADING_MODEL" | "GENERATING" | "PROCESSING" | "UPLOADING" | "COMPLETED" | "FAILED" | "CANCELLED";
  stage: string;
  progress: number;
  video_url?: string;
  thumbnail_url?: string;
  error?: string;
  created_at: number;
  completed_at?: number;
}

export async function checkGpuWorkerHealth(): Promise<GpuHealthResponse | null> {
  try {
    const res = await fetch(`${GPU_WORKER_URL}/health`, { cache: "no-store", next: { revalidate: 0 } });
    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    return null;
  }
}

export async function fetchGpuModels(): Promise<Record<string, GpuModelMeta>> {
  try {
    const res = await fetch(`${GPU_WORKER_URL}/models`, { cache: "no-store" });
    if (!res.ok) return {};
    const data = await res.json();
    return data.models || {};
  } catch (error) {
    return {};
  }
}

export async function submitGpuGenerationJob(payload: {
  model: string;
  prompt: string;
  negative_prompt?: string;
  image_url?: string;
  duration?: number;
  width?: number;
  height?: number;
  fps?: number;
  steps?: number;
  guidance_scale?: number;
  seed?: number;
  is_enhanced_prompt?: boolean;
}): Promise<{ success: boolean; job_id?: string; model?: string; status?: string; error?: string }> {
  try {
    const res = await fetch(`${GPU_WORKER_URL}/video/generate`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    const data = await res.json();
    if (!res.ok) {
      return { success: false, error: data.detail || "Failed to submit job to GPU worker." };
    }
    return data;
  } catch (error: any) {
    return {
      success: false,
      error: error.message || "GPU Worker server connection error at " + GPU_WORKER_URL,
    };
  }
}

export async function fetchGpuJobStatus(jobId: string): Promise<GpuJobResponse | null> {
  try {
    const res = await fetch(`${GPU_WORKER_URL}/video/jobs/${jobId}`, { cache: "no-store" });
    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    return null;
  }
}

export async function cancelGpuJob(jobId: string): Promise<boolean> {
  try {
    const res = await fetch(`${GPU_WORKER_URL}/video/jobs/${jobId}/cancel`, { method: "POST" });
    return res.ok;
  } catch (error) {
    return false;
  }
}

export async function enhancePromptGpu(prompt: string): Promise<string> {
  try {
    const res = await fetch(`${GPU_WORKER_URL}/prompt/enhance`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ prompt }),
    });
    if (!res.ok) return prompt;
    const data = await res.json();
    return data.enhanced_prompt || prompt;
  } catch (error) {
    return prompt;
  }
}
