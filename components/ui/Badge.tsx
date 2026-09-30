import React from "react";
import { Category } from "@/lib/types";
import { cn } from "@/lib/utils";

interface BadgeProps {
  category?: Category | string;
  variant?: "default" | "outline";
  className?: string;
}

const CATEGORY_COLORS: Record<string, string> = {
  Social: "bg-purple-500/15 text-purple-300 border-purple-500/30",
  Work: "bg-blue-500/15 text-blue-300 border-blue-500/30",
  Shopping: "bg-amber-500/15 text-amber-300 border-amber-500/30",
  Finance: "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
  Education: "bg-cyan-500/15 text-cyan-300 border-cyan-500/30",
  Other: "bg-slate-500/15 text-slate-300 border-slate-500/30",
};

export function Badge({ category = "Other", className }: BadgeProps) {
  const colorStyle = CATEGORY_COLORS[category] || CATEGORY_COLORS.Other;

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border backdrop-blur-sm",
        colorStyle,
        className
      )}
    >
      {category}
    </span>
  );
}
