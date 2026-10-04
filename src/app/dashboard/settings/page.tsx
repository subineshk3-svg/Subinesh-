"use client";

import React, { useState, useEffect } from "react";
import { User, Shield, Sliders, Trash2, Key, Smartphone, CheckCircle2, Lock } from "lucide-react";

export default function SettingsPage() {
  const [user, setUser] = useState<any>(null);
  const [twoFactor, setTwoFactor] = useState(false);
  const [savedMsg, setSavedMsg] = useState("");

  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  useEffect(() => {
    try {
      const stored = localStorage.getItem("vj17_user");
      if (stored) {
        const u = JSON.parse(stored);
        setUser(u);
        setName(u.name || "");
        setPhone(u.phone || "");
        setTwoFactor(!!u.twoFactorEnabled);
      }
    } catch (e) {}
  }, []);

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (user) {
      const updated = { ...user, name, phone, twoFactorEnabled: twoFactor };
      setUser(updated);
      localStorage.setItem("vj17_user", JSON.stringify(updated));
      setSavedMsg("Settings saved successfully.");
      setTimeout(() => setSavedMsg(""), 3000);
    }
  };

  return (
    <div className="max-w-3xl space-y-8 pb-12">
      <div className="border-b border-white/10 pb-6">
        <h1 className="text-3xl font-extrabold text-white font-heading">Account & Security Settings</h1>
        <p className="text-gray-400 text-xs mt-1">Manage your account profile, 2FA security, preferences, and privacy.</p>
      </div>

      {savedMsg && (
        <div className="p-4 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-bold flex items-center gap-2">
          <CheckCircle2 size={16} />
          <span>{savedMsg}</span>
        </div>
      )}

      {/* Account Profile Form */}
      <form onSubmit={handleSaveProfile} className="p-6 rounded-2xl glass-panel border border-white/10 space-y-6">
        <h2 className="text-lg font-bold text-white flex items-center gap-2 font-heading">
          <User size={20} className="text-cyan-400" />
          <span>Profile Information</span>
        </h2>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
              Full Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-3 rounded-xl glass-input text-xs focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
              Email Address
            </label>
            <input
              type="email"
              disabled
              value={user?.email || ""}
              className="w-full p-3 rounded-xl glass-input text-xs opacity-60 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-300 uppercase tracking-wider mb-1.5">
              Phone Number (For OTP Verification)
            </label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="w-full p-3 rounded-xl glass-input text-xs focus:outline-none"
            />
          </div>
        </div>

        {/* 2FA Toggle */}
        <div className="pt-4 border-t border-white/5 flex items-center justify-between">
          <div>
            <span className="font-bold text-white text-sm block">Two-Factor Authentication (2FA)</span>
            <span className="text-xs text-gray-400">Require 6-digit OTP verification upon sign in.</span>
          </div>

          <button
            type="button"
            onClick={() => setTwoFactor(!twoFactor)}
            className={`w-12 h-6 rounded-full transition-colors p-1 flex items-center ${
              twoFactor ? "bg-cyan-500 justify-end" : "bg-white/20 justify-start"
            }`}
          >
            <span className="w-4 h-4 rounded-full bg-black shadow-md inline-block" />
          </button>
        </div>

        <button
          type="submit"
          className="px-6 py-2.5 rounded-xl btn-glow font-bold text-xs shadow-md"
        >
          Save Changes
        </button>
      </form>

      {/* Danger Zone / Privacy */}
      <div className="p-6 rounded-2xl glass-panel border border-red-500/30 bg-red-950/10 space-y-4">
        <h2 className="text-lg font-bold text-red-400 flex items-center gap-2 font-heading">
          <Trash2 size={20} />
          <span>Privacy & Data Management</span>
        </h2>
        <p className="text-xs text-gray-400 leading-relaxed">
          Request export of your personal creations or initiate complete account deletion.
        </p>

        <div className="flex flex-wrap gap-4 pt-2">
          <button
            onClick={() => alert("Personal data export initialized. A download link will be emailed.")}
            className="px-4 py-2 rounded-xl glass-panel text-xs font-bold text-gray-300 hover:text-white border border-white/10"
          >
            Download Personal Data
          </button>
          <button
            onClick={() => {
              if (confirm("Are you sure you want to request account deletion? All projects will be permanently removed.")) {
                localStorage.clear();
                window.location.href = "/";
              }
            }}
            className="px-4 py-2 rounded-xl bg-red-500/20 text-red-300 border border-red-500/40 text-xs font-bold hover:bg-red-500/30"
          >
            Delete VJ17 Account
          </button>
        </div>
      </div>
    </div>
  );
}
