import React, { useState, useEffect } from "react";
import { AlertCircle } from "lucide-react";
import { Navbar } from "./components/Navbar";
import { HeroSection } from "./components/HeroSection";
import { FeaturesSection } from "./components/FeaturesSection";
import { TestimonialsSection } from "./components/TestimonialsSection";
import { FooterCTA } from "./components/FooterCTA";
import { VoiceDemoModal } from "./components/VoiceDemoModal";
import { ClerkAuth } from "./components/ClerkAuth";
import { Dashboard, type ConsultationRecord } from "./components/Dashboard";
import { ActiveConsultationScreen } from "./components/ActiveConsultationScreen";
import { ReportViewScreen } from "./components/ReportViewScreen";

export default function App() {
  const [currentView, setCurrentView] = useState<"landing" | "auth" | "dashboard" | "consultation" | "report">("landing");
  const [authUser, setAuthUser] = useState<{ fullName: string; email: string } | null>(null);
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [selectedAgentName, setSelectedAgentName] = useState<string>("Dr. General");
  const [activeConsultationDetails, setActiveConsultationDetails] = useState<{ doctorName: string; initialSymptoms: string } | null>(null);
  const [selectedConsultationId, setSelectedConsultationId] = useState<string | null>(null);

  // Load persistence states on startup & route deep link paths
  useEffect(() => {
    const cachedUser = localStorage.getItem("authUser");
    if (cachedUser) {
      try {
        setAuthUser(JSON.parse(cachedUser));
      } catch (e) {
        // failed parse
      }
    }

    const handleUrlRouting = () => {
      const path = window.location.pathname;
      const reportMatch = path.match(/^\/consultation\/([a-f0-9-]+)\/report$/i);
      if (reportMatch) {
        setSelectedConsultationId(reportMatch[1]);
        setCurrentView("report");
      } else {
        const cachedUserStore = localStorage.getItem("authUser");
        if (cachedUserStore) {
          setCurrentView("dashboard");
        } else {
          setCurrentView(path === "/auth" ? "auth" : "landing");
        }
      }
    };

    handleUrlRouting();
    window.addEventListener("popstate", handleUrlRouting);
    return () => window.removeEventListener("popstate", handleUrlRouting);
  }, []);

  const handleStartConsultation = (agentName: string = "Dr. General") => {
    // If not logged-in, guide them to Clerk Auth first! Protecting the routes under consultation and dashboard!
    if (!authUser) {
      setCurrentView("auth");
    } else {
      setSelectedAgentName(agentName);
      setIsModalOpen(true);
    }
  };

  const handleLaunchActiveConsultation = (doctorName: string, initialSymptoms: string) => {
    setActiveConsultationDetails({ doctorName, initialSymptoms });
    setCurrentView("consultation");
  };

  const handleAuthComplete = (user: { fullName: string; email: string }) => {
    setAuthUser(user);
    setCurrentView("dashboard");
  };

  const handleLogOut = () => {
    localStorage.removeItem("authUser");
    setAuthUser(null);
    setCurrentView("landing");
  };

  const handleConsultationComplete = async (newConsultation: ConsultationRecord) => {
    // Save to relational database via Express server API
    try {
      await fetch("/api/consultations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: authUser ? authUser.email : "guest@demo.com",
          symptoms: newConsultation.transcript,
          doctorType: newConsultation.doctorName,
          transcript: newConsultation.transcript,
          summary: newConsultation.diagnosis,
          medications: "[]",
          recommendations: newConsultation.recommendations,
          restAdvice: "Take regular rest and review symptoms.",
          status: "completed",
        }),
      });
    } catch (error) {
      console.error("❌ Failed to sync consultation session to database server:", error);
    }

    // Save to historical consultations locally matches fallback
    const currentList: ConsultationRecord[] = (() => {
      try {
        const stored = localStorage.getItem("consultationsList");
        return stored ? JSON.parse(stored) : [];
      } catch (err) {
        return [];
      }
    })();

    const updatedList = [newConsultation, ...currentList];
    localStorage.setItem("consultationsList", JSON.stringify(updatedList));

    // Decrement trial limit if not upgraded yet
    const cachedPlan = localStorage.getItem("isPaidPlan");
    if (cachedPlan !== "true") {
      const currentCount = parseInt(localStorage.getItem("trialConsultations") || "3", 10);
      const updatedCount = Math.max(0, currentCount - 1);
      localStorage.setItem("trialConsultations", updatedCount.toString());
    }

    // Force refresh state variables
    window.dispatchEvent(new Event("storage"));
  };

  return (
    <div className="relative min-h-screen bg-slate-50 dark:bg-slate-950 font-sans transition-colors duration-300">
      
      {/* Global clinical disclaimer banner: stays fixed at very top */}
      <div 
        id="global-disclaimer-banner"
        className="fixed top-0 left-0 right-0 z-100 flex items-center justify-center gap-2 bg-gradient-to-r from-teal to-teal-dark px-4 py-2.5 text-center text-[10.5px] sm:text-xs font-bold tracking-wide text-white shadow-md select-none"
      >
        <AlertCircle className="h-4 w-4 shrink-0" />
        <span>Demo app for educational/hackathon purposes only. Always consult a licensed healthcare professional.</span>
      </div>

      {/* Structural layout padding to offset the fixed banner height */}
      <div className="pt-10">

        {/* View Routing Structure */}
        {currentView === "landing" && (
          <div className="animate-fadeIn">
            {/* Standard landing Header Navbar */}
            <Navbar 
              onStartConsultation={() => handleStartConsultation("Dr. General")}
              user={authUser}
              onNavigateToDashboard={() => setCurrentView("dashboard")}
              onNavigateToAuth={() => setCurrentView("auth")}
              onNavigateToLanding={() => setCurrentView("landing")}
            />

            {/* Main Landing content sheets */}
            <main>
              <HeroSection 
                onStartConsultation={() => handleStartConsultation("Dr. General")} 
                onSeeHowItWorks={() => handleStartConsultation("Dr. General")} 
              />

              {/* Quick interactive visual shortcut preview click banner */}
              <div id="preview-demo" className="py-4 border-y border-slate-200/45 bg-slate-100/10 dark:border-slate-800/20 dark:bg-slate-900/5 flex justify-center">
                <button
                  onClick={() => handleStartConsultation("Dr. General")}
                  className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-teal hover:text-teal-dark dark:text-teal-400 dark:hover:text-teal-350 transition-colors cursor-pointer"
                >
                  <AlertCircle className="h-4 w-4 animate-bounce" /> Click to test simulated voice consultation intake
                </button>
              </div>

              {/* Features section grids */}
              <FeaturesSection />

              {/* Social testimonials section */}
              <TestimonialsSection />
            </main>

            {/* General bottom layout CTA */}
            <FooterCTA onStartConsultation={() => handleStartConsultation("Dr. General")} />
          </div>
        )}

        {currentView === "auth" && (
          <div className="animate-fadeIn">
            <ClerkAuth 
              initialMode="signin"
              onAuthComplete={handleAuthComplete}
              onGoBack={() => setCurrentView("landing")}
            />
          </div>
        )}

        {currentView === "dashboard" && authUser && (
          <div className="animate-fadeIn">
            <Navbar 
              onStartConsultation={() => handleStartConsultation("Dr. General")}
              user={authUser}
              onNavigateToDashboard={() => setCurrentView("dashboard")}
              onNavigateToAuth={() => setCurrentView("auth")}
              onNavigateToLanding={() => setCurrentView("landing")}
            />
            <Dashboard 
              user={authUser}
              onLogOut={handleLogOut}
              onOpenConsultation={(agentName) => handleStartConsultation(agentName)}
              onStartActiveConsultation={handleLaunchActiveConsultation}
            />
          </div>
        )}

        {currentView === "consultation" && activeConsultationDetails && (
          <ActiveConsultationScreen
            doctorName={activeConsultationDetails.doctorName}
            initialSymptoms={activeConsultationDetails.initialSymptoms}
            onClose={() => {
              setCurrentView("dashboard");
              window.history.pushState(null, "", "/dashboard");
              setActiveConsultationDetails(null);
            }}
            onSave={(status, consId) => {
              setSelectedConsultationId(consId);
              setCurrentView("report");
              window.history.pushState(null, "", `/consultation/${consId}/report`);
              setActiveConsultationDetails(null);
            }}
          />
        )}

        {currentView === "report" && selectedConsultationId && (
          <ReportViewScreen
            consultationId={selectedConsultationId}
            onBackToDashboard={() => {
              setCurrentView("dashboard");
              window.history.pushState(null, "", "/dashboard");
              setSelectedConsultationId(null);
            }}
          />
        )}

      </div>

      {/* Modular Interactive Voice Intake Modal */}
      <VoiceDemoModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)}
        selectedAgentName={selectedAgentName}
        onConsultationComplete={handleConsultationComplete}
      />

    </div>
  );
}
