import * as React from "react";

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
  children?: React.ReactNode;
  variant?: "default" | "secondary" | "destructive" | "outline" | "teal" | "emerald";
}

export function Badge({ className = "", variant = "default", ...props }: BadgeProps) {
  const baseStyles = "inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold uppercase tracking-wider transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2";
  
  const variants = {
    default: "bg-teal-500/10 text-teal-600 border border-teal-500/20",
    secondary: "bg-slate-100 text-slate-800 border border-slate-200 dark:bg-slate-800 dark:text-slate-100 dark:border-slate-700",
    destructive: "bg-red-100 text-red-800 border border-red-200 dark:bg-red-900/30 dark:text-red-400 dark:border-red-900/50",
    outline: "text-slate-950 border border-slate-200 dark:text-slate-50 dark:border-slate-800",
    teal: "bg-teal-500/15 text-teal-600 dark:text-teal-400 border border-teal-500/20",
    emerald: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20"
  };

  return (
    <div
      className={`${baseStyles} ${variants[variant] || variants.default} ${className}`}
      {...props}
    />
  );
}
