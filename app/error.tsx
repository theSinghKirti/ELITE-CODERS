"use client";

import React, { useEffect } from "react";
import { RefreshCcw, ShieldAlert, HeartCrack } from "lucide-react";
import { Button } from "../src/components/ui/Button";

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorBoundary({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error("❌ Root application error captured:", error);
  }, [error]);

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex flex-col items-center justify-center p-4 text-center font-sans">
      <div className="max-w-md w-full space-y-6 bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-850 p-8 rounded-3xl shadow-xl">
        
        <div className="mx-auto h-16 w-16 bg-rose-500/10 text-rose-500 rounded-full flex items-center justify-center">
          <HeartCrack className="h-8 w-8 animate-bounce text-rose-500" />
        </div>

        <div className="space-y-2">
          <span className="text-[10px] font-black uppercase text-rose-500 bg-rose-500/11 px-3 py-1 rounded-full tracking-wider">
            SYSTEM INGESTION ERRORED
          </span>
          <h1 className="text-2xl font-black text-slate-850 dark:text-white tracking-tight">
            Consultation Encountered an Issue
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed font-semibold">
            An unexpected error occurred during audio processing or AI parsing. You may try to re-initialize your session.
          </p>
          {error.message && (
            <div className="p-3 bg-red-50 dark:bg-red-950/20 text-red-700 dark:text-red-400 text-[11px] font-mono rounded-lg border border-red-500/10 max-h-24 overflow-y-auto">
              {error.message}
            </div>
          )}
        </div>

        <div className="pt-2 flex flex-col gap-2">
          <Button
            variant="destructive"
            onClick={() => reset()}
            className="w-full h-11 text-xs font-black uppercase tracking-widest flex items-center justify-center gap-2 rounded-xl text-white shadow-md shadow-rose-500/10"
          >
            <RefreshCcw className="h-4 w-4 animate-spin" /> Restart Session Encounter
          </Button>
          <button
            onClick={() => {
              window.location.href = "/";
            }}
            className="text-xs font-black text-slate-450 hover:text-teal py-2.5 transition-colors uppercase tracking-wider"
          >
            Return to Landing Portal
          </button>
        </div>

      </div>
    </div>
  );
}
