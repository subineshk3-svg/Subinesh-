"use client";

import React from "react";
import { Cpu, Zap, Sparkles, CheckCircle2, ShieldCheck, Coins } from "lucide-react";

export default function ModelsPage() {
  const models = [
    {
      name: "VJ17 Auto Dynamic v3.2",
      provider: "VJ17 Neural Engine",
      tier: "BALANCED",
      cost: "10 Credits",
      maxRes: "1080p",
      maxDur: "15 seconds",
      features: ["Auto Motion Analysis", "Identity Preservation", "Fluid Physics"],
      status: "ONLINE",
    },
    {
      name: "VJ17 Cinema Pro 4K",
      provider: "VJ17 Neural Engine",
      tier: "QUALITY",
      cost: "15 Credits",
      maxRes: "4K Master",
      maxDur: "15 seconds",
      features: ["HDR Lighting", "Full 60fps Synthesis", "Complex Anatomy Lock"],
      status: "ONLINE",
    },
    {
      name: "VJ17 Speed Motion Turbo",
      provider: "VJ17 Neural Engine",
      tier: "FAST",
      cost: "6 Credits",
      maxRes: "720p",
      maxDur: "5 seconds",
      features: ["Sub-5s Queue Latency", "Rapid Social Clips", "Minimal Cost"],
      status: "ONLINE",
    },
    {
      name: "Luma Dream Engine v2",
      provider: "Luma AI",
      tier: "BALANCED",
      cost: "12 Credits",
      maxRes: "1080p",
      maxDur: "10 seconds",
      features: ["Photorealistic Water & Smoke", "Large Camera Sweeps"],
      status: "ONLINE",
    },
    {
      name: "Runway Gen-3 Alpha",
      provider: "Runway",
      tier: "QUALITY",
      cost: "14 Credits",
      maxRes: "1080p",
      maxDur: "10 seconds",
      features: ["High Temporal Consistency", "Director Mode Controls"],
      status: "ONLINE",
    },
    {
      name: "Pika 2.0 Motion",
      provider: "Pika Labs",
      tier: "FAST",
      cost: "8 Credits",
      maxRes: "720p",
      maxDur: "5 seconds",
      features: ["Facial Expression Shift", "Fast Render Times"],
      status: "ONLINE",
    },
  ];

  return (
    <div className="space-y-8">
      <div className="border-b border-white/10 pb-6">
        <h1 className="text-3xl font-extrabold text-white font-heading">AI Video Models Engine</h1>
        <p className="text-gray-400 text-xs mt-1">
          Unified model matrix. VJ17 intelligently routes jobs to optimal providers based on quality & speed options.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {models.map((m) => (
          <div
            key={m.name}
            className="p-6 rounded-2xl glass-panel glass-panel-hover border border-white/10 flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="px-2.5 py-1 rounded-md bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-[10px] font-bold uppercase">
                  {m.tier} TIER
                </span>
                <span className="text-xs font-bold text-emerald-400 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  {m.status}
                </span>
              </div>

              <h3 className="text-lg font-bold text-white font-heading">{m.name}</h3>
              <p className="text-xs text-gray-400 mt-0.5">{m.provider}</p>

              <div className="mt-4 space-y-2 text-xs">
                {m.features.map((feat) => (
                  <div key={feat} className="flex items-center gap-2 text-gray-300">
                    <CheckCircle2 size={14} className="text-cyan-400 shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="pt-4 border-t border-white/5 flex items-center justify-between text-xs font-semibold">
              <span className="text-gray-400">Cost:</span>
              <span className="text-cyan-300 flex items-center gap-1 font-bold">
                <Coins size={14} />
                {m.cost}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
