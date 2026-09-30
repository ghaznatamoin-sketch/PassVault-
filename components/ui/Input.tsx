import React from "react";
import { cn } from "@/lib/utils";

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  helperText?: string;
  leftIcon?: React.ReactNode;
  rightElement?: React.ReactNode;
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, label, error, helperText, leftIcon, rightElement, id, ...props }, ref) => {
    const inputId = id || (label ? label.toLowerCase().replace(/\s+/g, "-") : undefined);

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label htmlFor={inputId} className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
            {label}
            {props.required && <span className="text-electric-400 ml-1">*</span>}
          </label>
        )}
        <div className="relative flex items-center">
          {leftIcon && (
            <div className="absolute left-3.5 flex items-center pointer-events-none text-slate-400">
              {leftIcon}
            </div>
          )}
          <input
            id={inputId}
            ref={ref}
            className={cn(
              "w-full rounded-xl bg-charcoal-900 border border-charcoal-700/80 px-4 py-2.5 text-sm text-white placeholder-slate-500 transition-all duration-200",
              "focus:outline-none focus:border-electric-500 focus:ring-1 focus:ring-electric-500",
              "disabled:opacity-50 disabled:bg-charcoal-950 disabled:cursor-not-allowed",
              leftIcon ? "pl-10" : "",
              rightElement ? "pr-12" : "",
              error ? "border-red-500 focus:border-red-500 focus:ring-red-500" : "",
              className
            )}
            {...props}
          />
          {rightElement && (
            <div className="absolute right-3 flex items-center">
              {rightElement}
            </div>
          )}
        </div>
        {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
        {helperText && !error && <p className="text-xs text-slate-500 mt-1">{helperText}</p>}
      </div>
    );
  }
);
Input.displayName = "Input";
