"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Shield, Mail, ArrowLeft, CheckCircle2 } from "lucide-react";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Alert } from "@/components/ui/Alert";
import { supabaseResetPassword, isSupabaseConfigured } from "@/lib/supabase/client";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!email.trim()) {
      setError("Please enter your registered email address.");
      return;
    }

    setIsLoading(true);
    if (isSupabaseConfigured()) {
      const res = await supabaseResetPassword(email.trim());
      setIsLoading(false);
      if (res.success) {
        setIsSubmitted(true);
      } else {
        setError(res.error || "Failed to send reset link.");
      }
      return;
    }

    await new Promise((resolve) => setTimeout(resolve, 600));
    setIsLoading(false);
    setIsSubmitted(true);
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
        <h2 className="text-2xl font-bold text-white tracking-tight">Reset your Password</h2>
        <p className="text-sm text-slate-400">
          Enter your email to receive recovery instructions.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <Card className="space-y-6">
          {error && <Alert type="error" message={error} />}

          {isSubmitted ? (
            <div className="text-center space-y-4">
              <div className="w-12 h-12 mx-auto rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-lg font-semibold text-white">Reset Link Sent</h3>
              <p className="text-sm text-slate-300">
                If an account exists for <span className="font-semibold text-white">{email}</span>, you will receive password reset instructions shortly.
              </p>
              <div className="pt-4 space-y-2">
                <Link href="/reset-password">
                  <Button variant="primary" className="w-full">
                    Enter New Password
                  </Button>
                </Link>
                <Link href="/login" className="block text-xs text-slate-400 hover:text-white pt-2">
                  Back to Sign In
                </Link>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <Input
                label="Registered Email Address"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                leftIcon={<Mail className="w-4 h-4" />}
                helperText="We will send a password reset link to this address."
              />

              <Button type="submit" variant="primary" className="w-full" isLoading={isLoading}>
                Send Reset Link
              </Button>

              <div className="text-center pt-2">
                <Link
                  href="/login"
                  className="inline-flex items-center space-x-1.5 text-xs text-slate-400 hover:text-white transition-colors"
                >
                  <ArrowLeft className="w-3.5 h-3.5" />
                  <span>Back to Sign In</span>
                </Link>
              </div>
            </form>
          )}
        </Card>
      </div>
    </div>
  );
}
