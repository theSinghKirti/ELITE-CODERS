import React, { useState } from "react";
import { Activity, ShieldCheck, Mail, Lock, Sparkles, AlertCircle, ArrowRight } from "lucide-react";
import { motion } from "motion/react";
import { Button } from "./ui/Button";
import { Card, CardHeader, CardContent } from "./ui/Card";
import { Badge } from "./ui/Badge";

interface ClerkAuthProps {
  initialMode?: "signin" | "signup";
  onAuthComplete: (user: { fullName: string; email: string }) => void;
  onGoBack: () => void;
}

export function ClerkAuth({ initialMode = "signin", onAuthComplete, onGoBack }: ClerkAuthProps) {
  const [mode, setMode] = useState<"signin" | "signup">(initialMode);
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [fullName, setFullName] = useState<string>("");
  const [errorText, setErrorText] = useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorText("");

    if (!email || !password) {
      setErrorText("Please complete all requested authentication fields.");
      return;
    }

    if (mode === "signup" && !fullName) {
      setErrorText("Please specify your full name to set up medical directories.");
      return;
    }

    setIsLoading(true);

    // Simulate Clerk verification delay
    setTimeout(() => {
      setIsLoading(false);
      const computedName = mode === "signup" ? fullName : (email.split("@")[0] || "User");
      
      const sessionUser = {
        fullName: computedName.split(" ").map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(" "),
        email: email,
      };

      // Persist locally
      localStorage.setItem("authUser", JSON.stringify(sessionUser));
      onAuthComplete(sessionUser);
    }, 1500);
  };

  const handleGoogleLogin = () => {
    setIsLoading(true);
    setTimeout(() => {
      setIsLoading(false);
      const sessionUser = {
        fullName: "Dr. Alexander Sterling",
        email: "alex.sterling@clinical.org",
      };
      localStorage.setItem("authUser", JSON.stringify(sessionUser));
      onAuthComplete(sessionUser);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-gradient-medical dark:bg-slate-950 flex flex-col items-center justify-center p-6 relative">
      
      {/* Absolute floating background aura */}
      <div className="absolute top-24 left-1/4 w-80 h-80 bg-teal-200/20 dark:bg-teal-500/5 rounded-full blur-3xl" />
      <div className="absolute bottom-24 right-1/4 w-[350px] h-[350px] bg-emerald-200/20 dark:bg-emerald-500/5 rounded-full blur-3xl" />

      {/* Main Wrapper */}
      <div className="relative w-full max-w-md z-10 space-y-6">
        
        {/* Top Centered Brand Logo */}
        <div className="flex flex-col items-center gap-2 cursor-pointer text-center" onClick={onGoBack}>
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-tr from-teal to-emerald text-white shadow-md shadow-teal-500/25">
            <Activity className="h-6 w-6" />
          </div>
          <span className="font-sans text-2xl font-black tracking-tight bg-gradient-to-r from-teal to-emerald bg-clip-text text-transparent">
            MediVoice AI
          </span>
          <p className="text-xs text-slate-450 dark:text-slate-400 font-bold uppercase tracking-wider">
            Clinical Intake Portal
          </p>
        </div>

        {/* Replica Clerk authentication Card layout */}
        <Card className="glass bg-white/80 dark:bg-slate-900/85 backdrop-blur-xl border border-slate-200/60 dark:border-slate-800/80 shadow-2xl rounded-3xl overflow-hidden p-6 sm:p-8">
          
          {/* Replica Clerk top title branding */}
          <div className="text-center space-y-2 mb-6">
            <h2 className="text-xl font-extrabold text-slate-900 dark:text-white">
              {mode === "signin" ? "Sign in to MediVoice" : "Create your account"}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
              Activate secure, HIPAA-compliant patient intake diagnostic tools in second clicks.
            </p>
          </div>

          {/* Social Google OAuth connection mimicking Clerk */}
          <button
            onClick={handleGoogleLogin}
            disabled={isLoading}
            className="w-full flex items-center justify-center gap-3 py-3 px-4 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 dark:bg-slate-950 dark:border-slate-800 dark:hover:bg-slate-900/40 text-sm font-semibold text-slate-700 dark:text-slate-300 transition-colors shadow-xs cursor-pointer enabled:active:scale-[0.98]"
          >
            {/* Minimal google SVG */}
            <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24">
              <path
                fill="#EA4335"
                d="M12.24 10.285V14.4h6.887c-.275 1.565-1.88 4.604-6.887 4.604-4.33 0-7.859-3.579-7.859-8s3.53-8 7.859-8c2.46 0 4.105 1.025 5.047 1.926l3.227-3.103C18.225 1.923 15.42 1 12.24 1 6.033 1 1 6.033 1 12.24s5.033 11.24 11.24 11.24c6.478 0 10.793-4.537 10.793-10.985 0-.737-.08-1.305-.176-1.851h-10.62Z"
              />
            </svg>
            <span>Continue with Google</span>
          </button>

          {/* Separator lines replicating Clerk UI */}
          <div className="relative flex py-4 items-center">
            <div className="flex-grow border-t border-slate-200/70 dark:border-slate-800" />
            <span className="flex-shrink mx-4 text-[10px] text-slate-400 font-black uppercase tracking-widest">or</span>
            <div className="flex-grow border-t border-slate-200/70 dark:border-slate-800" />
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4 text-left">
            
            {/* Error notifications */}
            {errorText && (
              <div className="p-3 bg-red-50 dark:bg-red-950/20 rounded-xl border border-red-500/10 flex items-start gap-2 text-xs text-red-800 dark:text-red-400">
                <AlertCircle className="h-3.5 w-3.5 shrink-0 mt-0.5" />
                <span className="font-semibold">{errorText}</span>
              </div>
            )}

            {/* Name input conditional on signup */}
            {mode === "signup" && (
              <div className="space-y-1.5 animate-fadeIn">
                <label className="text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Full Name
                </label>
                <div className="relative flex items-center">
                  <input
                    type="text"
                    required
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    placeholder="Dr. Jordan Mercer"
                    className="w-full h-11 pl-4 pr-4 rounded-xl border border-slate-200 bg-slate-50 dark:bg-slate-950 dark:border-slate-800 text-sm text-slate-800 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal/30 focus:border-teal transition-all"
                  />
                </div>
              </div>
            )}

            {/* Email field */}
            <div className="space-y-1.5">
              <label className="text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
                Email Address
              </label>
              <div className="relative flex items-center">
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@healthcare.org"
                  className="w-full h-11 pl-4 pr-10 rounded-xl border border-slate-200 bg-slate-50 dark:bg-slate-950 dark:border-slate-800 text-sm text-slate-800 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal/30 focus:border-teal transition-all"
                />
                <Mail className="absolute right-3.5 h-4 w-4 text-slate-400" />
              </div>
            </div>

            {/* Password field */}
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="text-[10px] font-black uppercase tracking-wider text-slate-500 dark:text-slate-400">
                  Security Password
                </label>
              </div>
              <div className="relative flex items-center">
                <input
                  type="password"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="w-full h-11 pl-4 pr-10 rounded-xl border border-slate-200 bg-slate-50 dark:bg-slate-950 dark:border-slate-800 text-sm text-slate-800 dark:text-slate-200 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-teal/30 focus:border-teal transition-all"
                />
                <Lock className="absolute right-3.5 h-4 w-4 text-slate-400" />
              </div>
            </div>

            {/* Submit onboarding */}
            <div className="pt-2">
              <Button
                type="submit"
                disabled={isLoading}
                className="w-full h-11 bg-teal hover:bg-teal-dark font-sans font-bold flex items-center justify-center gap-1.5 rounded-xl text-white shadow-md active:scale-95"
              >
                {isLoading ? "Synchronizing Credentials..." : (
                  <>
                    {mode === "signin" ? "Sign In" : "Register Credentials"}
                    <ArrowRight className="h-4 w-4" />
                  </>
                )}
              </Button>
            </div>
          </form>

          {/* Footer toggle screen helper links */}
          <div className="mt-6 text-center text-xs">
            {mode === "signin" ? (
              <span className="text-slate-400 font-semibold">
                Don't have an account?{" "}
                <button
                  onClick={() => setMode("signup")}
                  className="text-teal font-extrabold hover:underline cursor-pointer"
                >
                  Create one now
                </button>
              </span>
            ) : (
              <span className="text-slate-400 font-semibold">
                Already registered?{" "}
                <button
                  onClick={() => setMode("signin")}
                  className="text-teal font-extrabold hover:underline cursor-pointer"
                >
                  Sign in here
                </button>
              </span>
            )}
          </div>

        </Card>

        {/* Security / HIPAA badge */}
        <div className="flex items-center justify-center gap-1.5 text-slate-400 text-[10px] uppercase tracking-widest font-black select-none">
          <ShieldCheck className="h-4.5 w-4.5 text-emerald-500" /> HIPAA Secure Encryption Node
        </div>

      </div>
    </div>
  );
}
