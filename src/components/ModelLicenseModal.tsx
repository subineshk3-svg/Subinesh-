"use client";

import React from "react";
import { X, ShieldCheck, Cpu, HardDrive, ExternalLink, CheckCircle2, AlertTriangle } from "lucide-react";

interface ModelLicenseModalProps {
  model: any;
  isOpen: boolean;
  onClose: () => void;
}

export const ModelLicenseModal: React.FC<ModelLicenseModalProps> = ({ model, isOpen, onClose }) => {
  if (!isOpen || !model) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-xl p-6 rounded-3xl glass-panel border border-cyan-500/30 bg-[#0a0a14] space-y-6 shadow-[0_0_50px_rgba(0,242,254,0.15)] text-left">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center border border-cyan-500/40">
              <Cpu size={20} />
            </div>
            <div>
              <h3 className="text-xl font-black text-white font-heading">{model.name} Specification</h3>
              <span className="text-xs text-gray-400 font-mono">v{model.version || "1.0"} • {model.huggingface_repo || "Open Source"}</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-gray-400 hover:text-white hover:bg-white/10 transition-all"
          >
            <X size={20} />
          </button>
        </div>

        {/* Description */}
        <p className="text-sm text-gray-300 leading-relaxed">{model.description}</p>

        {/* Specs Grid */}
        <div className="grid grid-cols-2 gap-4 text-xs">
          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-1">
            <span className="text-gray-400 block text-[11px] uppercase tracking-wider font-semibold">License & Terms</span>
            <div className="flex items-center gap-1.5 font-bold text-cyan-300">
              <ShieldCheck size={14} className="text-cyan-400" />
              <span>{model.license || "Apache-2.0"}</span>
            </div>
            <span className="text-[10px] text-gray-400 block">{model.license_type || "Open Source License"}</span>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-1">
            <span className="text-gray-400 block text-[11px] uppercase tracking-wider font-semibold">Commercial Usability</span>
            <div className="flex items-center gap-1.5 font-bold text-emerald-400">
              {model.commercial_use !== false ? (
                <>
                  <CheckCircle2 size={14} className="text-emerald-400" />
                  <span>Allowed for Commercial Use</span>
                </>
              ) : (
                <>
                  <AlertTriangle size={14} className="text-amber-400" />
                  <span className="text-amber-300">Non-Commercial / Research Only</span>
                </>
              )}
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-1">
            <span className="text-gray-400 block text-[11px] uppercase tracking-wider font-semibold">Hardware Specs</span>
            <div className="flex items-center gap-1.5 font-bold text-purple-300">
              <HardDrive size={14} className="text-purple-400" />
              <span>{model.vram_required_gb || 12} GB VRAM Minimum</span>
            </div>
          </div>

          <div className="p-3.5 rounded-2xl bg-white/5 border border-white/10 space-y-1">
            <span className="text-gray-400 block text-[11px] uppercase tracking-wider font-semibold">Supported Modes</span>
            <div className="flex items-center gap-2 font-bold text-cyan-300 capitalize">
              {(model.supported_modes || ["t2v"]).map((m: string) => (
                <span key={m} className="px-2 py-0.5 rounded bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-[10px]">
                  {m.toUpperCase()}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-white/10 flex items-center justify-between text-xs">
          {model.huggingface_repo && (
            <a
              href={`https://huggingface.co/${model.huggingface_repo}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-cyan-400 hover:text-cyan-300 flex items-center gap-1.5 font-semibold"
            >
              <span>View Repository on Hugging Face</span>
              <ExternalLink size={14} />
            </a>
          )}

          <button
            onClick={onClose}
            className="px-5 py-2.5 rounded-xl btn-glow font-bold text-xs"
          >
            Close Spec
          </button>
        </div>
      </div>
    </div>
  );
};
