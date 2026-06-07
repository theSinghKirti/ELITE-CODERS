import React from "react";
import { type LucideIcon, Lock, Unlock, Sparkles, AlertCircle } from "lucide-react";
import { motion } from "motion/react";
import { Card, CardHeader, CardContent } from "./ui/Card";
import { Badge } from "./ui/Badge";
import { Button } from "./ui/Button";

export interface DoctorAgent {
  id: string;
  name: string;
  specialty: string;
  isUnlocked: boolean;
  avatarInitials: string;
  badgeText: string;
  avatarColor: string;
  statusText: string;
  description: string;
}

export interface DoctorAgentCardProps {
  key?: string;
  agent: DoctorAgent;
  onSelect: () => void;
  onUpgrade: () => void;
}

export function DoctorAgentCard({ agent, onSelect, onUpgrade }: DoctorAgentCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={agent.isUnlocked ? { scale: 1.02, y: -4 } : {}}
      transition={{ type: "spring", stiffness: 100, damping: 15 }}
      className="relative group h-full"
    >
      <Card
        className={`glass h-full flex flex-col justify-between overflow-hidden transition-all duration-300 rounded-2xl border ${
          agent.isUnlocked
            ? "border-slate-200/50 dark:border-slate-800/80 hover:shadow-lg dark:hover:bg-slate-900/40"
            : "border-slate-200/20 dark:border-slate-900 bg-slate-100/10 dark:bg-slate-800/5 opacity-75 filter grayscale-[30%] select-none"
        }`}
      >
        <CardContent className="p-5 flex-1 flex flex-col justify-between">
          <div>
            {/* Top Row: Avatar & Status/Badge */}
            <div className="flex items-start justify-between mb-4">
              {/* Avatar circle */}
              <div
                className={`flex h-11 w-11 items-center justify-center rounded-xl font-bold text-sm text-white shadow-sm ${agent.avatarColor}`}
              >
                {agent.avatarInitials}
              </div>

              {/* Status Badge */}
              {agent.isUnlocked ? (
                <Badge variant="teal" className="text-[10px] tracking-wide font-extrabold uppercase">
                  {agent.badgeText}
                </Badge>
              ) : (
                <Badge variant="secondary" className="text-[10px] tracking-wide font-extrabold flex items-center gap-1 uppercase bg-slate-100/80 text-slate-500">
                  <Lock className="h-2.5 w-2.5" /> LOCKED
                </Badge>
              )}
            </div>

            {/* Title Specialty */}
            <div className="space-y-1">
              <h4 className="font-sans text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-1.5">
                {agent.name}
                {agent.isUnlocked && (
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald animate-pulse" />
                )}
              </h4>
              <p className="text-xs font-bold text-teal dark:text-teal-400">
                {agent.specialty}
              </p>
            </div>

            {/* Description */}
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-2.5 leading-relaxed font-semibold">
              {agent.description}
            </p>
          </div>

          {/* Action Row */}
          <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800/50 flex items-center justify-between">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">
              {agent.statusText}
            </span>

            {agent.isUnlocked ? (
              <Button
                variant="teal"
                size="sm"
                onClick={onSelect}
                className="h-8 py-1 px-4.5 text-xs font-bold font-sans rounded-full hover:shadow-md"
              >
                Consult
              </Button>
            ) : (
              <Button
                variant="outline"
                size="sm"
                onClick={onUpgrade}
                className="h-8 py-1 px-4.5 text-xs font-bold font-sans rounded-full bg-amber-500/10 border-amber-500/20 text-amber-600 dark:text-amber-400 hover:bg-amber-500/25 transition-all text-[11px]"
              >
                Unlock
              </Button>
            )}
          </div>
        </CardContent>

        {/* Lock Overlay Shield for Locked Specialists */}
        {!agent.isUnlocked && (
          <div className="absolute inset-0 bg-slate-950/15 dark:bg-slate-950/40 backdrop-blur-xs flex flex-col items-center justify-center p-4 text-center z-10 transition-opacity group-hover:bg-slate-950/20">
            <div className="bg-slate-900/90 border border-slate-800 text-white rounded-full p-2.5 shadow-md mb-2">
              <Lock className="h-4.5 w-4.5 text-amber-500 animate-pulse" />
            </div>
            <p className="text-[11px] font-extrabold text-slate-900 dark:text-slate-100 tracking-wider uppercase mb-1">
              Premium Consultant
            </p>
            <button
              onClick={onUpgrade}
              className="mt-1 text-[10px] font-bold text-teal underline"
            >
              Upgrade plan to unlock
            </button>
          </div>
        )}
      </Card>
    </motion.div>
  );
}
