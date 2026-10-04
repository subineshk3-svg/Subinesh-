"use client";

import React, { useState } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Sparkles,
  Play,
  Video,
  Wand2,
  Camera,
  Layers,
  Volume2,
  Cpu,
  ArrowRight,
  CheckCircle2,
  Sliders,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { Logo } from "@/components/Logo";

export default function LandingPage() {
  const [sliderPos, setSliderPos] = useState(50);
  const [activeCameraIndex, setActiveCameraIndex] = useState(0);

  const cameraPresets = [
    { name: "Dolly In", desc: "Slow cinematic push-in toward focal subject" },
    { name: "Orbit 360°", desc: "Smooth 360-degree rotational camera spin" },
    { name: "Pan Right", desc: "Fluid horizontal sweep across environment" },
    { name: "Crane Up", desc: "Dramatic vertical elevation camera sweep" },
    { name: "Handheld", desc: "Natural organic camera micro-shake effect" },
    { name: "Tilt Down", desc: "Subtle downward vertical angle shift" },
  ];

  return (
    <div className="min-h-screen bg-[#06060a] text-gray-100 flex flex-col selection:bg-cyan-500 selection:text-black">
      {/* Navigation Bar */}
      <header className="sticky top-0 z-50 backdrop-blur-xl bg-[#06060a]/80 border-b border-white/10 px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <Logo size="md" />

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-300">
            <a href="#features" className="hover:text-cyan-400 transition-colors">Features</a>
            <a href="#interactive-demo" className="hover:text-cyan-400 transition-colors">Interactive Demo</a>
            <a href="#models" className="hover:text-cyan-400 transition-colors">AI Models</a>
            <a href="#pricing" className="hover:text-cyan-400 transition-colors">Pricing</a>
          </nav>

          <div className="flex items-center gap-4">
            <Link
              href="/login"
              className="px-4 py-2 text-sm font-semibold text-gray-200 hover:text-white transition-colors"
            >
              Sign In
            </Link>
            <Link
              href="/register"
              className="px-5 py-2.5 text-sm font-bold rounded-xl btn-glow flex items-center gap-2"
            >
              <span>Get Started</span>
              <ArrowRight size={16} />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-20 pb-28 px-6 overflow-hidden">
        {/* Particle Glow accents */}
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[700px] h-[350px] bg-gradient-to-r from-cyan-500/20 via-purple-600/20 to-pink-500/10 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-6xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold uppercase tracking-widest mb-6"
          >
            <Sparkles size={14} className="animate-spin text-cyan-400" />
            Next-Gen AI Image-To-Video Platform
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="text-5xl md:text-7xl font-black tracking-tight mb-6 leading-tight font-heading"
          >
            Turn Every Photo Into <br />
            <span className="gradient-text">Motion.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto mb-10 leading-relaxed"
          >
            Transform a single photograph into a cinematic AI-generated video with realistic motion, camera movement and visual effects.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.3 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16"
          >
            <Link
              href="/register"
              className="w-full sm:w-auto px-8 py-4 rounded-xl text-base font-bold btn-glow flex items-center justify-center gap-3 shadow-[0_0_30px_rgba(0,242,254,0.4)]"
            >
              <Wand2 size={20} />
              <span>Create Your First Video</span>
            </Link>
            <a
              href="#interactive-demo"
              className="w-full sm:w-auto px-8 py-4 rounded-xl text-base font-semibold glass-panel glass-panel-hover flex items-center justify-center gap-2 border border-white/10"
            >
              <Play size={18} className="text-cyan-400" />
              <span>Explore Features</span>
            </a>
          </motion.div>

          {/* Hero Visual Before / After Split Slider Experience */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative max-w-4xl mx-auto rounded-3xl overflow-hidden glass-panel border border-cyan-500/30 p-2 shadow-[0_0_50px_rgba(0,242,254,0.15)]"
          >
            <div id="interactive-demo" className="relative h-[380px] md:h-[480px] rounded-2xl overflow-hidden select-none">
              {/* Still Photo Layer */}
              <img
                src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=80"
                alt="Still Photo"
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div className="absolute top-4 left-4 z-20 px-3 py-1.5 rounded-lg bg-black/70 backdrop-blur-md text-xs font-bold text-gray-300 border border-white/10 flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-amber-400" />
                STILL PHOTO
              </div>

              {/* Animated AI Motion Layer */}
              <div
                className="absolute top-0 right-0 bottom-0 overflow-hidden border-l-2 border-cyan-400 shadow-[0_0_20px_#00f2fe]"
                style={{ width: `${100 - sliderPos}%` }}
              >
                <img
                  src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1200&q=80"
                  alt="AI Motion Video"
                  className="absolute top-0 right-0 h-full w-[800px] md:w-[1000px] max-w-none object-cover scale-105 animate-pulse-slow"
                />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-cyan-500/10 to-purple-600/20" />
                <div className="absolute top-4 right-4 z-20 px-3 py-1.5 rounded-lg bg-cyan-950/80 backdrop-blur-md text-xs font-bold text-cyan-300 border border-cyan-500/40 flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                  AI MOTION GENERATED
                </div>
              </div>

              {/* Slider Controls Handle */}
              <div
                className="absolute top-0 bottom-0 z-30 flex items-center justify-center -ml-4 cursor-ew-resize"
                style={{ left: `${sliderPos}%` }}
              >
                <div className="w-8 h-8 rounded-full bg-cyan-400 text-black flex items-center justify-center shadow-[0_0_20px_#00f2fe]">
                  <Sliders size={16} />
                </div>
              </div>

              {/* Interactive Range Input */}
              <input
                type="range"
                min="0"
                max="100"
                value={sliderPos}
                onChange={(e) => setSliderPos(Number(e.target.value))}
                className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-40"
              />
            </div>

            <div className="p-4 bg-[#0a0a14]/90 flex items-center justify-between text-xs text-gray-400 border-t border-white/10">
              <span className="font-semibold text-cyan-400">Interactive Preview: Slide left/right to compare Photo vs AI Video Motion</span>
              <span className="hidden sm:inline">VJ17 Motion Engine v3.2</span>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Grid Section */}
      <section id="features" className="py-24 px-6 bg-gradient-to-b from-transparent via-vjDark-900/50 to-transparent">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-extrabold mb-4 font-heading">
              Powered by Next-Generation <span className="gradient-text">AI Motion Architecture</span>
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto text-base">
              Transform static assets into studio-grade moving masterpieces with full director control over physics, camera paths, and styles.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* Card 1 */}
            <div className="glass-panel p-8 rounded-2xl glass-panel-hover border border-white/10 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-6">
                  <Video size={24} />
                </div>
                <h3 className="text-xl font-bold mb-3 text-white">Photo to Video</h3>
                <p className="text-gray-400 text-sm leading-relaxed mb-6">
                  Turn any portrait, landscape, product photo or artwork into realistic high-definition moving videos in seconds.
                </p>
              </div>
              <div className="text-xs font-semibold text-cyan-400 flex items-center gap-2">
                <span>HD & 4K Resolution Supported</span>
                <CheckCircle2 size={14} />
              </div>
            </div>

            {/* Card 2 */}
            <div className="glass-panel p-8 rounded-2xl glass-panel-hover border border-white/10 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center text-purple-400 mb-6">
                  <Wand2 size={24} />
                </div>
                <h3 className="text-xl font-bold mb-3 text-white">AI Auto Animate</h3>
                <p className="text-gray-400 text-sm leading-relaxed mb-6">
                  Let AI analyze subject composition, environment, and lighting to automatically generate optimal camera & motion trajectories.
                </p>
              </div>
              <div className="text-xs font-semibold text-purple-400 flex items-center gap-2">
                <span>1-Click Automated Workflow</span>
                <CheckCircle2 size={14} />
              </div>
            </div>

            {/* Card 3 */}
            <div className="glass-panel p-8 rounded-2xl glass-panel-hover border border-white/10 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-pink-500/10 border border-pink-500/30 flex items-center justify-center text-pink-400 mb-6">
                  <Camera size={24} />
                </div>
                <h3 className="text-xl font-bold mb-3 text-white">Cinematic Camera</h3>
                <p className="text-gray-400 text-sm leading-relaxed mb-6">
                  Full camera director control: Dolly In, Dolly Out, Pan Left/Right, Tilt, Orbit, Crane, Handheld micro-shake, and custom paths.
                </p>
              </div>
              <div className="text-xs font-semibold text-pink-400 flex items-center gap-2">
                <span>10+ Camera Movement Presets</span>
                <CheckCircle2 size={14} />
              </div>
            </div>

            {/* Card 4 */}
            <div className="glass-panel p-8 rounded-2xl glass-panel-hover border border-white/10 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-6">
                  <Layers size={24} />
                </div>
                <h3 className="text-xl font-bold mb-3 text-white">Realistic Physics Motion</h3>
                <p className="text-gray-400 text-sm leading-relaxed mb-6">
                  Realistic fluid physics for hair flow, clothing dynamics, facial blinks, ocean waves, smoke, fire, rain, and leaf movement.
                </p>
              </div>
              <div className="text-xs font-semibold text-amber-400 flex items-center gap-2">
                <span>Anatomy & Identity Lock</span>
                <CheckCircle2 size={14} />
              </div>
            </div>

            {/* Card 5 */}
            <div className="glass-panel p-8 rounded-2xl glass-panel-hover border border-white/10 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mb-6">
                  <Volume2 size={24} />
                </div>
                <h3 className="text-xl font-bold mb-3 text-white">AI Audio FX</h3>
                <p className="text-gray-400 text-sm leading-relaxed mb-6">
                  Generate synchronized ambient atmospheric audio, environmental sound effects, and background music matching the video scene.
                </p>
              </div>
              <div className="text-xs font-semibold text-emerald-400 flex items-center gap-2">
                <span>Sound Effects & Music Track</span>
                <CheckCircle2 size={14} />
              </div>
            </div>

            {/* Card 6 */}
            <div className="glass-panel p-8 rounded-2xl glass-panel-hover border border-white/10 flex flex-col justify-between">
              <div>
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 border border-blue-500/30 flex items-center justify-center text-blue-400 mb-6">
                  <Cpu size={24} />
                </div>
                <h3 className="text-xl font-bold mb-3 text-white">Multi AI Model Engine</h3>
                <p className="text-gray-400 text-sm leading-relaxed mb-6">
                  Unified model selector allowing you to generate through VJ17 Engine, Sora, Luma, Runway, Pika, and Kling models.
                </p>
              </div>
              <div className="text-xs font-semibold text-blue-400 flex items-center gap-2">
                <span>Intelligent Model Routing</span>
                <CheckCircle2 size={14} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t border-white/10 py-12 px-6 bg-[#040407]">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <Logo size="sm" />
          <p className="text-xs text-gray-500">
            © 2026 VJ17 Motion AI. All rights reserved. Turn Every Photo Into Motion.
          </p>
          <div className="flex gap-6 text-xs text-gray-400">
            <a href="#" className="hover:text-cyan-400">Terms of Service</a>
            <a href="#" className="hover:text-cyan-400">Privacy Policy</a>
            <a href="#" className="hover:text-cyan-400">API Documentation</a>
          </div>
        </div>
      </footer>
    </div>
  );
}
