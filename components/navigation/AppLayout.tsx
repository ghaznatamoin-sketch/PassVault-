"use client";

import React, { useEffect } from "react";
import { useRouter } from "next/navigation";
import { Sidebar } from "./Sidebar";
import { MobileNav } from "./MobileNav";
import { Topbar } from "./Topbar";
import { Toast } from "@/components/ui/Toast";
import { LockScreen } from "@/components/ui/LockScreen";
import { useVault } from "@/lib/vault-context";

export function AppLayout({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const { isLocked, isAuthenticated } = useVault();

  useEffect(() => {
    // FR-1.9: Unauthenticated users are redirected to Login
    if (!isAuthenticated) {
      router.push("/login");
    }
  }, [isAuthenticated, router]);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-midnight-950 flex items-center justify-center text-slate-400">
        <div className="text-center space-y-2">
          <p className="text-sm">Checking authentication session...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-midnight-950 text-slate-100 flex flex-col md:flex-row">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0 overflow-x-hidden">
        <MobileNav />
        <Topbar />
        <main className="flex-1 p-4 md:p-8 max-w-7xl w-full mx-auto">{children}</main>
      </div>
      <Toast />
      {isLocked && <LockScreen />}
    </div>
  );
}
