"use client";

import React from "react";
import { MoveLeft, HelpCircle, HeartPulse, Stethoscope } from "lucide-react";
import { Button } from "../src/components/ui/Button";

export default function NotFound() {
  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-4 text-center font-sans">
      <div className="max-w-md w-full space-y-6 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-850 p-8 rounded-3xl shadow-xl relative overflow-hidden">
        {/* Abstract floating lights behind */}
        <div className="absolute -top-10 -right-10 w-24 h-24 bg-teal/10 rounded-full blur-2xl" />
        <div className="absolute -bottom-10 -left-10 w-24 h-24 bg-emerald-500/10 rounded-full blur-2xl" />

        <div className="mx-auto h-16 w-16 bg-rose-500/10 text-rose-500 rounded-full flex items-center justify-center mb-2">
          <Stethoscope className="h-8 w-8 animate-pulse text-teal" />
        </div>

        <div className="space-y-2">
          <span className="text-[10px] font-black uppercase text-teal bg-teal-500/11 px-3 py-1 rounded-full tracking-wider">
            404 NOT FOUND ERROR
          </span>
          <h1 className="text-2xl font-black text-slate-850 dark:text-white tracking-tight">
            Consultation Channel Lost
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-450 leading-relaxed font-semibold">
            The page clinical endpoint or diagnostic report node you requested does not exist or has been archived securely.
          </p>
        </div>

        <div className="pt-2 flex flex-col gap-2">
          <Button
            variant="teal"
            onClick={() => {
              window.location.href = "/";
            }}
            className="w-full h-11 text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 rounded-xl text-white shadow-md shadow-teal-500/10"
          >
            <MoveLeft className="h-4 w-4" /> Go Back Home
          </Button>
          <button
            onClick={() => {
              window.location.href = "/dashboard";
            }}
            className="text-xs font-black text-slate-450 hover:text-teal py-2.5 transition-colors uppercase tracking-wider"
          >
            Access Dashboard Console
          </button>
        </div>
      </div>
    </div>
  );
}
