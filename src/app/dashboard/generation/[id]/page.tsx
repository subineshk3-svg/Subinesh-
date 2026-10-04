"use client";

import React, { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useParams, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import {
  Download,
  Share2,
  RotateCcw,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  Play,
  Film,
  Coins,
  Copy,
  ExternalLink,
  Layers,
  XCircle,
  Clock,
  Cpu,
} from "lucide-react";
import { VideoPlayer } from "@/components/VideoPlayer";

function GenerationProgressContent() {
  const params = useParams();
  const searchParams = useSearchParams();

  const jobId = params.id as string;
  const projectId = searchParams.get("projectId");

  const [jobStatus, setJobStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [cancelling, setCancelling] = useState(false);
  const [elapsedTime, setElapsedTime] = useState(0);

  const stages = [
    { key: "QUEUED", label: "Queued" },
    { key: "LOADING_MODEL", label: "Loading Model" },
    { key: "GENERATING", label: "Generating Frames" },
    { key: "PROCESSING", label: "FFmpeg Processing" },
    { key: "UPLOADING", label: "Uploading Render" },
    { key: "COMPLETED", label: "Ready" },
  ];

  // Live timer tick
  useEffect(() => {
    let timerInterval: NodeJS.Timeout;
    if (jobStatus?.status !== "COMPLETED" && jobStatus?.status !== "FAILED" && jobStatus?.status !== "CANCELLED") {
      timerInterval = setInterval(() => {
        setElapsedTime((prev) => prev + 1);
      }, 1000);
    }
    return () => clearInterval(timerInterval);
  }, [jobStatus?.status]);

  // Poll job status every 2 seconds until terminal state
  useEffect(() => {
    let interval: NodeJS.Timeout;

    const checkStatus = async () => {
      try {
        const res = await fetch(`/api/video/jobs/${jobId}`);
        const data = await res.json();
        if (data.job) {
          setJobStatus(data.job);
          if (data.job.error) {
            setError(data.job.error);
          }
          if (data.job.status === "COMPLETED" || data.job.status === "FAILED" || data.job.status === "CANCELLED") {
            clearInterval(interval);
          }
        }
      } catch (err: any) {
        setError(err.message || "Error polling GPU job status.");
      } finally {
        setLoading(false);
      }
    };

    checkStatus();
    interval = setInterval(checkStatus, 2000);

    return () => clearInterval(interval);
  }, [jobId]);

  const handleCancelJob = async () => {
    if (!jobId) return;
    setCancelling(true);
    try {
      const res = await fetch(`/api/video/jobs/${jobId}/cancel`, { method: "POST" });
      const data = await res.json();
      if (data.success) {
        setJobStatus((prev: any) => ({ ...prev, status: "CANCELLED", stage: "CANCELLED" }));
      }
    } catch (err) {
    } finally {
      setCancelling(false);
    }
  };

  const formatTimer = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const isComplete = jobStatus?.status === "COMPLETED";
  const isFailed = jobStatus?.status === "FAILED";
  const isCancelled = jobStatus?.status === "CANCELLED";

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16 text-left">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-6">
        <div>
          <h1 className="text-2xl font-black text-white font-heading">
            {isComplete ? "Motion Video Ready" : isFailed ? "Generation Failed" : isCancelled ? "Generation Cancelled" : "Generating Motion Video..."}
          </h1>
          <p className="text-gray-400 text-xs mt-1">
            Job ID: <span className="font-mono text-cyan-300">{jobId}</span>
          </p>
        </div>

        <div className="flex items-center gap-3">
          {!isComplete && !isFailed && !isCancelled && (
            <button
              onClick={handleCancelJob}
              disabled={cancelling}
              className="px-4 py-2 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs font-bold hover:bg-red-500/20 transition-all flex items-center gap-1.5"
            >
              <XCircle size={14} />
              <span>{cancelling ? "Cancelling..." : "Cancel Job"}</span>
            </button>
          )}

          <Link
            href="/dashboard/create"
            className="px-4 py-2 rounded-xl glass-panel text-xs font-bold text-gray-300 hover:text-white flex items-center gap-2"
          >
            <RotateCcw size={14} />
            <span>New Video</span>
          </Link>
        </div>
      </div>

      {/* ERROR BANNER */}
      {(error || isFailed) && (
        <div className="p-6 rounded-3xl bg-red-500/10 border border-red-500/30 text-red-300 space-y-3">
          <div className="flex items-center gap-3 font-bold text-red-400 text-sm">
            <AlertCircle size={20} />
            <span>Generation Failed</span>
          </div>
          <p className="text-xs leading-relaxed font-mono">
            {error || jobStatus?.error || "Video generation failed on GPU worker. Reserved credits have been automatically refunded to your account."}
          </p>
          <div className="pt-2 flex items-center gap-3">
            <Link
              href="/dashboard/create"
              className="px-4 py-2 rounded-xl btn-glow text-xs font-bold"
            >
              Try Lower Resolution or Steps
            </Link>
          </div>
        </div>
      )}

      {/* GENERATION PROGRESS TRACKER */}
      {!isComplete && !isFailed && !isCancelled && (
        <div className="p-8 rounded-3xl glass-panel border border-cyan-500/30 space-y-8 bg-cyan-950/10 shadow-[0_0_40px_rgba(0,242,254,0.1)] text-center">
          <div className="w-16 h-16 rounded-2xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center mx-auto border border-cyan-500/40 animate-pulse">
            <Sparkles size={32} />
          </div>

          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">Current Stage</span>
            <h2 className="text-xl font-extrabold text-white mt-1">
              {jobStatus?.stage ? jobStatus.stage.replace("_", " ") : "QUEUED"}
            </h2>
          </div>

          {/* Honest Progress Bar */}
          <div className="space-y-2">
            <div className="w-full bg-white/10 rounded-full h-3.5 overflow-hidden p-0.5 border border-white/10">
              <div
                className="bg-gradient-to-r from-cyan-400 via-purple-500 to-pink-500 h-full rounded-full transition-all duration-500 shadow-[0_0_15px_#00f2fe]"
                style={{ width: `${Math.max(jobStatus?.progress || 10, 5)}%` }}
              />
            </div>
            <div className="flex justify-between text-xs text-gray-400 font-mono">
              <span>{jobStatus?.progress || 10}% Complete</span>
              <span className="flex items-center gap-1">
                <Clock size={12} className="text-cyan-400" />
                <span>Elapsed: {formatTimer(elapsedTime)}</span>
              </span>
            </div>
          </div>

          {/* Stage Steps Visualizer */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-2 text-[11px] pt-4">
            {stages.map((st, idx) => {
              const currentIdx = stages.findIndex((s) => s.key === jobStatus?.stage);
              const isPast = idx < currentIdx;
              const isCurrent = idx === currentIdx;

              return (
                <div
                  key={st.key}
                  className={`p-2.5 rounded-xl border text-center font-semibold flex flex-col items-center justify-center gap-1 transition-all ${
                    isCurrent
                      ? "bg-cyan-500/20 text-cyan-300 border-cyan-400 shadow-[0_0_15px_rgba(0,242,254,0.2)] animate-pulse"
                      : isPast
                      ? "bg-emerald-500/10 text-emerald-300 border-emerald-500/30"
                      : "bg-white/5 text-gray-500 border-white/5"
                  }`}
                >
                  <span className="text-[10px] opacity-60">Step {idx + 1}</span>
                  <span className="line-clamp-1">{st.label}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* COMPLETED VIDEO PLAYER SECTION */}
      {isComplete && jobStatus?.videoUrl && (
        <VideoPlayer
          src={jobStatus.videoUrl}
          poster={jobStatus.thumbnailUrl}
          modelName="VJ17 Open-Source AI Video Model"
        />
      )}
    </div>
  );
}

export default function GenerationProgressPage() {
  return (
    <Suspense fallback={<div className="p-8 text-center text-cyan-400 font-semibold animate-pulse">Loading Video Status...</div>}>
      <GenerationProgressContent />
    </Suspense>
  );
}
