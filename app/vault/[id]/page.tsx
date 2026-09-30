"use client";

import React, { useState, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  Edit2,
  Trash2,
  ExternalLink,
  Calendar,
  Globe,
  User,
  Eye,
  EyeOff,
  Copy,
  Check,
  FileText,
  Shield,
} from "lucide-react";
import { useVault } from "@/lib/vault-context";
import { AppLayout } from "@/components/navigation/AppLayout";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { copyToClipboard, formatDate } from "@/lib/utils";

export default function CredentialDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = use(params);
  const router = useRouter();
  const { getCredentialById, deleteCredential, decryptCredentialPassword, showToast } = useVault();

  const credential = getCredentialById(unwrappedParams.id);
  const [showPassword, setShowPassword] = useState(false);
  const [plainPassword, setPlainPassword] = useState("");
  const [copiedPass, setCopiedPass] = useState(false);
  const [copiedUser, setCopiedUser] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  if (!credential) {
    return (
      <AppLayout>
        <div className="text-center py-20">
          <h2 className="text-xl font-bold text-white">Credential Not Found</h2>
          <p className="text-sm text-slate-400 mt-2 mb-6">
            The requested login account could not be found or has been deleted.
          </p>
          <Link href="/vault">
            <Button variant="primary">Return to Vault</Button>
          </Link>
        </div>
      </AppLayout>
    );
  }

  const handleToggleShow = async () => {
    if (!showPassword) {
      if (credential.password.startsWith("v1:")) {
        const decrypted = await decryptCredentialPassword(credential.id);
        setPlainPassword(decrypted);
      } else {
        setPlainPassword(credential.password);
      }
      setShowPassword(true);
    } else {
      setShowPassword(false);
    }
  };

  const handleCopyPassword = async () => {
    let textToCopy = credential.password;
    if (credential.password.startsWith("v1:")) {
      textToCopy = plainPassword || (await decryptCredentialPassword(credential.id));
    }
    const ok = await copyToClipboard(textToCopy);
    if (ok) {
      setCopiedPass(true);
      showToast("Password copied to clipboard", "success");
      setTimeout(() => setCopiedPass(false), 2000);
    }
  };

  const handleCopyUsername = async () => {
    const ok = await copyToClipboard(credential.username_email);
    if (ok) {
      setCopiedUser(true);
      showToast("Username copied to clipboard", "success");
      setTimeout(() => setCopiedUser(false), 2000);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    await deleteCredential(credential.id);
    setIsDeleting(false);
    setIsDeleteModalOpen(false);
    router.push("/vault");
  };

  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        {/* Top bar back link & actions */}
        <div className="flex items-center justify-between">
          <Link
            href="/vault"
            className="inline-flex items-center space-x-1.5 text-sm text-slate-400 hover:text-white transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Vault</span>
          </Link>

          <div className="flex items-center space-x-2">
            <Link href={`/vault/${credential.id}/edit`}>
              <Button variant="secondary" size="sm" leftIcon={<Edit2 className="w-3.5 h-3.5" />}>
                Edit
              </Button>
            </Link>
            <Button
              variant="danger"
              size="sm"
              leftIcon={<Trash2 className="w-3.5 h-3.5" />}
              onClick={() => setIsDeleteModalOpen(true)}
            >
              Delete
            </Button>
          </div>
        </div>

        {/* Main Details Card */}
        <Card className="space-y-6">
          {/* Header */}
          <div className="flex items-start justify-between pb-6 border-b border-charcoal-800">
            <div className="flex items-center space-x-4">
              <div className="w-14 h-14 rounded-2xl bg-charcoal-800 border border-charcoal-700 flex items-center justify-center text-electric-400 font-bold text-2xl">
                {credential.website_name.charAt(0).toUpperCase()}
              </div>
              <div>
                <h1 className="text-2xl font-bold text-white">{credential.website_name}</h1>
                {credential.website_url && (
                  <a
                    href={credential.website_url.startsWith("http") ? credential.website_url : `https://${credential.website_url}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-slate-400 hover:text-electric-400 flex items-center space-x-1 mt-1 transition-colors"
                  >
                    <span>{credential.website_url}</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
              </div>
            </div>
            <Badge category={credential.category} className="px-3 py-1 text-sm" />
          </div>

          {/* Fields */}
          <div className="space-y-4">
            {/* Username / Email */}
            <div className="p-4 rounded-xl bg-midnight-950 border border-charcoal-800 flex items-center justify-between">
              <div className="space-y-0.5">
                <span className="text-xs uppercase font-semibold text-slate-400 tracking-wider">
                  Username / Email
                </span>
                <p className="text-base font-medium text-white select-all">{credential.username_email}</p>
              </div>
              <button
                type="button"
                onClick={handleCopyUsername}
                className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-charcoal-800 transition-colors"
                title="Copy username"
              >
                {copiedUser ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>

            {/* Password */}
            <div className="p-4 rounded-xl bg-midnight-950 border border-charcoal-800 flex items-center justify-between">
              <div className="space-y-0.5 min-w-0 pr-4">
                <span className="text-xs uppercase font-semibold text-slate-400 tracking-wider">
                  Password
                </span>
                <p className="font-mono text-base text-white tracking-widest truncate select-all">
                  {showPassword ? (plainPassword || credential.password) : "••••••••••••••••••••"}
                </p>
              </div>
              <div className="flex items-center space-x-1.5 flex-shrink-0">
                <button
                  type="button"
                  onClick={handleToggleShow}
                  className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-charcoal-800 transition-colors"
                  title={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
                <button
                  type="button"
                  onClick={handleCopyPassword}
                  className="flex items-center space-x-1 px-3 py-1.5 rounded-lg bg-electric-600/20 text-electric-400 hover:bg-electric-600 hover:text-white border border-electric-500/30 font-medium text-xs transition-all"
                >
                  {copiedPass ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400">Copied</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5" />
                      <span>Copy</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Notes */}
            {credential.notes && (
              <div className="p-4 rounded-xl bg-midnight-950 border border-charcoal-800 space-y-1">
                <span className="text-xs uppercase font-semibold text-slate-400 tracking-wider">
                  Notes
                </span>
                <p className="text-sm text-slate-300 whitespace-pre-wrap leading-relaxed">
                  {credential.notes}
                </p>
              </div>
            )}
          </div>

          {/* Timestamps footer */}
          <div className="pt-4 border-t border-charcoal-800 flex flex-wrap items-center justify-between text-xs text-slate-400 gap-2">
            <span>Created: {formatDate(credential.created_at)}</span>
            <span>Last Updated: {formatDate(credential.updated_at)}</span>
          </div>
        </Card>
      </div>

      {/* Delete Confirmation Modal */}
      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Delete this saved credential?"
        description={`Are you sure you want to delete ${credential.website_name}? This action cannot be undone.`}
        confirmLabel="Confirm Delete"
        confirmVariant="danger"
        onConfirm={handleDelete}
        isLoading={isDeleting}
      />
    </AppLayout>
  );
}
