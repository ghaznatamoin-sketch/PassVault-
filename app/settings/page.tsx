"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Settings,
  Shield,
  Key,
  LogOut,
  Lock,
} from "lucide-react";
import { useVault } from "@/lib/vault-context";
import { AppLayout } from "@/components/navigation/AppLayout";
import { Card } from "@/components/ui/Card";
import { PasswordField } from "@/components/ui/PasswordField";
import { Button } from "@/components/ui/Button";
import { Alert } from "@/components/ui/Alert";
import { Modal } from "@/components/ui/Modal";
import { AutoLockTimeout } from "@/lib/types";

export default function SecuritySettingsPage() {
  const router = useRouter();
  const {
    logout,
    lockVault,
    autoLockTimeout,
    setAutoLockTimeout,
    showToast,
  } = useVault();

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const timeoutOptions: { label: string; value: AutoLockTimeout }[] = [
    { label: "1 minute of inactivity", value: 1 },
    { label: "5 minutes of inactivity", value: 5 },
    { label: "15 minutes of inactivity (Recommended)", value: 15 },
    { label: "30 minutes of inactivity", value: 30 },
    { label: "1 hour of inactivity", value: 60 },
    { label: "Never (Not recommended)", value: 0 },
  ];

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (!currentPassword || !newPassword || !confirmPassword) {
      setError("Please verify your information before continuing.");
      return;
    }

    if (newPassword !== confirmPassword) {
      setError("New passwords do not match.");
      return;
    }

    if (newPassword.length < 8) {
      setError("New password must be at least 8 characters long.");
      return;
    }

    setIsLoading(true);
    await new Promise((resolve) => setTimeout(resolve, 600));
    setIsLoading(false);
    setSuccess(true);
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    showToast("Master password updated successfully.", "success");
  };

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <Settings className="w-6 h-6 text-electric-400" />
            <span>Security & Session Settings</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Configure your master password and automatic session lock preferences.
          </p>
        </div>

        {/* Change Master Password Card */}
        <Card className="space-y-6">
          <div className="flex items-center space-x-3 pb-4 border-b border-charcoal-800">
            <div className="p-2 rounded-xl bg-electric-600/15 text-electric-400 border border-electric-500/30">
              <Key className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-white">Change Master Password</h2>
              <p className="text-xs text-slate-400">
                Your master password protects all credentials in your PassVault account.
              </p>
            </div>
          </div>

          {error && <Alert type="error" message={error} />}
          {success && (
            <Alert
              type="success"
              title="Password Updated"
              message="Your master password has been changed successfully."
            />
          )}

          <form onSubmit={handlePasswordChange} className="space-y-4">
            <PasswordField
              label="Current Master Password"
              placeholder="Enter current password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
            />

            <PasswordField
              label="New Master Password"
              placeholder="Enter new strong password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              showStrength
              required
            />

            <PasswordField
              label="Confirm New Master Password"
              placeholder="Re-enter new password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />

            <div className="flex justify-end pt-2">
              <Button type="submit" variant="primary" isLoading={isLoading}>
                Update Master Password
              </Button>
            </div>
          </form>
        </Card>

        {/* Session Lock & Auto-Lock Card */}
        <Card className="space-y-5 border-electric-500/20">
          <div className="flex items-center space-x-3 pb-3 border-b border-charcoal-800">
            <div className="p-2 rounded-xl bg-amber-500/15 text-amber-400 border border-amber-500/30">
              <Lock className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">Session Security & Vault Auto-Lock</h2>
              <p className="text-xs text-slate-400">
                Automatically lock your vault when inactive to protect credentials from unauthorized access.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            <div className="w-full space-y-1.5">
              <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
                Auto-Lock Timeout
              </label>
              <select
                value={autoLockTimeout}
                onChange={(e) => setAutoLockTimeout(parseInt(e.target.value, 10) as AutoLockTimeout)}
                className="w-full rounded-xl bg-charcoal-900 border border-charcoal-700 px-4 py-2.5 text-sm text-white focus:outline-none focus:border-electric-500 focus:ring-1 focus:ring-electric-500 transition-colors"
              >
                {timeoutOptions.map((opt) => (
                  <option key={opt.value} value={opt.value} className="bg-midnight-950 text-white">
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 p-3.5 rounded-xl bg-midnight-950 border border-charcoal-800">
              <div>
                <p className="text-xs font-semibold text-white">Manual Instant Lock</p>
                <p className="text-[11px] text-slate-400">Lock your vault immediately on demand.</p>
              </div>
              <Button
                variant="secondary"
                size="sm"
                leftIcon={<Lock className="w-3.5 h-3.5 text-amber-400" />}
                onClick={lockVault}
              >
                Lock Vault Now
              </Button>
            </div>
          </div>
        </Card>

        {/* Active Session & Logout Card */}
        <Card className="space-y-4">
          <div className="flex items-center space-x-3 pb-3 border-b border-charcoal-800">
            <div className="p-2 rounded-xl bg-blue-500/15 text-blue-400 border border-blue-500/30">
              <Shield className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-semibold text-white">Active Session</h3>
              <p className="text-xs text-slate-400">Current web device authentication status.</p>
            </div>
          </div>

          <div className="p-4 rounded-xl bg-midnight-950 border border-charcoal-800 flex items-center justify-between">
            <div>
              <p className="text-sm font-semibold text-white">PassVault Web Client</p>
              <p className="text-xs text-slate-400 mt-0.5">Session Active • Encrypted local state</p>
            </div>
            <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
              Authenticated
            </span>
          </div>

          <div className="pt-2 flex justify-between items-center">
            <p className="text-xs text-slate-400">
              Sign out from this device to end your session.
            </p>
            <Button
              variant="danger"
              size="sm"
              leftIcon={<LogOut className="w-4 h-4" />}
              onClick={() => setIsLogoutModalOpen(true)}
            >
              Sign Out
            </Button>
          </div>
        </Card>
      </div>

      {/* Logout Confirmation Modal */}
      <Modal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        title="Sign out of PassVault?"
        description="Are you sure you want to end your current session? You will need to sign in again to access your vault."
        confirmLabel="Sign Out"
        confirmVariant="danger"
        onConfirm={handleLogout}
      />
    </AppLayout>
  );
}
