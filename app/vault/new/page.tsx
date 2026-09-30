"use client";

import React, { Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { AppLayout } from "@/components/navigation/AppLayout";
import { CredentialForm } from "@/components/forms/CredentialForm";
import { Category } from "@/lib/types";

function NewCredentialContent() {
  const searchParams = useSearchParams();
  const catParam = (searchParams.get("category") as Category) || "Work";

  return (
    <AppLayout>
      <div className="py-4">
        <CredentialForm initialData={{ category: catParam }} />
      </div>
    </AppLayout>
  );
}

export default function NewCredentialPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-midnight-950 flex items-center justify-center text-white">Loading...</div>}>
      <NewCredentialContent />
    </Suspense>
  );
}
