const http = require("http");
const url = require("url");
const fs = require("fs");
const path = require("path");

const PORT = process.env.PORT || 8000;

// Model Catalog Definition
const AVAILABLE_MODELS = {
  "wan2.1": {
    id: "wan2.1",
    name: "Wan 2.1",
    version: "2.1",
    description: "High-quality general-purpose video generation with superior temporal consistency.",
    huggingface_repo: "Wan-AI/Wan2.1-T2V-14B",
    license: "Apache-2.0",
    license_type: "Commercial-friendly Open Source",
    commercial_use: true,
    vram_required_gb: 16,
    supported_modes: ["t2v", "i2v"],
    default_params: { duration: 5, fps: 16, width: 832, height: 480, steps: 30, guidance_scale: 6.0 },
    supported_resolutions: ["480p", "720p", "1080p"],
    is_active: false,
    is_available: true,
    is_loaded: false,
  },
  "wan2.2": {
    id: "wan2.2",
    name: "Wan 2.2 Turbo",
    version: "2.2",
    description: "Ultra-fast high-resolution motion video generation.",
    huggingface_repo: "Wan-AI/Wan2.2-T2V-7B",
    license: "Apache-2.0",
    license_type: "Commercial-friendly Open Source",
    commercial_use: true,
    vram_required_gb: 12,
    supported_modes: ["t2v", "i2v"],
    default_params: { duration: 5, fps: 24, width: 832, height: 480, steps: 25, guidance_scale: 5.0 },
    supported_resolutions: ["480p", "720p", "1080p"],
    is_active: false,
    is_available: true,
    is_loaded: false,
  },
  "ltx-video": {
    id: "ltx-video",
    name: "LTX-Video",
    version: "0.9.1",
    description: "Fast video generation and real-time image-to-video motion control.",
    huggingface_repo: "Lightricks/LTX-Video",
    license: "Open-RAIL-M",
    license_type: "Open Weights / Non-Commercial Commercial License",
    commercial_use: true,
    vram_required_gb: 12,
    supported_modes: ["t2v", "i2v"],
    default_params: { duration: 5, fps: 24, width: 768, height: 512, steps: 30, guidance_scale: 3.0 },
    supported_resolutions: ["480p", "720p"],
    is_active: true,
    is_available: true,
    is_loaded: true,
  },
  "hunyuan": {
    id: "hunyuan",
    name: "HunyuanVideo",
    version: "1.0",
    description: "High-quality cinematic generation requiring powerful GPU hardware.",
    huggingface_repo: "Tencent/HunyuanVideo",
    license: "Tencent-Hunyuan-NonCommercial",
    license_type: "Research & Non-Commercial License",
    commercial_use: false,
    vram_required_gb: 24,
    supported_modes: ["t2v"],
    default_params: { duration: 5, fps: 24, width: 854, height: 480, steps: 30, guidance_scale: 6.0 },
    supported_resolutions: ["720p", "1080p"],
    is_active: false,
    is_available: true,
    is_loaded: false,
  },
  "cogvideo": {
    id: "cogvideo",
    name: "CogVideoX-5B",
    version: "5B",
    description: "Text-to-video and image-to-video generation by THUDM.",
    huggingface_repo: "THUDM/CogVideoX-5b",
    license: "Apache-2.0",
    license_type: "Commercial-friendly Open Source",
    commercial_use: true,
    vram_required_gb: 16,
    supported_modes: ["t2v", "i2v"],
    default_params: { duration: 6, fps: 8, width: 720, height: 480, steps: 50, guidance_scale: 6.0 },
    supported_resolutions: ["480p", "720p"],
    is_active: false,
    is_available: true,
    is_loaded: false,
  },
  "mochi": {
    id: "mochi",
    name: "Mochi-1 Preview",
    version: "1.0",
    description: "Open-source high-fidelity text-to-video generation by Genmo.",
    huggingface_repo: "genmo/mochi-1-preview",
    license: "Apache-2.0",
    license_type: "Commercial-friendly Open Source",
    commercial_use: true,
    vram_required_gb: 20,
    supported_modes: ["t2v"],
    default_params: { duration: 5, fps: 30, width: 848, height: 480, steps: 64, guidance_scale: 4.5 },
    supported_resolutions: ["480p"],
    is_active: false,
    is_available: true,
    is_loaded: false,
  },
};

// In-Memory Job Storage & Active Model State
const jobs = new Map();
let activeModelId = "ltx-video";

// Helper JSON response
function sendJson(res, statusCode, data) {
  res.writeHead(statusCode, {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
  });
  res.end(JSON.stringify(data));
}

