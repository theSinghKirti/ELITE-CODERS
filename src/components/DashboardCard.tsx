import React from "react";
import { type LucideIcon } from "lucide-react";
import { motion } from "motion/react";
import { Card, CardContent } from "./ui/Card";

export interface DashboardCardProps {
  title: string;
  value: string | number;
  description: string;
  icon: LucideIcon;
  trend?: string;
  trendType?: "positive" | "neutral" | "negative";
  color?: "teal" | "emerald" | "slate" | "amber";
}

export function DashboardCard({
  title,
  value,
  description,
  icon: Icon,
  trend,
  trendType = "neutral",
  color = "teal",
}: DashboardCardProps) {
  const colorMaps = {
    teal: "bg-teal-500/10 text-teal dark:bg-teal-500/15 dark:text-teal-400",
    emerald: "bg-emerald-500/10 text-emerald dark:bg-emerald-500/15 dark:text-emerald-400",
    slate: "bg-slate-500/10 text-slate-600 dark:bg-slate-800 dark:text-slate-450",
    amber: "bg-amber-500/10 text-amber-600 dark:bg-amber-900/10 dark:text-amber-400",
  };

  return (
    <motion.div
      whileHover={{ y: -4, transition: { duration: 0.2 } }}
      className="relative overflow-hidden group"
    >
      <Card className="glass relative overflow-hidden bg-white/70 dark:bg-slate-900/60 backdrop-blur-md border border-slate-200/50 dark:border-slate-800/80 p-5 shadow-sm rounded-2xl">
        <CardContent className="p-0 flex items-start justify-between">
          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block">
              {title}
            </span>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold tracking-tight text-slate-900 dark:text-white">
                {value}
              </span>
              {trend && (
                <span
                  className={`text-[10px] font-bold px-1.5 py-0.5 rounded-full ${
                    trendType === "positive"
                      ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-400"
                      : "bg-slate-100 text-slate-700 dark:bg-slate-850 dark:text-slate-300"
                  }`}
                >
                  {trend}
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">
              {description}
            </p>
          </div>

          <div className={`p-3 rounded-xl ${colorMaps[color] || colorMaps.teal} shrink-0`}>
            <Icon className="h-5 w-5" />
          </div>
        </CardContent>

        {/* Decorative corner accent element */}
        <div className="absolute right-0 bottom-0 w-24 h-24 bg-gradient-to-tr from-transparent via-transparent to-teal/5 rounded-full group-hover:scale-125 transition-transform duration-500" />
      </Card>
    </motion.div>
  );
}
