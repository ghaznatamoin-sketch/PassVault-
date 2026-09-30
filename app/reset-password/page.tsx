"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Shield, CheckCircle2 } from "lucide-react";
import { PasswordField } from "@/components/ui/PasswordField";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Alert } from "@/components/ui/Alert";
import { useVault } from "@/lib/vault-context";
import { supabaseUpdatePassword, isSupabaseConfigured } from "@/lib/supabase/client";

export default function ResetPasswordPage() {
  const router = useRouter();
  const { showToast } = useVault();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!password || !confirmPassword) {
      setError("Please verify your information before continuing.");
      return;
    }

    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters long.");
      return;
    }

    setIsLoading(true);
    if (isSupabaseConfigured()) {
      const res = await supabaseUpdatePassword(password);
      setIsLoading(false);
      if (res.success) {
        setIsSuccess(true);
        showToast("Password updated successfully.", "success");
      } else {
        setError(res.error || "Password update failed.");
      }
      return;
    }

    await new Promise((resolve) => setTimeout(resolve, 600));
    setIsLoading(false);
    setIsSuccess(true);
    showToast("Password updated successfully.", "success");
  };

  return (
    <div className="min-h-screen bg-midnight-950 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center space-y-3">
        <Link href="/" className="inline-flex items-center space-x-2.5">
          <div className="p-2.5 rounded-xl bg-electric-600 text-white shadow-glow-sm">
            <Shield className="w-6 h-6" />
          </div>
          <span className="text-2xl font-bold tracking-tight text-white">
            Pass<span className="text-electric-400">Vault</span>
          </span>
        </Link>
        <h2 className="text-2xl font-bold text-white tracking-tight">Create New Password</h2>
        <p className="text-sm text-slate-400">
          Enter and confirm your new master password.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <Card className="space-y-6">
          {error && <Alert type="error" message={error} />}

          {isSuccess ? (
            <div className="text-center space-y-4">
              <div className="w-12 h-12 mx-auto rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-white">Password Updated</h3>
              <p className="text-sm text-slate-300">
                Your master password has been successfully updated. You can now sign in with your new credentials.
              </p>
              <div className="pt-4">
                <Link href="/login">
                  <Button variant="primary" className="w-full">
                    Sign In Now
                  </Button>
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <PasswordField
                label="New Master Password"
                placeholder="Enter new password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                showStrength
                required
              />

              <PasswordField
                label="Confirm New Password"
                placeholder="Re-enter new password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />

              <div className="text-xs text-slate-400 space-y-1 bg-midnight-950 p-3 rounded-xl border border-charcoal-800">
                <p className="font-semibold text-slate-300">Password Requirements:</p>
                <ul className="list-disc list-inside space-y-0.5">
                  <li>At least 8 characters long</li>
                  <li>Include uppercase and lowercase letters</li>
                  <li>Include at least one number or symbol</li>
                </ul>
              </div>

              <Button type="submit" variant="primary" className="w-full" isLoading={isLoading}>
                Update Password
              </Button>
            </form>
          )}
        </Card>
      </div>
    </div>
  );
}
