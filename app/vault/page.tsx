"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Plus, FolderLock } from "lucide-react";
import { useVault } from "@/lib/vault-context";
import { AppLayout } from "@/components/navigation/AppLayout";
import { CredentialList } from "@/components/vault/CredentialList";
import { CategoryFilter } from "@/components/vault/CategoryFilter";
import { SearchBar } from "@/components/vault/SearchBar";
import { Button } from "@/components/ui/Button";

export default function VaultPage() {
  const {
    credentials,
    filteredCredentials,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
  } = useVault();

  // Category counts
  const counts: Record<string, number> = {
    All: credentials.length,
    Social: credentials.filter((c) => c.category === "Social").length,
    Work: credentials.filter((c) => c.category === "Work").length,
    Shopping: credentials.filter((c) => c.category === "Shopping").length,
    Finance: credentials.filter((c) => c.category === "Finance").length,
    Education: credentials.filter((c) => c.category === "Education").length,
    Other: credentials.filter((c) => c.category === "Other").length,
  };

  return (
    <AppLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
              <FolderLock className="w-6 h-6 text-electric-400" />
              <span>Password Vault</span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Securely manage, search, and copy your login credentials.
            </p>
          </div>
          <Link href="/vault/new">
            <Button variant="primary" leftIcon={<Plus className="w-4 h-4" />}>
              Add Credential
            </Button>
          </Link>
        </div>

        {/* Filter & Search Bar */}
        <div className="space-y-4 bg-charcoal-900/60 p-4 rounded-2xl border border-charcoal-800">
          <SearchBar value={searchQuery} onChange={setSearchQuery} />
          <CategoryFilter
            selected={selectedCategory}
            onSelect={setSelectedCategory}
            counts={counts}
          />
        </div>

        {/* Credential Grid */}
        <CredentialList
          credentials={filteredCredentials}
          totalVaultCount={credentials.length}
          searchQuery={searchQuery}
          selectedCategory={selectedCategory}
        />
      </div>
    </AppLayout>
  );
}
