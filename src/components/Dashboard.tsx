import React, { useState, useEffect } from "react";
import {
  Activity,
  Bell,
  Home,
  MessageSquare,
  FileText,
  CreditCard,
  Settings,
  Mic,
  Lock,
  Unlock,
  CheckCircle,
  LogOut,
  ChevronRight,
  Sparkles,
  Search,
  User,
  HeartPulse,
  Brain,
  ShieldAlert,
  Stethoscope,
  Info,
  Check,
  Star,
  Plus
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "./ui/Button";
import { Badge } from "./ui/Badge";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "./ui/Card";
import { DashboardCard } from "./DashboardCard";
import { DoctorAgentCard, type DoctorAgent } from "./DoctorAgentCard";
import { PricingPage } from "./PricingPage";
import { UpgradeModal } from "./UpgradeModal";
import NewConsultationPage from "../../app/dashboard/new-consultation/page";

interface DashboardProps {
  user: {
    fullName: string;
    email: string;
  };
  onLogOut: () => void;
  onOpenConsultation: (agentName: string) => void;
  onStartActiveConsultation?: (agentName: string, initialSymptoms: string) => void;
}

export interface ConsultationRecord {
  id: string;
  doctorName: string;
  specialty: string;
  transcript: string;
  date: string;
  diagnosis: string;
  recommendations: string;
}

export function Dashboard({ user, onLogOut, onOpenConsultation, onStartActiveConsultation }: DashboardProps) {
  const [activeTab, setActiveTab] = useState<"home" | "consultations" | "reports" | "pricing" | "settings">("home");
  const [isTriageActive, setIsTriageActive] = useState<boolean>(false);
  const [isPaid, setIsPaid] = useState<boolean>(false);
  const [trialConsultations, setTrialConsultations] = useState<number>(3);
  const [consultationHistory, setConsultationHistory] = useState<ConsultationRecord[]>([]);
  const [showNotification, setShowNotification] = useState<string | null>(null);
  const [isUpgradeModalOpen, setIsUpgradeModalOpen] = useState<boolean>(false);

  // Load state and simulated history from database with localStorage fallback
  useEffect(() => {
    const cachedPlan = localStorage.getItem("isPaidPlan");
    if (cachedPlan === "true") setIsPaid(true);

    const cachedTrialCount = localStorage.getItem("trialConsultations");
    if (cachedTrialCount !== null) {
      setTrialConsultations(parseInt(cachedTrialCount, 10));
    }

    const fetchServerConsultations = async () => {
      try {
        const response = await fetch(`/api/consultations?userId=${encodeURIComponent(user.email)}`);
        if (response.ok) {
          const data = await response.json();
          const mapped: ConsultationRecord[] = data.map((item: any) => ({
            id: item.id,
            doctorName: item.doctorType || "Dr. General",
            specialty: item.doctorType.includes("Cardio") ? "Cardiologist"
                      : item.doctorType.includes("Neuro") ? "Neurologist"
                      : item.doctorType.includes("Derm") ? "Dermatologist"
                      : "General Physician",
            transcript: item.transcript || item.symptoms || "",
            date: new Date(item.createdAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            }),
            diagnosis: item.summary || "No active findings summary",
            recommendations: item.recommendations || "No active recommendations generated.",
          }));
          setConsultationHistory(mapped);
          localStorage.setItem("consultationsList", JSON.stringify(mapped));
        } else {
          const cachedConsultations = localStorage.getItem("consultationsList");
          if (cachedConsultations) {
            setConsultationHistory(JSON.parse(cachedConsultations));
          }
        }
      } catch (err) {
        console.error("❌ Failed to query consultations from database API:", err);
        const cachedConsultations = localStorage.getItem("consultationsList");
        if (cachedConsultations) {
          try {
            setConsultationHistory(JSON.parse(cachedConsultations));
          } catch (e) {
            // ignore
          }
        }
      }
    };

    fetchServerConsultations();

    // Listen to storage events to auto-reload if modal saves a new consultation
    const handleStorageChange = () => {
      fetchServerConsultations();
    };
    window.addEventListener("storage", handleStorageChange);
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, [user.email]);

  const handleUpgrade = () => {
    setIsPaid(true);
    localStorage.setItem("isPaidPlan", "true");
    triggerAlert("Premium plan unlocked successfully! All specialist agents are now unlocked.");
    setActiveTab("home");
  };

  const handleResetPlan = () => {
    setIsPaid(false);
    setTrialConsultations(3);
    setConsultationHistory([]);
    localStorage.removeItem("isPaidPlan");
    localStorage.removeItem("trialConsultations");
    localStorage.removeItem("consultationsList");
    triggerAlert("Plan parameters have been successfully reset.");
  };

  const triggerAlert = (message: string) => {
    setShowNotification(message);
    setTimeout(() => {
      setShowNotification(null);
    }, 4500);
  };

  // Predefined doctor agents list
  const doctorAgents: DoctorAgent[] = [
    {
      id: "general",
      name: "Dr. General",
      specialty: "General Physician",
      isUnlocked: true,
      avatarInitials: "GP",
      badgeText: "FREE",
      avatarColor: "bg-teal font-extrabold",
      statusText: "Immediate Consultation Ready",
      description: "Equipped to analyze common symptoms, cold/flu indicators, allergies, fatigue, and general health metrics.",
    },
    {
      id: "cardio",
      name: "Dr. Cardio",
      specialty: "Cardiologist",
      isUnlocked: isPaid,
      avatarInitials: "DR",
      badgeText: "PREMIUM",
      avatarColor: "bg-red-500 font-extrabold",
      statusText: "Chest & Circulation Specialist",
      description: "Focused on blood circulation metrics, severe palpitation risk ratings, high blood pressure patterns, and heart safety guidance.",
    },
    {
      id: "neuro",
      name: "Dr. Neuro",
      specialty: "Neurologist",
      isUnlocked: isPaid,
      avatarInitials: "NE",
      badgeText: "PREMIUM",
      avatarColor: "bg-purple-600 font-extrabold",
      statusText: "Cognitive & Nerve Specialist",
      description: "Specialized in chronic migraine analysis, neuropathy patterns, memory metrics, and acute tension tracking.",
    },
    {
      id: "derm",
      name: "Dr. Derm",
      specialty: "Dermatologist",
      isUnlocked: isPaid,
      avatarInitials: "DM",
      badgeText: "PREMIUM",
      avatarColor: "bg-orange-500 font-extrabold",
      statusText: "Skin & Epidermal Specialist",
      description: "Evaluates persistent rashes, lesion concerns, skin discoloration metrics, and general skin lesion guidance.",
    },
  ];

  return (
    <div className="flex h-[calc(100vh-4rem)] overflow-hidden font-sans">
      
      {/* Dynamic Pop-up Alert Toast Notification */}
      <AnimatePresence>
        {showNotification && (
          <motion.div
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -50 }}
            className="fixed top-18 left-1/2 -translate-x-1/2 z-101 max-w-md w-full bg-slate-900 border border-teal-500/30 text-white p-4 rounded-2xl shadow-xl flex items-start gap-3"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-teal-500/20 text-teal shrink-0">
              <Sparkles className="h-4.5 w-4.5" />
            </div>
            <div className="text-left flex-1">
              <p className="text-sm font-bold text-teal">MediVoice Notification</p>
              <p className="text-xs text-slate-350 mt-0.5 leading-relaxed font-semibold">
                {showNotification}
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* 1. SIDEBAR GRID (Left column: hidden on small screens) */}
      <aside className="hidden md:flex w-64 flex-col bg-white dark:bg-slate-950 border-r border-slate-200/60 dark:border-slate-900/60 transition-colors shrink-0">
        
        {/* Brand Container top section */}
        <div className="p-6 border-b border-slate-100 dark:border-slate-900 flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-tr from-teal to-emerald text-white">
            <Activity className="h-4.5 w-4.5" />
          </div>
          <span className="font-sans font-black text-slate-900 dark:text-white tracking-tight">
            MediVoice Console
          </span>
        </div>

        {/* Sidebar Navigation */}
        <nav className="flex-1 px-4 py-6 space-y-1.5 overflow-y-auto">
          <button
            onClick={() => setActiveTab("home")}
            className={`w-full flex items-center gap-3.5 px-3.5 py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
              activeTab === "home"
                ? "bg-teal text-white shadow-md shadow-teal-500/10"
                : "text-slate-650 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-900/40"
            }`}
          >
            <Home className="h-4.5 w-4.5" />
            <span>Dashboard</span>
          </button>

          <button
            onClick={() => setActiveTab("consultations")}
            className={`w-full flex items-center gap-3.5 px-3.5 py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
              activeTab === "consultations"
                ? "bg-teal text-white shadow-md shadow-teal-500/10"
                : "text-slate-650 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-900/40"
            }`}
          >
            <MessageSquare className="h-4.5 w-4.5" />
            <span>Consultations</span>
            {consultationHistory.length > 0 && (
              <span className="ml-auto bg-slate-22 px-2 py-0.5 rounded-full text-[10px] bg-slate-100 text-slate-800 dark:bg-slate-800 dark:text-slate-200 font-bold">
                {consultationHistory.length}
              </span>
            )}
          </button>

          <button
            onClick={() => setActiveTab("reports")}
            className={`w-full flex items-center gap-3.5 px-3.5 py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
              activeTab === "reports"
                ? "bg-teal text-white shadow-md shadow-teal-500/10"
                : "text-slate-650 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-900/40"
            }`}
          >
            <FileText className="h-4.5 w-4.5" />
            <span>Reports</span>
          </button>

          <button
            onClick={() => setActiveTab("pricing")}
            className={`w-full flex items-center gap-3.5 px-3.5 py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
              activeTab === "pricing"
                ? "bg-teal text-white shadow-md shadow-teal-500/10"
                : "text-slate-650 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-900/40"
            }`}
          >
            <CreditCard className="h-4.5 w-4.5" />
            <span>Pricing & Plans</span>
          </button>

          <button
            onClick={() => setActiveTab("settings")}
            className={`w-full flex items-center gap-3.5 px-3.5 py-3 rounded-xl text-sm font-semibold transition-all cursor-pointer ${
              activeTab === "settings"
                ? "bg-teal text-white shadow-md shadow-teal-500/10"
                : "text-slate-650 hover:bg-slate-100 dark:text-slate-300 dark:hover:bg-slate-900/40"
            }`}
          >
            <Settings className="h-4.5 w-4.5" />
            <span>Console Settings</span>
          </button>
        </nav>

        {/* Sidebar Footer User Details Profile replicate <UserButton> */}
        <div className="p-4 border-t border-slate-100 dark:border-slate-900 space-y-3">
          <div className="flex items-center gap-3 p-2 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-100 dark:border-slate-900">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-linear-to-tr from-teal to-emerald text-white text-xs font-bold font-sans">
              {user.fullName.split(" ").map(w => w[0]).join("")}
            </div>
            <div className="overflow-hidden">
              <p className="text-xs font-bold text-slate-800 dark:text-slate-200 truncate">
                {user.fullName}
              </p>
              <p className="text-[10px] text-slate-400 font-bold uppercase truncate tracking-wide">
                {isPaid ? "PRO CLINICAL PLAN" : "FREE TRIAL"}
              </p>
            </div>
          </div>
          <button
            onClick={onLogOut}
            className="w-full flex items-center gap-2 justify-center px-3.5 py-2 rounded-xl text-xs font-bold border border-slate-200 text-slate-600 hover:text-red-500 hover:bg-red-500/5 hover:border-red-500/20 dark:border-slate-800 dark:text-slate-400 transition-all cursor-pointer"
          >
            <LogOut className="h-3.5 w-3.5" />
            Sign Out
          </button>
        </div>
      </aside>

      {/* 2. BODY CONTENT AREA */}
      <div className="flex-1 flex flex-col bg-slate-50 dark:bg-slate-950 overflow-hidden">
        
        {/* Top Header bar with custom dynamic variables */}
        <header className="h-16 border-b border-slate-200/50 dark:border-slate-900/60 bg-white/70 dark:bg-slate-950/70 backdrop-blur-md flex items-center justify-between px-6 shrink-0 z-20">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white font-sans flex items-center gap-2">
              Welcome, <span className="text-teal font-extrabold">{user.fullName}</span>
              <span className="hidden sm:inline-flex items-center gap-1 bg-emerald-500/10 px-2 py-0.5 rounded-full text-[10px] text-emerald">
                <CheckCircle className="h-3 w-3" /> Activated
              </span>
            </h2>
            <p className="text-xs text-slate-400 font-medium hidden sm:block">
              Medical Consulting Portal — 100% Secure HIPAA Node
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Quick alert notifications */}
            <button
              onClick={() => triggerAlert("No ongoing medical warnings at this time. All servers are HIPAA secured.")}
              className="flex h-9 w-9 items-center justify-center rounded-xl bg-slate-50 border border-slate-150 text-slate-600 hover:bg-slate-100 dark:bg-slate-900 dark:border-slate-800 dark:text-slate-300 dark:hover:bg-slate-800 cursor-pointer relative"
              aria-label="System notifications"
            >
              <Bell className="h-4.5 w-4.5" />
              <span className="absolute -top-0.5 -right-0.5 flex h-2.5 w-2.5 rounded-full bg-teal" />
            </button>

            {/* Simulated mini Mobile Menu buttons */}
            <div className="flex md:hidden items-center gap-1.5 bg-slate-100 dark:bg-slate-900 p-1 rounded-xl">
              <button
                onClick={() => setActiveTab("home")}
                className={`p-2 rounded-lg ${activeTab === "home" ? "bg-white text-teal dark:bg-slate-850" : "text-slate-400"}`}
              >
                <Home className="h-4 w-4" />
              </button>
              <button
                onClick={() => setActiveTab("consultations")}
                className={`p-2 rounded-lg ${activeTab === "consultations" ? "bg-white text-teal dark:bg-slate-850" : "text-slate-400"}`}
              >
                <MessageSquare className="h-4 w-4" />
              </button>
              <button
                onClick={() => setActiveTab("pricing")}
                className={`p-2 rounded-lg ${activeTab === "pricing" ? "bg-white text-teal dark:bg-slate-850" : "text-slate-400"}`}
              >
                <CreditCard className="h-4 w-4" />
              </button>
            </div>
          </div>
        </header>

        {/* 3. DYNAMIC PAGES SWITCHER */}
        <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-6">
          <AnimatePresence mode="wait">
            
            {isTriageActive ? (
              <motion.div
                key="triage"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                transition={{ duration: 0.22 }}
              >
                <NewConsultationPage
                  onBack={() => setIsTriageActive(false)}
                  onStartActiveConsultation={(selectedDocName, initialSymptoms) => {
                    setIsTriageActive(false);
                    if (onStartActiveConsultation) {
                      onStartActiveConsultation(selectedDocName, initialSymptoms);
                    } else {
                      onOpenConsultation(selectedDocName);
                    }
                  }}
                />
              </motion.div>
            ) : (
              <>
                {/* === PAGE 1: HOME DASHBOARD === */}
                {activeTab === "home" && (
              <motion.div
                key="home"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                {/* Subscription indicator trial banner */}
                <Card className="glass relative overflow-hidden bg-white/70 dark:bg-slate-900/60 backdrop-blur-md border border-slate-200/50 dark:border-slate-800/80 p-5 rounded-3xl">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                    <div className="space-y-1 text-left">
                      <div className="flex items-center gap-2">
                        {isPaid ? (
                          <Badge variant="teal" className="text-[10px] tracking-wide font-extrabold uppercase">
                            Premium Plan Active
                          </Badge>
                        ) : (
                          <Badge variant="emerald" className="bg-amber-500/10 text-amber-600 dark:bg-amber-900/10 dark:text-amber-400 border-amber-500/20 text-[10px] tracking-wide font-extrabold uppercase">
                            Free Trial Active
                          </Badge>
                        )}
                        <span className="text-xs font-extrabold text-slate-400">• HIPAA compliant</span>
                      </div>
                      <h3 className="text-base font-extrabold text-slate-900 dark:text-white font-sans">
                        {isPaid ? (
                          "Premium Plan — Unlimited consultation passes activated"
                        ) : (
                          `Demo Trial — ${trialConsultations} consultation sessions remaining`
                        )}
                      </h3>
                      <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-semibold">
                        {isPaid ? (
                          "Full unrestricted consultation passes active. Speak naturally to all Generalists or locked specialist agents."
                        ) : (
                          "Take advantage of comprehensive AI-driven symptomatology reporting. Upgrade easily to gain unrestricted specialist nodes."
                        )}
                      </p>
                    </div>

                    {!isPaid && (
                      <Button
                        variant="teal"
                        size="sm"
                        onClick={() => setActiveTab("pricing")}
                        className="bg-amber-500 hover:bg-amber-600 text-white font-extrabold shadow-sm active:scale-95 text-xs inline-flex items-center gap-1.5"
                      >
                        <Sparkles className="h-3.5 w-3.5 fill-current" /> Upgrade Plan
                      </Button>
                    )}
                  </div>
                </Card>

                {/* Stats Grid Dashboard row */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                  <DashboardCard
                    title="Total Consults"
                    value={consultationHistory.length}
                    description="Successfully processed intake voice files"
                    icon={MessageSquare}
                    trend={consultationHistory.length > 0 ? "+100%" : undefined}
                    trendType="positive"
                    color="teal"
                  />
                  <DashboardCard
                    title="Current Month"
                    value={consultationHistory.length}
                    description="Consultations resolved this cycle"
                    icon={Activity}
                    color="emerald"
                  />
                  <DashboardCard
                    title="Draft Reports"
                    value={consultationHistory.length}
                    description="Clinical files generated"
                    icon={FileText}
                    color="slate"
                  />
                </div>

                {/* Main start consult trigger CTAs */}
                <div className="rounded-3xl border border-dashed border-teal-500/35 bg-teal-500/[0.02] dark:bg-teal-500/[0.01] p-6 text-center space-y-4">
                  <div className="max-w-md mx-auto space-y-2">
                    <div className="relative inline-block mx-auto mb-2">
                      <div className="absolute inset-0 rounded-full bg-teal/20 blur-md animate-pulse-glow" />
                      <button
                        onClick={() => onOpenConsultation("Dr. General")}
                        className="relative h-13 w-13 rounded-full bg-linear-to-tr from-teal to-emerald text-white flex items-center justify-center animate-pulse-glow"
                        aria-label="Start Quick Voice Consultation"
                      >
                        <Mic className="h-6 w-6" />
                      </button>
                    </div>
                    <h4 className="text-base font-extrabold text-slate-800 dark:text-slate-100">
                      Instantly Activate AI Symptom Triage
                    </h4>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-semibold">
                      Evaluate symptoms with our intelligent clinic router. Custom expert matches are recommended instantly based on your description.
                    </p>
                    <div className="pt-2 flex flex-col sm:flex-row items-center justify-center gap-3">
                      <Button
                        variant="teal"
                        onClick={() => setIsTriageActive(true)}
                        className="w-full sm:w-auto text-xs font-black uppercase tracking-wider h-11 px-6 shadow-md"
                      >
                        <Sparkles className="h-4 w-4 fill-current" /> Start New Consultation
                      </Button>
                      <Button
                        variant="outline"
                        onClick={() => onOpenConsultation("Dr. General")}
                        className="w-full sm:w-auto text-xs font-semibold h-11 px-5 border-slate-250 dark:border-slate-800"
                      >
                        Start Quick Consultation
                      </Button>
                    </div>
                  </div>
                </div>

                {/* Doctor specialist grid */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h3 className="font-sans text-base font-extrabold text-slate-800 dark:text-white flex items-center gap-2">
                      <HeartPulse className="h-4.5 w-4.5 text-teal" /> Recommended Specialists
                    </h3>
                    <span className="text-[10px] font-bold text-slate-450 text-slate-500 uppercase tracking-wider">
                      Interactive Clinical AI Agents
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                    {doctorAgents.map((agent) => (
                      <DoctorAgentCard
                        key={agent.id}
                        agent={agent}
                        onSelect={() => agent.isUnlocked ? onOpenConsultation(agent.name) : setIsUpgradeModalOpen(true)}
                        onUpgrade={() => setIsUpgradeModalOpen(true)}
                      />
                    ))}
                  </div>
                              {/* Recent Consultations lists */}
                <div className="space-y-4 pt-4">
                  <h3 className="font-sans text-base font-extrabold text-slate-800 dark:text-white">
                    Completed Clinical Report Audits
                  </h3>

                  {consultationHistory.length === 0 ? (
                    <div className="rounded-3xl border border-slate-200/60 dark:border-slate-900 bg-white dark:bg-slate-900/60 p-12 text-center flex flex-col items-center justify-center space-y-3.5">
                      <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-full text-slate-400">
                        <Stethoscope className="h-8 w-8 text-teal" />
                      </div>
                      <div className="max-w-xs space-y-1">
                        <p className="text-sm font-extrabold text-slate-800 dark:text-slate-200">
                          No consultations completed yet
                        </p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-semibold">
                          Active completed clinical test trials will list immediately after ingestion. Give it a run!
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 gap-4">
                      {consultationHistory.map((history) => {
                        const IconComponent = history.doctorName.toLowerCase().includes("cardio") ? HeartPulse
                                              : history.doctorName.toLowerCase().includes("neuro") ? Brain
                                              : history.doctorName.toLowerCase().includes("derm") ? Sparkles
                                              : Stethoscope;
                        const truncatedSymptoms = history.transcript.length > 80
                          ? history.transcript.substring(0, 80) + "..."
                          : history.transcript || "None reported.";

                        return (
                          <Card 
                            key={history.id} 
                            onClick={() => {
                              window.history.pushState(null, "", `/consultation/${history.id}/report`);
                              window.dispatchEvent(new Event("popstate"));
                            }}
                            className="bg-white dark:bg-slate-900 hover:border-teal-500/40 border-slate-200/80 dark:border-slate-800 p-5 rounded-2xl flex flex-col sm:flex-row justify-between items-start gap-4 hover:shadow-lg transition-all dark:hover:bg-slate-900/80 cursor-pointer group"
                          >
                            <div className="space-y-3 text-left flex-1">
                              <div className="flex flex-wrap items-center gap-2">
                                <div className="p-2 rounded-xl bg-teal-500/10 text-teal">
                                  <IconComponent className="h-4 w-4" />
                                </div>
                                <span className="font-bold text-slate-800 dark:text-slate-200 text-sm">{history.doctorName}</span>
                                <Badge variant="teal" className="text-[9px] uppercase tracking-wider font-extrabold px-1.5 py-0">Completed</Badge>
                                <span className="text-[10.5px] text-slate-400 font-bold ml-auto sm:ml-0">{history.date}</span>
                              </div>
                              <div className="space-y-1">
                                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">Patient Symptoms Intake</span>
                                <p className="text-xs text-slate-600 dark:text-slate-450 italic font-medium leading-relaxed">
                                  "{truncatedSymptoms}"
                                </p>
                              </div>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                                <div className="bg-slate-50 dark:bg-slate-950 p-3 rounded-xl border border-slate-100 dark:border-slate-850">
                                  <span className="text-[9px] uppercase tracking-wide font-extrabold text-teal block mb-0.5">Clinical Impression</span>
                                  <span className="text-xs text-slate-600 dark:text-slate-350 leading-relaxed font-semibold truncate block">{history.diagnosis}</span>
                                </div>
                                <div className="bg-slate-50 dark:bg-slate-950 p-3 rounded-xl border border-slate-100 dark:border-slate-850">
                                  <span className="text-[9px] uppercase tracking-wide font-extrabold text-emerald block mb-0.5">Primary Actions</span>
                                  <span className="text-xs text-slate-600 dark:text-slate-350 leading-relaxed font-semibold truncate block">{history.recommendations}</span>
                                </div>
                              </div>
                            </div>
                            <div className="self-stretch flex sm:flex-col justify-end items-end shrink-0 sm:pl-2">
                              <span className="text-xs font-bold text-teal group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                                View Report <ChevronRight className="h-3 w-3" />
                              </span>
                            </div>
                          </Card>
                        );
                      })}
                    </div>
                  )}
                </div>    </div>
              </motion.div>
            )}

            {/* === PAGE 2: CONSULTATIONS LIST === */}
            {activeTab === "consultations" && (
              <motion.div
                key="consultations"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-6"
              >
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">Voice Consultation Auditing</h3>
                  <p className="text-xs text-slate-500 font-semibold mt-1">Complete diagnostic transcripts of patient voice intakes</p>
                </div>

                {consultationHistory.length === 0 ? (
                  <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center flex flex-col items-center justify-center space-y-3">
                    <MessageSquare className="h-10 w-10 text-slate-300" />
                    <p className="text-sm font-bold text-slate-800">No voice sessions logged</p>
                    <p className="text-xs text-slate-400 font-medium">To see audits, activate consultations from the dashboard page.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {consultationHistory.map((history) => (
                      <Card 
                        key={history.id} 
                        onClick={() => {
                          window.history.pushState(null, "", `/consultation/${history.id}/report`);
                          window.dispatchEvent(new Event("popstate"));
                        }}
                        className="bg-white dark:bg-slate-900 p-5 rounded-2xl text-left border border-slate-200 dark:border-slate-800 space-y-4 hover:border-teal-500/40 hover:shadow-lg transition-all dark:hover:bg-slate-900/80 cursor-pointer group block"
                      >
                        <div className="flex justify-between items-center pb-3 border-b border-slate-100 dark:border-slate-800">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-extrabold text-slate-400 capitalize">{history.specialty}</span>
                            <span className="text-xs font-bold bg-neutral-100 text-neutral-800 px-2 py-0.5 rounded-full dark:bg-neutral-800 dark:text-neutral-200">{history.doctorName}</span>
                          </div>
                          <span className="text-[10px] font-bold text-slate-400">{history.date}</span>
                        </div>
                        <div className="space-y-1">
                          <span className="text-[10px] uppercase font-bold text-slate-400">Speech Transcription</span>
                          <p className="text-sm text-slate-800 dark:text-slate-200 italic font-medium">"{history.transcript}"</p>
                        </div>
                        <div className="p-3.5 bg-slate-50 dark:bg-slate-950 border border-slate-150 dark:border-slate-850 rounded-xl space-y-3">
                          <div className="flex gap-2">
                            <span className="text-xs font-extrabold text-slate-500 uppercase tracking-wider block min-w-[120px]">Etiology Findings:</span>
                            <span className="text-xs text-slate-800 dark:text-slate-300 leading-relaxed font-semibold">{history.diagnosis}</span>
                          </div>
                          <div className="flex gap-2">
                            <span className="text-xs font-extrabold text-teal uppercase tracking-wider block min-w-[120px]">Recommended Actions:</span>
                            <span className="text-xs text-slate-800 dark:text-slate-300 leading-relaxed font-semibold">{history.recommendations}</span>
                          </div>
                        </div>
                        <div className="pt-1 flex justify-end">
                          <span className="text-xs font-bold text-teal transition-transform group-hover:translate-x-1 inline-flex items-center gap-1">
                            Click to Open Full Dynamic Analysis Report <ChevronRight className="h-3 w-3" />
                          </span>
                        </div>
                      </Card>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {/* === PAGE 3: DETAILED REPORTS === */}
            {activeTab === "reports" && (
              <motion.div
                key="reports"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-6"
              >
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">Structured Medical Summaries</h3>
                  <p className="text-xs text-slate-500 font-semibold mt-1">Exportable PDF medical data sheets format</p>
                </div>

                <div className="rounded-3xl border border-slate-200 bg-white p-12 text-center flex flex-col items-center justify-center space-y-3 dark:bg-slate-900 dark:border-slate-800">
                  <FileText className="h-10 w-10 text-slate-300" />
                  <p className="text-sm font-bold text-slate-800 dark:text-slate-200">Export Engine Ready</p>
                  <p className="text-xs text-slate-400 dark:text-slate-400 font-medium max-w-sm">
                    {consultationHistory.length > 0 
                      ? `${consultationHistory.length} formatted reports are prepared. Select a clinical file below to view full details.` 
                      : "No active drafts are compiled. Real diagnostic histories render here upon complete voice ingesting."
                    }
                  </p>
                </div>

                {consultationHistory.length > 0 && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                    {consultationHistory.map((history) => {
                      const IconComponent = history.doctorName.toLowerCase().includes("cardio") ? HeartPulse
                                            : history.doctorName.toLowerCase().includes("neuro") ? Brain
                                            : history.doctorName.toLowerCase().includes("derm") ? Sparkles
                                            : Stethoscope;
                      return (
                        <Card 
                          key={history.id} 
                          onClick={() => {
                            window.history.pushState(null, "", `/consultation/${history.id}/report`);
                            window.dispatchEvent(new Event("popstate"));
                          }}
                          className="bg-white dark:bg-slate-900 hover:border-teal-500/40 border-slate-200 dark:border-slate-800 p-5 rounded-2xl flex items-center gap-4 hover:shadow-md transition-all cursor-pointer group"
                        >
                          <div className="p-3.5 rounded-xl bg-teal-500/10 text-teal shrink-0">
                            <IconComponent className="h-5 w-5" />
                          </div>
                          <div className="text-left flex-1 min-w-0">
                            <p className="text-xs font-bold text-slate-400 capitalize">{history.specialty}</p>
                            <p className="text-sm font-black text-slate-800 dark:text-white truncate">{history.doctorName} Report</p>
                            <p className="text-[10px] text-slate-400 font-bold mt-0.5">{history.date} • HIPAA Secure</p>
                          </div>
                          <ChevronRight className="h-4 w-4 text-slate-400 group-hover:text-teal group-hover:translate-x-1 transition-all shrink-0" />
                        </Card>
                      );
                    })}
                  </div>
                )}
              </motion.div>
            )}

            {/* === PAGE 4: PRICING MATRIX === */}
            {activeTab === "pricing" && (
              <motion.div
                key="pricing"
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.98 }}
                className="space-y-6"
              >
                <PricingPage
                  onBackToDashboard={() => setActiveTab("home")}
                  onUpgradeSuccess={() => {
                    setIsPaid(true);
                    triggerAlert("Pro plan activated successfully! All specialist doctor consultants unlocked.");
                    setActiveTab("home");
                  }}
                  hideBackBtn={false}
                />
              </motion.div>
            )}

            {/* === PAGE 5: SYSTEM SETTINGS === */}
            {activeTab === "settings" && (
              <motion.div
                key="settings"
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="space-y-6"
              >
                <div>
                  <h3 className="text-xl font-bold text-slate-900 dark:text-white">Console Configuration</h3>
                  <p className="text-xs text-slate-500 font-semibold mt-1">Admin level security parameters</p>
                </div>

                <Card className="bg-white dark:bg-slate-900 p-5 rounded-2xl text-left border border-slate-200 dark:border-slate-800 space-y-4">
                  <div className="space-y-3">
                    <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">Demonstration Control Panel</h4>
                    <div className="p-3.5 bg-yellow-50 dark:bg-yellow-950/20 rounded-xl border border-yellow-500/10 text-xs text-yellow-800 dark:text-yellow-400 font-medium">
                      Reset plan presets, cached simulated logs, and trial indicators back to default parameters easily here.
                    </div>
                    <div className="pt-2 flex flex-col sm:flex-row gap-3">
                      <Button
                        variant="destructive"
                        onClick={handleResetPlan}
                        className="text-white text-xs font-bold rounded-xl"
                      >
                        Clear System Cache
                      </Button>
                    </div>
                  </div>
                </Card>
              </motion.div>
            )}
              </>
            )}

          </AnimatePresence>
        </div>

      </div>

      <UpgradeModal
        isOpen={isUpgradeModalOpen}
        onClose={() => setIsUpgradeModalOpen(false)}
        onUpgradeClick={() => {
          setIsUpgradeModalOpen(false);
          setActiveTab("pricing");
        }}
      />
    </div>
  );
}
