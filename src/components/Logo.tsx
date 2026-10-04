import React from "react";
import Link from "next/link";
import { Sparkles, Video, Play } from "lucide-react";

interface LogoProps {
  size?: "sm" | "md" | "lg";
  href?: string;
}

export function Logo({ size = "md", href = "/" }: LogoProps) {
  const sizeClasses = {
    sm: "text-lg font-bold",
    md: "text-xl font-extrabold",
    lg: "text-3xl font-black",
  };

  const iconSizes = {
    sm: 18,
    md: 22,
    lg: 32,
  };

  const content = (
    <div className="inline-flex items-center gap-2.5 group cursor-pointer">
      <div className="relative flex items-center justify-center p-2 rounded-xl bg-gradient-to-br from-cyan-500/20 via-purple-600/20 to-black border border-cyan-500/30 group-hover:border-cyan-400 group-hover:shadow-[0_0_20px_rgba(0,242,254,0.4)] transition-all duration-300">
        <Video size={iconSizes[size]} className="text-cyan-400 group-hover:scale-110 transition-transform" />
        <Sparkles size={iconSizes[size] / 1.6} className="absolute -top-1 -right-1 text-purple-400 animate-pulse" />
      </div>
      <div className="flex flex-col">
        <span className={`font-heading tracking-tight ${sizeClasses[size]} text-white flex items-center gap-1`}>
          VJ17 <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-purple-500">MOTION AI</span>
        </span>
        {size === "lg" && (
          <span className="text-xs text-gray-400 font-normal tracking-wider uppercase">
            Turn Every Photo Into Motion
          </span>
        )}
      </div>
    </div>
  );

  if (href) {
    return <Link href={href}>{content}</Link>;
  }

  return content;
}
