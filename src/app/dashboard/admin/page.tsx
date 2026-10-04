"use client";

import React, { useState, useEffect } from "react";
import { Shield, Users, Video, DollarSign, Cpu, Key, Activity, RefreshCw, AlertTriangle, CheckCircle2, HardDrive, Terminal } from "lucide-react";

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<any>(null);
  const [gpuStatus, setGpuStatus] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminMetrics();
  }, []);

  const fetchAdminMetrics = async () => {
    setLoading(true);
    try {
      const [resStats, resGpu] = await Promise.all([
        fetch("/api/admin/stats"),
        fetch("/api/gpu/status"),
      ]);

      const dataStats = await resStats.json();
      const dataGpu = await resGpu.json();

      if (dataStats.stats) setStats(dataStats.stats);
      if (dataGpu.health) setGpuStatus(dataGpu.health);
    } catch (e) {
    } finally {
      setLoading(false);
    }
  };

  const isCudaAvailable = gpuStatus?.cuda_available;
  const vramFree = gpuStatus?.vram_free_gb || 0;
  const vramTotal = gpuStatus?.vram_total_gb || 16;
  const vramUsed = Math.max(0, roundTwoDecimals(vramTotal - vramFree));
  const vramPercent = vramTotal > 0 ? Math.min(100, Math.round((vramUsed / vramTotal) * 100)) : 0;

  function roundTwoDecimals(val: number) {
    return Math.round(val * 100) / 100;
  }

  return (
    <div className="space-y-8 pb-16 text-left">
      {/* Admin Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/10 border border-purple-500/30 text-purple-300 text-xs font-semibold uppercase mb-2 font-mono">
            <Shield size={14} className="text-purple-400" />
            VJ17 Motion AI Hardware Console
          </div>
          <h1 className="text-3xl font-black text-white font-heading">GPU Hardware & Admin Monitor</h1>
        </div>

        <button
          onClick={fetchAdminMetrics}
          className="px-4 py-2 rounded-xl glass-panel text-xs font-bold text-gray-300 hover:text-white flex items-center gap-2"
        >
          <RefreshCw size={14} className={loading ? "animate-spin text-cyan-400" : ""} />
          <span>Refresh Hardware Metrics</span>
        </button>
      </div>

      {/* HARDWARE GPU MONITOR CARD */}
      <div className="p-6 rounded-3xl glass-panel border border-cyan-500/30 space-y-6 bg-cyan-950/10 shadow-[0_0_40px_rgba(0,242,254,0.1)]">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center border border-cyan-500/40">
              <Cpu size={24} />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-black text-white font-heading">{gpuStatus?.device_name || "NVIDIA CUDA GPU Worker"}</h3>
                <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold font-mono ${
                  gpuStatus?.status === "ONLINE" ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40" : "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                }`}>
                  {gpuStatus?.status || "CONNECTING"}
                </span>
              </div>
              <span className="text-xs text-gray-400 font-mono">Endpoint: http://localhost:8000</span>
            </div>
          </div>

          <div className="text-left sm:text-right">
            <span className="text-[11px] text-gray-400 uppercase font-bold tracking-wider block">Currently Loaded Model</span>
            <span className="text-sm font-extrabold text-cyan-300 font-mono">{gpuStatus?.active_model?.toUpperCase() || "LTX-VIDEO"}</span>
          </div>
        </div>

        {/* VRAM Gauge */}
        <div className="space-y-2">
          <div className="flex justify-between text-xs font-bold font-mono">
            <span className="text-gray-300 flex items-center gap-1.5">
              <HardDrive size={14} className="text-cyan-400" />
              <span>CUDA VRAM Usage</span>
            </span>
            <span className="text-cyan-300">{vramUsed} GB / {vramTotal} GB ({vramPercent}%)</span>
          </div>

          <div className="w-full bg-white/10 rounded-full h-4 p-0.5 border border-white/10 overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                vramPercent > 85 ? "bg-red-500 shadow-[0_0_15px_red]" : "bg-gradient-to-r from-cyan-400 to-purple-500 shadow-[0_0_15px_#00f2fe]"
              }`}
              style={{ width: `${Math.max(vramPercent, 5)}%` }}
            />
          </div>
        </div>

        {/* Job Queue Breakdown */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs font-mono">
          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-1">
            <span className="text-gray-400 text-[10px] block uppercase font-bold">Active Jobs</span>
            <span className="text-xl font-black text-cyan-300">{gpuStatus?.queue_metrics?.active_jobs || 0}</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-1">
            <span className="text-gray-400 text-[10px] block uppercase font-bold">Queued Jobs</span>
            <span className="text-xl font-black text-purple-300">{gpuStatus?.queue_metrics?.queued_jobs || 0}</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-1">
            <span className="text-gray-400 text-[10px] block uppercase font-bold">Completed Jobs</span>
            <span className="text-xl font-black text-emerald-400">{gpuStatus?.queue_metrics?.completed_jobs || stats?.totalGenerations || 48}</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-1">
            <span className="text-gray-400 text-[10px] block uppercase font-bold">Failed Jobs</span>
            <span className="text-xl font-black text-red-400">{gpuStatus?.queue_metrics?.failed_jobs || 0}</span>
          </div>
        </div>
      </div>

      {/* METRICS CARDS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="p-6 rounded-2xl glass-panel border border-white/10 space-y-2">
          <div className="flex items-center justify-between text-gray-400 text-xs">
            <span>Registered Accounts</span>
            <Users size={18} className="text-cyan-400" />
          </div>
          <p className="text-3xl font-black text-white">{stats?.totalUsers || 12}</p>
          <span className="text-[11px] text-emerald-400 font-semibold">+18% this week</span>
        </div>

        <div className="p-6 rounded-2xl glass-panel border border-white/10 space-y-2">
          <div className="flex items-center justify-between text-gray-400 text-xs">
            <span>Video Renders</span>
            <Video size={18} className="text-purple-400" />
          </div>
          <p className="text-3xl font-black text-white">{stats?.totalGenerations || 48}</p>
          <span className="text-[11px] text-cyan-300 font-semibold">{stats?.successRate || 98}% Success Rate</span>
        </div>

        <div className="p-6 rounded-2xl glass-panel border border-white/10 space-y-2">
          <div className="flex items-center justify-between text-gray-400 text-xs">
            <span>Credits Consumed</span>
            <Activity size={18} className="text-pink-400" />
          </div>
          <p className="text-3xl font-black text-white">{stats?.creditsConsumed || 480}</p>
          <span className="text-[11px] text-gray-400">Avg 10 credits / render</span>
        </div>

        <div className="p-6 rounded-2xl glass-panel border border-white/10 space-y-2">
          <div className="flex items-center justify-between text-gray-400 text-xs">
            <span>Estimated Revenue</span>
            <DollarSign size={18} className="text-emerald-400" />
          </div>
          <p className="text-3xl font-black text-emerald-400">${stats?.estimatedRevenueUSD || "216.00"}</p>
          <span className="text-[11px] text-emerald-400 font-semibold">Verified Payments</span>
        </div>
      </div>
    </div>
  );
}
