"use client";

import React, { useState } from "react";
import { Lock, Shield, ArrowRight, LogOut, KeyRound } from "lucide-react";
import { useVault } from "@/lib/vault-context";
import { PasswordField } from "./PasswordField";
import { Button } from "./Button";
import { Card } from "./Card";
import { Alert } from "./Alert";

export function LockScreen() {
  const { profile, unlockVault, logout } = useVault();
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleUnlock = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!password) {
      setError("Please enter your master password to unlock.");
      return;
    }

    setIsLoading(true);
    const res = await unlockVault(password);
    setIsLoading(false);

    if (!res.success) {
      setError(res.error || "Incorrect password. Please try again.");
    } else {
      setPassword("");
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-midnight-950/90 backdrop-blur-xl p-4 animate-in fade-in duration-300">
      <div className="w-full max-w-md">
        <Card className="text-center space-y-6 border-electric-500/40 shadow-glow-md bg-charcoal-900/95">
          {/* Lock Icon Banner */}
          <div className="relative mx-auto w-20 h-20 rounded-3xl bg-charcoal-800 border border-electric-500/30 flex items-center justify-center text-electric-400 shadow-glow-sm">
            <Lock className="w-10 h-10 text-electric-400" />
            <div className="absolute -bottom-1 -right-1 p-1.5 rounded-full bg-electric-600 text-white">
              <Shield className="w-3.5 h-3.5" />
            </div>
          </div>

          <div className="space-y-1.5">
            <h2 className="text-2xl font-bold text-white tracking-tight">Vault Locked</h2>
            <p className="text-xs text-slate-400">
              Your session was locked for inactivity or by security preference.
            </p>
          </div>

          {/* User badge */}
          <div className="inline-flex items-center space-x-2.5 px-3 py-1.5 rounded-full bg-midnight-950 border border-charcoal-800 text-xs">
            <div className="w-5 h-5 rounded-full bg-electric-600/30 text-electric-400 font-bold flex items-center justify-center text-[10px]">
              {profile.full_name?.charAt(0) || "U"}
            </div>
            <span className="text-slate-200 font-medium">{profile.email}</span>
          </div>

          {error && <Alert type="error" message={error} className="text-left" />}

          <form onSubmit={handleUnlock} className="space-y-4 text-left">
            <PasswordField
              label="Master Password"
              placeholder="Enter master password to unlock"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoFocus
              required
            />

            <Button
              type="submit"
              variant="primary"
              className="w-full"
              isLoading={isLoading}
              rightIcon={<ArrowRight className="w-4 h-4" />}
            >
              Unlock Vault
            </Button>
          </form>

          <div className="pt-2 border-t border-charcoal-800 flex items-center justify-between text-xs text-slate-400">
            <span>Not you or forgot password?</span>
            <button
              type="button"
              onClick={logout}
              className="text-red-400 hover:text-red-300 font-medium flex items-center space-x-1"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Log Out</span>
            </button>
          </div>
        </Card>
      </div>
    </div>
  );
}
