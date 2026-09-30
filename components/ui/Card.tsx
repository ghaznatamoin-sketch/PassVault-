import React from "react";
import { cn } from "@/lib/utils";

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  hoverEffect?: boolean;
  glow?: boolean;
}

export function Card({ className, hoverEffect = false, glow = false, children, ...props }: CardProps) {
  return (
    <div
      className={cn(
        "rounded-2xl bg-charcoal-900/90 border border-charcoal-700/60 p-6 backdrop-blur-md shadow-card transition-all duration-200",
        hoverEffect && "hover:border-charcoal-600 hover:shadow-glow-sm hover:-translate-y-0.5",
        glow && "border-electric-500/40 shadow-glow-sm",
        className
      )}
      {...props}
    >
      {children}
    </div>
  );
}
