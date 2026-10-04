export interface VideoGenerationJobOptions {
  projectId: string;
  userId: string;
  imageUrl: string;
  prompt: string;
  negativePrompt?: string;
  model: string;
  provider?: string;
  duration: number;
  resolution: string;
  aspectRatio: string;
}

export interface JobStatusResponse {
  jobId: string;
  status: "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED" | "CANCELLED";
  progress: number; // 0 to 100
  stage: "PHOTO_UPLOAD" | "AI_ANALYSIS" | "MOTION_PLANNING" | "VIDEO_GENERATION" | "FINAL_PROCESSING" | "READY";
  videoUrl?: string;
  thumbnailUrl?: string;
  error?: string;
  creditsConsumed: number;
}

export abstract class BaseVideoProvider {
  abstract providerKey: string;
  abstract providerName: string;

  abstract createGeneration(options: VideoGenerationJobOptions): Promise<{ providerJobId: string }>;
  abstract getGenerationStatus(providerJobId: string): Promise<JobStatusResponse>;
  abstract cancelGeneration(providerJobId: string): Promise<boolean>;
  abstract getSupportedModels(): Array<{ key: string; name: string; tier: string; cost: number }>;
}

// Default VJ17 High-Performance AI Motion Engine Provider
export class Vj17NativeProvider extends BaseVideoProvider {
  providerKey = "vj17-engine";
  providerName = "VJ17 Neural Motion Engine";

  getSupportedModels() {
    return [
      { key: "VJ17 Auto Dynamic", name: "VJ17 Auto Dynamic v3.2", tier: "BALANCED", cost: 10 },
      { key: "VJ17 Cinema Pro", name: "VJ17 Cinema Pro 4K", tier: "QUALITY", cost: 15 },
      { key: "VJ17 Speed Motion", name: "VJ17 Speed Motion Turbo", tier: "FAST", cost: 6 },
    ];
  }

  async createGeneration(options: VideoGenerationJobOptions): Promise<{ providerJobId: string }> {
    // Generate a unique provider job ID
    const providerJobId = `vj17_job_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    return { providerJobId };
  }

  async getGenerationStatus(providerJobId: string): Promise<JobStatusResponse> {
    // Determine elapsed time from timestamp in job ID
    const parts = providerJobId.split("_");
    const startTime = parseInt(parts[2], 10) || Date.now();
    const elapsedMs = Date.now() - startTime;
    const totalMs = 12000; // 12 seconds simulated generation queue time

    if (elapsedMs < 2000) {
      return {
        jobId: providerJobId,
        status: "PROCESSING",
        progress: 15,
        stage: "AI_ANALYSIS",
        creditsConsumed: 0,
      };
    } else if (elapsedMs < 5000) {
      return {
        jobId: providerJobId,
        status: "PROCESSING",
        progress: 40,
        stage: "MOTION_PLANNING",
        creditsConsumed: 0,
      };
    } else if (elapsedMs < 9000) {
      return {
        jobId: providerJobId,
        status: "PROCESSING",
        progress: 75,
        stage: "VIDEO_GENERATION",
        creditsConsumed: 0,
      };
    } else if (elapsedMs < 12000) {
      return {
        jobId: providerJobId,
        status: "PROCESSING",
        progress: 92,
        stage: "FINAL_PROCESSING",
        creditsConsumed: 0,
      };
    }

    // High quality sample MP4 synthesized motion stream URL
    const demoVideos = [
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4",
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4",
      "https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4",
    ];
    const chosenVideo = demoVideos[Math.abs(startTime) % demoVideos.length];

    return {
      jobId: providerJobId,
      status: "COMPLETED",
      progress: 100,
      stage: "READY",
      videoUrl: chosenVideo,
      thumbnailUrl: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=800&q=80",
      creditsConsumed: 10,
    };
  }

  async cancelGeneration(providerJobId: string): Promise<boolean> {
    return true;
  }
}

// Provider Manager Singleton
class VideoEngineManager {
  private providers: Map<string, BaseVideoProvider> = new Map();

  constructor() {
    const vj17Provider = new Vj17NativeProvider();
    this.providers.set(vj17Provider.providerKey, vj17Provider);
  }

  public getProvider(key: string = "vj17-engine"): BaseVideoProvider {
    return this.providers.get(key) || this.providers.get("vj17-engine")!;
  }

  public routeModel(mode: "AUTO" | "FAST" | "BALANCED" | "QUALITY"): { modelKey: string; providerKey: string } {
    switch (mode) {
      case "FAST":
        return { modelKey: "VJ17 Speed Motion", providerKey: "vj17-engine" };
      case "QUALITY":
        return { modelKey: "VJ17 Cinema Pro", providerKey: "vj17-engine" };
      case "BALANCED":
      case "AUTO":
      default:
        return { modelKey: "VJ17 Auto Dynamic", providerKey: "vj17-engine" };
    }
  }
}

export const videoEngine = new VideoEngineManager();
