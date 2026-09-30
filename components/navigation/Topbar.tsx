"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Search, Plus, Wand2, ShieldCheck } from "lucide-react";
import { useVault } from "@/lib/vault-context";
import { Button } from "@/components/ui/Button";

export function Topbar() {
  const router = useRouter();
  const { searchQuery, setSearchQuery } = useVault();
  const [localSearch, setLocalSearch] = useState(searchQuery);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSearchQuery(localSearch);
    router.push(`/search?q=${encodeURIComponent(localSearch)}`);
  };

  return (
    <header className="hidden md:flex items-center justify-between px-8 py-4 bg-midnight-900/50 backdrop-blur-md border-b border-charcoal-800/80 sticky top-0 z-10">
      {/* Search form */}
      <form onSubmit={handleSearchSubmit} className="relative w-96">
        <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          type="text"
          placeholder="Search by website, app, or email..."
          value={localSearch}
          onChange={(e) => {
            setLocalSearch(e.target.value);
            setSearchQuery(e.target.value);
          }}
          className="w-full rounded-xl bg-charcoal-900 border border-charcoal-700/70 pl-10 pr-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-electric-500 focus:ring-1 focus:ring-electric-500 transition-colors"
        />
      </form>

      {/* Quick Actions */}
      <div className="flex items-center space-x-3">
        <Link href="/generator">
          <Button variant="secondary" size="sm" leftIcon={<Wand2 className="w-4 h-4 text-electric-400" />}>
            Generator
          </Button>
        </Link>
        <Link href="/vault/new">
          <Button variant="primary" size="sm" leftIcon={<Plus className="w-4 h-4" />}>
            Add Credential
          </Button>
        </Link>
      </div>
    </header>
  );
}
