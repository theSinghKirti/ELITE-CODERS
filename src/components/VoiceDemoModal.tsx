import React, { useState, useEffect } from "react";
import { X, Mic, CheckCircle2, Lock, ShieldAlert, Sparkles, User, HelpCircle, FileText, Send } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "./ui/Button";
import { Badge } from "./ui/Badge";

interface VoiceDemoModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedAgentName?: string;
  onConsultationComplete?: (record: {
    id: string;
    doctorName: string;
    specialty: string;
    transcript: string;
    date: string;
    diagnosis: string;
    recommendations: string;
  }) => void;
}

const SIMULATED_SYMPTOMS = [
  "Mild pressure on the left side of the head, paired with sensitivity to bright lights.",
  "Persistent dry cough, mild fatigue, and elevated temperature of 100.5°F.",
  "Dull, aching lower back discomfort starting after heavy lifting yesterday.",
];

export function VoiceDemoModal({ isOpen, onClose, selectedAgentName = "Dr. General", onConsultationComplete }: VoiceDemoModalProps) {
  const [step, setStep] = useState<"intro" | "listening" | "analyzing" | "completed">("intro");
  const [transcript, setTranscript] = useState<string>("");
  const [customText, setCustomText] = useState<string>("");
  const [waveHeights, setWaveHeights] = useState<number[]>([12, 18, 8, 24, 30, 16, 22, 10, 14, 28, 12, 6, 20]);

  // Determine specialty details
  const getSpecialty = (name: string) => {
    if (name.includes("Cardio")) return "Cardiologist";
    if (name.includes("Neuro")) return "Neurologist";
    if (name.includes("Derm")) return "Dermatologist";
    return "General Physician";
  };

  // Determine etiology diagnostic mock
  const getSimulatedFindings = (name: string) => {
    if (name.includes("Cardio")) {
      return {
        etiology: "Assessment points to benign palpitations or stress-induced blood pressure elevation indices. Critical patterns are currently stable.",
        action: "Avoid strenuous stimulants, observe resting heart rate, and schedule an official diagnostic ECG validation."
      };
    }
    if (name.includes("Neuro")) {
      return {
        etiology: "Clinical findings align with standard vascular cluster headache indicators or acute ophthalmic muscle fatigue.",
        action: "Minimize screen exposures, rest inside quiet shaded quarters, maintain adequate hydration, and record symptom logs."
      };
    }
    if (name.includes("Derm")) {
      return {
        etiology: "Primary visual cues identify potential localized contact urticaria or seasonal epidermal micro-allergen reactions.",
        action: "Cleanse area gently with cold water, apply hypoallergenic protective barrier cream, and secure formal allergy testing."
      };
    }
    return {
      etiology: "Findings indicate clinical milestones of micro-sinus inflammation or mild seasonal rhinitis. No acute threat flagged.",
      action: "Support normal hydration metrics, rest, and engage secondary evaluation if thermal values spike above 101°F."
    };
  };

  // Handle waveform motion during listing phase
  useEffect(() => {
    if (step !== "listening") return;

    const interval = setInterval(() => {
      setWaveHeights(prev => prev.map(() => Math.floor(Math.random() * 32) + 6));
    }, 120);

    // Auto complete voice intake after 4.5 seconds
    const timer = setTimeout(() => {
      setStep("analyzing");
    }, 4050);

    return () => {
      clearInterval(interval);
      clearTimeout(timer);
    };
  }, [step]);

  // Complete analysis state
  useEffect(() => {
    if (step !== "analyzing") return;

    const timer = setTimeout(() => {
      setStep("completed");

      // Auto trigger completed callback so dashboard can save state
      if (onConsultationComplete) {
        const currentFindings = getSimulatedFindings(selectedAgentName);
        onConsultationComplete({
          id: Math.random().toString(36).substring(4, 11),
          doctorName: selectedAgentName,
          specialty: getSpecialty(selectedAgentName),
          transcript: transcript,
          date: new Date().toLocaleDateString("en-US", {
            month: "short",
            day: "numeric",
            year: "numeric",
          }),
          diagnosis: currentFindings.etiology,
          recommendations: currentFindings.action,
        });
      }
    }, 2800);

    return () => clearTimeout(timer);
  }, [step]);

  const handleStartListening = (mockText: string) => {
    setTranscript(mockText);
    setStep("listening");
  };

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!customText.trim()) return;
    setTranscript(customText);
    setStep("analyzing");
  };

  const handleClose = () => {
    setStep("intro");
    setTranscript("");
    setCustomText("");
    onClose();
  };

  const currentFindings = getSimulatedFindings(selectedAgentName);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-100 overflow-y-auto">
          {/* Backdrop wrapper */}
          <div className="flex min-h-screen items-center justify-center p-4 text-center">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-slate-900/40 backdrop-blur-md"
              onClick={handleClose}
            />

            {/* Modal Box */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 15 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 15 }}
              transition={{ type: "spring", damping: 25, stiffness: 350 }}
              className="relative w-full max-w-lg transform overflow-hidden rounded-3xl bg-white p-6 text-left align-middle shadow-2xl transition-all dark:bg-slate-900 dark:border dark:border-slate-800"
            >
              {/* Header Close button */}
              <button
                onClick={handleClose}
                className="absolute right-4 top-4 rounded-full p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-850 dark:hover:text-slate-200 transition-colors cursor-pointer"
              >
                <X className="h-5 w-5" />
              </button>

              {/* Title / Header info */}
              <div className="mb-6 flex items-center gap-2">
                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal/10 text-teal">
                  <Sparkles className="h-4.5 w-4.5" />
                </div>
                <h3 className="font-sans text-lg font-bold text-slate-900 dark:text-white">
                  Intake Session with <span className="text-teal font-extrabold">{selectedAgentName}</span>
                </h3>
              </div>

              {/* Step 1: Intro / Select symptom option */}
              {step === "intro" && (
                <div>
                  <div className="mb-5 space-y-2">
                    <p className="text-base font-semibold text-slate-855 dark:text-slate-200">
                      Welcome to your secure consulting line.
                    </p>
                    <p className="text-sm text-slate-600 dark:text-slate-400">
                      Choose one of the sample options below to simulate voice-intake, or record in custom symptom descriptions directly.
                    </p>
                  </div>

                  {/* Scenarios */}
                  <div className="space-y-2.5 mb-5">
                    {SIMULATED_SYMPTOMS.map((symptom, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleStartListening(symptom)}
                        className="w-full text-left p-3.5 rounded-2xl border border-slate-150 bg-slate-50/50 hover:bg-teal-500/5 hover:border-teal/30 dark:bg-slate-850/50 dark:border-slate-800 dark:hover:bg-slate-800/40 dark:hover:border-teal-500/20 transition-all cursor-pointer group flex items-start gap-3"
                      >
                        <div className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-slate-200 dark:bg-slate-800 text-slate-500 text-xs font-bold group-hover:bg-teal/10 group-hover:text-teal transition-colors">
                          {idx + 1}
                        </div>
                        <span className="text-sm text-slate-700 dark:text-slate-300 leading-relaxed font-semibold">
                          {symptom}
                        </span>
                      </button>
                    ))}
                  </div>

                  {/* Custom Form */}
                  <form onSubmit={handleCustomSubmit} className="relative flex items-center">
                    <input
                      type="text"
                      value={customText}
                      onChange={(e) => setCustomText(e.target.value)}
                      placeholder="Describe symptoms in your own words..."
                      className="w-full h-11 pl-4 pr-12 rounded-full border border-slate-200 bg-slate-50 dark:bg-slate-950 dark:border-slate-800 text-sm text-slate-855 dark:text-slate-250 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal/30 focus:border-teal transition-all"
                    />
                    <Button
                      type="submit"
                      disabled={!customText.trim()}
                      className="absolute right-1 h-9 w-9 p-0 bg-teal hover:bg-teal-dark text-white rounded-full flex items-center justify-center"
                    >
                      <Send className="h-4 w-4" />
                    </Button>
                  </form>
                </div>
              )}

              {/* Step 2: Listening Animation */}
              {step === "listening" && (
                <div className="flex flex-col items-center justify-center py-10 text-center">
                  {/* Floating Pulsing Mic Button */}
                  <div className="relative mb-8">
                    <div className="absolute inset-0 rounded-full bg-teal/20 blur-xl opacity-70 animate-pulse-glow" />
                    <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-linear-to-tr from-teal to-emerald text-white shadow-xl animate-pulse-glow cursor-pointer">
                      <Mic className="h-10 w-10 animate-bounce" style={{ animationDuration: '2.5s' }} />
                    </div>
                  </div>

                  <p className="text-lg font-bold text-slate-900 dark:text-white animate-pulse">
                    Listening & transcribing...
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 mb-8 tracking-wide uppercase font-bold">
                    Speak naturally. We are capturing details.
                  </p>

                  {/* Waveform Visualization */}
                  <div className="flex items-center justify-center gap-1.5 h-12 px-6 bg-slate-50 dark:bg-slate-950/40 rounded-2xl border border-slate-100 dark:border-slate-800/50 w-full max-w-sm">
                    {waveHeights.map((h, i) => (
                      <motion.div
                        key={i}
                        animate={{ height: h }}
                        style={{ width: "3.5px" }}
                        className="bg-emerald-500 rounded-full opacity-80"
                        transition={{ type: "spring", stiffness: 200, damping: 20 }}
                      />
                    ))}
                  </div>

                  <div className="mt-6 p-4 rounded-2xl border border-dashed border-teal-500/20 bg-teal-500/[0.02] text-sm text-slate-655 dark:text-slate-350 italic max-w-md">
                    "{transcript}"
                  </div>
                </div>
              )}

              {/* Step 3: Analyzing State */}
              {step === "analyzing" && (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <div className="relative h-20 w-20 mb-6">
                    <div className="absolute inset-0 rounded-full border-4 border-slate-100 dark:border-slate-800" />
                    <div className="absolute inset-0 rounded-full border-4 border-teal border-t-transparent animate-spin" />
                  </div>
                  <h4 className="text-lg font-bold text-slate-900 dark:text-white">
                    Processing Medical Insights
                  </h4>
                  <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 max-w-xs">
                    Cross-referencing symptoms patterns with evidence-based internal databases...
                  </p>
                </div>
              )}

              {/* Step 4: Medical Intake Consultation Completed */}
              {step === "completed" && (
                <div className="space-y-5">
                  <div className="rounded-2xl bg-emerald-500/10 border border-emerald-500/20 p-4 shrink-0 flex items-start gap-3">
                    <div className="bg-emerald-500 text-white rounded-full p-1.5 mt-0.5">
                      <CheckCircle2 className="h-4 w-4" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-emerald-855 dark:text-emerald-400">
                        Visual Consultation Report Generated
                      </p>
                      <p className="text-xs text-slate-600 dark:text-slate-350 mt-0.5 leading-relaxed font-semibold">
                        Data ingestion complete. Based on clinical patterns, here is a professional guidance summary:
                      </p>
                    </div>
                  </div>

                  {/* Report Card */}
                  <div className="rounded-2xl border border-slate-200 bg-slate-50/50 p-4 dark:border-slate-800 dark:bg-slate-950/40 space-y-4">
                    {/* Transcript block */}
                    <div>
                      <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block mb-1">
                        Input Symptom Audio
                      </span>
                      <p className="text-sm font-semibold text-slate-800 dark:text-slate-250 italic bg-white dark:bg-slate-900 p-2.5 rounded-xl border border-slate-150 dark:border-slate-800 leading-relaxed shadow-xs">
                        "{transcript}"
                      </p>
                    </div>

                    {/* AI Findings */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 text-left">
                      <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-150 dark:border-slate-800 shadow-xs">
                        <span className="text-xs font-bold text-teal block mb-1 flex items-center gap-1 uppercase tracking-wide">
                          <Sparkles className="h-3 w-3" /> Potential Etiology
                        </span>
                        <p className="text-[11px] text-slate-700 dark:text-slate-300 font-semibold leading-relaxed">
                          {currentFindings.etiology}
                        </p>
                      </div>

                      <div className="p-3 bg-white dark:bg-slate-900 rounded-xl border border-slate-150 dark:border-slate-800 shadow-xs">
                        <span className="text-xs font-bold text-emerald block mb-1 flex items-center gap-1 uppercase tracking-wide">
                          <CheckCircle2 className="h-3 w-3" /> Recommended Action
                        </span>
                        <p className="text-[11px] text-slate-700 dark:text-slate-300 font-semibold leading-relaxed">
                          {currentFindings.action}
                        </p>
                      </div>
                    </div>

                    {/* Disclaimer Warning banner */}
                    <div className="border border-amber-500/20 bg-amber-500/10 rounded-xl p-3 flex gap-2.5 items-start">
                      <ShieldAlert className="h-4.5 w-4.5 text-amber-600 shrink-0 mt-0.5" />
                      <p className="text-[11px] text-amber-800 dark:text-amber-400 font-medium leading-relaxed">
                        <strong>Clinical Disclaimer:</strong> AI findings are advisory aids for triage routing. Always consult formal physician support. Call 911 in emergency situations.
                      </p>
                    </div>
                  </div>

                  {/* Action row */}
                  <div className="flex gap-2.5 pt-2">
                    <Button
                      variant="teal"
                      onClick={() => setStep("intro")}
                      className="flex-1 justify-center rounded-2xl whitespace-nowrap h-11 text-xs"
                    >
                      New Speech Simulation
                    </Button>
                    <Button
                      variant="outline"
                      onClick={handleClose}
                      className="flex-1 justify-center rounded-2xl h-11 text-xs"
                    >
                      Commit & Close
                    </Button>
                  </div>
                </div>
              )}

              {/* Data security tag */}
              <div className="mt-5 flex items-center justify-center gap-1.5 text-slate-400 text-xs font-bold">
                <Lock className="h-3 w-3" /> HIPAA Compliant End-to-End Encryption
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}
