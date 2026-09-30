"use client";

import React, { Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Search, FolderLock } from "lucide-react";
import { useVault } from "@/lib/vault-context";
import { AppLayout } from "@/components/navigation/AppLayout";
import { CredentialList } from "@/components/vault/CredentialList";
import { SearchBar } from "@/components/vault/SearchBar";
import { CategoryFilter } from "@/components/vault/CategoryFilter";

function SearchContent() {
  const searchParams = useSearchParams();
  const queryParam = searchParams.get("q") || "";
  const {
    filteredCredentials,
    searchQuery,
    setSearchQuery,
    selectedCategory,
    setSelectedCategory,
    credentials,
  } = useVault();

  useEffect(() => {
    if (queryParam && queryParam !== searchQuery) {
      setSearchQuery(queryParam);
    }
  }, [queryParam, searchQuery, setSearchQuery]);

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
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <Search className="w-6 h-6 text-electric-400" />
            <span>Search Results</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            {searchQuery
              ? `Showing matching credentials for "${searchQuery}"`
              : "Search your vault by website name, URL, or username/email."}
          </p>
        </div>

        <div className="space-y-4 bg-charcoal-900/60 p-4 rounded-2xl border border-charcoal-800">
          <SearchBar value={searchQuery} onChange={setSearchQuery} />
          <CategoryFilter
            selected={selectedCategory}
            onSelect={setSelectedCategory}
            counts={counts}
          />
        </div>

        <CredentialList
          credentials={filteredCredentials}
          totalVaultCount={credentials.length}
          searchQuery={searchQuery || " "}
          selectedCategory={selectedCategory}
        />
      </div>
    </AppLayout>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-midnight-950 flex items-center justify-center text-white">Loading...</div>}>
      <SearchContent />
    </Suspense>
  );
}
