import React from "react";
import { motion } from "motion/react";

interface ReportSectionProps {
  title: string;
  icon: React.ReactNode;
  borderColor: string; // Tailwind class e.g. 'border-teal-500'
  children: React.ReactNode;
}

export function ReportSection({ title, icon, borderColor, children }: ReportSectionProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className={`bg-white dark:bg-slate-900 shadow-sm rounded-2xl p-5 sm:p-6 border-l-4 ${borderColor} transition-all duration-300 hover:shadow-md border border-slate-200/50 dark:border-slate-800/40`}
    >
      <div className="flex items-center gap-3 mb-4 select-none">
        <div className="p-2 bg-slate-50 dark:bg-slate-800/60 rounded-xl text-slate-700 dark:text-slate-350 shrink-0">
          {icon}
        </div>
        <h3 className="font-sans font-bold text-base sm:text-lg text-slate-900 dark:text-slate-100 tracking-tight">
          {title}
        </h3>
      </div>
      <div className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-sans">
        {children}
      </div>
    </motion.div>
  );
}
