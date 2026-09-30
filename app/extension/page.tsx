"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Laptop,
  Puzzle,
  Download,
  CheckCircle2,
  Zap,
  Shield,
  Eye,
  EyeOff,
  ArrowRight,
  ExternalLink,
  Sparkles,
  RefreshCw,
  FolderLock,
  Globe,
} from "lucide-react";
import { AppLayout } from "@/components/navigation/AppLayout";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { PasswordField } from "@/components/ui/PasswordField";
import { Alert } from "@/components/ui/Alert";
import { useVault } from "@/lib/vault-context";

interface DemoSite {
  name: string;
  url: string;
  category: "Social" | "Work" | "Shopping" | "Finance" | "Education" | "Other";
  defaultUser: string;
  defaultPass: string;
}

const DEMO_SITES: DemoSite[] = [
  {
    name: "Spotify Web Player",
    url: "https://spotify.com/login",
    category: "Social",
    defaultUser: "music_lover@example.com",
    defaultPass: "Sp0tify!Rock#99",
  },
  {
    name: "Slack Workspace",
    url: "https://slack.com/signin",
    category: "Work",
    defaultUser: "alex.mercer@company.org",
    defaultPass: "Sl@ckDev&2026",
  },
  {
    name: "Amazon Shopping",
    url: "https://amazon.com/ap/signin",
    category: "Shopping",
    defaultUser: "alex.mercer@example.com",
    defaultPass: "Amz*Prime#456",
  },
  {
    name: "Coursera Student Portal",
    url: "https://coursera.org/login",
    category: "Education",
    defaultUser: "alex.student@university.edu",
    defaultPass: "Cour$era!Learn78",
  },
];

