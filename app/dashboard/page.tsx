"use client";

import React from "react";
import Link from "next/link";
import {
  FolderLock,
  Plus,
  Wand2,
  ShieldCheck,
  Search,
  ArrowRight,
  TrendingUp,
  AlertTriangle,
  KeyRound,
  ExternalLink,
  Sparkles,
  Puzzle,
  Lock,
  CreditCard,
} from "lucide-react";
import { useVault } from "@/lib/vault-context";
import { AppLayout } from "@/components/navigation/AppLayout";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { CredentialCard } from "@/components/vault/CredentialCard";
import { Badge } from "@/components/ui/Badge";

export default function DashboardPage() {
  const { profile, credentials, subscription, lockVault } = useVault();

  // Category counts
  const workCount = credentials.filter((c) => c.category === "Work").length;
  const socialCount = credentials.filter((c) => c.category === "Social").length;
  const shoppingCount = credentials.filter((c) => c.category === "Shopping").length;
  const financeCount = credentials.filter((c) => c.category === "Finance").length;
  const educationCount = credentials.filter((c) => c.category === "Education").length;

  const recentCredentials = credentials.slice(0, 3);

  return (
    <AppLayout>
      <div className="space-y-8">
        {/* Welcome Banner */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-6 rounded-2xl bg-gradient-to-r from-electric-600/20 via-charcoal-900 to-charcoal-900 border border-electric-500/30">
          <div className="space-y-1">
            <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
              Welcome back, {profile.full_name || "User"}
            </h1>
            <p className="text-sm text-slate-300">
              Your PassVault is active and keeping your account credentials organized.
            </p>
          </div>
          <div className="flex items-center space-x-3">
            <Link href="/generator">
              <Button variant="secondary" size="sm" leftIcon={<Wand2 className="w-4 h-4 text-electric-400" />}>
                Password Generator
              </Button>
            </Link>
            <Link href="/vault/new">
              <Button variant="primary" size="sm" leftIcon={<Plus className="w-4 h-4" />}>
                Add Credential
              </Button>
            </Link>
          </div>
        </div>

        {/* Phase 2: Subscription Free Trial Banner */}
        {subscription.plan === "free_trial" && (
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 via-charcoal-900 to-charcoal-900 border border-amber-500/30">
            <div className="flex items-center space-x-3">
              <div className="p-2 rounded-xl bg-amber-500/20 text-amber-400">
                <Sparkles className="w-5 h-5" />
              </div>
              <div>
                <p className="text-sm font-semibold text-white">
                  30-Day Free Trial: <span className="text-amber-300">{subscription.trialDaysLeft} days remaining</span>
                </p>
                <p className="text-xs text-slate-400">
                  Enjoy unlimited vault storage, cryptographic generation, and browser extension access.
                </p>
              </div>
            </div>
            <Link href="/subscription" className="flex-shrink-0">
              <Button variant="secondary" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                View Plans & Upgrade
              </Button>
            </Link>
          </div>
        )}

        {/* Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-5 flex items-center space-x-4">
            <div className="p-3 rounded-xl bg-electric-600/20 text-electric-400 border border-electric-500/30">
              <FolderLock className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs uppercase font-semibold text-slate-400">Total Saved</p>
              <p className="text-2xl font-bold text-white mt-0.5">{credentials.length}</p>
            </div>
          </Card>

          <Card className="p-5 flex items-center space-x-4">
            <div className="p-3 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30">
              <KeyRound className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs uppercase font-semibold text-slate-400">Work & Dev</p>
              <p className="text-2xl font-bold text-white mt-0.5">{workCount}</p>
            </div>
          </Card>

          <Card className="p-5 flex items-center space-x-4">
            <div className="p-3 rounded-xl bg-purple-500/20 text-purple-400 border border-purple-500/30">
              <TrendingUp className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs uppercase font-semibold text-slate-400">Social & Personal</p>
              <p className="text-2xl font-bold text-white mt-0.5">{socialCount}</p>
            </div>
          </Card>

          <Card className="p-5 flex items-center space-x-4">
            <div className="p-3 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
              <ShieldCheck className="w-6 h-6" />
            </div>
            <div>
              <p className="text-xs uppercase font-semibold text-slate-400">Finance & Shop</p>
              <p className="text-2xl font-bold text-white mt-0.5">{financeCount + shoppingCount}</p>
            </div>
          </Card>
        </div>

        {/* Phase 2: Browser Extension & Security Reminders */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Card className="border-electric-500/20 bg-charcoal-900/60 p-5 flex flex-col justify-between gap-4">
            <div className="flex items-start space-x-3.5">
              <div className="p-2.5 rounded-xl bg-electric-600/15 text-electric-400 border border-electric-500/30 flex-shrink-0 mt-0.5">
                <Puzzle className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-semibold text-white">PassVault Browser Extension</h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Detect login fields, save credentials on submit, and autofill accounts automatically in Chrome, Edge, and Firefox.
                </p>
              </div>
            </div>
            <div className="flex justify-end">
              <Link href="/extension">
                <Button variant="outline" size="sm" rightIcon={<ArrowRight className="w-3.5 h-3.5" />}>
                  Explore Extension & Simulator
                </Button>
              </Link>
            </div>
          </Card>

          <Card className="border-electric-500/20 bg-charcoal-900/60 p-5 flex flex-col justify-between gap-4">
            <div className="flex items-start space-x-3.5">
              <div className="p-2.5 rounded-xl bg-amber-500/15 text-amber-400 border border-amber-500/30 flex-shrink-0 mt-0.5">
                <Lock className="w-5 h-5" />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-semibold text-white">Session Security & Vault Lock</h4>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Keep your vault locked when stepping away from your computer. Unlock anytime with your Master Password.
                </p>
              </div>
            </div>
            <div className="flex justify-end">
              <Button
                variant="secondary"
                size="sm"
                leftIcon={<Lock className="w-3.5 h-3.5 text-amber-400" />}
                onClick={lockVault}
              >
                Lock Vault Now
              </Button>
            </div>
          </Card>
        </div>

        {/* Recently Added Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-white">Recently Managed Accounts</h2>
              <p className="text-xs text-slate-400">Quick access to your most frequently used login credentials.</p>
            </div>
            <Link
              href="/vault"
              className="text-xs font-semibold text-electric-400 hover:text-electric-300 flex items-center space-x-1"
            >
              <span>View all ({credentials.length})</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {recentCredentials.map((cred) => (
              <CredentialCard key={cred.id} credential={cred} />
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}
