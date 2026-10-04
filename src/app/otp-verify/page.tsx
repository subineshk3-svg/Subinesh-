"use client";

import React, { useState, useEffect, useRef, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import { ShieldCheck, ArrowLeft, RefreshCw, AlertCircle, CheckCircle2, KeyRound } from "lucide-react";
import { Logo } from "@/components/Logo";

function OtpVerifyContent() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const userId = searchParams.get("userId") || "";
  const destination = searchParams.get("destination") || "your registered destination";

  const [otp, setOtp] = useState<string[]>(Array(6).fill(""));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const [loading, setLoading] = useState(false);
  const [resending, setResending] = useState(false);
  const [error, setError] = useState("");
  const [successMsg, setSuccessMsg] = useState("");
  const [demoCode, setDemoCode] = useState<string | null>(null);

  // Retrieve demo code from sessionStorage if present
  useEffect(() => {
    try {
      const stored = sessionStorage.getItem("vj17_pending_user");
      if (stored) {
        const parsed = JSON.parse(stored);
        if (parsed.demoCode) {
          setDemoCode(parsed.demoCode);
        }
      }
    } catch (e) {}
  }, []);

  // Countdown timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (timer > 0) {
      interval = setInterval(() => {
        setTimer((prev) => prev - 1);
      }, 1000);
    } else {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [timer]);

  // Handle single digit input
  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value.slice(-1);
    setOtp(newOtp);

    // Auto-focus next field
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  // Handle backspace navigation
  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // Handle paste OTP support
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").trim();
    if (/^\d{6}$/.test(pastedData)) {
      const digits = pastedData.split("");
      setOtp(digits);
      inputRefs.current[5]?.focus();
    }
  };

  // Verify OTP submission
  const handleVerify = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const fullCode = otp.join("");
    if (fullCode.length !== 6) {
      setError("Please enter the complete 6-digit verification code.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/auth/verify-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId, code: fullCode }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error || "OTP verification failed.");
      }

      setSuccessMsg("Account verified successfully.");

      // Save user session in localStorage
      localStorage.setItem("vj17_user", JSON.stringify(data.user));
      localStorage.setItem("vj17_token", data.token);

      setTimeout(() => {
        router.push("/dashboard");
      }, 1200);
    } catch (err: any) {
      setError(err.message || "Failed to verify OTP.");
    } finally {
      setLoading(false);
    }
  };

  // Resend OTP trigger
  const handleResend = async () => {
    if (!canResend || resending) return;
    setResending(true);
    setError("");

    try {
      const res = await fetch("/api/auth/resend-otp", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Failed to resend code.");

      if (data.demoCode) setDemoCode(data.demoCode);

      setTimer(30);
      setCanResend(false);
      setSuccessMsg("A new 6-digit code has been sent.");
      setTimeout(() => setSuccessMsg(""), 3000);
    } catch (err: any) {
      setError(err.message || "Resend failed.");
    } finally {
      setResending(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#06060a] flex items-center justify-center p-6 relative overflow-hidden">
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[500px] h-[300px] bg-cyan-500/10 blur-[120px] rounded-full pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md glass-panel p-8 rounded-3xl border border-cyan-500/30 shadow-[0_0_50px_rgba(0,242,254,0.15)] relative z-10 text-center"
      >
        <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
          <ShieldCheck size={32} />
        </div>

        <Logo size="sm" href="/" />
        <h1 className="text-2xl font-bold text-white mt-4 font-heading">Verify your account</h1>
        <p className="text-gray-400 text-xs mt-2 leading-relaxed">
          We sent a 6-digit verification code to <br />
          <span className="text-cyan-300 font-semibold">{destination}</span>
        </p>

        {demoCode && (
          <div className="mt-4 p-2.5 rounded-xl bg-cyan-950/60 border border-cyan-500/40 text-cyan-300 text-xs flex items-center justify-center gap-2">
            <KeyRound size={14} />
            <span>Developer Demo Code: <strong>{demoCode}</strong></span>
          </div>
        )}

        {error && (
          <div className="mt-4 p-3 rounded-xl bg-red-500/10 border border-red-500/30 text-red-400 text-xs flex items-center justify-center gap-2">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="mt-4 p-3 rounded-xl bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs flex items-center justify-center gap-2">
            <CheckCircle2 size={16} />
            <span>{successMsg}</span>
          </div>
        )}

        {/* 6 OTP Inputs */}
        <div className="flex justify-center gap-2.5 my-8">
          {otp.map((digit, index) => (
            <input
              key={index}
              ref={(el) => {
                inputRefs.current[index] = el;
              }}
              type="text"
              inputMode="numeric"
              maxLength={1}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              onPaste={handlePaste}
              className="w-12 h-14 text-center text-xl font-bold text-cyan-300 bg-[#0d0d18] border border-white/15 rounded-xl focus:border-cyan-400 focus:outline-none focus:shadow-[0_0_15px_rgba(0,242,254,0.3)] transition-all"
            />
          ))}
        </div>

        <button
          onClick={handleVerify}
          disabled={loading || otp.join("").length !== 6}
          className="w-full py-3.5 rounded-xl btn-glow font-bold text-sm shadow-[0_0_20px_rgba(0,242,254,0.3)] disabled:opacity-50"
        >
          {loading ? (
            <span className="w-5 h-5 border-2 border-black border-t-transparent rounded-full animate-spin inline-block" />
          ) : (
            "Verify OTP"
          )}
        </button>

        <div className="flex items-center justify-between mt-6 text-xs text-gray-400">
          <button
            onClick={() => router.push("/register")}
            className="flex items-center gap-1 hover:text-white transition-colors"
          >
            <ArrowLeft size={14} />
            <span>Change phone number</span>
          </button>

          <button
            onClick={handleResend}
            disabled={!canResend || resending}
            className="flex items-center gap-1.5 text-cyan-400 font-semibold disabled:text-gray-600 hover:underline"
          >
            <RefreshCw size={12} className={resending ? "animate-spin" : ""} />
            {canResend ? "Resend OTP" : `Resend OTP in ${timer}s`}
          </button>
        </div>
      </motion.div>
    </div>
  );
}

export default function OtpVerifyPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-[#06060a] flex items-center justify-center text-cyan-400 font-semibold animate-pulse">Loading Verification...</div>}>
      <OtpVerifyContent />
    </Suspense>
  );
}
