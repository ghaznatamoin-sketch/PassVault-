"use client";

import React from "react";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  Shield,
  KeyRound,
  PlusCircle,
  Wand2,
  Search,
  User,
  Settings,
  LogOut,
  FolderLock,
  LayoutDashboard,
  Puzzle,
  CreditCard,
  Lock,
} from "lucide-react";
import { useVault } from "@/lib/vault-context";
import { cn } from "@/lib/utils";

export function Sidebar() {
  const pathname = usePathname();
  const router = useRouter();
  const { profile, logout, lockVault, subscription } = useVault();

  const navItems = [
    { label: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { label: "Password Vault", href: "/vault", icon: FolderLock },
    { label: "Add Credential", href: "/vault/new", icon: PlusCircle },
    { label: "Password Generator", href: "/generator", icon: Wand2 },
    { label: "Browser Extension", href: "/extension", icon: Puzzle, badge: "New" },
    { label: "Subscription & Plans", href: "/subscription", icon: CreditCard, badge: subscription.plan === "free_trial" ? "Trial" : "Pro" },
    { label: "Search Results", href: "/search", icon: Search },
    { label: "Profile", href: "/profile", icon: User },
    { label: "Security Settings", href: "/settings", icon: Settings },
  ];

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <aside className="hidden md:flex flex-col w-64 bg-midnight-900 border-r border-charcoal-700/60 h-screen sticky top-0 select-none z-20">
      {/* Brand Header */}
      <div className="p-6 border-b border-charcoal-800/80">
        <Link href="/dashboard" className="flex items-center space-x-3 group">
          <div className="p-2.5 rounded-xl bg-electric-600 text-white shadow-glow-sm group-hover:scale-105 transition-transform duration-200">
            <Shield className="w-6 h-6" />
          </div>
          <div>
            <span className="text-lg font-bold tracking-tight text-white flex items-center gap-1.5">
              Pass<span className="text-electric-400">Vault</span>
            </span>
            <span className="text-[10px] uppercase font-semibold tracking-widest text-slate-400 block -mt-0.5">
              Secure Manager
            </span>
          </div>
        </Link>
      </div>

      {/* Nav List */}
      <div className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
        <div className="px-3 pb-2 text-[11px] font-semibold uppercase tracking-wider text-slate-400 flex items-center justify-between">
          <span>Main Menu</span>
        </div>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href || (item.href !== "/dashboard" && pathname.startsWith(item.href) && item.href !== "/vault/new");

          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center justify-between px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150",
                isActive
                  ? "bg-electric-600/15 text-electric-400 font-semibold border border-electric-500/30 shadow-glow-sm"
                  : "text-slate-400 hover:text-slate-100 hover:bg-charcoal-800/70"
              )}
            >
              <div className="flex items-center space-x-3 min-w-0">
                <Icon className={cn("w-4 h-4 flex-shrink-0", isActive ? "text-electric-400" : "text-slate-400")} />
                <span className="truncate">{item.label}</span>
              </div>
              {item.badge && (
                <span
                  className={cn(
                    "text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider",
                    item.badge === "Trial"
                      ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                      : "bg-electric-600/20 text-electric-300 border border-electric-500/30"
                  )}
                >
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </div>

      {/* User Footer with Lock & Logout */}
      <div className="p-4 border-t border-charcoal-800/80 bg-midnight-950/40 space-y-2">
        <div className="flex items-center justify-between p-2 rounded-xl bg-charcoal-900/60 border border-charcoal-800">
          <Link href="/profile" className="flex items-center space-x-3 min-w-0 pr-2 hover:opacity-80 transition-opacity">
            <div className="w-8 h-8 rounded-full bg-electric-600/20 text-electric-400 border border-electric-500/30 flex items-center justify-center font-bold text-xs flex-shrink-0">
              {profile.full_name?.charAt(0) || "U"}
            </div>
            <div className="min-w-0">
              <p className="text-xs font-semibold text-white truncate">{profile.full_name}</p>
              <p className="text-[11px] text-slate-400 truncate">{profile.email}</p>
            </div>
          </Link>
          <div className="flex items-center space-x-1">
            <button
              onClick={lockVault}
              title="Lock Vault Now"
              className="p-1.5 text-slate-400 hover:text-amber-400 rounded-lg hover:bg-charcoal-800 transition-colors flex-shrink-0"
            >
              <Lock className="w-4 h-4" />
            </button>
            <button
              onClick={handleLogout}
              title="Sign Out"
              className="p-1.5 text-slate-400 hover:text-red-400 rounded-lg hover:bg-red-500/10 transition-colors flex-shrink-0"
            >
              <LogOut className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
}
