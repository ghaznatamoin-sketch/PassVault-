import React from "react";
import { AlertCircle, CheckCircle2, AlertTriangle, Info } from "lucide-react";
import { cn } from "@/lib/utils";

interface AlertProps {
  type?: "error" | "success" | "warning" | "info";
  title?: string;
  message: string;
  className?: string;
}

export function Alert({ type = "info", title, message, className }: AlertProps) {
  const styles = {
    error: "bg-red-950/40 border-red-500/30 text-red-200 icon-text-red-400",
    success: "bg-emerald-950/40 border-emerald-500/30 text-emerald-200 icon-text-emerald-400",
    warning: "bg-amber-950/40 border-amber-500/30 text-amber-200 icon-text-amber-400",
    info: "bg-blue-950/40 border-blue-500/30 text-blue-200 icon-text-blue-400",
  };

  const icons = {
    error: <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0 mt-0.5" />,
    success: <CheckCircle2 className="w-5 h-5 text-emerald-400 flex-shrink-0 mt-0.5" />,
    warning: <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" />,
    info: <Info className="w-5 h-5 text-blue-400 flex-shrink-0 mt-0.5" />,
  };

  return (
    <div className={cn("flex items-start space-x-3 p-4 rounded-xl border", styles[type], className)}>
      {icons[type]}
      <div className="space-y-0.5 text-sm">
        {title && <h5 className="font-semibold text-white">{title}</h5>}
        <p className="opacity-90 leading-relaxed">{message}</p>
      </div>
    </div>
  );
}
