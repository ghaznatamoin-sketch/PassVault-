"use client";

import React from "react";
import Link from "next/link";
import { Plus, Search, FolderLock, Inbox } from "lucide-react";
import { Credential, Category } from "@/lib/types";
import { CredentialCard } from "./CredentialCard";
import { Button } from "@/components/ui/Button";

interface CredentialListProps {
  credentials: Credential[];
  totalVaultCount?: number;
  searchQuery?: string;
  selectedCategory?: Category | "All";
  isLoading?: boolean;
}

export function CredentialList({
  credentials,
  totalVaultCount = 0,
  searchQuery = "",
  selectedCategory = "All",
  isLoading = false,
}: CredentialListProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {[1, 2, 3, 4, 5, 6].map((n) => (
          <div
            key={n}
            className="rounded-2xl bg-charcoal-900/60 border border-charcoal-800 p-5 animate-pulse space-y-4"
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-charcoal-800" />
              <div className="space-y-2 flex-1">
                <div className="h-4 bg-charcoal-800 rounded w-3/4" />
                <div className="h-3 bg-charcoal-800 rounded w-1/2" />
              </div>
            </div>
            <div className="h-20 bg-charcoal-800/60 rounded-xl" />
            <div className="h-4 bg-charcoal-800 rounded w-1/3" />
          </div>
        ))}
      </div>
    );
  }

  // 1. Empty Vault State
  if (totalVaultCount === 0) {
    return (
      <div className="text-center py-16 px-4 rounded-2xl bg-charcoal-900/40 border border-charcoal-800/80 max-w-lg mx-auto">
        <div className="w-14 h-14 mx-auto rounded-2xl bg-electric-600/10 border border-electric-500/20 text-electric-400 flex items-center justify-center mb-4">
          <FolderLock className="w-7 h-7" />
        </div>
        <h3 className="text-lg font-semibold text-white">Your vault is empty</h3>
        <p className="text-sm text-slate-400 mt-1.5 mb-6">
          Your vault is empty. Add your first account to get started.
        </p>
        <Link href="/vault/new">
          <Button leftIcon={<Plus className="w-4 h-4" />}>
            Add First Credential
          </Button>
        </Link>
      </div>
    );
  }

  // 2. Empty Search State (File 5 §14: "No saved accounts found.")
  if (searchQuery && credentials.length === 0) {
    return (
      <div className="text-center py-14 px-4 rounded-2xl bg-charcoal-900/40 border border-charcoal-800/80 max-w-lg mx-auto">
        <div className="w-12 h-12 mx-auto rounded-2xl bg-charcoal-800 text-slate-400 flex items-center justify-center mb-3">
          <Search className="w-6 h-6" />
        </div>
        <h3 className="text-base font-semibold text-white">No saved accounts found.</h3>
        <p className="text-sm text-slate-400 mt-1 mb-4">
          No credentials found for your search.
        </p>
        <p className="text-xs text-slate-400">
          Try searching for a different website name, URL, or username.
        </p>
      </div>
    );
  }

  // 3. Empty Category State
  if (selectedCategory !== "All" && credentials.length === 0) {
    return (
      <div className="text-center py-14 px-4 rounded-2xl bg-charcoal-900/40 border border-charcoal-800/80 max-w-lg mx-auto">
        <div className="w-12 h-12 mx-auto rounded-2xl bg-charcoal-800 text-slate-400 flex items-center justify-center mb-3">
          <Inbox className="w-6 h-6" />
        </div>
        <h3 className="text-base font-semibold text-white">No accounts in {selectedCategory}</h3>
        <p className="text-sm text-slate-400 mt-1 mb-5">
          No credentials found in this category.
        </p>
        <Link href={`/vault/new?category=${selectedCategory}`}>
          <Button variant="secondary" size="sm" leftIcon={<Plus className="w-4 h-4" />}>
            Add {selectedCategory} Credential
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
      {credentials.map((cred) => (
        <CredentialCard key={cred.id} credential={cred} />
      ))}
    </div>
  );
}
