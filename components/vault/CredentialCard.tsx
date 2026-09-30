"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ExternalLink, MoreVertical, Edit2, Trash2, Eye, EyeOff, Copy, Check, Key } from "lucide-react";
import { Credential } from "@/lib/types";
import { Badge } from "@/components/ui/Badge";
import { Modal } from "@/components/ui/Modal";
import { copyToClipboard } from "@/lib/utils";
import { useVault } from "@/lib/vault-context";

interface CredentialCardProps {
  credential: Credential;
}

export function CredentialCard({ credential }: CredentialCardProps) {
  const { deleteCredential, decryptCredentialPassword, showToast } = useVault();
  const [showPassword, setShowPassword] = useState(false);
  const [plainPassword, setPlainPassword] = useState("");
  const [copied, setCopied] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

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
      setCopied(true);
      showToast("Password copied to clipboard", "success");
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    await deleteCredential(credential.id);
    setIsDeleting(false);
    setIsDeleteModalOpen(false);
  };

  return (
    <>
      <div className="group relative rounded-2xl bg-charcoal-900/90 border border-charcoal-700/60 p-5 hover:border-electric-500/40 hover:shadow-glow-sm transition-all duration-200 backdrop-blur-md flex flex-col justify-between">
        {/* Top bar */}
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="flex items-center space-x-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-charcoal-800 border border-charcoal-700 flex items-center justify-center text-electric-400 font-bold text-base flex-shrink-0 group-hover:border-electric-500/30 group-hover:scale-105 transition-all">
              {credential.website_name.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0">
              <Link
                href={`/vault/${credential.id}`}
                className="font-semibold text-white hover:text-electric-400 transition-colors text-base truncate block"
              >
                {credential.website_name}
              </Link>
              {credential.website_url && (
                <a
                  href={credential.website_url.startsWith("http") ? credential.website_url : `https://${credential.website_url}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs text-slate-400 hover:text-slate-200 flex items-center gap-1 truncate mt-0.5"
                >
                  <span className="truncate">{credential.website_url.replace(/^https?:\/\//, "")}</span>
                  <ExternalLink className="w-3 h-3 flex-shrink-0" />
                </a>
              )}
            </div>
          </div>
          <Badge category={credential.category} />
        </div>

        {/* Credentials Details */}
        <div className="space-y-2.5 my-3 bg-midnight-950/60 rounded-xl p-3.5 border border-charcoal-800">
          <div>
            <span className="text-[11px] uppercase font-semibold text-slate-400 block tracking-wider">
              Username / Email
            </span>
            <p className="text-sm font-medium text-slate-200 truncate mt-0.5 select-all">
              {credential.username_email}
            </p>
          </div>

          <div>
            <div className="flex items-center justify-between">
              <span className="text-[11px] uppercase font-semibold text-slate-400 block tracking-wider">
                Password
              </span>
              <span className="text-[10px] text-slate-400 font-mono">
                {showPassword ? "Visible" : "Hidden"}
              </span>
            </div>
            <div className="flex items-center justify-between mt-1">
              <span className="font-mono text-sm tracking-wider text-slate-100 select-all truncate max-w-[180px]">
                {showPassword ? (plainPassword || credential.password) : "••••••••••••••••"}
              </span>
              <div className="flex items-center space-x-1.5 ml-2">
                <button
                  type="button"
                  onClick={handleToggleShow}
                  title={showPassword ? "Hide password" : "Show password"}
                  className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-charcoal-700 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
                <button
                  type="button"
                  onClick={handleCopyPassword}
                  title="Copy password"
                  className="flex items-center space-x-1 px-2 py-1 text-xs font-medium rounded-lg bg-electric-600/20 text-electric-400 hover:bg-electric-600 hover:text-white border border-electric-500/30 transition-all"
                >
                  {copied ? (
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
          </div>
        </div>

        {/* Footer actions */}
        <div className="flex items-center justify-between pt-2 border-t border-charcoal-800/70 text-xs">
          <Link
            href={`/vault/${credential.id}`}
            className="text-slate-400 hover:text-electric-400 font-medium transition-colors"
          >
            View Details
          </Link>
          <div className="flex items-center space-x-2">
            <Link
              href={`/vault/${credential.id}/edit`}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-charcoal-800 transition-colors"
              title="Edit credential"
            >
              <Edit2 className="w-3.5 h-3.5" />
            </Link>
            <button
              onClick={() => setIsDeleteModalOpen(true)}
              className="p-1.5 text-slate-400 hover:text-red-400 rounded-lg hover:bg-red-500/10 transition-colors"
              title="Delete credential"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
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
    </>
  );
}
