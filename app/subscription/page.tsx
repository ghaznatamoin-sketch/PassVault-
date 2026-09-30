"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  CreditCard,
  Check,
  Shield,
  Sparkles,
  Zap,
  Calendar,
  AlertCircle,
  Clock,
  ArrowRight,
} from "lucide-react";
import { AppLayout } from "@/components/navigation/AppLayout";
import { Card } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Modal } from "@/components/ui/Modal";
import { Alert } from "@/components/ui/Alert";
import { useVault } from "@/lib/vault-context";
import { SubscriptionPlan } from "@/lib/types";
import { formatDate } from "@/lib/utils";

export default function SubscriptionPage() {
  const { subscription, updateSubscriptionPlan, cancelSubscription, showToast } = useVault();
  const [selectedPlanModal, setSelectedPlanModal] = useState<SubscriptionPlan | null>(null);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  const planFeatures = [
    "Unlimited credential & password storage",
    "Real-time search & 6 category filters",
    "Cryptographic Password Generator",
    "PassVault Browser Extension integration",
    "Automatic login field detection & autofill",
    "Session lock & configurable auto-logout",
  ];

  const handleConfirmPlanChange = async () => {
    if (!selectedPlanModal) return;
    setIsUpdating(true);
    await updateSubscriptionPlan(selectedPlanModal);
    setIsUpdating(false);
    setSelectedPlanModal(null);
  };

  const handleConfirmCancel = async () => {
    setIsUpdating(true);
    await cancelSubscription();
    setIsUpdating(false);
    setIsCancelModalOpen(false);
  };

  const getPlanTitle = (plan: SubscriptionPlan) => {
    switch (plan) {
      case "monthly_pro":
        return "Monthly Pro";
      case "annual_pro":
        return "Annual Pro";
      case "free_trial":
      default:
        return "Free Trial";
    }
  };

  return (
    <AppLayout>
      <div className="space-y-8 max-w-5xl mx-auto">
        {/* Header */}
        <div>
          <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-electric-600/15 border border-electric-500/30 text-xs font-semibold text-electric-400 mb-2">
            <CreditCard className="w-3.5 h-3.5" />
            <span>PassVault Subscription & Billing</span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold text-white tracking-tight">
            Subscription Management
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Start with our 30-day full access trial, followed by simple and affordable plans.
          </p>
        </div>

        {/* Current Plan Status Card */}
        <Card className="border-electric-500/30 bg-gradient-to-r from-charcoal-900 via-charcoal-900 to-electric-950/20 p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-charcoal-800">
            <div className="space-y-1">
              <span className="text-xs uppercase font-semibold text-slate-400 tracking-wider">
                Current Active Plan
              </span>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <span>{getPlanTitle(subscription.plan)}</span>
                <span className="text-xs px-2.5 py-0.5 rounded-full font-semibold bg-emerald-500/15 text-emerald-400 border border-emerald-500/30">
                  {subscription.status === "active_trial" ? "Active Trial" : subscription.status === "active_subscription" ? "Active" : "Canceled"}
                </span>
              </h2>
            </div>

            <div className="text-left sm:text-right">
              <span className="text-xs uppercase font-semibold text-slate-400 tracking-wider">
                Current Rate
              </span>
              <p className="text-xl font-bold text-electric-400">{subscription.price}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs text-slate-300">
            <div className="flex items-center space-x-2">
              <Calendar className="w-4 h-4 text-slate-400" />
              <span>Started: {formatDate(subscription.startDate)}</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4 text-slate-400" />
              <span>Next Renewal / End: {formatDate(subscription.endDate)}</span>
            </div>
            {subscription.plan === "free_trial" && (
              <div className="flex items-center space-x-2 text-electric-400 font-semibold">
                <Sparkles className="w-4 h-4" />
                <span>{subscription.trialDaysLeft} days left in free trial</span>
              </div>
            )}
          </div>
        </Card>

        {/* Pricing Table & Plans */}
        <div className="space-y-4">
          <div className="text-center max-w-xl mx-auto space-y-1">
            <h2 className="text-xl font-bold text-white">Choose the Right Plan for You</h2>
            <p className="text-xs text-slate-400">
              No hidden fees, no complicated tiers. Cancel anytime with a single click.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-4">
            {/* Free Trial */}
            <Card
              className={`space-y-5 flex flex-col justify-between ${
                subscription.plan === "free_trial"
                  ? "border-electric-500/50 shadow-glow-sm bg-charcoal-900"
                  : "bg-charcoal-900/60"
              }`}
            >
              <div className="space-y-4">
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-white">30-Day Free Trial</h3>
                  <p className="text-xs text-slate-400">Full access to explore PassVault.</p>
                </div>

                <div className="pt-2">
                  <span className="text-3xl font-extrabold text-white">$0</span>
                  <span className="text-xs text-slate-400 ml-1">/ for 30 days</span>
                </div>

                <ul className="space-y-2.5 pt-2 text-xs text-slate-300">
                  {planFeatures.map((feat, i) => (
                    <li key={i} className="flex items-start space-x-2">
                      <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-4 border-t border-charcoal-800">
                {subscription.plan === "free_trial" ? (
                  <Button variant="outline" className="w-full text-xs" disabled>
                    Current Plan ({subscription.trialDaysLeft} days left)
                  </Button>
                ) : (
                  <Button
                    variant="secondary"
                    className="w-full text-xs"
                    onClick={() => setSelectedPlanModal("free_trial")}
                  >
                    Switch to Free Trial
                  </Button>
                )}
              </div>
            </Card>

            {/* Monthly Pro */}
            <Card
              className={`space-y-5 flex flex-col justify-between ${
                subscription.plan === "monthly_pro"
                  ? "border-electric-500/50 shadow-glow-sm bg-charcoal-900"
                  : "bg-charcoal-900/60"
              }`}
            >
              <div className="space-y-4">
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-white">Monthly Pro</h3>
                  <p className="text-xs text-slate-400">Flexible month-to-month subscription.</p>
                </div>

                <div className="pt-2">
                  <span className="text-3xl font-extrabold text-white">$2.99</span>
                  <span className="text-xs text-slate-400 ml-1">/ month</span>
                </div>

                <ul className="space-y-2.5 pt-2 text-xs text-slate-300">
                  {planFeatures.map((feat, i) => (
                    <li key={i} className="flex items-start space-x-2">
                      <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                  <li className="flex items-start space-x-2 text-electric-400 font-medium">
                    <Zap className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                    <span>Priority cloud sync updates</span>
                  </li>
                </ul>
              </div>

              <div className="pt-4 border-t border-charcoal-800">
                {subscription.plan === "monthly_pro" ? (
                  <Button variant="outline" className="w-full text-xs" disabled>
                    Current Plan (Active)
                  </Button>
                ) : (
                  <Button
                    variant="primary"
                    className="w-full text-xs"
                    onClick={() => setSelectedPlanModal("monthly_pro")}
                  >
                    Select Monthly Pro
                  </Button>
                )}
              </div>
            </Card>

            {/* Annual Pro */}
            <Card
              className={`relative space-y-5 flex flex-col justify-between ${
                subscription.plan === "annual_pro"
                  ? "border-electric-500 shadow-glow-md bg-charcoal-900"
                  : "border-electric-500/40 bg-charcoal-900/80"
              }`}
            >
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-0.5 rounded-full bg-electric-600 text-white font-bold text-[10px] uppercase tracking-wider shadow-sm">
                Best Value (Save 16%)
              </div>

              <div className="space-y-4">
                <div className="space-y-1">
                  <h3 className="text-base font-bold text-white">Annual Pro</h3>
                  <p className="text-xs text-slate-400">Save 16% with annual billing ($2.50/mo).</p>
                </div>

                <div className="pt-2">
                  <span className="text-3xl font-extrabold text-white">$29.99</span>
                  <span className="text-xs text-slate-400 ml-1">/ year</span>
                </div>

                <ul className="space-y-2.5 pt-2 text-xs text-slate-300">
                  {planFeatures.map((feat, i) => (
                    <li key={i} className="flex items-start space-x-2">
                      <Check className="w-3.5 h-3.5 text-emerald-400 flex-shrink-0 mt-0.5" />
                      <span>{feat}</span>
                    </li>
                  ))}
                  <li className="flex items-start space-x-2 text-emerald-400 font-medium">
                    <Sparkles className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                    <span>2 Months Free included</span>
                  </li>
                </ul>
              </div>

              <div className="pt-4 border-t border-charcoal-800">
                {subscription.plan === "annual_pro" ? (
                  <Button variant="outline" className="w-full text-xs" disabled>
                    Current Plan (Active)
                  </Button>
                ) : (
                  <Button
                    variant="primary"
                    className="w-full text-xs"
                    onClick={() => setSelectedPlanModal("annual_pro")}
                  >
                    Select Annual Pro
                  </Button>
                )}
              </div>
            </Card>
          </div>
        </div>

        {/* Subscription Disclaimer & Cancel Option */}
        <div className="pt-6 border-t border-charcoal-800 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 text-xs text-slate-400">
          <p className="max-w-xl">
            PassVault provides full transparent billing. Live payment processor gateway integration (Stripe / PayPal) is provisioned for production deployment.
          </p>
          {subscription.status !== "canceled" && (
            <button
              onClick={() => setIsCancelModalOpen(true)}
              className="text-red-400 hover:text-red-300 font-medium transition-colors whitespace-nowrap"
            >
              Cancel Subscription
            </button>
          )}
        </div>
      </div>

      {/* Plan Selection Modal */}
      {selectedPlanModal && (
        <Modal
          isOpen={true}
          onClose={() => setSelectedPlanModal(null)}
          title={`Confirm Plan: ${getPlanTitle(selectedPlanModal)}`}
          description="Update your PassVault subscription tier."
          confirmLabel="Confirm & Update Plan"
          onConfirm={handleConfirmPlanChange}
          isLoading={isUpdating}
        >
          <div className="space-y-3 py-2">
            <div className="p-3 rounded-xl bg-midnight-950 border border-charcoal-800 space-y-1 text-xs">
              <div className="flex justify-between">
                <span className="text-slate-400">Selected Plan:</span>
                <span className="font-semibold text-white">{getPlanTitle(selectedPlanModal)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Billing:</span>
                <span className="font-semibold text-electric-400">
                  {selectedPlanModal === "annual_pro"
                    ? "$29.99/year"
                    : selectedPlanModal === "monthly_pro"
                    ? "$2.99/month"
                    : "$0 (30-day trial)"}
                </span>
              </div>
            </div>
            <p className="text-[11px] text-slate-400">
              Your subscription status and access tier will be immediately activated.
            </p>
          </div>
        </Modal>
      )}

      {/* Cancel Subscription Confirmation Modal */}
      <Modal
        isOpen={isCancelModalOpen}
        onClose={() => setIsCancelModalOpen(false)}
        title="Cancel PassVault Subscription?"
        description="Are you sure you want to cancel? You will still have access until the end of your current billing period."
        confirmLabel="Confirm Cancellation"
        confirmVariant="danger"
        onConfirm={handleConfirmCancel}
        isLoading={isUpdating}
      />
    </AppLayout>
  );
}
