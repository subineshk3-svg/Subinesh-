"use client";

import React, { useState } from "react";
import { Cpu, Info, Check, ChevronDown, ShieldCheck, Zap } from "lucide-react";
import { ModelLicenseModal } from "./ModelLicenseModal";

interface ModelSelectorProps {
  selectedModelId: string;
  onSelectModel: (modelId: string) => void;
  modelsCatalog: Record<string, any>;
  workerOnline?: boolean;
}

export const ModelSelector: React.FC<ModelSelectorProps> = ({
  selectedModelId,
  onSelectModel,
  modelsCatalog,
  workerOnline = true,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [inspectModel, setInspectModel] = useState<any>(null);

  const modelKeys = Object.keys(modelsCatalog);
  const currentModel = modelsCatalog[selectedModelId] || modelsCatalog["ltx-video"] || {
    name: "LTX-Video",
    description: "Fast video generation and real-time image-to-video motion control.",
    vram_required_gb: 12,
  };

  return (
    <div className="space-y-3 text-left">
      <div className="flex items-center justify-between">
        <label className="text-xs font-bold text-gray-300 uppercase tracking-wider flex items-center gap-2">
          <Cpu size={14} className="text-cyan-400" />
          <span>Video Generation Model</span>
        </label>
        <span className="text-[11px] text-gray-400 font-mono flex items-center gap-1.5">
          <span className={`w-2 h-2 rounded-full ${workerOnline ? "bg-emerald-400 animate-pulse" : "bg-amber-400"}`} />
          {workerOnline ? "GPU Active" : "Worker Connecting..."}
        </span>
      </div>

      {/* Model Selector Dropdown Header */}
      <div className="relative">
        <button
          type="button"
          onClick={() => setIsOpen(!isOpen)}
          className="w-full p-4 rounded-2xl glass-panel border border-cyan-500/30 hover:border-cyan-400 transition-all flex items-center justify-between bg-black/40 text-left group shadow-lg"
        >
          <div className="space-y-1">
            <div className="flex items-center gap-2.5">
              <span className="font-extrabold text-white text-base group-hover:text-cyan-300 transition-colors font-heading">
                {currentModel.name}
              </span>
              <span className="px-2 py-0.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-[10px] font-mono font-bold">
                {currentModel.vram_required_gb || 12}GB VRAM
              </span>
              {currentModel.commercial_use && (
                <span className="px-2 py-0.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-[10px] font-bold">
                  Commercial
                </span>
              )}
            </div>
            <p className="text-xs text-gray-400 line-clamp-1">{currentModel.description}</p>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setInspectModel(currentModel);
              }}
              className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-cyan-300 transition-all"
              title="Inspect Model License & Specs"
            >
              <Info size={16} />
            </button>
            <ChevronDown size={18} className={`text-cyan-400 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
          </div>
        </button>

        {/* Dropdown Options List */}
        {isOpen && (
          <div className="absolute top-full left-0 right-0 mt-2 z-40 p-2 rounded-2xl glass-panel border border-white/15 bg-[#0a0a14] space-y-2 shadow-[0_10px_40px_rgba(0,0,0,0.8)] max-h-96 overflow-y-auto">
            {modelKeys.map((key) => {
              const item = modelsCatalog[key];
              const isSelected = key === selectedModelId;

              return (
                <div
                  key={key}
                  onClick={() => {
                    onSelectModel(key);
                    setIsOpen(false);
                  }}
                  className={`p-3.5 rounded-xl border text-left cursor-pointer transition-all flex items-center justify-between ${
                    isSelected
                      ? "bg-cyan-500/15 border-cyan-400/60 text-white shadow-[0_0_15px_rgba(0,242,254,0.15)]"
                      : "bg-white/5 border-white/5 hover:bg-white/10 text-gray-300 hover:text-white"
                  }`}
                >
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-white font-heading">{item.name}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded bg-white/10 text-gray-300 font-mono">
                        {item.vram_required_gb || 12}GB
                      </span>
                      <span className="text-[10px] text-cyan-400 font-mono">{item.license}</span>
                    </div>
                    <p className="text-xs text-gray-400">{item.description}</p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setInspectModel(item);
                      }}
                      className="p-1 rounded text-gray-500 hover:text-cyan-400"
                    >
                      <Info size={15} />
                    </button>
                    {isSelected && <Check size={18} className="text-cyan-400" />}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      <ModelLicenseModal
        model={inspectModel}
        isOpen={!!inspectModel}
        onClose={() => setInspectModel(null)}
      />
    </div>
  );
};
