import React, { useState } from "react";
import { Eye, EyeOff, Copy, Check } from "lucide-react";
import { cn, copyToClipboard } from "@/lib/utils";
import { evaluatePasswordStrength } from "@/lib/generator";

interface PasswordFieldProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  label?: string;
  error?: string;
  showStrength?: boolean;
  allowCopy?: boolean;
  onCopySuccess?: () => void;
}

export const PasswordField = React.forwardRef<HTMLInputElement, PasswordFieldProps>(
  ({ className, label, error, showStrength = false, allowCopy = false, onCopySuccess, value, onChange, ...props }, ref) => {
    const [showPassword, setShowPassword] = useState(false);
    const [copied, setCopied] = useState(false);

    const handleCopy = async () => {
      const textToCopy = String(value || "");
      if (!textToCopy) return;
      const ok = await copyToClipboard(textToCopy);
      if (ok) {
        setCopied(true);
        if (onCopySuccess) onCopySuccess();
        setTimeout(() => setCopied(false), 2000);
      }
    };

    const strength = showStrength ? evaluatePasswordStrength(String(value || "")) : null;

    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
            {label}
            {props.required && <span className="text-electric-400 ml-1">*</span>}
          </label>
        )}
        <div className="relative flex items-center">
          <input
            ref={ref}
            type={showPassword ? "text" : "password"}
            value={value}
            onChange={onChange}
            className={cn(
              "w-full rounded-xl bg-charcoal-900 border border-charcoal-700/80 px-4 py-2.5 pr-20 text-sm text-white placeholder-slate-500 font-mono tracking-wider transition-all duration-200",
              "focus:outline-none focus:border-electric-500 focus:ring-1 focus:ring-electric-500",
              "disabled:opacity-50 disabled:bg-charcoal-950 disabled:cursor-not-allowed",
              error ? "border-red-500 focus:border-red-500 focus:ring-red-500" : "",
              className
            )}
            {...props}
          />
          <div className="absolute right-2 flex items-center space-x-1">
            {allowCopy && value && (
              <button
                type="button"
                onClick={handleCopy}
                title={copied ? "Copied to clipboard" : "Copy password"}
                className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-charcoal-800 transition-colors"
              >
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            )}
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              title={showPassword ? "Hide password" : "Show password"}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-charcoal-800 transition-colors"
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>
        </div>
        {showStrength && value && strength && (
          <div className="pt-1 space-y-1">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-400">Strength:</span>
              <span className={cn("font-medium", strength.colorClass)}>{strength.label}</span>
            </div>
            <div className="grid grid-cols-4 gap-1.5 h-1 w-full bg-charcoal-800 rounded-full overflow-hidden">
              {[1, 2, 3, 4].map((step) => (
                <div
                  key={step}
                  className={cn(
                    "h-full transition-colors duration-300",
                    strength.score >= step
                      ? strength.score === 1
                        ? "bg-red-500"
                        : strength.score === 2
                        ? "bg-amber-500"
                        : strength.score === 3
                        ? "bg-blue-500"
                        : "bg-emerald-500"
                      : "bg-charcoal-700"
                  )}
                />
              ))}
            </div>
          </div>
        )}
        {error && <p className="text-xs text-red-400 mt-1">{error}</p>}
      </div>
    );
  }
);
PasswordField.displayName = "PasswordField";
