"use client";

import React from "react";
import { useVault } from "@/lib/vault-context";
import { CheckCircle2, AlertCircle, AlertTriangle, Info } from "lucide-react";
import { cn } from "@/lib/utils";

export function Toast() {
  const { toastMessage } = useVault();

  if (!toastMessage) return null;

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0" />,
    error: <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />,
    warning: <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0" />,
    info: <Info className="w-5 h-5 text-blue-400 flex-shrink-0" />,
  };

  const borders = {
    success: "border-emerald-500/40 bg-charcoal-900/95 text-emerald-200",
    error: "border-red-500/40 bg-charcoal-900/95 text-red-200",
    warning: "border-amber-500/40 bg-charcoal-900/95 text-amber-200",
    info: "border-blue-500/40 bg-charcoal-900/95 text-blue-200",
  };

  return (
    <div className="fixed bottom-6 right-6 z-50 max-w-sm animate-in slide-in-from-bottom-5 duration-300">
      <div className={cn("flex items-center space-x-3 px-4 py-3 rounded-xl border shadow-2xl backdrop-blur-md", borders[toastMessage.type])}>
        {icons[toastMessage.type]}
        <p className="text-sm font-medium text-slate-100">{toastMessage.text}</p>
      </div>
    </div>
  );
}
