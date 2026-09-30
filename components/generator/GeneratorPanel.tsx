"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { RefreshCw, Copy, Check, ArrowRight, Wand2, ShieldCheck } from "lucide-react";
import { useVault } from "@/lib/vault-context";
import { generatePassword, evaluatePasswordStrength } from "@/lib/generator";
import { copyToClipboard } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Toggle } from "@/components/ui/Toggle";
import { Card } from "@/components/ui/Card";

interface GeneratorPanelProps {
  onUsePassword?: (password: string) => void;
  showUseButton?: boolean;
}

export function GeneratorPanel({ onUsePassword, showUseButton = true }: GeneratorPanelProps) {
  const router = useRouter();
  const { generatorSettings, updateGeneratorSettings, setActiveGeneratedPassword, showToast } = useVault();
  const [generatedPassword, setGeneratedPassword] = useState("");
  const [copied, setCopied] = useState(false);

  // Generate on mount and when settings change
  useEffect(() => {
    const pwd = generatePassword(generatorSettings);
    setGeneratedPassword(pwd);
  }, [generatorSettings]);

  const handleRegenerate = () => {
    const pwd = generatePassword(generatorSettings);
    setGeneratedPassword(pwd);
  };

  const handleCopy = async () => {
    const ok = await copyToClipboard(generatedPassword);
    if (ok) {
      setCopied(true);
      showToast("Password copied to clipboard", "success");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleUsePassword = () => {
    if (onUsePassword) {
      onUsePassword(generatedPassword);
    } else {
      setActiveGeneratedPassword(generatedPassword);
      router.push("/vault/new");
    }
  };

  const strength = evaluatePasswordStrength(generatedPassword);

  return (
    <Card className="max-w-2xl mx-auto space-y-6">
      {/* Password Preview Box */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Generated Password
          </span>
          <div className="flex items-center space-x-2 text-xs">
            <span className="text-slate-400">Strength:</span>
            <span className={`font-semibold ${strength.colorClass}`}>{strength.label}</span>
          </div>
        </div>

        <div className="relative flex items-center justify-between p-4 rounded-xl bg-midnight-950 border border-charcoal-700/80">
          <div className="font-mono text-lg md:text-xl text-white tracking-widest break-all select-all pr-4">
            {generatedPassword}
          </div>

          <div className="flex items-center space-x-2 flex-shrink-0">
            <button
              type="button"
              onClick={handleRegenerate}
              title="Generate new password"
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-charcoal-800 transition-colors"
            >
              <RefreshCw className="w-5 h-5 hover:rotate-180 transition-transform duration-300" />
            </button>
            <button
              type="button"
              onClick={handleCopy}
              title="Copy password"
              className="flex items-center space-x-1.5 px-3 py-2 rounded-lg bg-electric-600/20 text-electric-400 hover:bg-electric-600 hover:text-white border border-electric-500/30 transition-all font-medium text-xs"
            >
              {copied ? (
                <>
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span className="text-emerald-400">Copied</span>
                </>
              ) : (
                <>
                  <Copy className="w-4 h-4" />
                  <span>Copy</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Strength meter bar */}
        <div className="grid grid-cols-4 gap-1.5 h-1.5 w-full bg-charcoal-800 rounded-full overflow-hidden">
          {[1, 2, 3, 4].map((step) => (
            <div
              key={step}
              className={`h-full transition-colors duration-300 ${
                strength.score >= step
                  ? strength.score === 1
                    ? "bg-red-500"
                    : strength.score === 2
                    ? "bg-amber-500"
                    : strength.score === 3
                    ? "bg-blue-500"
                    : "bg-emerald-500"
                  : "bg-charcoal-700"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Length Slider */}
      <div className="space-y-3 pt-2">
        <div className="flex items-center justify-between text-sm">
          <label htmlFor="pwd-length" className="font-medium text-slate-200">
            Password Length
          </label>
          <span className="px-2.5 py-0.5 rounded-lg bg-charcoal-800 text-electric-400 font-mono font-bold text-sm border border-charcoal-700">
            {generatorSettings.password_length} characters
          </span>
        </div>
        <input
          id="pwd-length"
          type="range"
          min="6"
          max="48"
          value={generatorSettings.password_length}
          onChange={(e) => updateGeneratorSettings({ password_length: parseInt(e.target.value, 10) })}
          className="w-full h-2 bg-charcoal-800 rounded-lg appearance-none cursor-pointer accent-electric-500"
        />
        <div className="flex justify-between text-[11px] text-slate-400">
          <span>6 characters</span>
          <span>24 (Recommended)</span>
          <span>48 characters</span>
        </div>
      </div>

      {/* Character Type Toggles */}
      <div className="space-y-3 pt-2 border-t border-charcoal-800">
        <h4 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
          Character Options
        </h4>
        <div className="space-y-3">
          <Toggle
            label="Uppercase Letters (A-Z)"
            description="Include capital letters in the password"
            checked={generatorSettings.uppercase_enabled}
            onChange={(checked) => updateGeneratorSettings({ uppercase_enabled: checked })}
          />
          <Toggle
            label="Lowercase Letters (a-z)"
            description="Include small letters in the password"
            checked={generatorSettings.lowercase_enabled}
            onChange={(checked) => updateGeneratorSettings({ lowercase_enabled: checked })}
          />
          <Toggle
            label="Numbers (0-9)"
            description="Include numeric digits in the password"
            checked={generatorSettings.numbers_enabled}
            onChange={(checked) => updateGeneratorSettings({ numbers_enabled: checked })}
          />
          <Toggle
            label="Special Symbols (!@#$%...)"
            description="Include symbols for maximum entropy"
            checked={generatorSettings.symbols_enabled}
            onChange={(checked) => updateGeneratorSettings({ symbols_enabled: checked })}
          />
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex items-center justify-end space-x-3 pt-4 border-t border-charcoal-800">
        <Button
          type="button"
          variant="secondary"
          onClick={handleRegenerate}
          leftIcon={<RefreshCw className="w-4 h-4" />}
        >
          Regenerate
        </Button>
        {showUseButton && (
          <Button
            type="button"
            variant="primary"
            onClick={handleUsePassword}
            rightIcon={<ArrowRight className="w-4 h-4" />}
          >
            Use in Credential Form
          </Button>
        )}
      </div>
    </Card>
  );
}
