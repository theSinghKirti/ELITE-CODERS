"use client";

import React, { useState } from "react";
import { Check, HelpCircle, ChevronDown, ShieldCheck, CreditCard, Sparkles, AlertCircle, Sparkle } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "./ui/Button";
import { Card, CardContent } from "./ui/Card";
import { Badge } from "./ui/Badge";

interface FAQItem {
  question: string;
  answer: string;
}

const FAQ_ITEMS: FAQItem[] = [
  {
    question: "Is my health data secure & HIPAA compliant?",
    answer: "Absolutely. MediVoice AI enforces strict HIPAA security standards. All real-time voice consultations are encrypted end-to-end using TLS, and compiled clinical reports are stored securely under encrypted relational storage nodes."
  },
  {
    question: "Can I cancel my subscription anytime?",
    answer: "Yes, you can manage, downgrade, or cancel your Pro tier subscription instantly inside your profile setting tab without any hidden penalties or cancellation fees."
  },
  {
    question: "How detailed are the compiled medical reports?",
    answer: "All reports cover categorized symptom analysis, potential condition warnings, calculated safe over-the-counter medicine guides with dosage boundaries, recovery schedules, and a HIPAA-compliant download button to export straight to your practitioner."
  },
  {
    question: "Is this a substitute for a licensed healthcare practitioner?",
    answer: "No. MediVoice AI serves as a smart preliminary, home documentation triage portal. It should be used to log and synthesize clinical symptoms, not to replace the definitive advice, diagnostics, or therapies of a medical doctor."
  }
];

export interface PricingPageProps {
  onBackToDashboard?: () => void;
  onUpgradeSuccess?: () => void;
  hideBackBtn?: boolean;
}

