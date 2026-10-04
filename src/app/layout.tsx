import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "VJ17 Motion AI — Turn Every Photo Into Motion",
  description: "Transform still photographs into cinematic AI-generated videos with realistic motion, camera movements, and visual effects.",
  keywords: ["AI video generation", "photo to video", "VJ17 Motion AI", "image to motion", "cinematic AI", "SaaS"],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-[#06060a] text-gray-100 antialiased min-h-screen selection:bg-cyan-500 selection:text-black">
        {/* Global ambient lighting background glow */}
        <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
          <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[800px] h-[450px] bg-gradient-radial from-cyan-500/15 via-purple-600/10 to-transparent blur-3xl rounded-full" />
          <div className="absolute top-1/3 -left-40 w-[500px] h-[500px] bg-purple-600/10 blur-3xl rounded-full" />
          <div className="absolute bottom-10 right-0 w-[600px] h-[400px] bg-cyan-500/10 blur-3xl rounded-full" />
        </div>
        <div className="relative z-10">{children}</div>
      </body>
    </html>
  );
}
