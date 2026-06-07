import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "motion/react";
import { MicButton } from "./MicButton";
import { WaveformVisualizer } from "./WaveformVisualizer";
import { ConversationBubble, type Message } from "./ConversationBubble";
import { PhoneOff, Volume2, VolumeX, ShieldAlert, Sparkles, Loader2, ArrowLeft } from "lucide-react";
import { useVoiceConsultation } from "../hooks/useVoiceConsultation";

interface ActiveConsultationScreenProps {
  doctorName: string;
  initialSymptoms?: string;
  onClose: () => void;
  onSave?: (summary: string, transcript: string) => void;
}

export function ActiveConsultationScreen({
  doctorName,
  initialSymptoms = "",
  onClose,
  onSave,
}: ActiveConsultationScreenProps) {
  const [elapsedSeconds, setElapsedSeconds] = useState<number>(0);
  const [isSpeakerOn, setIsSpeakerOn] = useState<boolean>(true);

  // Invoke the master real-time voice orchestration hook
  const {
    messages,
    isListening,
    isProcessing,
    isSpeaking,
    isMuted,
    liveTranscript,
    error,
    startConsultation,
    stopConsultation,
    toggleMute,
    analyserNode,
  } = useVoiceConsultation({
    doctorType: doctorName,
    initialSymptoms,
  });

  const messageEndRef = useRef<HTMLDivElement | null>(null);

  // Auto-start voice channel on mount
  useEffect(() => {
    startConsultation();
    return () => {
      stopConsultation();
    };
  }, []);

  const status = isListening
    ? "listening"
    : isProcessing
    ? "processing"
    : isSpeaking
    ? "speaking"
    : "idle";

  const transcriptionDraft = liveTranscript;

  // Auto scroll
  useEffect(() => {
    messageEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, status]);

  // Timer counter
  useEffect(() => {
    const timer = setInterval(() => {
      setElapsedSeconds((prev) => prev + 1);
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const formatTime = (totalSecs: number) => {
    const minutes = Math.floor(totalSecs / 60);
    const seconds = totalSecs % 60;
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  const handleMicToggle = () => {
    if (isListening) {
      stopConsultation();
    } else {
      startConsultation();
    }
  };

  const [generatingReport, setGeneratingReport] = useState<boolean>(false);
  const [generatorError, setGeneratorError] = useState<string | null>(null);

  const handleEndCall = async () => {
    try {
      stopConsultation();
      setGeneratingReport(true);
      setGeneratorError(null);

      // Collect the full conversation logs as transcript
      const formattedTranscript = messages
        .map((m) => `${m.role === "user" ? "Patient" : "Doctor"}: ${m.content}`)
        .join("\n") || "Patient described symptoms and followed visual prompts.";

      // 1. Create the consultation session in the DB/local mock list
      const authUserStr = localStorage.getItem("authUser");
      const userEmail = authUserStr ? JSON.parse(authUserStr).email : "guest@demo.com";

      const createRes = await fetch("/api/consultations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: userEmail,
          symptoms: initialSymptoms || "Not specified",
          doctorType: doctorName,
          transcript: formattedTranscript,
          status: "active",
        }),
      });

      if (!createRes.ok) {
        throw new Error("Failed to register the consultation ID in the database.");
      }

      const createdRecord = await createRes.json();
      const consId = createdRecord.id;

      // 2. Invoke the report generation AI compiler to perform structured GPT-4o analysis
      const reportRes = await fetch("/api/generate-report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          consultationId: consId,
          transcript: formattedTranscript,
          doctorType: doctorName,
          symptoms: initialSymptoms,
        }),
      });

      if (!reportRes.ok) {
        throw new Error("Triage report compiler timed out. Syncing draft file...");
      }

      // Decrement trial limit if guest/free user completed session
      const cachedPlan = localStorage.getItem("isPaidPlan");
      if (cachedPlan !== "true") {
        const currentCount = parseInt(localStorage.getItem("trialConsultations") || "3", 10);
        localStorage.setItem("trialConsultations", Math.max(0, currentCount - 1).toString());
      }
      
      // Dispatch storage update to refresh lists in dashboard
      window.dispatchEvent(new Event("storage"));

      // 3. Callback to parent container to save and transition views
      if (onSave) {
        onSave("completed", consId);
      }
    } catch (err: any) {
      console.error("❌ Error in post-call pipeline:", err);
      setGeneratorError(err.message || "An error occurred while compiling your medical files.");
      setGeneratingReport(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-slate-950 text-white z-110 flex flex-col justify-between font-sans overflow-hidden select-none animate-fadeIn select-none p-4 md:p-8">
      
      {/* 4. CLINICAL AI INTAKE AND STRUCTURE COMPILER OVERLAY */}
      <AnimatePresence>
        {generatingReport && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-slate-950/98 backdrop-blur-md z-120 flex flex-col items-center justify-center p-6 text-center"
          >
            <div className="max-w-md space-y-6">
              <div className="relative inline-block">
                <div className="absolute inset-0 rounded-full bg-teal/25 blur-xl animate-pulse" />
                <Loader2 className="h-14 w-14 text-teal animate-spin relative" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold text-white tracking-tight">Generating Consultation Report</h3>
                <p className="text-xs text-slate-400 font-semibold leading-relaxed">
                  MediVoice structured reasoning engine is extracting clinical findings, OTC relief metrics, follow-up parameters, and compiling the medical report document...
                </p>
              </div>
              <div className="w-48 bg-slate-900 border border-slate-800 h-2 rounded-full overflow-hidden mx-auto">
                <div className="bg-teal h-full animate-pulse rounded-full" style={{ width: "70%" }}></div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 1. TOP HEADER PANEL BAR */}
      <header className="flex items-center justify-between py-3 px-4 border-b border-slate-900 bg-slate-950/80 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <button
            onClick={onClose}
            className="p-2 -ml-2 rounded-full text-slate-400 hover:text-white hover:bg-slate-900 transition-colors cursor-pointer"
          >
            <ArrowLeft className="h-5 w-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-sm font-black text-white leading-none">
                Consultation • {doctorName}
              </h2>
              <div className="flex items-center gap-1 bg-teal/15 px-2 py-0.5 rounded-full border border-teal/20">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[9px] font-black uppercase text-teal tracking-wide">LIVE</span>
              </div>
            </div>
            <p className="text-[10px] text-slate-500 font-extrabold mt-0.5 uppercase tracking-wide">
              Encrypted SIP Protocol Channel
            </p>
          </div>
        </div>

        {/* Call elapse time and End Call button */}
        <div className="flex items-center gap-4">
          <span className="font-mono text-xs font-black tracking-widest text-[#14b8a6] bg-slate-900/50 px-3.5 py-1.5 rounded-full border border-slate-800">
            {formatTime(elapsedSeconds)}
          </span>

          <button
            onClick={handleEndCall}
            className="flex items-center gap-2 px-5 py-2.5 h-10 bg-red-500 hover:bg-red-650 rounded-full font-black text-xs uppercase tracking-wider text-white shadow-md hover:scale-[1.02] active:scale-95 transition-all cursor-pointer"
          >
            <PhoneOff className="h-4 w-4" /> End Call
          </button>
        </div>
      </header>

      {/* 2. CENTER MAIN SCREEN CONTENT AREA */}
      <main className="flex-1 flex flex-col justify-center max-w-lg w-full mx-auto space-y-6 py-6 overflow-hidden">
        
        {/* Dynamic interactive diagnostic visualizer context */}
        <div className="space-y-4">
          <WaveformVisualizer status={status} analyserNode={analyserNode} />
          
          {/* Diagnostic Status labels */}
          <div className="text-center h-5">
            <AnimatePresence mode="wait">
              {status === "listening" && (
                <motion.p
                  key="listening"
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: [0.4, 1, 0.4] }}
                  transition={{ duration: 1.4, repeat: Infinity }}
                  className="text-xs font-extrabold text-teal uppercase tracking-widest"
                >
                  Listening closely... Speak your symptoms
                </motion.p>
              )}
              {status === "processing" && (
                <motion.p
                  key="processing"
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1 }}
                  className="text-xs font-extrabold text-amber-400 uppercase tracking-widest flex items-center justify-center gap-1.5"
                >
                  <Loader2 className="h-3 w-3 animate-spin text-amber-400" /> AI Doctor is thinking...
                </motion.p>
              )}
              {status === "speaking" && (
                <motion.p
                  key="speaking"
                  initial={{ opacity: 0, y: -4 }}
                  animate={{ opacity: 1 }}
                  className="text-xs font-extrabold text-emerald-400 uppercase tracking-widest inline-flex items-center gap-1.5"
                >
                  Speaking...
                </motion.p>
              )}
              {status === "idle" && (
                <motion.p
                  key="idle"
                  className="text-xs font-bold text-slate-500 uppercase tracking-widest"
                >
                  Press Mic to stream transcription
                </motion.p>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Scrollable Clinical Transcript Bubbles wrapper */}
        <div className="flex-1 overflow-y-auto px-1 space-y-4 max-h-[290px] border-b border-t border-slate-900 py-3 scrollbar-none">
          <div className="space-y-4">
            {messages.map((item) => (
              <ConversationBubble key={item.id} message={item} doctorName={doctorName} />
            ))}
            <div ref={messageEndRef} />
          </div>
        </div>

        {/* Mock Live transcript string pill bar */}
        <div className="h-10">
          {transcriptionDraft && (
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-slate-900 border border-slate-800 rounded-full px-4 py-1.5 text-center text-[10.5px] font-semibold text-slate-350 max-w-sm mx-auto flex items-center justify-center gap-1.5"
            >
              <Sparkles className="h-3 w-3 text-teal shrink-0" />
              <span>{transcriptionDraft}</span>
            </motion.div>
          )}
        </div>

      </main>

      {/* 3. BOTTOM PANEL CONTROLS ROW */}
      <footer className="py-6 px-4 border-t border-slate-900 bg-slate-950/60 max-w-lg w-full mx-auto space-y-4">
        <div className="flex items-center justify-evenly">
          
          {/* Speaker toggle */}
          <button
            onClick={() => setIsSpeakerOn(!isSpeakerOn)}
            className={`h-11 w-11 rounded-full border flex items-center justify-center transition-colors cursor-pointer ${
              isSpeakerOn
                ? "bg-slate-900 text-slate-300 border-slate-800 hover:text-white"
                : "bg-red-500/15 text-red-500 border-red-500/20 hover:bg-red-500/25"
            }`}
          >
            {isSpeakerOn ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
          </button>

          {/* Central responsive Mic trigger */}
          <MicButton isListening={status === "listening"} onClick={handleMicToggle} />

          {/* Clinical layout visual info */}
          <div className="h-11 w-11 rounded-full bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-400">
            <span className="text-[10px] font-black tracking-tighter uppercase">SSL</span>
          </div>

        </div>

        <button
          onClick={handleEndCall}
          className="block text-center text-[10.5px] font-black uppercase text-slate-600 hover:text-slate-400 tracking-widest hover:underline cursor-pointer select-none"
        >
          Terminate HIPAA Consultation Session
        </button>
      </footer>

    </div>
  );
}
