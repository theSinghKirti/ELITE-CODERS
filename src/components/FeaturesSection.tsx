import { motion } from "motion/react";
import { Mic, Brain, FileText, Sparkles, Activity, ShieldCheck } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription } from "./ui/Card";

export function FeaturesSection() {
  const cards = [
    {
      title: "Real-Time Voice",
      description: "Speak naturally as if talking to a physical practitioner, and receive immediate vocalized and visual triage guidance.",
      icon: Mic,
      gradient: "from-teal/20 to-teal/5 text-teal",
    },
    {
      title: "Smart Diagnosis Aid",
      description: "Advanced symptom-mapping engine provides smart clinical aid routing, analyzing over 1,500 distinct medical entities.",
      icon: Brain,
      gradient: "from-emerald/20 to-emerald/5 text-emerald",
    },
    {
      title: "Detailed Reports",
      description: "Instantly draft highly structured clinical summaries and consultations ready to bring straight to your next physical checkup.",
      icon: FileText,
      gradient: "from-teal/20 to-teal/5 text-teal",
    },
  ];

  const headerVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  const gridVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
      },
    },
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 25 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 100, damping: 15 },
    },
  };

  return (
    <section id="features" className="relative py-20 lg:py-28 overflow-hidden">
      {/* Background visual helpers */}
      <div className="absolute right-0 top-1/4 h-80 w-80 rounded-full bg-emerald-500/5 blur-3xl" />
      <div className="absolute left-0 bottom-1/8 h-80 w-80 rounded-full bg-teal-500/5 blur-3xl" />

      <div className="relative mx-auto max-w-7xl px-6 lg:px-8">
        
        {/* Section Header */}
        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          variants={headerVariants}
          className="mx-auto max-w-2xl text-center mb-16 space-y-4"
        >
          <div className="inline-flex items-center gap-1.5 rounded-full bg-teal-500/10 px-4 py-1 text-xs font-semibold uppercase tracking-wider text-teal-600 dark:text-teal-400">
            <Activity className="h-3.5 w-3.5" /> High Performance Clinical AI
          </div>
          <h2 className="text-3xl font-extrabold tracking-tight sm:text-4xl text-slate-900 dark:text-white font-sans">
            Why Choose MediVoice AI?
          </h2>
          <p className="text-base text-slate-600 dark:text-slate-400 font-medium">
            We merge semantic voice parsing with verified emergency triage protocols to deliver an elite patient intake companion.
          </p>
        </motion.div>

        {/* Features Card Grid */}
        <motion.div
          variants={gridVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-100px" }}
          className="mx-auto grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 max-w-5xl"
        >
          {cards.map((card, idx) => {
            const IconComponent = card.icon;
            return (
              <motion.div
                key={idx}
                variants={cardVariants}
                whileHover={{ y: -8, transition: { duration: 0.2 } }}
                className="group relative"
              >
                {/* Visual glow on hover */}
                <div className="absolute -inset-px rounded-2xl bg-gradient-to-tr from-teal to-emerald opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-xs" />
                
                {/* Core Card with Glassmorphic styling rules from theme */}
                <Card className="glass relative h-full group-hover:bg-white/80 dark:group-hover:bg-slate-900/80 shadow-lg group-hover:shadow-xl ring-1 ring-teal-500/5 dark:ring-teal-500/20 transition-all duration-300 rounded-2xl">
                  <CardHeader className="space-y-4">
                    {/* Icon container */}
                    <div className={`flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br ${card.gradient} shadow-xs border border-teal-500/10 group-hover:scale-105 transition-transform duration-300`}>
                      <IconComponent className="h-6 w-6" />
                    </div>

                    <CardTitle className="text-lg font-bold text-slate-900 dark:text-white group-hover:text-teal transition-colors">
                      {card.title}
                    </CardTitle>

                    <CardDescription className="text-slate-655 text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                      {card.description}
                    </CardDescription>
                  </CardHeader>

                  {/* Aesthetic card corner highlight */}
                  <div className="absolute bottom-4 right-4 text-[10px] uppercase font-bold text-slate-350 dark:text-slate-700 tracking-widest flex items-center gap-1 select-none">
                    <ShieldCheck className="h-3 w-3 text-emerald-500/55" /> Secured
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
