"use client";

import React, { useState } from "react";
import { User, Mail, Calendar, ShieldCheck } from "lucide-react";
import { useVault } from "@/lib/vault-context";
import { AppLayout } from "@/components/navigation/AppLayout";
import { Card } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { formatDate } from "@/lib/utils";

export default function ProfilePage() {
  const { profile, updateProfile } = useVault();
  const [fullName, setFullName] = useState(profile.full_name);
  const [email, setEmail] = useState(profile.email);
  const [isLoading, setIsLoading] = useState(false);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    await updateProfile({ full_name: fullName, email });
    setIsLoading(false);
  };

  return (
    <AppLayout>
      <div className="max-w-2xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <User className="w-6 h-6 text-electric-400" />
            <span>Profile & Account Settings</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Manage your personal profile information and PassVault identity.
          </p>
        </div>

        <Card className="space-y-6">
          <div className="flex items-center space-x-4 pb-6 border-b border-charcoal-800">
            <div className="w-16 h-16 rounded-2xl bg-electric-600/20 text-electric-400 border border-electric-500/30 flex items-center justify-center font-bold text-2xl">
              {profile.full_name?.charAt(0) || "U"}
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">{profile.full_name}</h2>
              <p className="text-sm text-slate-400">{profile.email}</p>
            </div>
          </div>

          <form onSubmit={handleSave} className="space-y-4">
            <Input
              label="Full Name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
              leftIcon={<User className="w-4 h-4" />}
            />

            <Input
              label="Email Address"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              leftIcon={<Mail className="w-4 h-4" />}
            />

            <div className="pt-2 flex items-center justify-between text-xs text-slate-400 border-t border-charcoal-800">
              <span className="flex items-center gap-1.5">
                <Calendar className="w-4 h-4 text-slate-400" />
                Member since: {formatDate(profile.created_at)}
              </span>
              <span className="flex items-center gap-1.5 text-emerald-400">
                <ShieldCheck className="w-4 h-4" />
                Account Active
              </span>
            </div>

            <div className="flex justify-end pt-4">
              <Button type="submit" variant="primary" isLoading={isLoading}>
                Save Profile Changes
              </Button>
            </div>
          </form>
        </Card>
      </div>
    </AppLayout>
  );
}
