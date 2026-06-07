"use client";

import React, { useState } from "react";
import { ArrowLeft, CheckCircle, Sparkles, Loader2, AlertCircle, Heart, ShieldAlert, Check } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "../../../src/components/ui/Button";

// Predefined doctor agents list for choosing a custom doctor
const SPECIALISTS = [
  { id: "General Physician", name: "Dr. General", specialty: "General Physician", color: "bg-teal text-white", initials: "GP" },
  { id: "Cardiologist", name: "Dr. Cardio", specialty: "Cardiologist", color: "bg-red-500 text-white", initials: "CR" },
  { id: "Neurologist", name: "Dr. Neuro", specialty: "Neurologist", color: "bg-purple-600 text-white", initials: "NE" },
  { id: "Dermatologist", name: "Dr. Derm", specialty: "Dermatologist", color: "bg-orange-500 text-white", initials: "DM" },
];

export default function NewConsultationPage({
  onBack,
  onStartActiveConsultation,
}: {
  onBack?: () => void;
  onStartActiveConsultation?: (agentName: string, initialSymptoms: string) => void;
}) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [symptoms, setSymptoms] = useState<string>("");
  const [isAnalyzing, setIsAnalyzing] = useState<boolean>(false);
  const [errorText, setErrorText] = useState<string>("");
  const [recommendation, setRecommendation] = useState<{
    doctorType: string;
    reason: string;
    confidence: "high" | "medium" | "low";
  } | null>(null);
  const [manualSelection, setManualSelection] = useState<boolean>(false);

  // Character validations
  const minChars = 20;
  const isSufficient = symptoms.trim().length >= minChars;

  // STEP 1 Click handler
  const handleAnalyzeSymptoms = async () => {
    if (!isSufficient) {
      setErrorText(`Please describe your symptoms in at least ${minChars} characters to allow accurate clinical analysis.`);
      return;
    }
    setErrorText("");
    setIsAnalyzing(true);

    try {
      const res = await fetch("/api/recommend-doctor", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ symptoms }),
      });

      if (!res.ok) {
        const errData = await res.json();
        throw new Error(errData.error || "Failed to analyze symptoms");
      }

      const recommendationData = await res.json();
      setRecommendation(recommendationData);
      setStep(2);
    } catch (err: any) {
      console.error(err);
      setErrorText(err.message || "An unexpected network error occurred. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  // STEP 2 Click handlers
  const handleConfirmStart = () => {
    const selectedDocName = SPECIALISTS.find(
      s => s.id === (recommendation?.doctorType || "General Physician")
    )?.name || "Dr. General";

    const isPaid = localStorage.getItem("isPaidPlan") === "true";
    if (selectedDocName !== "Dr. General" && !isPaid) {
      alert("Specialists are pro-tier agents. Redirecting to pricing tiers...");
      window.location.href = "/pricing";
      return;
    }

    setStep(3);
    setTimeout(() => {
      if (onStartActiveConsultation) {
        onStartActiveConsultation(selectedDocName, symptoms);
      } else {
        // Redirection mock fallback notice
        alert(`Starting consultation session with ${selectedDocName}...`);
      }
    }, 1500);
  };

  const handleSelectCustomDoctor = (doctorType: string) => {
    const isPaid = localStorage.getItem("isPaidPlan") === "true";
    if (doctorType !== "General Physician" && !isPaid) {
      alert("Specialist consultant channels require a premium membership. Redirecting to plans...");
      window.location.href = "/pricing";
      return;
    }

    setRecommendation({
      doctorType,
      reason: `Patient manually diverted recommendation to Consult standard ${doctorType} agent.`,
      confidence: "high"
    });
    setManualSelection(false);
  };

  const currentSpecialistDetails = SPECIALISTS.find(
    doc => doc.id === (recommendation?.doctorType || "General Physician")
  ) || SPECIALISTS[0];

  const getConfidenceBadgeColor = (conf: string) => {
    switch (conf) {
      case "high":
        return "bg-emerald-50 text-emerald-700 border-emerald-200/50 dark:bg-emerald-950/20 dark:text-emerald-400";
      case "medium":
        return "bg-amber-50 text-amber-700 border-amber-200/50 dark:bg-amber-950/20 dark:text-amber-400";
      case "low":
        return "bg-rose-50 text-rose-700 border-rose-200/50 dark:bg-rose-950/20 dark:text-rose-400";
      default:
        return "bg-slate-100 text-slate-800";
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-4 sm:p-6 lg:p-8 space-y-8 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800/80 rounded-3xl shadow-xl">
      
      {/* Header back triggers */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-800">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-xs font-bold text-slate-500 hover:text-teal transition-colors cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" /> Go Back to Dashboard
        </button>
        <span className="text-[10px] font-black tracking-widest text-teal uppercase bg-teal-500/10 px-2.5 py-1 rounded-full">
          AI Triage System
        </span>
      </div>

      {/* Progress Line Pills indicator */}
      <div className="space-y-3">
        <div className="flex items-center justify-between text-xs text-slate-400 font-bold uppercase tracking-wider">
          <span>Triage Progress</span>
          <span>Step {step} of 3</span>
        </div>
        <div className="flex gap-2">
          <div className={`h-2 flex-1 rounded-full transition-all duration-300 ${step >= 1 ? "bg-teal" : "bg-slate-100 dark:bg-slate-800"}`} />
          <div className={`h-2 flex-1 rounded-full transition-all duration-300 ${step >= 2 ? "bg-teal" : "bg-slate-100 dark:bg-slate-800"}`} />
          <div className={`h-2 flex-1 rounded-full transition-all duration-300 ${step >= 3 ? "bg-teal" : "bg-slate-100 dark:bg-slate-800"}`} />
        </div>
      </div>

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: -15 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 15 }}
            transition={{ duration: 0.25 }}
            className="space-y-6 text-left"
          >
            <div className="space-y-2">
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white font-sans">
                Describe Your Symptoms
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-semibold">
                Please outline the symptoms you are currently feeling in your own words. The triage agent will process chest, neuropathy, rash, or general symptoms immediately.
              </p>
            </div>

            <div className="space-y-2">
              <textarea
                value={symptoms}
                onChange={(e) => setSymptoms(e.target.value)}
                placeholder="Examples: 'I have had a severe throbbing headache behind my right eye for 2 days now, accompanied by nausea and light sensitivity.' or 'I am experiencing sudden redness on my left forearm with intense itching and a burning rash.'"
                className="w-full min-h-[160px] p-4 rounded-2xl border border-slate-200 bg-slate-50 dark:bg-slate-950 dark:border-slate-800 text-sm text-slate-850 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal/20 focus:border-teal transition-all resize-none leading-relaxed font-medium"
              />
              <div className="flex justify-between items-center text-xs">
                {errorText ? (
                  <span className="text-rose-500 font-semibold inline-flex items-center gap-1">
                    <AlertCircle className="h-3.5 w-3.5" /> Character minimum not met
                  </span>
                ) : (
                  <span className="text-slate-400 font-semibold">Be descriptive for better recommendation quality.</span>
                )}
                <span className={`font-bold transition-colors ${isSufficient ? "text-emerald-500" : "text-slate-400"}`}>
                  {symptoms.trim().length} / {minChars} chars min
                </span>
              </div>
            </div>

            {errorText && !errorText.includes("minimum") && (
              <div className="p-4 bg-rose-50 dark:bg-rose-950/20 rounded-2xl border border-rose-500/10 text-xs text-rose-800 dark:text-rose-400 font-semibold flex items-start gap-2.5">
                <AlertCircle className="h-4 w-4 shrink-0 mt-0.5" />
                <span>{errorText}</span>
              </div>
            )}

            <Button
              variant="teal"
              disabled={!isSufficient || isAnalyzing}
              onClick={handleAnalyzeSymptoms}
              className="w-full h-12 text-sm font-extrabold rounded-2xl shadow-md flex items-center justify-center gap-2 bg-teal hover:bg-teal-dark text-white disabled:bg-slate-100 disabled:text-slate-400"
            >
              {isAnalyzing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" /> Analyzing your symptoms...
                </>
              ) : (
                <>
                  <Sparkles className="h-4.5 w-4.5" /> Analyze Symptoms with Medical AI
                </>
              )}
            </Button>
          </motion.div>
        )}

        {step === 2 && recommendation && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: -15 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 15 }}
            transition={{ duration: 0.25 }}
            className="space-y-6 text-left"
          >
            <div className="space-y-1 text-center sm:text-left">
              <h2 className="text-xl font-extrabold text-slate-900 dark:text-white font-sans">
                AI Clinical Triage Result
              </h2>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-semibold">
                The agent has successfully scanned pathology patterns and recommends the specialist below.
              </p>
            </div>

            {/* Recommendation Display Panel Card */}
            <div className="p-6 bg-slate-50 dark:bg-slate-950 border border-slate-150 dark:border-slate-850 rounded-3xl space-y-5">
              <div className="flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
                {/* Large Specialty Avatar circle */}
                <div className={`h-16 w-16 rounded-full flex items-center justify-center text-lg font-black shrink-0 shadow-inner ${currentSpecialistDetails.color}`}>
                  {currentSpecialistDetails.initials}
                </div>
                
                <div className="space-y-1.5 flex-1">
                  <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
                    <span className="text-[10px] font-black uppercase text-teal tracking-widest">Recommended Match</span>
                    <span className={`text-[9px] uppercase tracking-widest font-black px-2 py-0.5 border rounded-full ${getConfidenceBadgeColor(recommendation.confidence)}`}>
                      {recommendation.confidence} Confidence
                    </span>
                  </div>
                  <h3 className="text-lg font-black text-slate-850 dark:text-white font-sans">
                    Recommended: Dr. {currentSpecialistDetails.specialty}
                  </h3>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200/50 dark:border-slate-800 space-y-2 text-xs font-semibold text-slate-650 dark:text-slate-300">
                <span className="text-[10px] uppercase font-black tracking-wider text-slate-400 block">Assessment Context</span>
                <p className="leading-relaxed text-slate-800 dark:text-slate-250 italic">
                  "{recommendation.reason}"
                </p>
              </div>
            </div>

            {!manualSelection ? (
              <div className="space-y-3 pt-2">
                <Button
                  variant="teal"
                  onClick={handleConfirmStart}
                  className="w-full h-12 text-sm font-extrabold rounded-2xl shadow-md bg-teal hover:bg-teal-dark text-white flex items-center justify-center gap-2"
                >
                  <Check className="h-4.5 w-4.5" /> Confirm & Start Consultation
                </Button>
                
                <div className="text-center">
                  <button
                    onClick={() => setManualSelection(true)}
                    className="text-xs text-slate-500 hover:text-teal font-bold hover:underline cursor-pointer"
                  >
                    Choose Different Doctor Manually
                  </button>
                </div>
              </div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="space-y-3 pt-3 border-t border-slate-100 dark:border-slate-800"
              >
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block mb-2">Available Clinical Expert Nodes</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {SPECIALISTS.map((spec) => (
                    <button
                      key={spec.id}
                      onClick={() => handleSelectCustomDoctor(spec.id)}
                      className="flex items-center gap-3 p-3.5 bg-white hover:bg-slate-100 dark:bg-slate-900 dark:hover:bg-slate-850 text-left rounded-xl border border-slate-200 dark:border-slate-800 transition-all cursor-pointer group"
                    >
                      <span className={`h-8 w-8 rounded-lg ${spec.color} flex items-center justify-center text-xs font-bold font-sans shrink-0`}>
                        {spec.initials}
                      </span>
                      <div>
                        <p className="text-xs font-bold text-slate-800 dark:text-slate-200">{spec.name}</p>
                        <p className="text-[10px] text-slate-400 font-bold">{spec.specialty}</p>
                      </div>
                    </button>
                  ))}
                </div>
                <div className="text-center pt-2">
                  <button
                    onClick={() => setManualSelection(false)}
                    className="text-xs text-slate-400 font-black uppercase hover:text-slate-600 dark:hover:text-white"
                  >
                    Go Back to Match
                  </button>
                </div>
              </motion.div>
            )}
          </motion.div>
        )}

        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="py-12 flex flex-col items-center justify-center text-center space-y-4"
          >
            <div className="relative">
              <div className="absolute inset-0 rounded-full bg-teal/20 blur-md animate-pulse" />
              <Loader2 className="h-12 w-12 text-teal animate-spin relative" />
            </div>
            <div className="max-w-xs space-y-1">
              <h3 className="text-base font-extrabold text-slate-800 dark:text-slate-100 font-sans">
                Setting up your consultation...
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold leading-relaxed">
                Syncing HIPAA-compliant session channels with Dr. {SPECIALISTS.find(doc => doc.id === (recommendation?.doctorType || "General Physician"))?.specialty || "General Physician"}.
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
