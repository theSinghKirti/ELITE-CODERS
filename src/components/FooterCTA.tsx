import { Activity, ShieldCheck, HeartPulse } from "lucide-react";
import { Button } from "./ui/Button";

interface FooterCTAProps {
  onStartConsultation: () => void;
}

export function FooterCTA({ onStartConsultation }: FooterCTAProps) {
  return (
    <footer className="w-full bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      
      {/* Banner Callout Container */}
      <div className="mx-auto max-w-5xl px-6 lg:px-8 py-16">
        
        {/* Teal gradient banner: "Ready to talk to an AI doctor?" */}
        <div className="relative overflow-hidden rounded-3xl bg-linear-to-tr from-teal to-emerald dark:from-teal-dark dark:to-emerald-700 px-6 py-12 text-center shadow-xl sm:px-12 md:py-16 text-white">
          
          {/* Subtle decorative grid overlay and circles */}
          <div className="absolute inset-0 bg-grid-pattern opacity-10" />
          <div className="absolute -left-10 -bottom-10 h-40 w-40 bg-white/10 rounded-full blur-2xl" />
          <div className="absolute -right-10 -top-10 h-40 w-40 bg-white/10 rounded-full blur-2xl" />

          <div className="relative mx-auto max-w-xl space-y-5 z-10 flex flex-col items-center">
            
            {/* Center icon */}
            <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 backdrop-blur-md border border-white/20 select-none">
              <HeartPulse className="h-6 w-6 text-white" />
            </div>

            <h3 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-white font-sans">
              Ready to talk to an AI doctor?
            </h3>
            
            <p className="text-sm sm:text-base text-teal-50 font-medium leading-relaxed max-w-md mx-auto">
              Access secure, instant symptom-management guidance and receive detailed diagnostic consult reports in seconds.
            </p>

            <div className="pt-4">
              <Button
                variant="default"
                size="lg"
                onClick={onStartConsultation}
                className="w-full sm:w-auto h-12 bg-white text-teal hover:bg-slate-50 font-bold active:scale-[0.98] transition-transform shadow-lg shadow-black/10 rounded-full cursor-pointer"
              >
                Get Started Free
              </Button>
            </div>
          </div>
        </div>

        {/* Corporate Legal & Compliance Footer section */}
        <div className="mt-16 pt-8 border-t border-slate-200 dark:border-slate-900 flex flex-col md:flex-row items-center justify-between gap-6">
          
          {/* Branding */}
          <div className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-teal text-white">
              <Activity className="h-4 w-4" />
            </div>
            <span className="font-sans font-bold text-slate-800 dark:text-slate-200 text-sm tracking-tight">
              MediVoice AI
            </span>
            <span className="text-xs text-slate-400">© 2026 MediVoice AI Inc. All rights reserved.</span>
          </div>

          {/* Links and HIPAA Statement */}
          <div className="flex flex-col md:flex-row items-center gap-4 text-xs font-semibold text-slate-500 dark:text-slate-400">
            <span className="flex items-center gap-1 text-emerald-500">
              <ShieldCheck className="h-3.5 w-3.5" /> HIPAA Compliant Security Standard
            </span>
            <span className="hidden md:inline">|</span>
            <a href="#" className="hover:text-teal transition-colors">Privacy Statement</a>
            <a href="#" className="hover:text-teal transition-colors">Usage Terms</a>
            <a href="#" className="hover:text-teal transition-colors">Patient Ethics</a>
          </div>
        </div>

        {/* Strict Medical Liability Disclaimer */}
        <div className="mt-8 p-4 rounded-xl bg-slate-100 dark:bg-slate-900/60 border border-slate-200/50 dark:border-slate-800/40 text-center text-[10px] text-slate-450 text-slate-500 dark:text-slate-400 leading-relaxed font-semibold">
          <strong>LEGAL DISCLAIMER:</strong> MediVoice AI is an educational technology demonstration and clinical informational utility. It is NOT equipped to evaluate medical emergencies, diagnose physical diseases, or prescribe drug therapies. Under no circumstances should this software replace advice from a licensed medical professional. If you are experiencing a life-threatening health instance, please dial emergency services immediately (911/112).
        </div>

      </div>
    </footer>
  );
}
