"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import {
  Upload,
  Image as ImageIcon,
  Sparkles,
  Wand2,
  Camera,
  Layers,
  Sliders,
  Play,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  Coins,
  Cpu,
  RefreshCw,
  X,
  FileImage,
  Info,
  Type,
  Video,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { ModelSelector } from "@/components/ModelSelector";
import { calculateGenerationCredits } from "@/lib/credits";

function CreateVideoContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  // Mode Selection: "t2v" (Text-to-Video) vs "i2v" (Image-to-Video)
  const initialMode = (searchParams.get("tab") as "t2v" | "i2v") || "t2v";
  const [activeTab, setActiveTab] = useState<"t2v" | "i2v">(initialMode);

  // Model & Health Catalog State
  const [modelsCatalog, setModelsCatalog] = useState<Record<string, any>>({});
  const [workerOnline, setWorkerOnline] = useState(true);
  const [selectedModelId, setSelectedModelId] = useState("ltx-video");

  // Form State
  const [prompt, setPrompt] = useState(
    "A highly detailed cinematic humanoid robot walking slowly through a futuristic neon city at night, volumetric lighting, dynamic camera tracking, 8k resolution."
  );
  const [negativePrompt, setNegativePrompt] = useState("blurry, low quality, distorted, glitch, noise, artifacts");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [imageName, setImageName] = useState("");

  // Parameter Settings
  const [duration, setDuration] = useState(5);
  const [aspectRatio, setAspectRatio] = useState("16:9");
  const [resolution, setResolution] = useState("1080p");
  const [width, setWidth] = useState(832);
  const [height, setHeight] = useState(480);
  const [fps, setFps] = useState(16);
  const [steps, setSteps] = useState(30);
  const [guidanceScale, setGuidanceScale] = useState(6.0);
  const [seed, setSeed] = useState(-1);

  // Enhancer & Submission State
  const [enhancingPrompt, setEnhancingPrompt] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [error, setError] = useState("");
  const [user, setUser] = useState<any>(null);

  // Fetch catalog & user session on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem("vj17_user");
      if (stored) setUser(JSON.parse(stored));
    } catch (e) {}

    fetchModelCatalog();
  }, []);

  const fetchModelCatalog = async () => {
    try {
      const res = await fetch("/api/video/models");
      const data = await res.json();
      if (data.models) {
        setModelsCatalog(data.models);
        setWorkerOnline(data.workerOnline ?? true);
      }
    } catch (err) {}
  };

  const handleSelectModel = (modelId: string) => {
    setSelectedModelId(modelId);
    const meta = modelsCatalog[modelId];
    if (meta && meta.default_params) {
      if (meta.default_params.duration) setDuration(meta.default_params.duration);
      if (meta.default_params.fps) setFps(meta.default_params.fps);
      if (meta.default_params.steps) setSteps(meta.default_params.steps);
      if (meta.default_params.guidance_scale) setGuidanceScale(meta.default_params.guidance_scale);
      if (meta.default_params.width) setWidth(meta.default_params.width);
      if (meta.default_params.height) setHeight(meta.default_params.height);
    }
  };

  const handleEnhancePrompt = async () => {
    if (!prompt.trim()) return;
    setEnhancingPrompt(true);
    try {
      const res = await fetch("/api/video/enhance-prompt", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });
      const data = await res.json();
      if (data.enhancedPrompt) {
        setPrompt(data.enhancedPrompt);
      }
    } catch (e) {
    } finally {
      setEnhancingPrompt(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate type & size (10MB max)
    if (!file.type.startsWith("image/")) {
      setError("Please upload a valid image file (PNG, JPG, WEBP).");
      return;
    }
    if (file.size > 10 * 1024 * 1024) {
      setError("Image file size exceeds maximum limit of 10MB.");
      return;
    }

    setError("");
    setImageName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      setImageUrl(event.target?.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!prompt.trim()) {
      setError("Please enter a video generation prompt.");
      return;
    }
    if (activeTab === "i2v" && !imageUrl) {
      setError("Please upload an image for Image-to-Video generation.");
      return;
    }

    setGenerating(true);
    setError("");

    try {
      const currentUserId = user?.id || "demo-user-session";
      const payload = {
        userId: currentUserId,
        model: selectedModelId,
        prompt,
        negativePrompt,
        imageUrl: activeTab === "i2v" ? imageUrl : undefined,
        duration,
        aspectRatio,
        resolution,
        width,
        height,
        fps,
        steps,
        guidanceScale,
        seed,
      };

      const res = await fetch("/api/video/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "Video generation submission failed.");
      }

      if (data.jobId) {
        router.push(`/dashboard/generation/${data.jobId}?projectId=${data.projectId}`);
      }
    } catch (err: any) {
      setError(err.message || "Error submitting video generation job.");
    } finally {
      setGenerating(false);
    }
  };

  const currentModelMeta = modelsCatalog[selectedModelId] || {};
  const creditCost = calculateGenerationCredits({
    model: selectedModelId,
    duration,
    resolution,
  });

  return (
    <div className="max-w-5xl mx-auto space-y-8 pb-16 text-left">
      {/* Studio Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold uppercase tracking-widest mb-2">
            <Sparkles size={14} className="text-cyan-400" />
            VJ17 Motion AI Engine
          </div>
          <h1 className="text-3xl font-black text-white font-heading">AI Video Creation Studio</h1>
          <p className="text-xs text-gray-400 mt-1">
            Generate cinematic motion videos powered by open-source GPU AI models.
          </p>
        </div>

        {/* Dynamic Mode Switcher Tabs */}
        <div className="flex items-center p-1 rounded-2xl glass-panel border border-white/10 bg-black/40 self-start">
          <button
            onClick={() => setActiveTab("t2v")}
            className={`px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all ${
              activeTab === "t2v"
                ? "bg-gradient-to-r from-cyan-500 to-purple-600 text-white shadow-[0_0_20px_rgba(0,242,254,0.3)]"
                : "text-gray-400 hover:text-white"
            }`}
          >
            <Type size={16} />
            <span>Text-to-Video</span>
          </button>
          <button
            onClick={() => setActiveTab("i2v")}
            className={`px-5 py-2.5 rounded-xl font-bold text-xs flex items-center gap-2 transition-all ${
              activeTab === "i2v"
                ? "bg-gradient-to-r from-cyan-500 to-purple-600 text-white shadow-[0_0_20px_rgba(0,242,254,0.3)]"
                : "text-gray-400 hover:text-white"
            }`}
          >
            <ImageIcon size={16} />
            <span>Image-to-Video</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-bold flex items-center gap-3">
          <AlertCircle size={18} />
          <span>{error}</span>
        </div>
      )}

      {/* Main Form Layout */}
      <form onSubmit={handleGenerate} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Column: Model & Input Controls */}
        <div className="lg:col-span-2 space-y-6">
          {/* Model Selector Card */}
          <div className="p-6 rounded-3xl glass-panel border border-white/10 space-y-4">
            <ModelSelector
              selectedModelId={selectedModelId}
              onSelectModel={handleSelectModel}
              modelsCatalog={modelsCatalog}
              workerOnline={workerOnline}
            />
          </div>

          {/* Image Upload Area (If Image-to-Video Tab Active) */}
          {activeTab === "i2v" && (
            <div className="p-6 rounded-3xl glass-panel border border-cyan-500/30 space-y-4 bg-cyan-950/10">
              <label className="block text-xs font-bold text-gray-300 uppercase tracking-wider flex items-center gap-2">
                <ImageIcon size={14} className="text-cyan-400" />
                <span>Source Image to Animate</span>
              </label>

              {imageUrl ? (
                <div className="relative rounded-2xl overflow-hidden border border-cyan-500/40 group">
                  <img src={imageUrl} alt="Source upload" className="w-full h-56 object-cover" />
                  <button
                    type="button"
                    onClick={() => {
                      setImageUrl(null);
                      setImageName("");
                    }}
                    className="absolute top-3 right-3 p-2 rounded-xl bg-black/80 text-white hover:bg-red-500 transition-colors"
                  >
                    <X size={16} />
                  </button>
                  <div className="absolute bottom-0 inset-x-0 p-3 bg-black/60 backdrop-blur-sm text-xs font-mono text-cyan-300">
                    {imageName || "Source Image Loaded"}
                  </div>
                </div>
              ) : (
                <label className="border-2 border-dashed border-cyan-500/40 hover:border-cyan-400 rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer transition-colors text-center bg-black/20 group">
                  <Upload size={32} className="text-cyan-400 mb-2 group-hover:scale-110 transition-transform" />
                  <span className="text-sm font-bold text-white">Click or drag image to upload</span>
                  <span className="text-xs text-gray-400 mt-1">Supports PNG, JPG, WEBP (Max 10MB)</span>
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                </label>
              )}
            </div>
          )}

          {/* Prompt Entry Box */}
          <div className="p-6 rounded-3xl glass-panel border border-white/10 space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold text-gray-300 uppercase tracking-wider flex items-center gap-2">
                <Wand2 size={14} className="text-cyan-400" />
                <span>Video Generation Prompt</span>
              </label>

              <button
                type="button"
                onClick={handleEnhancePrompt}
                disabled={enhancingPrompt || !prompt.trim()}
                className="px-3 py-1 rounded-xl bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-bold hover:bg-purple-500/20 transition-all flex items-center gap-1.5 disabled:opacity-50"
              >
                <Sparkles size={12} className={enhancingPrompt ? "animate-spin text-purple-400" : "text-purple-400"} />
                <span>{enhancingPrompt ? "Enhancing..." : "Enhance Prompt"}</span>
              </button>
            </div>

            <textarea
              rows={4}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe the video motion, camera movement, environment, lighting and subject..."
              className="w-full p-4 rounded-2xl glass-input text-sm text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 transition-all font-sans leading-relaxed"
            />

            {/* Negative Prompt */}
            <div className="space-y-2 pt-2">
              <label className="text-xs font-bold text-gray-400 uppercase tracking-wider block">Negative Prompt</label>
              <input
                type="text"
                value={negativePrompt}
                onChange={(e) => setNegativePrompt(e.target.value)}
                placeholder="Elements to exclude (blurry, low quality, artifacts...)"
                className="w-full p-3 rounded-xl glass-input text-xs text-gray-300 focus:outline-none"
              />
            </div>
          </div>
        </div>

        {/* Right Column: Generation Settings & Submit Button */}
        <div className="space-y-6">
          <div className="p-6 rounded-3xl glass-panel border border-white/10 space-y-6">
            <h3 className="text-base font-bold text-white font-heading flex items-center gap-2 border-b border-white/10 pb-3">
              <Sliders size={18} className="text-cyan-400" />
              <span>Inference Parameters</span>
            </h3>

            {/* Duration Slider */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-gray-300">Duration</span>
                <span className="text-cyan-400 font-mono">{duration} Seconds</span>
              </div>
              <input
                type="range"
                min="2"
                max="10"
                value={duration}
                onChange={(e) => setDuration(Number(e.target.value))}
                className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
            </div>

            {/* Resolution Selector */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-300 block">Output Resolution</label>
              <div className="grid grid-cols-3 gap-2 text-xs font-bold">
                {["480p", "720p", "1080p"].map((res) => (
                  <button
                    key={res}
                    type="button"
                    onClick={() => setResolution(res)}
                    className={`py-2 rounded-xl border text-center transition-all ${
                      resolution === res
                        ? "bg-cyan-500/20 text-cyan-300 border-cyan-400 font-extrabold"
                        : "bg-white/5 border-white/10 text-gray-400 hover:text-white"
                    }`}
                  >
                    {res}
                  </button>
                ))}
              </div>
            </div>

            {/* FPS Selector */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-gray-300">Frame Rate (FPS)</span>
                <span className="text-cyan-400 font-mono">{fps} FPS</span>
              </div>
              <div className="grid grid-cols-4 gap-2 text-xs font-bold">
                {[8, 16, 24, 30].map((rate) => (
                  <button
                    key={rate}
                    type="button"
                    onClick={() => setFps(rate)}
                    className={`py-1.5 rounded-xl border text-center transition-all ${
                      fps === rate
                        ? "bg-purple-500/20 text-purple-300 border-purple-400"
                        : "bg-white/5 border-white/10 text-gray-400"
                    }`}
                  >
                    {rate}
                  </button>
                ))}
              </div>
            </div>

            {/* Inference Steps */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-gray-300">Inference Steps</span>
                <span className="text-cyan-400 font-mono">{steps} Steps</span>
              </div>
              <input
                type="range"
                min="10"
                max="60"
                step="5"
                value={steps}
                onChange={(e) => setSteps(Number(e.target.value))}
                className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
            </div>

            {/* Guidance Scale */}
            <div className="space-y-2">
              <div className="flex justify-between text-xs font-bold">
                <span className="text-gray-300">Guidance Scale (CFG)</span>
                <span className="text-cyan-400 font-mono">{guidanceScale.toFixed(1)}</span>
              </div>
              <input
                type="range"
                min="1.0"
                max="12.0"
                step="0.5"
                value={guidanceScale}
                onChange={(e) => setGuidanceScale(Number(e.target.value))}
                className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-cyan-400"
              />
            </div>

            {/* Seed */}
            <div className="space-y-2">
              <label className="text-xs font-bold text-gray-300 block">Random Seed (-1 for Random)</label>
              <input
                type="number"
                value={seed}
                onChange={(e) => setSeed(Number(e.target.value))}
                className="w-full p-2.5 rounded-xl glass-input text-xs font-mono text-center"
              />
            </div>

            {/* Estimated Credit Cost */}
            <div className="p-4 rounded-2xl bg-cyan-950/20 border border-cyan-500/30 flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <Coins size={16} className="text-amber-400" />
                <span className="font-bold text-gray-200">Required Credits</span>
              </div>
              <span className="font-black text-cyan-300 font-mono text-base">{creditCost} Credits</span>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={generating}
              className="w-full py-4 rounded-2xl btn-glow font-extrabold text-sm flex items-center justify-center gap-2 shadow-[0_0_30px_rgba(0,242,254,0.4)] disabled:opacity-50"
            >
              {generating ? (
                <span className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin" />
              ) : (
                <>
                  <Play size={18} className="fill-black" />
                  <span>Generate Video Now</span>
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}

export default function CreateVideoPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-cyan-400 font-semibold animate-pulse">Loading Motion Studio...</div>}>
      <CreateVideoContent />
    </Suspense>
  );
}
