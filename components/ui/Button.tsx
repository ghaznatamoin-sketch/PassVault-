import React from "react";
import { cn } from "@/lib/utils";
import { Spinner } from "./Spinner";

interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
  isLoading?: boolean;
  leftIcon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", isLoading = false, leftIcon, rightIcon, children, disabled, ...props }, ref) => {
    const baseStyles = "inline-flex items-center justify-center font-medium rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-midnight-950 disabled:opacity-50 disabled:cursor-not-allowed select-none";

    const variantStyles = {
      primary: "bg-electric-600 hover:bg-electric-500 text-white shadow-glow-sm hover:shadow-glow-md focus:ring-electric-500 active:scale-[0.98]",
      secondary: "bg-charcoal-800 hover:bg-charcoal-700 text-slate-200 border border-charcoal-700 hover:border-charcoal-600 focus:ring-charcoal-600",
      danger: "bg-red-600/90 hover:bg-red-600 text-white shadow-sm focus:ring-red-500 active:scale-[0.98]",
      outline: "bg-transparent hover:bg-charcoal-800/60 text-slate-200 border border-charcoal-700 hover:border-slate-500 focus:ring-electric-500",
      ghost: "bg-transparent hover:bg-charcoal-800/60 text-slate-300 hover:text-white focus:ring-charcoal-600",
    };

    const sizeStyles = {
      sm: "text-xs px-3 py-1.5 gap-1.5 min-h-[32px]",
      md: "text-sm px-4 py-2.5 gap-2 min-h-[42px]",
      lg: "text-base px-6 py-3.5 gap-2.5 min-h-[50px]",
    };

    return (
      <button
        ref={ref}
        disabled={disabled || isLoading}
        className={cn(baseStyles, variantStyles[variant], sizeStyles[size], className)}
        {...props}
      >
        {isLoading ? <Spinner size="sm" className="text-current" /> : leftIcon}
        <span>{children}</span>
        {!isLoading && rightIcon}
      </button>
    );
  }
);
Button.displayName = "Button";
