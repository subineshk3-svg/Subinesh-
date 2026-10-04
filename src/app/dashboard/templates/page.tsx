"use client";

import React from "react";
import Link from "next/link";
import { LayoutTemplate, Sparkles, Camera, ArrowRight, Play } from "lucide-react";

export default function TemplatesPage() {
  const templates = [
    {
      id: "portrait",
      title: "Cinematic Portrait",
      category: "People / Model",
      description: "Slow push-in with gentle hair breeze & identity lock.",
      camera: "Dolly In",
      aspectRatio: "16:9",
      image: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=800&q=80",
    },
    {
      id: "travel",
      title: "Travel & Landscape",
      category: "Nature / Outdoor",
      description: "Majestic wide sweep with drifting clouds & horizon pan.",
      camera: "Pan Right",
      aspectRatio: "16:9",
      image: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=800&q=80",
    },
    {
      id: "product",
      title: "Commercial Product",
      category: "Advertisement",
      description: "360-degree orbital rotation with studio lighting bloom.",
      camera: "Orbit 360",
      aspectRatio: "1:1",
      image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=800&q=80",
    },
    {
      id: "social-reel",
      title: "Social Media Reel",
      category: "TikTok / Shorts / Reels",
      description: "Dynamic vertical zoom with subtle background parallax.",
      camera: "Slow Zoom In",
      aspectRatio: "9:16",
      image: "https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=800&q=80",
    },
    {
      id: "wedding",
      title: "Elegant Wedding",
      category: "Events & Romance",
      description: "Soft handheld slow-motion drift with golden rim light.",
      camera: "Handheld",
      aspectRatio: "16:9",
      image: "https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=800&q=80",
    },
    {
      id: "fantasy",
      title: "Fantasy Realm",
      category: "Creative / Sci-Fi",
      description: "Floating particle atmosphere with magical glow shifts.",
      camera: "Crane Up",
      aspectRatio: "16:9",
      image: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=800&q=80",
    },
  ];

  return (
    <div className="space-y-8">
      <div className="border-b border-white/10 pb-6">
        <h1 className="text-3xl font-extrabold text-white font-heading">Animation Templates</h1>
        <p className="text-gray-400 text-xs mt-1">
          Ready-made camera presets and motion trajectories for instant creation.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {templates.map((tpl) => (
          <div
            key={tpl.id}
            className="rounded-2xl glass-panel glass-panel-hover border border-white/10 overflow-hidden flex flex-col justify-between"
          >
            <div className="relative h-48 bg-black overflow-hidden group">
              <img
                src={tpl.image}
                alt={tpl.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <span className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-black/60 backdrop-blur-md text-[10px] font-bold text-cyan-300 border border-white/10">
                {tpl.category}
              </span>
            </div>

            <div className="p-5 space-y-4">
              <div>
                <h3 className="font-bold text-white text-base">{tpl.title}</h3>
                <p className="text-gray-400 text-xs mt-1">{tpl.description}</p>
              </div>

              <div className="flex items-center justify-between text-xs pt-2 border-t border-white/5">
                <span className="text-gray-400 flex items-center gap-1">
                  <Camera size={14} className="text-cyan-400" />
                  {tpl.camera}
                </span>
                <span className="font-mono text-cyan-300 font-semibold">{tpl.aspectRatio}</span>
              </div>

              <Link
                href={`/dashboard/create?template=${tpl.id}`}
                className="w-full py-2.5 rounded-xl btn-glow font-bold text-xs flex items-center justify-center gap-2 shadow-[0_0_15px_rgba(0,242,254,0.3)]"
              >
                <span>Use Template</span>
                <ArrowRight size={14} />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
