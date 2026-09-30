"use client";

import React from "react";
import { Wand2 } from "lucide-react";
import { AppLayout } from "@/components/navigation/AppLayout";
import { GeneratorPanel } from "@/components/generator/GeneratorPanel";

export default function GeneratorPage() {
  return (
    <AppLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2">
            <Wand2 className="w-6 h-6 text-electric-400" />
            <span>Password Generator</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Generate cryptographically strong, random passwords to protect your accounts against brute-force and dictionary attacks.
          </p>
        </div>

        <div className="py-4">
          <GeneratorPanel />
        </div>
      </div>
    </AppLayout>
  );
}
