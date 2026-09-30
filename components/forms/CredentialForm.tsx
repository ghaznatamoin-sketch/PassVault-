"use client";

import React, { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Globe, User, Lock, FileText, Wand2 } from "lucide-react";
import { Category, Credential } from "@/lib/types";
import { useVault } from "@/lib/vault-context";
import { Input } from "@/components/ui/Input";
import { PasswordField } from "@/components/ui/PasswordField";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

interface CredentialFormProps {
  initialData?: Partial<Credential>;
  isEditing?: boolean;
}

const CATEGORIES: Category[] = [
  "Work",
  "Social",
  "Shopping",
  "Finance",
  "Education",
  "Other",
];

export function CredentialForm({ initialData, isEditing = false }: CredentialFormProps) {
  const router = useRouter();
  const { addCredential, updateCredential, activeGeneratedPassword, setActiveGeneratedPassword } = useVault();

  const [websiteName, setWebsiteName] = useState(initialData?.website_name || "");
  const [websiteUrl, setWebsiteUrl] = useState(initialData?.website_url || "");
  const [category, setCategory] = useState<Category>(initialData?.category || "Work");
  const [usernameEmail, setUsernameEmail] = useState(initialData?.username_email || "");
  const [password, setPassword] = useState(initialData?.password || "");
  const [notes, setNotes] = useState(initialData?.notes || "");

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  // If a generated password was set before entering this form, populate it
  useEffect(() => {
    if (activeGeneratedPassword && !initialData?.password) {
      setPassword(activeGeneratedPassword);
      setActiveGeneratedPassword(null);
    }
  }, [activeGeneratedPassword, initialData, setActiveGeneratedPassword]);

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!websiteName.trim()) {
      errs.websiteName = "Website or Application name is required.";
    }
    if (!usernameEmail.trim()) {
      errs.usernameEmail = "Username or Email is required.";
    }
    if (!password) {
      errs.password = "Password is required.";
    }
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsLoading(true);

    if (isEditing && initialData?.id) {
      const res = await updateCredential(initialData.id, {
        website_name: websiteName,
        website_url: websiteUrl,
        category,
        username_email: usernameEmail,
        password,
        notes,
      });
      setIsLoading(false);
      if (res.success) {
        router.push(`/vault/${initialData.id}`);
      }
    } else {
      const res = await addCredential({
        website_name: websiteName,
        website_url: websiteUrl,
        category,
        username_email: usernameEmail,
        password,
        notes,
      });
      setIsLoading(false);
      if (res.success && res.id) {
        router.push(`/vault/${res.id}`);
      }
    }
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="border-b border-charcoal-800 pb-4">
          <h2 className="text-xl font-bold text-white">
            {isEditing ? "Edit Credential" : "Add New Credential"}
          </h2>
          <p className="text-sm text-slate-400 mt-1">
            {isEditing
              ? "Update your login information for this account."
              : "Store your website or application login details safely in your vault."}
          </p>
        </div>

        {/* Website / App Name */}
        <Input
          label="Website or Application Name"
          placeholder="e.g. Google Workspace, Amazon, GitHub"
          value={websiteName}
          onChange={(e) => setWebsiteName(e.target.value)}
          error={errors.websiteName}
          required
          leftIcon={<Globe className="w-4 h-4" />}
        />

        {/* Website URL & Category */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Input
            label="Website URL (Optional)"
            placeholder="https://example.com"
            value={websiteUrl}
            onChange={(e) => setWebsiteUrl(e.target.value)}
            helperText="e.g. https://github.com/login"
          />

          <div className="w-full space-y-1.5">
            <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
              Category
            </label>
            <select
              value={category}
              onChange={(e) => setCategory(e.target.value as Category)}
              className="w-full rounded-xl bg-charcoal-900 border border-charcoal-700/80 px-4 py-2.5 text-sm text-white focus:outline-none focus:border-electric-500 focus:ring-1 focus:ring-electric-500 transition-colors"
            >
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat} className="bg-midnight-950 text-white">
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Username / Email */}
        <Input
          label="Username or Email"
          placeholder="user@example.com or @handle"
          value={usernameEmail}
          onChange={(e) => setUsernameEmail(e.target.value)}
          error={errors.usernameEmail}
          required
          leftIcon={<User className="w-4 h-4" />}
        />

        {/* Password */}
        <div className="space-y-2">
          <PasswordField
            label="Password"
            placeholder="Enter password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={errors.password}
            showStrength
            allowCopy
            required
          />
          <div className="flex justify-end">
            <button
              type="button"
              onClick={() => router.push("/generator")}
              className="text-xs text-electric-400 hover:text-electric-300 font-medium flex items-center space-x-1 transition-colors"
            >
              <Wand2 className="w-3.5 h-3.5" />
              <span>Generate strong password</span>
            </button>
          </div>
        </div>

        {/* Notes */}
        <div className="w-full space-y-1.5">
          <label className="block text-xs font-semibold uppercase tracking-wider text-slate-400">
            Notes (Optional)
          </label>
          <textarea
            rows={3}
            placeholder="Security answers, PIN notes, or login hints..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="w-full rounded-xl bg-charcoal-900 border border-charcoal-700/80 px-4 py-2.5 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-electric-500 focus:ring-1 focus:ring-electric-500 transition-colors"
          />
        </div>

        {/* Form Actions */}
        <div className="flex items-center justify-end space-x-3 pt-4 border-t border-charcoal-800">
          <Button
            type="button"
            variant="secondary"
            onClick={() => router.back()}
            disabled={isLoading}
          >
            Cancel
          </Button>
          <Button type="submit" variant="primary" isLoading={isLoading}>
            {isEditing ? "Save Changes" : "Save Credential"}
          </Button>
        </div>
      </form>
    </Card>
  );
}
