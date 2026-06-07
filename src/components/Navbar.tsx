import { useState, useEffect } from "react";
import { Activity, Moon, Sun, ArrowRight, ShieldCheck } from "lucide-react";
import { Button } from "./ui/Button";

interface NavbarProps {
  onStartConsultation: () => void;
  user?: { fullName: string; email: string } | null;
  onNavigateToDashboard?: () => void;
  onNavigateToAuth?: () => void;
  onNavigateToLanding?: () => void;
}

export function Navbar({ onStartConsultation, user, onNavigateToDashboard, onNavigateToAuth, onNavigateToLanding }: NavbarProps) {
  const [isDark, setIsDark] = useState<boolean>(false);

  useEffect(() => {
    // Check local storage or system preferences on mount
    const savedTheme = localStorage.getItem("theme");
    const prefersDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    
    if (savedTheme === "dark" || (!savedTheme && prefersDark)) {
      setIsDark(true);
      document.documentElement.classList.add("dark");
    } else {
      setIsDark(false);
      document.documentElement.classList.remove("dark");
    }
  }, []);

  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
      setIsDark(false);
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setIsDark(true);
    }
  };

  const scrollToSection = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b border-black/5 bg-white/70 dark:bg-slate-950/70 dark:border-white/5 backdrop-blur-md transition-colors duration-300">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-6 lg:px-8">
        {/* Logo */}
        <div 
          className="flex items-center gap-2.5 cursor-pointer" 
          onClick={() => {
            if (onNavigateToLanding) {
              onNavigateToLanding();
            } else {
              window.scrollTo({ top: 0, behavior: "smooth" });
            }
          }}
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-teal to-emerald text-white shadow-md shadow-teal-500/20">
            <Activity className="h-5 w-5" />
          </div>
          <span className="font-sans text-xl font-extrabold tracking-tight bg-gradient-to-r from-teal to-emerald dark:from-teal-400 dark:to-emerald-400 bg-clip-text text-transparent">
            MediVoice AI
          </span>
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-600 dark:text-slate-300">
          <button 
            onClick={() => scrollToSection("features")} 
            className="hover:text-teal transition-colors cursor-pointer"
          >
            Features
          </button>
          <button 
            onClick={() => scrollToSection("preview-demo")} 
            className="hover:text-teal transition-colors cursor-pointer"
          >
            Interactive Demo
          </button>
          <button 
            onClick={() => scrollToSection("testimonials")} 
            className="hover:text-teal transition-colors cursor-pointer"
          >
            Testimonials
          </button>
          <span className="flex items-center gap-1.5 text-emerald font-semibold bg-emerald-500/10 px-2.5 py-1 rounded-full text-xs">
            <ShieldCheck className="h-3.5 w-3.5" /> HIPAA Compliant
          </span>
        </nav>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          {/* Theme Switcher */}
          <button
            onClick={toggleTheme}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-slate-200 bg-white/80 dark:bg-slate-900/80 dark:border-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer shadow-sm transition-all"
            aria-label="Toggle theme"
          >
            {isDark ? (
              <Sun className="h-4 w-4 text-emerald" />
            ) : (
              <Moon className="h-4 w-4 text-teal" />
            )}
          </button>

          {user ? (
            <Button 
              variant="teal" 
              size="sm"
              onClick={onNavigateToDashboard}
              className="inline-flex items-center gap-1.5"
            >
              Open Console <ArrowRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button 
              variant="outline" 
              size="sm"
              onClick={onNavigateToAuth}
              className="inline-flex items-center gap-1.5 font-bold"
            >
              Sign In
            </Button>
          )}
        </div>
      </div>
    </header>
  );
}
