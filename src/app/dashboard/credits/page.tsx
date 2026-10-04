"use client";

import React, { useState, useEffect } from "react";
import { Coins, Check, Zap, CreditCard, ShieldCheck, History } from "lucide-react";

export default function CreditsPage() {
  const [user, setUser] = useState<any>(null);
  const [purchasing, setPurchasing] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");

  useEffect(() => {
    try {
      const stored = localStorage.getItem("vj17_user");
      if (stored) setUser(JSON.parse(stored));
    } catch (e) {}
  }, []);

  const handleBuyCredits = (amount: number, priceUSD: number) => {
    setPurchasing(true);
    setTimeout(() => {
      if (user) {
        const newTotal = (user.credits || 50) + amount;
        const updated = { ...user, credits: newTotal };
        setUser(updated);
        localStorage.setItem("vj17_user", JSON.stringify(updated));
        setSuccessMsg(`Successfully added +${amount} credits to your account!`);
        setTimeout(() => setSuccessMsg(""), 4000);
      }
      setPurchasing(false);
    }, 1000);
  };

  const creditPacks = [
    { credits: 100, price: "$10", popular: false },
    { credits: 300, price: "$25", popular: true },
    { credits: 1000, price: "$75", popular: false },
  ];

  const plans = [
    {
      name: "Free",
      price: "$0 / mo",
      credits: "50 Free Credits",
      features: ["720p Resolution", "Standard Models", "Watermark Enabled"],
      cta: "Current Plan",
      current: true,
    },
    {
      name: "Creator",
      price: "$19 / mo",
      credits: "300 Credits / mo",
      features: ["1080p Resolution", "No Watermark", "Fast Queue Priority", "VJ17 Prompt Director"],
      cta: "Upgrade to Creator",
      popular: true,
    },
    {
      name: "Pro",
      price: "$49 / mo",
      credits: "1,000 Credits / mo",
      features: ["4K Resolution", "All Models (Sora, Luma, Runway)", "Priority Processing", "Commercial Rights"],
      cta: "Upgrade to Pro",
    },
    {
      name: "Business",
      price: "$149 / mo",
      credits: "3,500 Credits / mo",
      features: ["Dedicated API Access", "Custom Model Tuning", "Team Seats", "24/7 Priority Support"],
      cta: "Contact Sales",
    },
  ];

  return (
    <div className="space-y-10 pb-12">
      {/* Current Balance Banner */}
      <div className="p-8 rounded-3xl glass-panel border border-cyan-500/30 flex flex-col md:flex-row items-center justify-between gap-6 bg-cyan-950/10 shadow-[0_0_40px_rgba(0,242,254,0.1)]">
        <div className="flex items-center gap-5 text-center md:text-left">
          <div className="w-16 h-16 rounded-2xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center border border-cyan-500/40 shrink-0">
            <Coins size={36} />
          </div>
          <div>
            <span className="text-xs text-gray-400 uppercase font-semibold">Available Credit Balance</span>
            <h2 className="text-3xl font-black text-white font-heading">{user?.credits || 50} Credits</h2>
            <p className="text-xs text-cyan-300 mt-1">Sufficient for ~{Math.floor((user?.credits || 50) / 10)} HD Video Generations</p>
          </div>
        </div>

        {successMsg && (
          <div className="px-4 py-2 rounded-xl bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/40">
            {successMsg}
          </div>
        )}
      </div>

      {/* Credit Top-up Packs */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white font-heading">Top-Up Credit Packs</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {creditPacks.map((pack) => (
            <div
              key={pack.credits}
              className={`p-6 rounded-2xl glass-panel border flex flex-col justify-between relative ${
                pack.popular ? "border-cyan-500/50 shadow-[0_0_30px_rgba(0,242,254,0.15)] bg-cyan-950/10" : "border-white/10"
              }`}
            >
              {pack.popular && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 rounded-full bg-cyan-400 text-black text-[10px] font-extrabold uppercase tracking-wider">
                  Most Popular
                </span>
              )}

              <div>
                <h3 className="text-2xl font-black text-white font-heading">+{pack.credits} Credits</h3>
                <p className="text-gray-400 text-xs mt-1">One-time purchase, credits never expire.</p>
                <div className="text-3xl font-extrabold text-cyan-300 my-4">{pack.price}</div>
              </div>

              <button
                onClick={() => handleBuyCredits(pack.credits, 10)}
                disabled={purchasing}
                className="w-full py-3 rounded-xl btn-glow font-bold text-xs shadow-md disabled:opacity-50"
              >
                {purchasing ? "Processing..." : "Buy Credits Now"}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Subscription Plans */}
      <div className="space-y-4 pt-4">
        <h2 className="text-xl font-bold text-white font-heading">Subscription Plans</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`p-6 rounded-2xl glass-panel border flex flex-col justify-between space-y-6 ${
                plan.popular ? "border-purple-500/50 shadow-[0_0_30px_rgba(168,85,247,0.15)]" : "border-white/10"
              }`}
            >
              <div>
                <h3 className="text-lg font-bold text-white">{plan.name}</h3>
                <div className="text-2xl font-black text-cyan-300 my-2">{plan.price}</div>
                <span className="text-xs font-semibold text-purple-300 bg-purple-500/10 px-2.5 py-1 rounded-md border border-purple-500/30 inline-block mb-4">
                  {plan.credits}
                </span>

                <div className="space-y-2 text-xs">
                  {plan.features.map((f) => (
                    <div key={f} className="flex items-center gap-2 text-gray-300">
                      <Check size={14} className="text-cyan-400 shrink-0" />
                      <span>{f}</span>
                    </div>
                  ))}
                </div>
              </div>

              <button
                disabled={plan.current}
                className={`w-full py-3 rounded-xl font-bold text-xs transition-all ${
                  plan.current
                    ? "bg-white/10 text-gray-400 cursor-default"
                    : "btn-glow shadow-md"
                }`}
              >
                {plan.cta}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
