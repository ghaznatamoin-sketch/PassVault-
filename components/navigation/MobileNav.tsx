"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Shield,
  Menu,
  X,
  LayoutDashboard,
  FolderLock,
  PlusCircle,
  Wand2,
  Search,
  User,
  Settings,
  LogOut,
} from "lucide-react";
import { useVault } from "@/lib/vault-context";
import { cn } from "@/lib/utils";

export function MobileNav() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const { profile, logout } = useVault();

  const navItems = [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: "Password Vault", href: "/vault", icon: FolderLock },
    { label: "Add Credential", href: "/vault/new", icon: PlusCircle },
    { label: "Password Generator", href: "/generator", icon: Wand2 },
    { label: "Search Results", href: "/search", icon: Search },
    { label: "Profile", href: "/profile", icon: User },
    { label: "Security Settings", href: "/settings", icon: Settings },
  ];

  const handleLogout = () => {
    logout();
    setIsOpen(false);
    router.push("/login");
  };

  return (
    <div className="md:hidden">
      {/* Mobile Top Header */}
      <div className="flex items-center justify-between px-4 py-3 bg-midnight-900 border-b border-charcoal-700/60 sticky top-0 z-30">
        <Link href="/dashboard" className="flex items-center space-x-2.5">
          <div className="p-1.5 rounded-lg bg-electric-600 text-white">
            <Shield className="w-5 h-5" />
          </div>
          <span className="font-bold text-white tracking-tight">
            Pass<span className="text-electric-400">Vault</span>
          </span>
        </Link>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 text-slate-300 hover:text-white rounded-lg hover:bg-charcoal-800 transition-colors"
          aria-label="Toggle navigation"
        >
          {isOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Drawer */}
      {isOpen && (
        <div className="fixed inset-0 z-40 top-[57px] bg-midnight-950/95 backdrop-blur-md p-6 flex flex-col justify-between animate-in slide-in-from-top duration-200">
          <div className="space-y-2 overflow-y-auto">
            <div className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400">
              Core Navigation
            </div>
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "flex items-center space-x-3 px-4 py-3 rounded-xl text-base font-medium transition-colors",
                    isActive
                      ? "bg-electric-600/20 text-electric-400 border border-electric-500/30"
                      : "text-slate-300 hover:text-white hover:bg-charcoal-800"
                  )}
                >
                  <Icon className="w-5 h-5" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </div>

          <div className="pt-4 border-t border-charcoal-800 space-y-3">
            <div className="flex items-center space-x-3 p-3 rounded-xl bg-charcoal-900 border border-charcoal-800">
              <div className="w-10 h-10 rounded-full bg-electric-600/20 text-electric-400 flex items-center justify-center font-bold">
                {profile.full_name?.charAt(0) || "U"}
              </div>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-white truncate">{profile.full_name}</p>
                <p className="text-xs text-slate-400 truncate">{profile.email}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="w-full flex items-center justify-center space-x-2 py-3 rounded-xl bg-red-600/20 text-red-400 border border-red-500/30 hover:bg-red-600/30 font-semibold text-sm transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Log Out</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
