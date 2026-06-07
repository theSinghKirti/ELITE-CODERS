import { motion } from "motion/react";
import { Mic, ArrowRight, Play, Sparkles, HeartPulse, CheckCircle } from "lucide-react";
import { Button } from "./ui/Button";
import { Badge } from "./ui/Badge";

interface HeroSectionProps {
  onStartConsultation: () => void;
  onSeeHowItWorks: () => void;
}

export function HeroSection({ onStartConsultation, onSeeHowItWorks }: HeroSectionProps) {
  // Framer Motion Animation Variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 18,
      },
    },
  };

  return (
    <section className="relative flex min-h-[calc(100vh-4rem)] items-center justify-center overflow-hidden py-12 lg:py-20">
      {/* Subtle Grid and Gradient Backgrounds */}
      <div className="absolute inset-0 bg-grid-pattern opacity-100" />
      
      {/* Light Mode subtle radial gradient */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--color-teal-500\/5)_0%,_transparent_65%)] dark:hidden" />
      
      {/* Dark Mode subtle gradient overlay */}
      <div className="absolute inset-0 hidden dark:block bg-[radial-gradient(circle_at_center,_rgba(20,184,166,0.06)_0%,_transparent_70%)]" />

      {/* Floating decorative blurred safety/glow circles */}
      <div className="absolute -left-12 -top-12 h-72 w-72 rounded-full bg-teal-500/10 blur-3xl dark:bg-teal-500/5" />
      <div className="absolute -right-16 bottom-16 h-80 w-80 rounded-full bg-emerald-500/10 blur-3xl dark:bg-emerald-500/5" />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* Column 1: Copy/CTA Text (grows to 7 cols on large screens) */}
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="lg:col-span-7 space-y-6 text-center lg:text-left z-10"
          >
            {/* Animated Floating Badge */}
            <motion.div variants={itemVariants} className="inline-block">
              <motion.div
                animate={{ y: [0, -4, 0] }}
                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                className="inline-flex items-center gap-1.5 rounded-full bg-teal-500/10 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-teal-600 dark:text-teal-400 border border-teal-500/20"
              >
                <Sparkles className="h-3.5 w-3.5 text-emerald animate-pulse" />
                AI-Powered Medical Assistant
              </motion.div>
            </motion.div>

            {/* H1 Heading with gradient text */}
            <motion.h1
              variants={itemVariants}
              className="text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl text-slate-900 dark:text-white font-sans leading-[1.1]"
            >
              Talk to an AI Doctor. <br />
              <span className="bg-gradient-to-r from-teal to-emerald dark:from-teal-400 dark:to-emerald-400 bg-clip-text text-transparent">
                Get Instant Guidance.
              </span>
            </motion.h1>

            {/* Subtext description */}
            <motion.p
              variants={itemVariants}
              className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-xl mx-auto lg:mx-0 leading-relaxed font-medium"
            >
              Describe your symptoms naturally. Get evidence-based guidance in seconds using our secure clinical AI interface.
            </motion.p>

            {/* CTAs */}
            <motion.div
              variants={itemVariants}
              className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4 pt-4"
            >
              <Button
                variant="teal"
                size="lg"
                onClick={onStartConsultation}
                className="w-full sm:w-auto h-13 shadow-lg shadow-teal-500/20 hover:shadow-teal-500/30 font-bold"
              >
                Start Free Consultation
              </Button>
              <Button
                variant="outline"
                size="lg"
                onClick={onSeeHowItWorks}
                className="w-full sm:w-auto h-13 border-slate-200 dark:border-slate-800 flex items-center justify-center gap-2 text-slate-700 dark:text-slate-300 font-bold"
              >
                <Play className="h-4 w-4 fill-current text-teal" /> See How It Works
              </Button>
            </motion.div>

            {/* Confidence metric tags */}
            <motion.div
              variants={itemVariants}
              className="flex flex-wrap justify-center lg:justify-start gap-y-2 gap-x-6 pt-6 border-t border-slate-200/50 dark:border-slate-800/50"
            >
              <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider">
                <CheckCircle className="h-4 w-4 text-teal" /> Instant Triage Logic
              </div>
              <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider">
                <CheckCircle className="h-4 w-4 text-teal" /> HIPAA Secured Node
              </div>
              <div className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 font-semibold uppercase tracking-wider">
                <CheckCircle className="h-4 w-4 text-teal" /> Free Educational Tool
              </div>
            </motion.div>
          </motion.div>

          {/* Column 2: Dashboard Visual Mockup with Floating elements */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 70, damping: 20, delay: 0.4 }}
            className="lg:col-span-5 relative w-full flex justify-center z-10"
          >
            {/* Background glowing aura effect */}
            <div className="absolute inset-0 bg-gradient-to-tr from-teal/10 to-emerald/10 blur-2xl rounded-3xl" />

            {/* High fidelity console container mockup */}
            <div className="relative w-full max-w-[420px] rounded-3xl border border-slate-200/80 bg-white/80 p-6 shadow-xl dark:border-slate-800/80 dark:bg-slate-900/80 backdrop-blur-xl transition-all duration-300">
              
              {/* Card Title Header with active signal */}
              <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-gradient-b dark:border-slate-800/50">
                <div className="flex items-center gap-2">
                  <div className="h-2.5 w-2.5 rounded-full bg-emerald animate-pulse-glow" />
                  <span className="text-xs uppercase tracking-wider font-extrabold text-slate-500 dark:text-slate-400">
                    Vocal Symptom Intake
                  </span>
                </div>
                <Badge variant="teal" className="lowercase">v1.2-live</Badge>
              </div>

              {/* Consultation simulation area */}
              <div className="py-6 space-y-4">
                <div className="rounded-2xl bg-slate-55 bg-slate-100/50 dark:bg-slate-950/40 p-4 border border-slate-100 dark:border-slate-800/40">
                  <span className="text-[10px] font-bold text-teal block uppercase tracking-wider mb-1">
                    MediVoice Assistant
                  </span>
                  <p className="text-sm font-semibold text-slate-800 dark:text-slate-200 leading-relaxed">
                    "Please tap the microphone button below and describe whatever health discomfort or symptoms you are experiencing..."
                  </p>
                </div>

                {/* Simulated Waveform Visual */}
                <div className="flex items-center justify-center gap-1.5 h-16 w-full rounded-2xl bg-teal-500/[0.02] border border-dashed border-teal-500/10 px-4 py-3">
                  {[6, 12, 22, 14, 30, 42, 28, 38, 16, 26, 8, 12, 24, 10, 6, 14].map((h, i) => (
                    <motion.div
                      key={i}
                      style={{ height: `${h}px` }}
                      animate={{ height: [h-3, h+4, h-3] }}
                      transition={{ repeat: Infinity, duration: 1.5 + (i % 3) * 0.2, ease: "easeInOut" }}
                      className="bg-teal opacity-70 rounded-full w-[3px]"
                    />
                  ))}
                </div>
              </div>

              {/* Mic Area showcasing pulse-glow */}
              <div className="flex flex-col items-center justify-center space-y-3 pb-2 pt-2">
                <div className="relative">
                  {/* Subtle pulsing background glow using the 'pulse-glow' animation */}
                  <div className="absolute inset-0 rounded-full bg-teal/20 blur-lg opacity-75 animate-pulse-glow" />
                  <button
                    onClick={onStartConsultation}
                    className="relative flex h-16 w-16 items-center justify-center rounded-full bg-linear-to-tr from-teal to-emerald text-white shadow-lg animate-pulse-glow hover:shadow-xl hover:scale-105 active:scale-95 transition-all cursor-pointer z-10"
                    aria-label="Activate voice consultation simulator"
                  >
                    <Mic className="h-7 w-7" />
                  </button>
                </div>
                <span className="text-xs font-bold text-slate-500 dark:text-slate-400">
                  Click to start voice demo
                </span>
              </div>
            </div>

            {/* Mini floating elements for depth */}
            <motion.div
              animate={{ y: [0, -6, 0] }}
              transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut" }}
              className="absolute -top-6 -left-6 hidden md:flex items-center gap-2 rounded-2xl bg-white border border-slate-200 p-3 shadow-md dark:bg-slate-950 dark:border-slate-800 z-20"
            >
              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-500/10 text-emerald">
                <HeartPulse className="h-4.5 w-4.5" />
              </div>
              <div className="text-left">
                <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wide">Live Analysis</div>
                <div className="text-xs font-bold text-slate-800 dark:text-slate-200">98.2% Accurate Triage</div>
              </div>
            </motion.div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
