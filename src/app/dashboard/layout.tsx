"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Video,
  FolderKanban,
  LayoutTemplate,
  Cpu,
  Coins,
  History,
  Settings,
  HelpCircle,
  Search,
  Bell,
  User as UserIcon,
  LogOut,
  Shield,
  Menu,
  X,
  Sparkles,
  Plus,
} from "lucide-react";
import { Logo } from "@/components/Logo";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("vj17_user");
      if (stored) {
        setUser(JSON.parse(stored));
      } else {
        // Fallback default user for testing
        const defaultUser = { id: "user-1", name: "Alex Motion", email: "alex@vj17.ai", credits: 50, role: "ADMIN" };
        setUser(defaultUser);
        localStorage.setItem("vj17_user", JSON.stringify(defaultUser));
      }
    } catch (e) {}
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("vj17_user");
    localStorage.removeItem("vj17_token");
    router.push("/login");
  };

  const navItems = [
    { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "Create Video", href: "/dashboard/create", icon: Video },
    { name: "My Projects", href: "/dashboard/projects", icon: FolderKanban },
    { name: "Templates", href: "/dashboard/templates", icon: LayoutTemplate },
    { name: "AI Models", href: "/dashboard/models", icon: Cpu },
    { name: "Credits", href: "/dashboard/credits", icon: Coins },
    { name: "Settings", href: "/dashboard/settings", icon: Settings },
    { name: "Help", href: "/dashboard/help", icon: HelpCircle },
  ];

  if (user?.role === "ADMIN") {
    navItems.push({ name: "Admin Panel", href: "/dashboard/admin", icon: Shield });
  }

  return (
    <div className="min-h-screen bg-[#06060a] text-gray-100 flex flex-col md:flex-row selection:bg-cyan-500 selection:text-black">
      {/* Mobile Top Navigation */}
      <div className="md:hidden flex items-center justify-between px-4 py-3 bg-[#0a0a14] border-b border-white/10 sticky top-0 z-50">
        <Logo size="sm" />
        <button
          onClick={() => setMobileOpen(!mobileOpen)}
          className="p-2 text-gray-300 hover:text-white"
        >
          {mobileOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar Navigation */}
      <aside
        className={`fixed md:sticky top-0 left-0 z-40 h-screen w-64 bg-[#080811]/95 backdrop-blur-2xl border-r border-white/10 flex flex-col justify-between p-5 transition-transform duration-300 ${
          mobileOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0"
        }`}
      >
        <div>
          <div className="hidden md:block pb-6 border-b border-white/10">
            <Logo size="md" />
          </div>

          <div className="mt-6 mb-4">
            <Link
              href="/dashboard/create"
              onClick={() => setMobileOpen(false)}
              className="w-full py-3 px-4 rounded-xl btn-glow font-bold text-sm flex items-center justify-center gap-2 shadow-[0_0_20px_rgba(0,242,254,0.3)]"
            >
              <Plus size={18} />
              <span>+ Create Video</span>
            </Link>
          </div>

          <nav className="space-y-1.5 mt-6">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setMobileOpen(false)}
                  className={`flex items-center gap-3 px-4 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                    isActive
                      ? "bg-gradient-to-r from-cyan-500/20 to-purple-600/20 text-cyan-300 border border-cyan-500/40 shadow-[0_0_15px_rgba(0,242,254,0.15)]"
                      : "text-gray-400 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <Icon size={18} className={isActive ? "text-cyan-400" : "text-gray-400"} />
                  <span>{item.name}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        {/* Sidebar Footer Credits Box */}
        <div className="pt-4 border-t border-white/10">
          <div className="p-4 rounded-2xl bg-gradient-to-br from-cyan-950/40 via-purple-950/20 to-black border border-cyan-500/30">
            <div className="flex items-center justify-between text-xs font-semibold text-gray-300 mb-1">
              <span>Credits Balance</span>
              <span className="text-cyan-400 font-bold flex items-center gap-1">
                <Coins size={14} />
                {user?.credits || 50}
              </span>
            </div>
            <div className="w-full bg-white/10 rounded-full h-1.5 overflow-hidden my-2">
              <div className="bg-gradient-to-r from-cyan-400 to-purple-500 h-full w-[70%]" />
            </div>
            <Link
              href="/dashboard/credits"
              className="text-[11px] text-cyan-400 font-bold hover:underline block text-right"
            >
              + Buy Credits
            </Link>
          </div>
        </div>
      </aside>

      {/* Main Workspace Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header Bar */}
        <header className="sticky top-0 z-30 bg-[#06060a]/80 backdrop-blur-xl border-b border-white/10 px-6 py-4 flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md hidden sm:block">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
            <input
              type="text"
              placeholder="Search projects, templates or motions..."
              className="w-full pl-10 pr-4 py-2 rounded-xl glass-input text-xs focus:outline-none"
            />
          </div>

          <div className="flex items-center gap-4 ml-auto">
            <div className="px-3.5 py-1.5 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-bold flex items-center gap-2">
              <Coins size={14} className="text-cyan-400 animate-pulse" />
              <span>{user?.credits || 50} Credits</span>
            </div>

            <button className="p-2 rounded-xl glass-panel text-gray-300 hover:text-white relative">
              <Bell size={18} />
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-cyan-400" />
            </button>

            {/* Profile Dropdown */}
            <div className="relative">
              <button
                onClick={() => setUserMenuOpen(!userMenuOpen)}
                className="flex items-center gap-2 p-1.5 rounded-xl glass-panel hover:bg-white/10"
              >
                <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-cyan-400 to-purple-600 flex items-center justify-center text-black font-bold text-xs">
                  {user?.name ? user.name[0].toUpperCase() : "U"}
                </div>
                <span className="text-xs font-semibold text-gray-200 hidden lg:inline">
                  {user?.name || "User"}
                </span>
              </button>

              {userMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 rounded-2xl glass-panel p-2 border border-white/10 shadow-2xl z-50 text-xs">
                  <div className="px-3 py-2 border-b border-white/10 mb-1">
                    <p className="font-bold text-white">{user?.name || "User"}</p>
                    <p className="text-gray-400 text-[11px] truncate">{user?.email}</p>
                  </div>
                  <Link
                    href="/dashboard/settings"
                    onClick={() => setUserMenuOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-white/10 text-gray-300"
                  >
                    <UserIcon size={14} />
                    <span>Account Settings</span>
                  </Link>
                  <Link
                    href="/dashboard/credits"
                    onClick={() => setUserMenuOpen(false)}
                    className="flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-white/10 text-gray-300"
                  >
                    <Coins size={14} />
                    <span>Billing & Credits</span>
                  </Link>
                  <button
                    onClick={handleLogout}
                    className="w-full flex items-center gap-2 px-3 py-2 rounded-xl hover:bg-red-500/20 text-red-400 mt-1"
                  >
                    <LogOut size={14} />
                    <span>Logout</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Page Content Container */}
        <main className="flex-1 p-6 md:p-8 max-w-7xl w-full mx-auto">{children}</main>
      </div>
    </div>
  );
}
