"use client";

import { useState } from "react";
import { Navbar } from "../src/components/Navbar";
import { HeroSection } from "../src/components/HeroSection";
import { FeaturesSection } from "../src/components/FeaturesSection";
import { TestimonialsSection } from "../src/components/TestimonialsSection";
import { FooterCTA } from "../src/components/FooterCTA";
import { VoiceDemoModal } from "../src/components/VoiceDemoModal";
import { PricingPage } from "../src/components/PricingPage";
import { Mic, Sparkles, FileText, ArrowRight } from "lucide-react";
import { motion } from "motion/react";

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  return (
    <div className="relative min-h-screen bg-gradient-medical dark:bg-slate-950 transition-colors duration-300">
      {/* Navigation header */}
      <Navbar onStartConsultation={() => setIsModalOpen(true)} />
      
      {/* Core landing details */}
      <main className="space-y-16">
        <HeroSection 
          onStartConsultation={() => setIsModalOpen(true)} 
          onSeeHowItWorks={() => setIsModalOpen(true)} 
        />

        {/* 3 Steps HOW IT WORKS Section */}
        <section className="max-w-6xl mx-auto px-6 py-12 text-left">
          <div className="text-center space-y-4 max-w-xl mx-auto mb-12">
            <span className="text-[10px] font-black tracking-widest text-teal uppercase bg-teal-500/10 px-3 py-1 rounded-full">
              Symptomatology Pipeline
            </span>
            <h2 className="text-3xl font-extrabold text-slate-805 dark:text-white tracking-tight">
              Speak to Intake in 3 Automated Steps
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold leading-relaxed">
              MediVoice replaces traditional forms with instant clinical audio processing and specialist triage routes.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                step: "01",
                icon: Mic,
                title: "Describe Symptoms Naturally",
                desc: "Press the mic and speak exactly how you feel. Describe headaches, chest congestion, or rashes in your own descriptive conversational words.",
                color: "text-teal bg-teal-500/10"
              },
              {
                step: "02",
                icon: Sparkles,
                title: "AI Specialist Triage",
                desc: "Our neural symptoms scanner parses circulatory, neurology, or epidermal signals to match your description with the most qualified medical agent.",
                color: "text-purple-505 bg-purple-500/10"
              },
              {
                step: "03",
                icon: FileText,
                title: "Obtain HIPAA Clinical Audit",
                desc: "Export detailed diagnostic suggestions, suggested non-prescription medication purposes, safety boundaries, and urgency-level warnings instantly.",
                color: "text-emerald-505 bg-emerald-500/10"
              }
            ].map((item, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.35, delay: idx * 0.12 }}
                className="relative bg-white dark:bg-slate-900/60 p-6 rounded-3xl border border-slate-200/50 dark:border-slate-850 hover:shadow-lg transition-all"
              >
                <div className="absolute top-4 right-6 text-3xl font-black text-slate-100 dark:text-slate-800 select-none">
                  {item.step}
                </div>

                <div className={`h-11 w-11 rounded-2xl flex items-center justify-center mb-5 ${item.color}`}>
                  <item.icon className="h-5.5 w-5.5" />
                </div>

                <h3 className="text-base font-extrabold text-slate-850 dark:text-white mb-2 font-sans">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-semibold">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </section>

        <FeaturesSection />

        {/* Dynamic Pricing section nested right in the landing screen */}
        <section className="bg-slate-100/30 dark:bg-slate-900/10 py-16 border-y border-slate-200/40 dark:border-slate-850">
          <PricingPage 
            hideBackBtn={true} 
            onUpgradeSuccess={() => {
              window.location.href = "/dashboard";
            }}
          />
        </section>

        <TestimonialsSection />
      </main>

      {/* Action banner and subfooters */}
      <FooterCTA onStartConsultation={() => setIsModalOpen(true)} />

      {/* Dynamic consulting panel */}
      <VoiceDemoModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
