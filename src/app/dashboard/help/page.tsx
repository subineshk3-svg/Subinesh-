"use client";

import React from "react";
import { HelpCircle, Sparkles, MessageSquare, BookOpen, Video, ShieldCheck } from "lucide-react";

export default function HelpPage() {
  const faqs = [
    {
      q: "How does VJ17 Motion AI convert photos into video?",
      a: "Our VJ17 Neural Motion Engine analyzes subject geometry, camera composition, and environmental lighting using vision AI, then generates physical motion vectors and temporal frame synthesis matching your selected camera path.",
    },
    {
      q: "Are my uploaded photos kept private?",
      a: "Yes. All uploads are processed securely via private signed storage buckets and protected by end-to-end authorization.",
    },
    {
      q: "What happens if a video generation fails?",
      a: "Our credit engine uses idempotent job reservation. If any generation fails or times out, your reserved credits are automatically refunded to your balance.",
    },
    {
      q: "Which video models can I choose from?",
      a: "You can select VJ17 Auto Dynamic, VJ17 Cinema Pro 4K, VJ17 Speed Motion Turbo, Luma Dream Engine, Runway Gen-3, or Pika 2.0.",
    },
  ];

  return (
    <div className="max-w-4xl space-y-8 pb-12">
      <div className="border-b border-white/10 pb-6">
        <h1 className="text-3xl font-extrabold text-white font-heading">Help & Support</h1>
        <p className="text-gray-400 text-xs mt-1">Frequently asked questions and guides for VJ17 Motion AI.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {faqs.map((faq, idx) => (
          <div key={idx} className="p-6 rounded-2xl glass-panel border border-white/10 space-y-2">
            <h3 className="font-bold text-white text-sm flex items-start gap-2 font-heading">
              <HelpCircle size={18} className="text-cyan-400 shrink-0 mt-0.5" />
              <span>{faq.q}</span>
            </h3>
            <p className="text-xs text-gray-400 leading-relaxed pl-6">{faq.a}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
