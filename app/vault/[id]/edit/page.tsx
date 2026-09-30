"use client";

import React, { use } from "react";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useVault } from "@/lib/vault-context";
import { AppLayout } from "@/components/navigation/AppLayout";
import { CredentialForm } from "@/components/forms/CredentialForm";
import { Button } from "@/components/ui/Button";

export default function EditCredentialPage({ params }: { params: Promise<{ id: string }> }) {
  const unwrappedParams = use(params);
  const { getCredentialById } = useVault();
  const credential = getCredentialById(unwrappedParams.id);

  if (!credential) {
    return (
      <AppLayout>
        <div className="text-center py-20">
          <h2 className="text-xl font-bold text-white">Credential Not Found</h2>
          <p className="text-sm text-slate-400 mt-2 mb-6">
            The requested login account could not be found.
          </p>
          <Link href="/vault">
            <Button variant="primary">Return to Vault</Button>
          </Link>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      <div className="max-w-3xl mx-auto space-y-6">
        <Link
          href={`/vault/${credential.id}`}
          className="inline-flex items-center space-x-1.5 text-sm text-slate-400 hover:text-white transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Details</span>
        </Link>

        <CredentialForm initialData={credential} isEditing />
      </div>
    </AppLayout>
  );
}
