import Link from "next/link";
import {
  Shield,
  KeyRound,
  Search,
  Wand2,
  Lock,
  FolderLock,
  ArrowRight,
  CheckCircle2,
  Users,
  GraduationCap,
  Briefcase,
  Laptop,
  ShoppingBag,
  Building2,
  Globe,
  Puzzle,
  Sparkles,
  CreditCard,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export default function LandingPage() {
  const targetUsers = [
    {
      title: "Students",
      description: "Keep academic portals, LMS logins, research tools, and student email accounts organized in one place.",
      icon: GraduationCap,
    },
    {
      title: "Employees & Professionals",
      description: "Separate work credentials, enterprise platforms, and internal tools from your personal accounts.",
      icon: Briefcase,
    },
    {
      title: "Freelancers",
      description: "Manage client logins, SaaS dashboards, invoicing platforms, and freelance job accounts securely.",
      icon: Laptop,
    },
    {
      title: "Online Shoppers",
      description: "Stop resetting retail passwords. Safely store ecommerce and shipping account logins.",
      icon: ShoppingBag,
    },
    {
      title: "Small Business Owners",
      description: "Maintain control over business services, banking portals, and vendor login credentials.",
      icon: Building2,
    },
    {
      title: "General Internet Users",
      description: "Replace insecure sticky notes and repeated passwords with a modern, simple vault.",
      icon: Globe,
    },
  ];

  const features = [
    {
      title: "Organized Password Vault",
      description: "Store your website credentials, categorize them into Work, Social, Shopping, Finance, or Education, and add private notes.",
      icon: FolderLock,
    },
    {
      title: "PassVault Browser Extension",
      description: "Automatically detect login forms on visited sites, prompt to save on submit, and autofill credentials in Chrome, Edge & Firefox.",
      icon: Puzzle,
    },
    {
      title: "Cryptographic Generator",
      description: "Generate high-entropy, cryptographically strong passwords tailored with custom lengths and character sets.",
      icon: Wand2,
    },
    {
      title: "Vault Auto-Lock & Session Security",
      description: "Configurable inactivity auto-lock and manual instant lock to protect your credentials from unauthorized physical access.",
      icon: Lock,
    },
  ];

  return (
    <div className="min-h-screen bg-midnight-950 text-slate-100 flex flex-col">
      {/* Navigation Bar */}
      <header className="border-b border-charcoal-800/80 bg-midnight-900/60 backdrop-blur-md sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center space-x-3 group">
            <div className="p-2.5 rounded-xl bg-electric-600 text-white shadow-glow-sm group-hover:scale-105 transition-transform duration-200">
              <Shield className="w-6 h-6" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold tracking-tight text-white">
                Pass<span className="text-electric-400">Vault</span>
              </span>
              <span className="text-[10px] uppercase tracking-widest text-slate-400 font-semibold -mt-1">
                Secure Password Manager
              </span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center space-x-8 text-sm font-medium text-slate-300">
            <a href="#features" className="hover:text-electric-400 transition-colors">Features</a>
            <Link href="/extension" className="hover:text-electric-400 transition-colors flex items-center gap-1">
              <span>Extension</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-electric-600/30 text-electric-300 font-bold">New</span>
            </Link>
            <Link href="/subscription" className="hover:text-electric-400 transition-colors">Pricing</Link>
            <a href="#problem" className="hover:text-electric-400 transition-colors">The Problem</a>
            <a href="#target-users" className="hover:text-electric-400 transition-colors">For Who</a>
          </nav>

          <div className="flex items-center space-x-3">
            <Link href="/login">
              <Button variant="ghost" size="sm">
                Sign In
              </Button>
            </Link>
            <Link href="/signup">
              <Button variant="primary" size="sm" rightIcon={<ArrowRight className="w-4 h-4" />}>
                Start Free Trial
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative overflow-hidden pt-20 pb-24 md:pt-28 md:pb-32">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-electric-600/15 blur-[120px] rounded-full pointer-events-none" />

        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center relative z-10 space-y-8">
          <div className="inline-flex items-center space-x-2 px-4 py-1.5 rounded-full bg-charcoal-900/90 border border-electric-500/30 text-xs font-semibold text-electric-400 shadow-glow-sm">
            <Sparkles className="w-3.5 h-3.5 text-amber-400" />
            <span>PassVault Phase 2 — 30-Day Free Trial & Browser Extension</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight">
            Stop Remembering Passwords. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-electric-400 via-blue-400 to-indigo-400">
              Manage Credentials Securely.
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
            The average user manages over 100 online accounts. PassVault provides a clean, user-friendly digital solution to store, find, and generate strong passwords in one protected place — with full browser extension autofill.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link href="/signup" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto px-8" rightIcon={<ArrowRight className="w-5 h-5" />}>
                Start 30-Day Free Trial
              </Button>
            </Link>
            <Link href="/dashboard" className="w-full sm:w-auto">
              <Button variant="secondary" size="lg" className="w-full sm:w-auto px-8">
                Open Password Vault
              </Button>
            </Link>
          </div>

          {/* Quick Metrics */}
          <div className="pt-12 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto border-t border-charcoal-800/80">
            <div>
              <p className="text-2xl font-bold text-white">30 Days</p>
              <p className="text-xs text-slate-400 mt-0.5">Free Full Trial</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-electric-400">Autofill</p>
              <p className="text-xs text-slate-400 mt-0.5">Browser Extension</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-amber-400">Auto-Lock</p>
              <p className="text-xs text-slate-400 mt-0.5">Session Security</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-emerald-400">CSPRNG</p>
              <p className="text-xs text-slate-400 mt-0.5">Cryptographic RNG</p>
            </div>
          </div>
        </div>
      </section>

      {/* The Problem Section */}
      <section id="problem" className="py-20 bg-charcoal-900/40 border-y border-charcoal-800/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <h2 className="text-xs font-bold tracking-widest text-electric-400 uppercase">
              The Reality
            </h2>
            <p className="text-3xl font-bold text-white">
              Why Password Security is Broken For Everyday Users
            </p>
            <p className="text-sm text-slate-400">
              Memorizing dozens of complex passwords is humanly impossible. Traditional workarounds expose users to severe risk.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="space-y-3 border-red-500/20 bg-midnight-950/60">
              <div className="text-red-400 font-bold text-lg">Password Reuse</div>
              <p className="text-sm text-slate-300">
                Using the same password across social media, shopping, and work means one compromised site compromises all accounts.
              </p>
            </Card>

            <Card className="space-y-3 border-amber-500/20 bg-midnight-950/60">
              <div className="text-amber-400 font-bold text-lg">Unsecured Notes & Sheets</div>
              <p className="text-sm text-slate-300">
                Writing credentials in notebooks, unencrypted documents, or mobile notes leaves them vulnerable to theft and snooping.
              </p>
            </Card>

            <Card className="space-y-3 border-blue-500/20 bg-midnight-950/60">
              <div className="text-electric-400 font-bold text-lg">Complex, Overloaded Tools</div>
              <p className="text-sm text-slate-300">
                Traditional password software is often cluttered and confusing for non-technical users. PassVault keeps it simple and direct.
              </p>
            </Card>
          </div>
        </div>
      </section>

      {/* Target Users Section */}
      <section id="target-users" className="py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <h2 className="text-xs font-bold tracking-widest text-electric-400 uppercase">
              Target Audience
            </h2>
            <p className="text-3xl font-bold text-white">
              Designed For Real-World Internet Users
            </p>
            <p className="text-sm text-slate-400">
              Whether studying, freelancing, or managing a household, PassVault fits your daily digital workflow.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {targetUsers.map((user) => {
              const Icon = user.icon;
              return (
                <Card key={user.title} hoverEffect className="space-y-3">
                  <div className="w-10 h-10 rounded-xl bg-electric-600/15 border border-electric-500/30 text-electric-400 flex items-center justify-center">
                    <Icon className="w-5 h-5" />
                  </div>
                  <h3 className="text-base font-semibold text-white">{user.title}</h3>
                  <p className="text-xs text-slate-400 leading-relaxed">{user.description}</p>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-20 bg-charcoal-900/40 border-y border-charcoal-800/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <h2 className="text-xs font-bold tracking-widest text-electric-400 uppercase">
              Core Capabilities
            </h2>
            <p className="text-3xl font-bold text-white">
              Everything You Need in a Password Manager
            </p>
            <p className="text-sm text-slate-400">
              Streamlined features that empower you to take complete control of your digital credentials.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {features.map((feat) => {
              const Icon = feat.icon;
              return (
                <Card key={feat.title} hoverEffect className="p-6 flex space-x-4 items-start">
                  <div className="p-3 rounded-xl bg-electric-600 text-white shadow-glow-sm flex-shrink-0">
                    <Icon className="w-6 h-6" />
                  </div>
                  <div className="space-y-1.5">
                    <h3 className="text-base font-semibold text-white">{feat.title}</h3>
                    <p className="text-sm text-slate-400 leading-relaxed">{feat.description}</p>
                  </div>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-20">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 text-center space-y-12">
          <div className="space-y-3">
            <h2 className="text-xs font-bold tracking-widest text-electric-400 uppercase">
              Simple Workflow
            </h2>
            <p className="text-3xl font-bold text-white">
              Detect → Review → Save → Search → Autofill → Manage
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-3 text-center">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-charcoal-800 border border-charcoal-700 flex items-center justify-center font-bold text-electric-400 text-lg">
                1
              </div>
              <h4 className="font-semibold text-white">Detect & Save</h4>
              <p className="text-xs text-slate-400">
                Input credentials or let the extension detect login forms automatically on submission.
              </p>
            </div>

            <div className="space-y-3 text-center">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-charcoal-800 border border-charcoal-700 flex items-center justify-center font-bold text-electric-400 text-lg">
                2
              </div>
              <h4 className="font-semibold text-white">Organize & Search</h4>
              <p className="text-xs text-slate-400">
                Categorize your credentials and use real-time search to find any login instantly.
              </p>
            </div>

            <div className="space-y-3 text-center">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-charcoal-800 border border-charcoal-700 flex items-center justify-center font-bold text-electric-400 text-lg">
                3
              </div>
              <h4 className="font-semibold text-white">Autofill & Lock</h4>
              <p className="text-xs text-slate-400">
                One-click autofill enters logins instantly, while auto-lock protects your vault.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Footer */}
      <footer className="mt-auto border-t border-charcoal-800/80 bg-midnight-900 py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center space-x-3">
            <div className="p-2 rounded-lg bg-electric-600 text-white">
              <Shield className="w-5 h-5" />
            </div>
            <span className="font-bold text-white tracking-tight">
              Pass<span className="text-electric-400">Vault</span>
            </span>
          </div>

          <p className="text-xs text-slate-400 text-center md:text-left">
            PassVault — Secure Password Manager. Built for high reliability and privacy.
          </p>

          <div className="flex items-center space-x-4">
            <Link href="/login" className="text-xs text-slate-400 hover:text-white transition-colors">
              Sign In
            </Link>
            <Link href="/subscription" className="text-xs text-slate-400 hover:text-white transition-colors">
              Pricing & Plans
            </Link>
            <Link href="/signup" className="text-xs text-electric-400 hover:text-electric-300 font-semibold transition-colors">
              Start Free Trial
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
