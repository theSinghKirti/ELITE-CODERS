"use client";

import React, { useState, useEffect } from "react";
import { getConsultations } from "../actions/consultation";
import { Stethoscope, Calendar, HeartPulse, Activity, Sparkles, Video, User } from "lucide-react";
import Link from "next/link";
import { Badge } from "../../src/components/ui/Badge";
import { Card } from "../../src/components/ui/Card";

export default function DashboardPage() {
  const [userId, setUserId] = useState<string>("guest@demo.com");
  const [history, setHistory] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Attempt to grab any stored user context
    try {
      const stored = localStorage.getItem("authUser");
      if (stored) {
        const u = JSON.parse(stored);
        if (u.email) setUserId(u.email);
      }
    } catch (e) {
      // ignore
    }

    async function load() {
      setIsLoading(true);
      try {
        const list = await getConsultations(userId);
        setHistory(list || []);
      } catch (err) {
        console.error("Failed to fetch custom consultation lists:", err);
      } finally {
        setIsLoading(false);
      }
    }
    load();
  }, [userId]);

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-8 text-left font-sans">
      
      {/* Upper greetings */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            MediVoice Active Console
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold mt-1">
            Secure HIPAA Consultation Node (ID: {userId})
          </p>
        </div>

        <Link
          href="/dashboard/new-consultation"
          className="inline-flex items-center gap-2 px-5 py-3 h-11 text-xs font-black uppercase tracking-wider rounded-xl bg-teal text-white shadow-md hover:shadow-lg hover:active:scale-95 transition-all text-center"
        >
          <Sparkles className="h-4 w-4" /> Start New Consultation
        </Link>
      </div>

      {/* Main grids */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left main: Consultation History */}
        <div className="lg:col-span-2 space-y-6">
          <div className="flex items-center justify-between bg-slate-100/50 p-4 rounded-2xl">
            <h2 className="text-sm font-black uppercase tracking-wider text-slate-650 dark:text-slate-300 flex items-center gap-2">
              <Activity className="h-4 w-4 text-teal" /> Recent Consultation Audits
            </h2>
            <span className="text-[10px] font-bold text-slate-400 capitalize">{history.length} Saved</span>
          </div>

          {isLoading ? (
            <div className="p-12 text-center text-xs text-slate-400 font-bold space-y-2">
              <div className="h-5 w-5 rounded-full border-2 border-teal border-t-transparent animate-spin mx-auto" />
              <span>Querying relational history channels...</span>
            </div>
          ) : history.length === 0 ? (
            <Card className="p-12 border-dashed border-slate-200 dark:border-slate-800 text-center flex flex-col items-center justify-center space-y-4">
              <div className="p-4 bg-slate-50 dark:bg-slate-950 rounded-full">
                <Stethoscope className="h-8 w-8 text-teal" />
              </div>
              <div className="max-w-xs space-y-1">
                <p className="text-sm font-extrabold text-slate-800 dark:text-slate-200">
                  No consultation records registered
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-semibold leading-relaxed">
                  Start your very first symptomatology analysis to index diagnostic profiles here.
                </p>
              </div>
            </Card>
          ) : (
            <div className="space-y-4">
              {history.map((item) => (
                <Card key={item.id} className="p-5 border-slate-150 rounded-2xl bg-white dark:bg-slate-900 flex flex-col sm:flex-row justify-between items-start gap-4">
                  <div className="space-y-2 text-left flex-1">
                    <div className="flex items-center gap-2">
                      <Badge variant="teal" className="text-[10.5px] uppercase font-black tracking-wide">
                        {item.doctorType}
                      </Badge>
                      <span className="text-xs text-slate-400 font-bold flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(item.createdAt).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric"
                        })}
                      </span>
                      <span className={`text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                        item.status === "completed" 
                          ? "bg-emerald-50 text-emerald-700 border-emerald-200/50" 
                          : "bg-amber-50 text-amber-700 border-amber-200/50 animate-pulse"
                      }`}>
                        {item.status}
                      </span>
                    </div>

                    <p className="text-xs text-slate-700 dark:text-slate-200 font-medium italic select-none">
                      "{item.symptoms}"
                    </p>

                    <div className="bg-slate-50 dark:bg-slate-950 p-3.5 rounded-xl border border-slate-150/40 space-y-2 text-xs">
                      <span className="text-[9px] uppercase tracking-wider font-extrabold text-teal block">Diagnosis Summary</span>
                      <p className="text-slate-650 dark:text-slate-350 leading-relaxed font-semibold">
                        {item.summary || "Pending clinical audio intake recording."}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>

        {/* Right side: Clinical statistics */}
        <div className="space-y-6">
          <Card className="p-6 bg-slate-50/50 border-slate-250/20 rounded-3xl space-y-4 text-left">
            <h3 className="text-sm font-black uppercase tracking-wider text-slate-800 dark:text-neutral-200 flex items-center gap-1.5">
              <HeartPulse className="h-4.5 w-4.5 text-teal" /> Medical Guidelines
            </h3>
            <p className="text-xs text-slate-500 leading-relaxed font-semibold">
              All records generated pass end-to-end TLS encryption channels. Share diagnostic files and advice reports detailing recommended next actions with your real physician today.
            </p>
            <div className="border-t border-slate-200/50 pt-4 space-y-2.5 text-xs font-semibold">
              <div className="flex justify-between items-center">
                <span className="text-slate-400">HIPAA Compliant</span>
                <span className="text-emerald-500 font-black">ACTIVE</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-slate-400">Database Connection</span>
                <span className="text-teal font-black">Neon relational postgres</span>
              </div>
            </div>
          </Card>
        </div>

      </div>

    </div>
  );
}
