import * as React from "react";

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "secondary" | "destructive" | "outline" | "ghost" | "link" | "teal" | "emerald" | "tealGhost";
  size?: "default" | "sm" | "lg" | "icon";
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className = "", variant = "default", size = "default", type = "button", ...props }, ref) => {
    const baseStyles = "inline-flex items-center justify-center gap-2 whitespace-nowrap text-sm font-semibold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 cursor-pointer rounded-full active:scale-[0.98] transition-transform duration-100";

    const variants = {
      default: "bg-slate-900 text-slate-50 hover:bg-slate-900/90 dark:bg-slate-50 dark:text-slate-900 dark:hover:bg-slate-50/90 shadow-sm",
      secondary: "bg-slate-100 text-slate-900 hover:bg-slate-100/80 dark:bg-slate-800 dark:text-slate-50 dark:hover:bg-slate-800/80",
      destructive: "bg-red-500 text-slate-50 hover:bg-red-500/90 dark:bg-red-900 dark:text-slate-50 dark:hover:bg-red-900/90",
      outline: "border border-slate-200 bg-white hover:bg-slate-50 hover:text-slate-900 dark:border-slate-800 dark:bg-slate-950 dark:hover:bg-slate-800 dark:hover:text-slate-50",
      ghost: "hover:bg-slate-100 hover:text-slate-900 dark:hover:bg-slate-800 dark:hover:text-slate-50",
      tealGhost: "hover:bg-teal-500/10 text-teal hover:text-teal-dark active:scale-[0.98]",
      link: "text-slate-900 underline-offset-4 hover:underline dark:text-slate-50",
      teal: "bg-teal text-white hover:bg-teal-dark shadow-md shadow-teal-500/10 hover:shadow-lg hover:shadow-teal-500/20",
      emerald: "bg-emerald text-white hover:bg-emerald-600 shadow-md shadow-emerald-500/10 hover:shadow-lg hover:shadow-emerald-500/20",
    };

    const sizes = {
      default: "h-11 px-6 py-2.5",
      sm: "h-9 rounded-full px-4 text-xs",
      lg: "h-12 rounded-full px-8 text-base",
      icon: "h-10 w-10 p-0 rounded-full",
    };

    return (
      <button
        ref={ref}
        type={type}
        className={`${baseStyles} ${variants[variant] || variants.default} ${sizes[size] || sizes.default} ${className}`}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";