export default function ExtensionPage() {
  const { addCredential, showToast, credentials } = useVault();

  // Interactive Simulator State
  const [selectedSite, setSelectedSite] = useState<DemoSite>(DEMO_SITES[0]);
  const [usernameInput, setUsernameInput] = useState(DEMO_SITES[0].defaultUser);
  const [passwordInput, setPasswordInput] = useState(DEMO_SITES[0].defaultPass);
  const [isPromptVisible, setIsPromptVisible] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isAutofilled, setIsAutofilled] = useState(false);
  const [isReviewOpen, setIsReviewOpen] = useState(false);

  const handleSiteSelect = (site: DemoSite) => {
    setSelectedSite(site);
    setUsernameInput(site.defaultUser);
    setPasswordInput(site.defaultPass);
    setIsPromptVisible(false);
    setIsSaved(false);
    setIsAutofilled(false);
  };

  const handleSimulateSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!usernameInput || !passwordInput) {
      showToast("Please enter username and password to simulate.", "warning");
      return;
    }
    // Trigger Extension "Save Password?" Prompt
    setIsPromptVisible(true);
    showToast("PassVault Extension detected login form submission.", "info");
  };

  const handleConfirmSave = async () => {
    const res = await addCredential({
      website_name: selectedSite.name,
      website_url: selectedSite.url,
      category: selectedSite.category,
      username_email: usernameInput,
      password: passwordInput,
      notes: "Saved automatically via PassVault Browser Extension",
    });

    if (res.success) {
      setIsPromptVisible(false);
      setIsReviewOpen(false);
      setIsSaved(true);
    }
  };

  const handleSimulateAutofill = () => {
    // Check if site credentials exist in vault
    const existing = credentials.find(
      (c) => c.website_name.toLowerCase().includes(selectedSite.name.toLowerCase().split(" ")[0])
    );

    if (existing) {
      setUsernameInput(existing.username_email);
      setPasswordInput(existing.password);
      setIsAutofilled(true);
      showToast(`⚡ Autofilled credentials for ${selectedSite.name}`, "success");
    } else {
      setUsernameInput(selectedSite.defaultUser);
      setPasswordInput(selectedSite.defaultPass);
      setIsAutofilled(true);
      showToast(`⚡ Autofilled credentials for ${selectedSite.name}`, "success");
    }
    setTimeout(() => setIsAutofilled(false), 3000);
  };

  return (
    <AppLayout>
      <div className="space-y-8 max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-electric-600/15 border border-electric-500/30 text-xs font-semibold text-electric-400 mb-2">
              <Puzzle className="w-3.5 h-3.5" />
              <span>PassVault Browser Extension — Manifest V3</span>
            </div>
            <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
              PassVault for Chrome, Edge & Firefox
            </h1>
            <p className="text-sm text-slate-400 mt-1">
              Seamlessly detect login fields, save new credentials on submission, and autofill accounts with one click.
            </p>
          </div>

          <div className="flex items-center space-x-3">
            <a
              href="#install-guide"
              className="inline-flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-electric-600 hover:bg-electric-500 text-white font-semibold text-sm shadow-glow-sm transition-all"
            >
              <Download className="w-4 h-4" />
              <span>Install Extension</span>
            </a>
          </div>
        </div>

        {/* Workflow Steps Overview */}
        <div className="grid grid-cols-1 md:grid-cols-6 gap-3 text-center">
          {[
            { step: "1. Detect", desc: "Discovers username & password fields on any page" },
            { step: "2. Review", desc: "Verify detected site name, URL & email" },
            { step: "3. Save", desc: "Encrypts & stores directly in PassVault" },
            { step: "4. Search", desc: "Instant query inside browser toolbar" },
            { step: "5. Autofill", desc: "Populates credentials on return visits" },
            { step: "6. Manage", desc: "Syncs with PassVault web application" },
          ].map((item, index) => (
            <Card key={index} className="p-3.5 bg-charcoal-900/60 border-charcoal-800 space-y-1">
              <span className="text-xs font-bold text-electric-400">{item.step}</span>
              <p className="text-[11px] text-slate-400 leading-snug">{item.desc}</p>
            </Card>
          ))}
        </div>

        {/* Interactive Simulator Section */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-0.5">
              <h2 className="text-lg font-bold text-white flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-electric-400" />
                <span>Interactive Extension Workflow Simulator</span>
              </h2>
              <p className="text-xs text-slate-400">
                Experience the approved extension workflow (Detect → Review → Save → Autofill) right here.
              </p>
            </div>

            {/* Select Target Site */}
            <div className="flex items-center space-x-2">
              <span className="text-xs text-slate-400 hidden sm:inline">Simulate Site:</span>
              <div className="flex space-x-1.5 overflow-x-auto">
                {DEMO_SITES.map((site) => (
                  <button
                    key={site.name}
                    onClick={() => handleSiteSelect(site)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                      selectedSite.name === site.name
                        ? "bg-electric-600 text-white shadow-glow-sm"
                        : "bg-charcoal-800 text-slate-300 hover:bg-charcoal-700"
                    }`}
                  >
                    {site.name.split(" ")[0]}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Browser Window Mockup */}
          <div className="rounded-2xl bg-midnight-900 border border-charcoal-700/80 shadow-2xl overflow-hidden relative">
            {/* Browser Top Navigation Bar */}
            <div className="bg-charcoal-950 px-4 py-3 border-b border-charcoal-800 flex items-center justify-between gap-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-amber-500/80" />
                <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
              </div>

              {/* Address bar */}
              <div className="flex-1 max-w-xl mx-auto flex items-center space-x-2 bg-charcoal-900 px-3.5 py-1.5 rounded-lg border border-charcoal-800 text-xs text-slate-300">
                <Globe className="w-3.5 h-3.5 text-slate-400" />
                <span className="text-slate-400">https://</span>
                <span className="font-semibold text-white truncate">{selectedSite.url.replace("https://", "")}</span>
              </div>

              {/* Extension Icon in Browser Bar */}
              <div className="flex items-center space-x-2">
                <div
                  title="PassVault Extension Active"
                  className="p-1.5 rounded-lg bg-electric-600/20 text-electric-400 border border-electric-500/30 flex items-center space-x-1 cursor-pointer"
                >
                  <Shield className="w-4 h-4" />
                  <span className="text-[10px] font-bold">PassVault</span>
                </div>
              </div>
            </div>

            {/* Simulated Web Page Content Area */}
            <div className="p-8 md:p-12 max-w-md mx-auto relative min-h-[380px] flex flex-col justify-center">
              {/* Simulated In-Page "Save Password to PassVault?" Notification Banner */}
              {isPromptVisible && (
                <div className="absolute top-4 right-4 z-20 w-80 rounded-xl bg-charcoal-900 border border-electric-500/60 shadow-glow-md p-4 animate-in slide-in-from-top duration-300 space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <div className="p-1 rounded-md bg-electric-600 text-white">
                        <Shield className="w-3.5 h-3.5" />
                      </div>
                      <span className="text-xs font-bold text-white">Save to PassVault?</span>
                    </div>
                    <button
                      onClick={() => setIsPromptVisible(false)}
                      className="text-slate-400 hover:text-white text-xs"
                    >
                      ✕
                    </button>
                  </div>

                  <p className="text-xs text-slate-300 leading-snug">
                    Save login credentials for <strong className="text-white">{selectedSite.name}</strong> to your vault?
                  </p>

                  <div className="bg-midnight-950 p-2.5 rounded-lg border border-charcoal-800 text-[11px] space-y-1 font-mono">
                    <div className="text-slate-300 truncate">
                      <span className="text-slate-500">User:</span> {usernameInput}
                    </div>
                    <div className="text-slate-300">
                      <span className="text-slate-500">Pass:</span> ••••••••••••••••
                    </div>
                  </div>

                  <div className="flex items-center space-x-2 pt-1">
                    <Button
                      size="sm"
                      variant="primary"
                      className="flex-1 text-xs"
                      onClick={handleConfirmSave}
                    >
                      Save Credential
                    </Button>
                    <Button
                      size="sm"
                      variant="secondary"
                      className="text-xs"
                      onClick={() => setIsPromptVisible(false)}
                    >
                      Dismiss
                    </Button>
                  </div>
                </div>
              )}

              {/* In-Page Login Form */}
              <div className="bg-charcoal-900/90 border border-charcoal-700/80 rounded-2xl p-6 shadow-xl space-y-5">
                <div className="text-center space-y-1">
                  <div className="w-10 h-10 mx-auto rounded-xl bg-charcoal-800 border border-charcoal-700 flex items-center justify-center font-bold text-electric-400">
                    {selectedSite.name.charAt(0)}
                  </div>
                  <h3 className="text-base font-bold text-white">{selectedSite.name} Sign In</h3>
                  <p className="text-xs text-slate-400">Simulated website login page</p>
                </div>

                {isSaved && (
                  <Alert
                    type="success"
                    title="Account Saved!"
                    message="Credentials have been securely saved into your PassVault."
                  />
                )}

                {isAutofilled && (
                  <Alert
                    type="info"
                    message="Credentials populated via PassVault Extension Autofill."
                  />
                )}

                <form onSubmit={handleSimulateSubmit} className="space-y-4">
                  <div className="space-y-1 relative">
                    <label className="text-xs font-medium text-slate-300">Username / Email</label>
                    <div className="relative">
                      <input
                        type="text"
                        value={usernameInput}
                        onChange={(e) => setUsernameInput(e.target.value)}
                        className="w-full rounded-xl bg-charcoal-950 border border-charcoal-700 px-3.5 py-2 text-sm text-white focus:outline-none focus:border-electric-500"
                        placeholder="Enter username"
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-1 relative">
                    <div className="flex items-center justify-between">
                      <label className="text-xs font-medium text-slate-300">Password</label>
                      {/* Autofill Trigger Button */}
                      <button
                        type="button"
                        onClick={handleSimulateAutofill}
                        className="text-[11px] text-electric-400 hover:text-electric-300 font-semibold flex items-center space-x-1"
                      >
                        <Zap className="w-3 h-3 text-electric-400" />
                        <span>Autofill with PassVault</span>
                      </button>
                    </div>
                    <div className="relative">
                      <input
                        type="password"
                        value={passwordInput}
                        onChange={(e) => setPasswordInput(e.target.value)}
                        className="w-full rounded-xl bg-charcoal-950 border border-charcoal-700 px-3.5 py-2 text-sm text-white font-mono focus:outline-none focus:border-electric-500"
                        placeholder="Enter password"
                        required
                      />
                    </div>
                  </div>

                  <Button type="submit" variant="primary" className="w-full">
                    Log In to {selectedSite.name.split(" ")[0]}
                  </Button>
                </form>
              </div>
            </div>
          </div>
        </div>

        {/* Installation Instructions */}
        <section id="install-guide" className="space-y-4 pt-6 border-t border-charcoal-800">
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Download className="w-5 h-5 text-electric-400" />
            <span>How to Load the Extension in Your Browser</span>
          </h2>
          <p className="text-xs text-slate-400">
            The Manifest V3 extension package is located in the <code>/extension</code> folder in this project repository.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="space-y-3">
              <div className="text-sm font-bold text-white flex items-center space-x-2">
                <span className="w-6 h-6 rounded-full bg-electric-600/20 text-electric-400 flex items-center justify-center text-xs">
                  1
                </span>
                <span>Open Extensions Page</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                In Google Chrome, Brave, or Microsoft Edge, navigate to <code>chrome://extensions</code> (or <code>edge://extensions</code>).
              </p>
            </Card>

            <Card className="space-y-3">
              <div className="text-sm font-bold text-white flex items-center space-x-2">
                <span className="w-6 h-6 rounded-full bg-electric-600/20 text-electric-400 flex items-center justify-center text-xs">
                  2
                </span>
                <span>Enable Developer Mode</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Toggle the <strong>Developer mode</strong> switch in the top-right corner of the extensions page.
              </p>
            </Card>

            <Card className="space-y-3">
              <div className="text-sm font-bold text-white flex items-center space-x-2">
                <span className="w-6 h-6 rounded-full bg-electric-600/20 text-electric-400 flex items-center justify-center text-xs">
                  3
                </span>
                <span>Load Unpacked</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed">
                Click <strong>Load unpacked</strong> and select the <code>extension</code> folder in the PassVault project directory.
              </p>
            </Card>
          </div>
        </section>
      </div>
    </AppLayout>
  );
}
