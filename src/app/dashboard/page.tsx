"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { Plus, Video, Sparkles, Wand2, FolderKanban, ArrowRight, Play, Clock, CheckCircle2 } from "lucide-react";

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("vj17_user");
      if (stored) {
        const u = JSON.parse(stored);
        setUser(u);
        fetchProjects(u.id);
      }
    } catch (e) {
      setLoading(false);
    }
  }, []);

  const fetchProjects = async (userId: string) => {
    try {
      const res = await fetch(`/api/projects?userId=${userId}`);
      const data = await res.json();
      if (data.projects) {
        setProjects(data.projects);
      }
    } catch (e) {
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8">
      {/* Welcome Banner */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative rounded-3xl p-8 glass-panel border border-cyan-500/30 overflow-hidden shadow-[0_0_40px_rgba(0,242,254,0.1)]"
      >
        <div className="absolute top-0 right-0 w-96 h-full bg-gradient-to-l from-cyan-500/10 via-purple-600/10 to-transparent pointer-events-none" />

        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold uppercase tracking-wider mb-4">
            <Sparkles size={14} className="text-cyan-400" />
            VJ17 AI Motion Workspace
          </div>

          <h1 className="text-3xl md:text-4xl font-extrabold text-white font-heading tracking-tight">
            Welcome back, <span className="gradient-text">{user?.name || "Creator"}</span>
          </h1>

          <p className="text-gray-300 text-sm mt-2 leading-relaxed">
            What will you create today? Transform any photograph into a cinematic moving masterpiece with camera paths and physics control.
          </p>

          <div className="mt-6 flex flex-wrap gap-4">
            <Link
              href="/dashboard/create"
              className="px-6 py-3.5 rounded-xl btn-glow font-bold text-sm flex items-center gap-2 shadow-[0_0_25px_rgba(0,242,254,0.4)]"
            >
              <Plus size={18} />
              <span>+ Create New Video</span>
            </Link>
            <Link
              href="/dashboard/templates"
              className="px-6 py-3.5 rounded-xl glass-panel glass-panel-hover font-semibold text-sm text-gray-200 flex items-center gap-2 border border-white/10"
            >
              <Wand2 size={16} className="text-cyan-400" />
              <span>Explore Templates</span>
            </Link>
          </div>
        </div>
      </motion.div>

      {/* Quick Action Modes Showcase */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Link
          href="/dashboard/create?mode=simple"
          className="p-6 rounded-2xl glass-panel glass-panel-hover border border-white/10 flex flex-col justify-between group"
        >
          <div>
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-4 group-hover:scale-110 transition-transform">
              <Wand2 size={20} />
            </div>
            <h3 className="font-bold text-white text-base mb-1">Simple Mode</h3>
            <p className="text-gray-400 text-xs leading-relaxed">
              Upload photo → 1-click Auto Animate. Fast & simple.
            </p>
          </div>
          <span className="mt-4 text-xs font-bold text-cyan-400 flex items-center gap-1">
            Start Simple Mode <ArrowRight size={14} />
          </span>
        </Link>

        <Link
          href="/dashboard/create?mode=creator"
          className="p-6 rounded-2xl glass-panel glass-panel-hover border border-white/10 flex flex-col justify-between group"
        >
          <div>
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 mb-4 group-hover:scale-110 transition-transform">
              <Video size={20} />
            </div>
            <h3 className="font-bold text-white text-base mb-1">Creator Mode</h3>
            <p className="text-gray-400 text-xs leading-relaxed">
              Customize subject motion, camera presets & VJ17 Prompt Director.
            </p>
          </div>
          <span className="mt-4 text-xs font-bold text-purple-400 flex items-center gap-1">
            Start Creator Mode <ArrowRight size={14} />
          </span>
        </Link>

        <Link
          href="/dashboard/create?mode=advanced"
          className="p-6 rounded-2xl glass-panel glass-panel-hover border border-white/10 flex flex-col justify-between group"
        >
          <div>
            <div className="w-10 h-10 rounded-xl bg-pink-500/10 border border-pink-500/30 flex items-center justify-center text-pink-400 mb-4 group-hover:scale-110 transition-transform">
              <Sparkles size={20} />
            </div>
            <h3 className="font-bold text-white text-base mb-1">Advanced Mode</h3>
            <p className="text-gray-400 text-xs leading-relaxed">
              Full negative prompts, custom seed, multi-model engine routing.
            </p>
          </div>
          <span className="mt-4 text-xs font-bold text-pink-400 flex items-center gap-1">
            Start Advanced Mode <ArrowRight size={14} />
          </span>
        </Link>
      </div>

      {/* Recent Projects Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-bold text-white font-heading flex items-center gap-2">
            <FolderKanban size={20} className="text-cyan-400" />
            <span>Recent Motion Creations</span>
          </h2>
          <Link href="/dashboard/projects" className="text-xs font-bold text-cyan-400 hover:underline">
            View All Projects →
          </Link>
        </div>

        {loading ? (
          <div className="py-12 text-center text-gray-500 text-sm">Loading projects...</div>
        ) : projects.length === 0 ? (
          <div className="p-12 rounded-2xl glass-panel text-center border border-white/10 space-y-4">
            <div className="w-16 h-16 rounded-full bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mx-auto">
              <Video size={28} />
            </div>
            <h3 className="text-lg font-bold text-white">No projects created yet</h3>
            <p className="text-gray-400 text-xs max-w-md mx-auto">
              Your first cinematic creation starts with a photograph. Upload a photo and transform it into motion now!
            </p>
            <Link
              href="/dashboard/create"
              className="inline-flex px-6 py-3 rounded-xl btn-glow font-bold text-xs shadow-[0_0_20px_rgba(0,242,254,0.3)]"
            >
              Create Your First Video
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.slice(0, 3).map((proj) => (
              <div
                key={proj.id}
                className="rounded-2xl glass-panel glass-panel-hover border border-white/10 overflow-hidden flex flex-col justify-between"
              >
                <div className="relative h-44 bg-black overflow-hidden group">
                  <img
                    src={proj.thumbnailUrl || proj.originalImageUrl}
                    alt={proj.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                  <span className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-black/60 backdrop-blur-md text-[10px] font-bold text-cyan-300 border border-white/10">
                    {proj.model}
                  </span>
                  <span className="absolute bottom-3 right-3 px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 text-[10px] font-mono">
                    {proj.duration}s • {proj.resolution}
                  </span>
                </div>

                <div className="p-4">
                  <h4 className="font-bold text-white text-sm truncate">{proj.name}</h4>
                  <p className="text-gray-400 text-xs line-clamp-1 mt-1">{proj.prompt}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
