"use client";

import React, { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { MailCheck, ArrowRight, Shield } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { useVault } from "@/lib/vault-context";

function VerifyEmailContent() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "your-email@example.com";
  const { showToast } = useVault();

  const handleResend = () => {
    showToast(`Verification link resent to ${email}`, "success");
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
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-md px-4 sm:px-0">
        <Card className="text-center space-y-6">
          <div className="w-16 h-16 mx-auto rounded-2xl bg-electric-600/10 border border-electric-500/30 text-electric-400 flex items-center justify-center">
            <MailCheck className="w-8 h-8" />
          </div>

          <div className="space-y-2">
            <h2 className="text-2xl font-bold text-white">Verify your email address</h2>
            <p className="text-sm text-slate-300">
              We have sent a verification link to:
            </p>
            <p className="text-sm font-semibold text-electric-400 font-mono bg-charcoal-800 py-1 px-3 rounded-lg inline-block">
              {email}
            </p>
            <p className="text-xs text-slate-400 pt-2">
              Click the link inside the email to activate your PassVault account and secure your credentials.
            </p>
          </div>

          <div className="space-y-3 pt-2">
            <Link href="/dashboard" className="block w-full">
              <Button variant="primary" className="w-full" rightIcon={<ArrowRight className="w-4 h-4" />}>
                Continue to Dashboard
              </Button>
            </Link>

            <Button variant="secondary" className="w-full" onClick={handleResend}>
              Resend Verification Email
            </Button>
          </div>

          <div className="pt-2 border-t border-charcoal-800">
            <Link href="/login" className="text-xs text-slate-400 hover:text-white transition-colors">
              Back to Sign In
            </Link>
          </div>
        </Card>
      </div>
    </div>
  );
}

export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-midnight-950 flex items-center justify-center text-white">Loading...</div>}>
      <VerifyEmailContent />
    </Suspense>
  );
}