export function PricingPage({ onBackToDashboard, onUpgradeSuccess, hideBackBtn = false }: PricingPageProps) {
  const [billingCycle, setBillingCycle] = useState<"monthly" | "annual">("annual");
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(null);
  const [isUpgrading, setIsUpgrading] = useState<boolean>(false);
  const [upgradeComplete, setUpgradeComplete] = useState<boolean>(false);

  const priceMonthly = 19;
  const priceAnnual = Math.round(19 * 0.8); // 20% discount is $15/mo

  const handleUpgradeToPro = () => {
    setIsUpgrading(true);
    // Simulate Clerk Billing / Stripe Checkout Redirect and update Storage success
    setTimeout(() => {
      setIsUpgrading(false);
      setUpgradeComplete(true);
      localStorage.setItem("isPaidPlan", "true");
      window.dispatchEvent(new Event("storage"));
      
      if (onUpgradeSuccess) {
        onUpgradeSuccess();
      }
    }, 1500);
  };

  const toggleFaq = (index: number) => {
    setOpenFaqIndex(openFaqIndex === index ? null : index);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 md:py-12 text-left font-sans space-y-12">
      
      {/* Top Heading */}
      <div className="text-center space-y-4 max-w-xl mx-auto">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-teal-500/10 text-teal rounded-full text-xs font-extrabold uppercase tracking-wider">
          <Sparkles className="h-3.5 w-3.5 animate-pulse" /> Transparent Clinical Pricing
        </div>
        <h1 className="text-3xl md:text-4xl font-extrabold text-slate-900 dark:text-white tracking-tight">
          Flexible Plans for Every Intake Node
        </h1>
        <p className="text-xs md:text-sm text-slate-500 dark:text-slate-400 leading-relaxed font-semibold">
          Unlock restricted specialist doctors, unlimited AI symptoms logs, and secure clinical file downloads today.
        </p>

        {/* 1. Monthly / Annual Billing Toggle Option */}
        <div className="pt-4 flex items-center justify-center gap-3">
          <span className={`text-xs font-extrabold transition-colors duration-200 ${billingCycle === "monthly" ? "text-slate-800 dark:text-white" : "text-slate-400"}`}>
            Billed Monthly
          </span>
          
          <button
            onClick={() => setBillingCycle(billingCycle === "monthly" ? "annual" : "monthly")}
            className="relative h-6.5 w-12 rounded-full bg-slate-250 dark:bg-slate-800 flex items-center p-1 transition-colors cursor-pointer"
            aria-label="Toggle subscription billing cycle"
          >
            <div
              className={`h-4.5 w-4.5 rounded-full bg-teal transition-transform duration-300 ${
                billingCycle === "annual" ? "translate-x-5" : "translate-x-0"
              }`}
            />
          </button>

          <span className={`text-xs font-extrabold transition-colors duration-200 ${billingCycle === "annual" ? "text-slate-800 dark:text-white" : "text-slate-400"} flex items-center gap-1.5`}>
            Billed Annually
            <Badge variant="emerald" className="bg-emerald-500/10 text-emerald-500 text-[9px] uppercase tracking-wider font-extrabold px-1.5 py-0 border-emerald-500/20">
              Save 20%
            </Badge>
          </span>
        </div>
      </div>

      {/* 2. Tiers Layout Grid Card Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start relative z-10">
        
        {/* TIER 1 - Free Card */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <Card className="glass relative rounded-3xl border border-slate-200/40 dark:border-slate-850/80 bg-white/70 dark:bg-slate-900/40 backdrop-blur-md overflow-hidden p-6 hover:shadow-xl transition-shadow flex flex-col justify-between h-full min-h-[460px]">
            <div className="space-y-6 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-[10px] font-black tracking-widest text-slate-405 uppercase bg-slate-100 dark:bg-slate-855 px-2.5 py-1 rounded-full">
                    FREE TRIAL
                  </span>
                </div>

                <div className="space-y-1">
                  <h3 className="text-xl font-black text-slate-850 dark:text-white">MediVoice Starter</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-405 font-semibold">
                    Perfect for triaging simple health worries.
                  </p>
                </div>

                {/* Price Display */}
                <div className="py-6 flex items-baseline gap-1 select-none">
                  <span className="text-4xl font-black text-slate-900 dark:text-white">$0</span>
                  <span className="text-xs font-semibold text-slate-400">/ forever</span>
                </div>

                {/* Features List */}
                <div className="space-y-3.5 pt-2 border-t border-slate-100 dark:border-slate-850">
                  <span className="text-[9px] font-black uppercase tracking-wider text-slate-400">Included Core Features</span>
                  <ul className="space-y-2.5">
                    {[
                      "3 voice consultation passes per month",
                      "General Physician doctor channel access",
                      "Basic PDF style clinical findings records",
                      "HIPAA-compliant client-side secure caching",
                    ].map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs text-slate-600 dark:text-slate-350 font-bold">
                        <Check className="h-4 w-4 text-emerald-500 shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Outline Action Button */}
              <div className="pt-6 mt-auto">
                <Button
                  variant="outline"
                  onClick={onBackToDashboard}
                  className="w-full h-11 rounded-xl text-xs font-black uppercase tracking-widest border border-slate-200 hover:bg-slate-50 dark:border-slate-800 text-slate-700 dark:text-slate-300 dark:hover:bg-slate-900 duration-150"
                >
                  {hideBackBtn ? "Start Free Account" : "Keep Free Active"}
                </Button>
              </div>
            </div>
          </Card>
        </motion.div>

        {/* TIER 2 - Pro Card (Highlighted with active ring borders) */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.12 }}
        >
          <Card className="relative rounded-3xl border-2 border-teal bg-white dark:bg-slate-900/90 shadow-2xl p-6 overflow-hidden flex flex-col justify-between h-full min-h-[460px] before:absolute before:inset-0 before:rounded-3xl before:bg-gradient-to-br before:from-teal/5 before:to-transparent before:-z-10 group">
            {/* Absolute badge most popular overlay */}
            <div className="absolute top-0 right-6 translate-y-1 z-10 select-none">
              <Badge variant="teal" className="text-[10px] tracking-wider font-extrabold px-3 py-1 border-teal uppercase shadow-inner">
                Most Popular
              </Badge>
            </div>

            <div className="space-y-6 flex-1 flex flex-col justify-between">
              <div>
                <div className="flex justify-between items-center mb-4">
                  <span className="text-[10px] font-black tracking-widest text-teal uppercase bg-teal-500/10 px-2.5 py-1 rounded-full">
                    RELIABLE PROFESSIONAL
                  </span>
                </div>

                <div className="space-y-1">
                  <h3 className="text-xl font-black text-slate-900 dark:text-white">MediVoice Pro Plan</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold">
                    Complete specialist coverage with offline reports.
                  </p>
                </div>

                {/* Price Display */}
                <div className="py-6 flex items-baseline gap-1 select-none">
                  <span className="text-4xl font-extrabold text-slate-900 dark:text-white transition-all">
                    ${billingCycle === "annual" ? priceAnnual : priceMonthly}
                  </span>
                  <span className="text-xs font-semibold text-slate-400">
                    / month {billingCycle === "annual" && "(billed annually)"}
                  </span>
                </div>

                {/* Features List */}
                <div className="space-y-3.5 pt-2 border-t border-slate-100 dark:border-slate-805">
                  <span className="text-[9px] font-black uppercase tracking-wider text-teal">All Features + Premium Coverage</span>
                  <ul className="space-y-2.5">
                    {[
                      "Unlimited clinical voice consultations",
                      "All 4 Specialist Consultants unlocked instantly",
                      "Detailed medical reports (Pathology / conditions)",
                      "Urgency level screening and recovery guidance",
                      "HIPAA offline files PDF downloads",
                      "Priority 24/7 client-practitioner triage support",
                    ].map((feature, idx) => (
                      <li key={idx} className="flex items-start gap-2 text-xs text-slate-700 dark:text-slate-200 font-bold">
                        <Check className="h-4 w-4 text-teal shrink-0 mt-0.5" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Filled Premium CTA button */}
              <div className="pt-6 mt-auto">
                {upgradeComplete ? (
                  <Button
                    variant="teal"
                    className="w-full h-12 rounded-xl text-xs font-black uppercase tracking-widest bg-emerald-500 text-white flex items-center justify-center gap-1.5 cursor-default"
                  >
                    <Check className="h-5.5 w-5.5" /> Plan Activated & Syncing
                  </Button>
                ) : (
                  <Button
                    variant="teal"
                    onClick={handleUpgradeToPro}
                    disabled={isUpgrading}
                    className="w-full h-12 rounded-xl text-xs font-black uppercase tracking-widest bg-teal hover:bg-teal-dark text-white shadow-lg shadow-teal-500/25 flex items-center justify-center gap-2 active:scale-98"
                  >
                    {isUpgrading ? (
                      <span>Redirecting to secure billing...</span>
                    ) : (
                      <>
                        <Sparkle className="h-4 w-4 text-teal-200 animate-spin" /> Upgrade to Pro Plan
                      </>
                    )}
                  </Button>
                )}
              </div>
            </div>
          </Card>
        </motion.div>

      </div>

      {/* 3. Trust badges row */}
      <div className="py-4 border-y border-slate-200/50 dark:border-slate-850 bg-slate-50/50 dark:bg-slate-900/20 rounded-2xl flex flex-col sm:flex-row items-center justify-around gap-4 text-xs text-slate-450 dark:text-slate-400 font-bold select-none">
        <div className="flex items-center gap-2">
          <ShieldCheck className="h-5 w-5 text-emerald-500" />
          <span>HIPAA Secure Encryption Node</span>
        </div>
        <div className="flex items-center gap-2">
          <CreditCard className="h-4.5 w-4.5 text-teal animate-pulse" />
          <span>Secure Payments & Cancel Anytime</span>
        </div>
        <div className="flex items-center gap-2">
          <AlertCircle className="h-4.5 w-4.5 text-teal" />
          <span>100% Sandbox Compliant Checkout</span>
        </div>
      </div>

      {/* 4. FAQ Section below Accordion */}
      <div className="space-y-6 pt-6 text-left">
        <div className="text-center space-y-1.5">
          <h3 className="text-xl font-black text-slate-850 dark:text-white tracking-tight">
            Frequently Asked Questions
          </h3>
          <p className="text-xs text-slate-400 font-semibold">
            Common answers about MediVoice billing networks, regulatory standards, and technology features.
          </p>
        </div>

        <div className="space-y-3.5 max-w-3xl mx-auto">
          {FAQ_ITEMS.map((item, index) => {
            const isOpen = openFaqIndex === index;
            return (
              <div 
                key={index} 
                className="bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-850 rounded-2xl overflow-hidden transition-all duration-200"
              >
                <button
                  onClick={() => toggleFaq(index)}
                  className="w-full flex items-center justify-between p-4 bg-transparent outline-none text-left cursor-pointer select-none"
                >
                  <span className="font-extrabold text-sm text-slate-800 dark:text-slate-150 flex items-center gap-2">
                    <HelpCircle className="h-4 w-4 text-teal shrink-0" /> {item.question}
                  </span>
                  <ChevronDown className={`h-4.5 w-4.5 text-slate-400 transition-transform duration-300 ${isOpen ? "rotate-180 text-teal" : ""}`} />
                </button>
                
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.2 }}
                    >
                      <div className="px-5 pb-5 pt-1 border-t border-slate-100 dark:border-slate-850/40 text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-semibold">
                        {item.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>

      {/* Back button */}
      {!hideBackBtn && onBackToDashboard && (
        <div className="text-center pt-4">
          <button
            onClick={onBackToDashboard}
            className="text-xs text-slate-400 hover:text-teal font-black uppercase tracking-wider transition-colors cursor-pointer"
          >
            ← Back to Dashboard Console
          </button>
        </div>
      )}

    </div>
  );
}
