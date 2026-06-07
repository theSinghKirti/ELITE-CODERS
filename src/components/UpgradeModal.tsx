"use client";

import React from "react";
import { X, Check, Sparkles, ShieldAlert, HeartPulse, Brain, Sparkle, Lock } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "./ui/Button";

interface UpgradeModalProps {
  isOpen: boolean;
  onClose: () => void;
  onUpgradeClick: () => void;
}

export function UpgradeModal({ isOpen, onClose, onUpgradeClick }: UpgradeModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-150 flex items-center justify-center p-4">
          {/* Backdrop blur overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-slate-950/45 backdrop-blur-md"
          />

          {/* Modal Container */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 15 }}
            transition={{ type: "spring", stiffness: 150, damping: 20 }}
            className="relative w-full max-w-md overflow-hidden rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800 shadow-2xl p-6 text-left z-10"
          >
            {/* Close button top right */}
            <button
              onClick={onClose}
              className="absolute right-4 top-4 p-1.5 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors"
              aria-label="Close modal"
            >
              <X className="h-4.5 w-4.5" />
            </button>

            {/* Icon Headings */}
            <div className="flex items-center gap-3.5 mb-5 select-none">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-teal-500/15 text-teal shadow-inner">
                <Sparkles className="h-5.5 w-5.5 animate-pulse" />
              </div>
              <div>
                <span className="text-[9px] font-black uppercase tracking-widest text-teal bg-teal-500/10 px-2 py-0.5 rounded-full">
                  MEMBER PREMIUM UPGRADE
                </span>
                <h3 className="text-lg font-black text-slate-905 dark:text-white mt-1 tracking-tight">
                  Unlock Professional Doctors
                </h3>
              </div>
            </div>

            {/* Description */}
            <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-semibold mb-6">
              General Physician is open under our starter tier. Instantly unlock deep pathology tracking, diagnostic summaries, and 3 high-tier medical consultants.
            </p>

            {/* Premium Doctors Grid Preview */}
            <div className="grid grid-cols-3 gap-3 mb-6 bg-slate-50 dark:bg-slate-950 p-3 rounded-2xl border border-slate-100 dark:border-slate-850/60">
              <div className="flex flex-col items-center text-center p-2 rounded-xl bg-white dark:bg-slate-900 shadow-xs">
                <div className="h-7 w-7 rounded-lg bg-red-500/10 text-red-500 flex items-center justify-center text-xs font-bold mb-1">
                  CR
                </div>
                <span className="text-[10px] font-bold text-slate-800 dark:text-slate-200">Cardiology</span>
              </div>
              <div className="flex flex-col items-center text-center p-2 rounded-xl bg-white dark:bg-slate-900 shadow-xs">
                <div className="h-7 w-7 rounded-lg bg-purple-600/10 text-purple-600 flex items-center justify-center text-xs font-bold mb-1">
                  NE
                </div>
                <span className="text-[10px] font-bold text-slate-800 dark:text-slate-200">Neurology</span>
              </div>
              <div className="flex flex-col items-center text-center p-2 rounded-xl bg-white dark:bg-slate-900 shadow-xs">
                <div className="h-7 w-7 rounded-lg bg-orange-500/10 text-orange-500 flex items-center justify-center text-xs font-bold mb-1">
                  DM
                </div>
                <span className="text-[10px] font-bold text-slate-800 dark:text-slate-200">Dermatology</span>
              </div>
            </div>

            {/* List of Benefits */}
            <div className="space-y-3 mb-6">
              <span className="text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-wider block">
                Premium Core Advantages
              </span>
              <ul className="space-y-2.5">
                {[
                  "Unlimited voice sessions & consultation diagnostics",
                  "Unrestricted access to all 4 expert doctor channels",
                  "Deep-dive AI pathology reports & follow-up matrices",
                  "HIPAA file storage & downloadable medical files",
                  "24/7 dedicated priority premium support",
                ].map((benefit, index) => (
                  <li key={index} className="flex items-start gap-2.5 text-xs text-slate-650 dark:text-slate-300 font-bold">
                    <div className="p-0.5 rounded-full bg-emerald-500/10 text-emerald-500 mt-0.5 shrink-0">
                      <Check className="h-3 w-3" />
                    </div>
                    <span>{benefit}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* CTA action buttons */}
            <div className="space-y-2.5">
              <Button
                variant="teal"
                onClick={onUpgradeClick}
                className="w-full h-11 bg-teal hover:bg-teal-dark font-sans font-black flex items-center justify-center gap-2 rounded-xl text-white shadow-lg shadow-teal-500/10"
              >
                <Sparkle className="h-4.5 w-4.5 animate-spin text-teal-200" />
                Upgrade to Pro (Just $19)
              </Button>
              <button
                onClick={onClose}
                className="w-full h-10 flex items-center justify-center text-xs text-slate-400 hover:text-slate-600 dark:hover:text-white font-bold transition-all"
              >
                Keep using free trial
              </button>
            </div>

            {/* Security disclaimer */}
            <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800/60 flex items-center justify-center gap-1.5 text-[10px] tracking-wide text-slate-400 font-extrabold select-none">
              <Lock className="h-3.5 w-3.5 text-slate-400" /> SECURE INTEGRATED CHECKOUT • CANCEL ANYTIME
            </div>

          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
