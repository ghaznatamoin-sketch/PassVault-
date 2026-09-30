import Link from "next/link";
import {
  Shield,
  KeyRound,
  Search,
  Wand2,
  FolderLock,
  ArrowRight,
  GraduationCap,
  Briefcase,
  Laptop,
  ShoppingBag,
  Building2,
  Globe,
  Lock,
} from "lucide-react";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";

export default function LandingPage() {
  const targetUsers = [
    {
      title: "Students",
      description: "Keep university portals, LMS logins, research tools, and student emails organized in one central vault.",
      icon: GraduationCap,
    },
    {
      title: "Employees & Professionals",
      description: "Separate work credentials, corporate tools, and internal accounts from personal logins.",
      icon: Briefcase,
    },
    {
      title: "Freelancers",
      description: "Manage client dashboards, SaaS subscriptions, invoicing platforms, and freelance tools safely.",
      icon: Laptop,
    },
    {
      title: "Online Shoppers",
      description: "Stop resetting retail passwords. Safely store ecommerce and shipping account logins.",
      icon: ShoppingBag,
    },
    {
      title: "Small Business Owners",
      description: "Maintain control over business services, merchant portals, and vendor login credentials.",
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
      title: "Password Vault (CRUD)",
      description: "Store website credentials with Website Name, URL, Category, Username/Email, Password, and Optional Notes.",
      icon: FolderLock,
    },
    {
      title: "Fast Real-Time Search",
      description: "Search saved credentials by Website/App Name and Username/Email with instant query matching.",
      icon: Search,
    },
    {
      title: "Cryptographic Password Generator",
      description: "Generate high-entropy passwords with custom length and character set options using CSPRNG.",
      icon: Wand2,
    },
    {
      title: "Masked Passwords & One-Click Copy",
      description: "Passwords are hidden by default everywhere. Use Show/Hide toggles and instant one-click copy.",
      icon: KeyRound,
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
            <a href="#problem" className="hover:text-electric-400 transition-colors">The Problem</a>
            <a href="#target-users" className="hover:text-electric-400 transition-colors">Target Users</a>
            <a href="#how-it-works" className="hover:text-electric-400 transition-colors">How It Works</a>
          </nav>

          <div className="flex items-center space-x-3">
            <Link href="/login">
              <Button variant="ghost" size="sm">
                Sign In
              </Button>
            </Link>
            <Link href="/signup">
              <Button variant="primary" size="sm" rightIcon={<ArrowRight className="w-4 h-4" />}>
                Create Account
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
            <Shield className="w-3.5 h-3.5 text-electric-400" />
            <span>PassVault MVP — Core Password Management Solution</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-tight">
            Stop Remembering Passwords. <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-electric-400 via-blue-400 to-indigo-400">
              Manage Credentials Securely.
            </span>
          </h1>

          <p className="text-lg sm:text-xl text-slate-300 max-w-3xl mx-auto leading-relaxed">
            The average user manages over 100 online accounts. PassVault provides one secure, user-friendly place to safely store, find, copy, and generate strong passwords.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link href="/signup" className="w-full sm:w-auto">
              <Button size="lg" className="w-full sm:w-auto px-8" rightIcon={<ArrowRight className="w-5 h-5" />}>
                Get Started
              </Button>
            </Link>
            <Link href="/dashboard" className="w-full sm:w-auto">
              <Button variant="secondary" size="lg" className="w-full sm:w-auto px-8">
                Open Password Vault
              </Button>
            </Link>
          </div>

          {/* Core MVP Metrics */}
          <div className="pt-12 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto border-t border-charcoal-800/80">
            <div>
              <p className="text-2xl font-bold text-white">100%</p>
              <p className="text-xs text-slate-400 mt-0.5">Masked by Default</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-electric-400">Zero</p>
              <p className="text-xs text-slate-400 mt-0.5">Plaintext Display</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-white">6 Types</p>
              <p className="text-xs text-slate-400 mt-0.5">Category Filters</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-emerald-400">CSPRNG</p>
              <p className="text-xs text-slate-400 mt-0.5">Web Crypto Engine</p>
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
              Why Password Management Needs a Dedicated Solution
            </p>
            <p className="text-sm text-slate-400">
              Memorizing dozens of complex passwords is impossible. Insecure notes and repeated passwords expose users to credential stuffing and data theft.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="space-y-3 border-red-500/20 bg-midnight-950/60">
              <div className="text-red-400 font-bold text-lg">Password Reuse</div>
              <p className="text-sm text-slate-300">
                Reusing the same password across social media, shopping, and work means a single compromised website exposes all other accounts.
              </p>
            </Card>

            <Card className="space-y-3 border-amber-500/20 bg-midnight-950/60">
              <div className="text-amber-400 font-bold text-lg">Scattered Notes & Sheets</div>
              <p className="text-sm text-slate-300">
                Writing credentials in unencrypted text files, spreadsheets, or notebooks leaves sensitive passwords unprotected.
              </p>
            </Card>

            <Card className="space-y-3 border-blue-500/20 bg-midnight-950/60">
              <div className="text-electric-400 font-bold text-lg">Memory Burden & Resets</div>
              <p className="text-sm text-slate-300">
                Constant password-reset cycles waste valuable time and interrupt your daily productivity.
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
              Built for Everyday Internet Users
            </p>
            <p className="text-sm text-slate-400">
              PassVault is designed to be accessible, intuitive, and secure for non-technical users and professionals alike.
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

      {/* Core Features Section */}
      <section id="features" className="py-20 bg-charcoal-900/40 border-y border-charcoal-800/80">
        <div className="max-w-6xl mx-auto px-4 sm:px-6">
          <div className="text-center max-w-3xl mx-auto mb-16 space-y-3">
            <h2 className="text-xs font-bold tracking-widest text-electric-400 uppercase">
              MVP Capabilities
            </h2>
            <p className="text-3xl font-bold text-white">
              Core Password Management Workflow
            </p>
            <p className="text-sm text-slate-400">
              Essential, high-reliability features designed to solve the password problem completely.
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
              Core Journey
            </h2>
            <p className="text-3xl font-bold text-white">
              Save → Search → View/Copy → Generate → Manage
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="space-y-3 text-center">
              <div className="w-12 h-12 mx-auto rounded-2xl bg-charcoal-800 border border-charcoal-700 flex items-center justify-center font-bold text-electric-400 text-lg">
                1
              </div>
              <h4 className="font-semibold text-white">Add Your Account</h4>
              <p className="text-xs text-slate-400">
                Input your website details or let PassVault generate a strong random password.
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
              <h4 className="font-semibold text-white">View & Copy</h4>
              <p className="text-xs text-slate-400">
                One-click copy sends credentials to your clipboard with immediate confirmation.
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
            PassVault — Secure Password Manager MVP. Built for high reliability and privacy.
          </p>

          <div className="flex items-center space-x-4">
            <Link href="/login" className="text-xs text-slate-400 hover:text-white transition-colors">
              Sign In
            </Link>
            <Link href="/signup" className="text-xs text-electric-400 hover:text-electric-300 font-semibold transition-colors">
              Create Account
            </Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
