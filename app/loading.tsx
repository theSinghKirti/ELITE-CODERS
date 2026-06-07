"use client";

import React from "react";
import { Activity, Star } from "lucide-react";

export default function Loading() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-4 text-center font-sans">
      <div className="relative flex flex-col items-center justify-center space-y-4">
        {/* Animated glowing halos behind */}
        <div className="absolute inset-0 h-28 w-28 bg-teal-500/10 dark:bg-teal-500/5 rounded-full blur-2xl animate-pulse" />
        
        {/* Main circular spinning track */}
        <div className="relative h-16 w-16 flex items-center justify-center">
          <div className="absolute inset-0 rounded-full border-4 border-slate-205 dark:border-slate-800" />
          <div className="absolute inset-0 rounded-full border-4 border-t-teal border-r-transparent animate-spin" />
          <Activity className="h-6 w-6 text-teal animate-pulse" />
        </div>

        {/* Informative text signals */}
        <div className="space-y-1">
          <p className="text-xs font-black uppercase text-teal tracking-widest">
            MediVoice AI
          </p>
          <p className="text-[10.5px] text-slate-400 font-extrabold animate-pulse">
            Configuring HIPAA consultation console...
          </p>
        </div>
      </div>
    </div>
  );
}