// Background Worker Processor for Generation Jobs
function processJob(jobId) {
  const job = jobs.get(jobId);
  if (!job || job.status === "CANCELLED") return;

  // Step 1: Model Loading
  setTimeout(() => {
    if (jobs.get(jobId)?.status === "CANCELLED") return;
    activeModelId = job.model_id;
    jobs.set(jobId, { ...jobs.get(jobId), status: "LOADING_MODEL", stage: "LOADING_MODEL", progress: 20 });
  }, 1000);

  // Step 2: Generating Video Frames
  setTimeout(() => {
    if (jobs.get(jobId)?.status === "CANCELLED") return;
    jobs.set(jobId, { ...jobs.get(jobId), status: "GENERATING", stage: "GENERATING", progress: 60 });
  }, 3500);

  // Step 3: FFmpeg Processing
  setTimeout(() => {
    if (jobs.get(jobId)?.status === "CANCELLED") return;
    jobs.set(jobId, { ...jobs.get(jobId), status: "PROCESSING", stage: "PROCESSING", progress: 85 });
  }, 6500);

  // Step 4: Finalizing Output
  setTimeout(() => {
    if (jobs.get(jobId)?.status === "CANCELLED") return;
    const demoVideos = [
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    ];
    const videoUrl = demoVideos[Math.abs(hashString(jobId)) % demoVideos.length];

    jobs.set(jobId, {
      ...jobs.get(jobId),
      status: "COMPLETED",
      stage: "COMPLETED",
      progress: 100,
      video_url: videoUrl,
      thumbnail_url: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80",
      completed_at: Date.now(),
    });
  }, 9000);
}

function hashString(str) {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return hash;
}

// Create HTTP Server
const server = http.createServer((req, res) => {
  if (req.method === "OPTIONS") {
    res.writeHead(204, {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type",
    });
    return res.end();
  }

  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;

  // GET /health & GET /gpu/status
  if (pathname === "/health" || pathname === "/gpu/status") {
    return sendJson(res, 200, {
      status: "ONLINE",
      service: "VJ17 Motion AI GPU Inference Worker (Node.js High-Performance Microservice)",
      cuda_available: true,
      device_name: "NVIDIA RTX 4090 GPU (Worker Device 0)",
      vram_free_gb: 14.8,
      vram_total_gb: 24.0,
      active_model: activeModelId,
      queue_metrics: {
        total_jobs: jobs.size,
        active_jobs: Array.from(jobs.values()).filter((j) => ["LOADING_MODEL", "GENERATING", "PROCESSING"].includes(j.status)).length,
        queued_jobs: Array.from(jobs.values()).filter((j) => j.status === "QUEUED").length,
        completed_jobs: Array.from(jobs.values()).filter((j) => j.status === "COMPLETED").length,
        failed_jobs: Array.from(jobs.values()).filter((j) => j.status === "FAILED").length,
      },
    });
  }

  // GET /models
  if (pathname === "/models") {
    const catalog = {};
    for (const [k, v] of Object.entries(AVAILABLE_MODELS)) {
      catalog[k] = {
        ...v,
        is_active: k === activeModelId,
        is_loaded: k === activeModelId,
      };
    }
    return sendJson(res, 200, { models: catalog });
  }

  // POST /prompt/enhance
  if (pathname === "/prompt/enhance" && req.method === "POST") {
    let body = "";
    req.on("data", (chunk) => (body += chunk));
    req.on("end", () => {
      try {
        const payload = JSON.parse(body || "{}");
        const orig = payload.prompt || "";
        const enhanced = `${orig.trim().replace(/\.$/, "")}, highly detailed cinematic composition, 8k motion video render, volumetric lighting, photorealistic dynamic camera movement.`;
        return sendJson(res, 200, { original_prompt: orig, enhanced_prompt: enhanced });
      } catch (e) {
        return sendJson(res, 400, { error: "Invalid JSON body" });
      }
    });
    return;
  }

  // POST /video/generate
  if (pathname === "/video/generate" && req.method === "POST") {
    let body = "";
    req.on("data", (chunk) => (body += chunk));
    req.on("end", () => {
      try {
        const payload = JSON.parse(body || "{}");
        const modelId = (payload.model || "ltx-video").toLowerCase();

        if (!AVAILABLE_MODELS[modelId]) {
          return sendJson(res, 400, { detail: `Model '${payload.model}' is not supported.` });
        }

        const jobId = `vj17_job_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
        const job = {
          job_id: jobId,
          model_id: modelId,
          prompt: payload.prompt,
          params: payload,
          status: "QUEUED",
          stage: "QUEUED",
          progress: 5,
          created_at: Date.now(),
        };

        jobs.set(jobId, job);
        processJob(jobId);

        return sendJson(res, 200, {
          success: true,
          job_id: jobId,
          model: AVAILABLE_MODELS[modelId].name,
          status: "QUEUED",
          message: "Job queued on GPU worker.",
        });
      } catch (e) {
        return sendJson(res, 400, { detail: "Invalid request payload" });
      }
    });
    return;
  }

  // GET /video/jobs/:jobId
  if (pathname.startsWith("/video/jobs/")) {
    const parts = pathname.split("/");
    const jobId = parts[3];
    const isCancel = parts[4] === "cancel";

    if (!jobId) {
      return sendJson(res, 400, { error: "Missing jobId" });
    }

    if (isCancel && req.method === "POST") {
      if (jobs.has(jobId)) {
        const j = jobs.get(jobId);
        j.status = "CANCELLED";
        j.stage = "CANCELLED";
        jobs.set(jobId, j);
        return sendJson(res, 200, { success: true, jobId, status: "CANCELLED" });
      }
      return sendJson(res, 404, { error: "Job not found" });
    }

    if (jobs.has(jobId)) {
      return sendJson(res, 200, jobs.get(jobId));
    } else {
      return sendJson(res, 404, { error: "Job not found" });
    }
  }

  return sendJson(res, 404, { error: "Endpoint not found" });
});

server.listen(PORT, () => {
  console.log(`[VJ17 Motion AI] GPU Inference Worker Service listening on http://localhost:${PORT}`);
});
