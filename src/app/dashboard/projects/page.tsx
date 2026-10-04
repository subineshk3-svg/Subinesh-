"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Film,
  Search,
  Filter,
  Play,
  Download,
  Trash2,
  RotateCcw,
  Copy,
  ExternalLink,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  X,
} from "lucide-react";
import { VideoPlayer } from "@/components/VideoPlayer";

export default function ProjectsLibraryPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [modelFilter, setModelFilter] = useState("ALL");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [user, setUser] = useState<any>(null);

  // Selected video for modal playback
  const [activeVideo, setActiveVideo] = useState<any>(null);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("vj17_user");
      if (stored) setUser(JSON.parse(stored));
    } catch (e) {}
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [user]);

  const fetchProjects = async () => {
    try {
      const userId = user?.id || "demo-user-session";
      const res = await fetch(`/api/projects?userId=${userId}&search=${search}&status=${statusFilter}`);
      const data = await res.json();
      if (data.projects) {
        setProjects(data.projects);
      }
    } catch (err) {
    } finally {
      setLoading(false);
    }
  };

  const filteredProjects = projects.filter((p) => {
    if (modelFilter !== "ALL" && p.model?.toLowerCase() !== modelFilter.toLowerCase()) return false;
    if (statusFilter !== "ALL" && p.status !== statusFilter) return false;
    if (search.trim() && !p.name?.toLowerCase().includes(search.toLowerCase()) && !p.prompt?.toLowerCase().includes(search.toLowerCase())) return false;
    return true;
  });

  return (
    <div className="space-y-8 pb-16 text-left">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-6">
        <div>
          <h1 className="text-3xl font-black text-white font-heading">My Videos Library</h1>
          <p className="text-xs text-gray-400 mt-1">
            Browse, play, download, and manage your AI-generated motion video assets.
          </p>
        </div>

        <Link
          href="/dashboard/create"
          className="px-5 py-2.5 rounded-xl btn-glow font-bold text-xs flex items-center gap-2"
        >
          <Sparkles size={16} />
          <span>Create New Video</span>
        </Link>
      </div>

      {/* Filter & Search Bar */}
      <div className="p-4 rounded-2xl glass-panel border border-white/10 flex flex-col md:flex-row items-center justify-between gap-4">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search prompts & titles..."
            className="w-full pl-9 pr-4 py-2.5 rounded-xl glass-input text-xs text-white placeholder-gray-500 focus:outline-none"
          />
        </div>

        {/* Filter Dropdowns */}
        <div className="flex items-center gap-3 w-full md:w-auto justify-end text-xs font-bold">
          <div className="flex items-center gap-1 text-gray-400">
            <Filter size={14} />
            <span>Model:</span>
          </div>
          <select
            value={modelFilter}
            onChange={(e) => setModelFilter(e.target.value)}
            className="p-2.5 rounded-xl glass-input text-xs font-bold bg-[#0a0a14] border border-white/10 text-cyan-300 focus:outline-none"
          >
            <option value="ALL">All Models</option>
            <option value="ltx-video">LTX-Video</option>
            <option value="wan2.1">Wan 2.1</option>
            <option value="wan2.2">Wan 2.2 Turbo</option>
            <option value="hunyuan">HunyuanVideo</option>
            <option value="cogvideo">CogVideoX</option>
            <option value="mochi">Mochi-1</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="p-2.5 rounded-xl glass-input text-xs font-bold bg-[#0a0a14] border border-white/10 text-cyan-300 focus:outline-none"
          >
            <option value="ALL">All Statuses</option>
            <option value="COMPLETED">Completed</option>
            <option value="QUEUED">Queued</option>
            <option value="PROCESSING">Processing</option>
            <option value="FAILED">Failed</option>
          </select>
        </div>
      </div>

      {/* Grid List */}
      {filteredProjects.length === 0 ? (
        <div className="p-12 rounded-3xl glass-panel border border-white/10 text-center space-y-4">
          <Film size={48} className="mx-auto text-gray-600 animate-pulse" />
          <h3 className="text-lg font-bold text-white">No Motion Videos Found</h3>
          <p className="text-xs text-gray-400 max-w-md mx-auto">
            You haven't generated any videos matching the selected filter criteria yet.
          </p>
          <Link href="/dashboard/create" className="px-5 py-2.5 rounded-xl btn-glow font-bold text-xs inline-block">
            Start First Video Generation
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <div
              key={project.id}
              className="rounded-3xl glass-panel border border-white/10 overflow-hidden group hover:border-cyan-500/40 transition-all space-y-3 p-4 flex flex-col justify-between"
            >
              <div className="relative rounded-2xl overflow-hidden bg-black aspect-video cursor-pointer" onClick={() => setActiveVideo(project)}>
                {project.generatedVideoUrl ? (
                  <video src={project.generatedVideoUrl} poster={project.thumbnailUrl} className="w-full h-full object-cover" />
                ) : (
                  <div className="w-full h-full bg-white/5 flex items-center justify-center text-gray-500">
                    <Film size={32} />
                  </div>
                )}
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                  <div className="w-12 h-12 rounded-full bg-cyan-500/80 text-black flex items-center justify-center font-bold">
                    <Play size={20} className="fill-black ml-0.5" />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-300 font-mono font-bold uppercase border border-cyan-500/30">
                    {project.model}
                  </span>
                  <span className="text-gray-400">{project.resolution} • {project.duration}s</span>
                </div>
                <h4 className="font-bold text-white text-sm line-clamp-1">{project.name || "Untitled Motion Asset"}</h4>
                <p className="text-xs text-gray-400 line-clamp-2 italic">"{project.prompt}"</p>
              </div>

              <div className="pt-2 border-t border-white/10 flex items-center justify-between text-xs">
                <button
                  onClick={() => setActiveVideo(project)}
                  className="text-cyan-400 font-bold hover:underline flex items-center gap-1"
                >
                  <Play size={12} />
                  <span>Play</span>
                </button>

                <Link
                  href={`/dashboard/create?tab=t2v&prompt=${encodeURIComponent(project.prompt || "")}`}
                  className="text-purple-400 font-bold hover:underline flex items-center gap-1"
                >
                  <RotateCcw size={12} />
                  <span>Duplicate</span>
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Video Modal Player */}
      {activeVideo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
          <div className="relative w-full max-w-3xl p-6 rounded-3xl glass-panel bg-[#0a0a14] border border-cyan-500/30 space-y-4">
            <button
              onClick={() => setActiveVideo(null)}
              className="absolute top-4 right-4 p-2 rounded-xl text-gray-400 hover:text-white"
            >
              <X size={20} />
            </button>
            <VideoPlayer
              src={activeVideo.generatedVideoUrl}
              poster={activeVideo.thumbnailUrl}
              modelName={activeVideo.model}
              prompt={activeVideo.prompt}
              duration={activeVideo.duration}
              resolution={activeVideo.resolution}
            />
          </div>
        </div>
      )}
    </div>
  );
}
