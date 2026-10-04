"use client";

import React, { useState, useRef, useEffect } from "react";
import {
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize2,
  Minimize2,
  Download,
  Share2,
  Sparkles,
  Info,
  Sliders,
  Check,
} from "lucide-react";

interface VideoPlayerProps {
  src: string;
  poster?: string;
  modelName?: string;
  prompt?: string;
  duration?: number;
  resolution?: string;
  fps?: number;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  src,
  poster,
  modelName = "VJ17 Open-Source AI Video Model",
  prompt,
  duration = 5,
  resolution = "1080p",
  fps = 24,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentTime, setCurrentTime] = useState(0);
  const [totalDuration, setTotalDuration] = useState(duration);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [showPromptInspector, setShowPromptInspector] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
      if (video.duration) {
        setProgress((video.currentTime / video.duration) * 100);
        setTotalDuration(video.duration);
      }
    };

    const handleEnded = () => setIsPlaying(false);

    video.addEventListener("timeupdate", handleTimeUpdate);
    video.addEventListener("ended", handleEnded);

    return () => {
      video.removeEventListener("timeupdate", handleTimeUpdate);
      video.removeEventListener("ended", handleEnded);
    };
  }, []);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!videoRef.current || !videoRef.current.duration) return;
    const seekTime = (parseFloat(e.target.value) / 100) * videoRef.current.duration;
    videoRef.current.currentTime = seekTime;
    setProgress(parseFloat(e.target.value));
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const handleSpeedChange = (speed: number) => {
    if (!videoRef.current) return;
    videoRef.current.playbackRate = speed;
    setPlaybackSpeed(speed);
  };

  const handleFullscreen = () => {
    if (!videoRef.current) return;
    if (videoRef.current.requestFullscreen) {
      videoRef.current.requestFullscreen();
    }
  };

  const handleDownload = () => {
    const a = document.createElement("a");
    a.href = src;
    a.download = `VJ17-AI-Video-${Date.now()}.mp4`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  const handleCopyPrompt = () => {
    if (!prompt) return;
    navigator.clipboard.writeText(prompt);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const formatTime = (timeInSec: number) => {
    const mins = Math.floor(timeInSec / 60);
    const secs = Math.floor(timeInSec % 60);
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="space-y-4">
      {/* Video Container */}
      <div className="relative rounded-3xl overflow-hidden glass-panel border border-cyan-500/40 bg-black group shadow-[0_0_50px_rgba(0,242,254,0.2)]">
        <video
          ref={videoRef}
          src={src}
          poster={poster}
          playsInline
          loop
          className="w-full h-[400px] md:h-[500px] object-cover cursor-pointer"
          onClick={togglePlay}
        />

        {/* Big Play Overlay Button when paused */}
        {!isPlaying && (
          <button
            onClick={togglePlay}
            className="absolute inset-0 m-auto w-20 h-20 rounded-full bg-cyan-500/30 text-cyan-300 border border-cyan-400/60 backdrop-blur-md flex items-center justify-center transition-all transform hover:scale-110 shadow-[0_0_40px_rgba(0,242,254,0.4)]"
          >
            <Play size={36} className="ml-1 fill-cyan-300" />
          </button>
        )}

        {/* Video Control Bar */}
        <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/90 via-black/60 to-transparent backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 space-y-2">
          {/* Progress Slider Bar */}
          <input
            type="range"
            min="0"
            max="100"
            value={progress}
            onChange={handleSeek}
            className="w-full h-1.5 bg-white/20 rounded-lg appearance-none cursor-pointer accent-cyan-400 hover:h-2 transition-all"
          />

          <div className="flex items-center justify-between text-xs text-gray-200">
            <div className="flex items-center gap-3">
              <button onClick={togglePlay} className="p-1.5 rounded-lg hover:bg-white/10 text-cyan-300">
                {isPlaying ? <Pause size={18} /> : <Play size={18} />}
              </button>

              <button onClick={toggleMute} className="p-1.5 rounded-lg hover:bg-white/10 text-gray-300">
                {isMuted ? <VolumeX size={18} /> : <Volume2 size={18} />}
              </button>

              <span className="font-mono text-xs">
                {formatTime(currentTime)} / {formatTime(totalDuration)}
              </span>
            </div>

            <div className="flex items-center gap-3">
              {/* Playback speed selector */}
              <div className="flex items-center gap-1 font-mono text-[11px] bg-white/10 rounded-lg px-2 py-1">
                {[0.5, 1, 1.5, 2].map((s) => (
                  <button
                    key={s}
                    onClick={() => handleSpeedChange(s)}
                    className={`px-1 rounded ${playbackSpeed === s ? "text-cyan-400 font-bold" : "text-gray-400"}`}
                  >
                    {s}x
                  </button>
                ))}
              </div>

              <button onClick={handleFullscreen} className="p-1.5 rounded-lg hover:bg-white/10 text-gray-300">
                <Maximize2 size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Video Action Footer */}
      <div className="p-6 rounded-2xl glass-panel border border-white/10 flex flex-col md:flex-row items-center justify-between gap-6 text-left">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-bold font-mono">
              Generated with {modelName}
            </span>
            <span className="text-xs text-gray-400">• {resolution} • {fps} FPS • {totalDuration.toFixed(1)}s</span>
          </div>
          {prompt && (
            <p className="text-xs text-gray-300 line-clamp-2 italic">"{prompt}"</p>
          )}
        </div>

        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            onClick={handleDownload}
            className="px-5 py-2.5 rounded-xl btn-glow font-bold text-xs flex items-center gap-2 shadow-[0_0_20px_rgba(0,242,254,0.3)]"
          >
            <Download size={16} />
            <span>Download MP4</span>
          </button>

          {prompt && (
            <button
              onClick={handleCopyPrompt}
              className="px-4 py-2.5 rounded-xl glass-panel text-xs font-semibold text-gray-200 hover:text-white flex items-center gap-2 border border-white/10"
            >
              {copied ? <Check size={16} className="text-emerald-400" /> : <Info size={16} className="text-cyan-400" />}
              <span>{copied ? "Prompt Copied!" : "Copy Prompt"}</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
