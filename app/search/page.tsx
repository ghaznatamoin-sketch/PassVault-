"use client";

import React, { Suspense, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { Search, FolderLock } from "lucide-react";
import { useVault } from "@/lib/vault-context";
import { AppLayout } from "@/components/navigation/AppLayout";
import { CredentialList } from "@/components/vault/CredentialList";
import { SearchBar } from "@/components/vault/SearchBar";

function SearchContent() {
  const searchParams = useSearchParams();
  const queryParam = searchParams.get("q") || "";
  const { filteredCredentials, searchQuery, setSearchQuery, credentials } = useVault();

  useEffect(() => {
    if (queryParam && queryParam !== searchQuery) {
      setSearchQuery(queryParam);
    }
  }, [queryParam, searchQuery, setSearchQuery]);

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

        <div className="bg-charcoal-900/60 p-4 rounded-2xl border border-charcoal-800">
          <SearchBar value={searchQuery} onChange={setSearchQuery} />
        </div>

        <CredentialList
          credentials={filteredCredentials}
          totalVaultCount={credentials.length}
          searchQuery={searchQuery || " "}
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
