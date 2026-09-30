import type { ReactNode } from "react";

type BadgeProps = {
  children: ReactNode;
  variant?: "blue" | "green" | "yellow" | "red" | "gray";
};

const variants = {
  blue: "bg-blue-500/10 text-blue-400 border-blue-500/20",
  green: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  yellow: "bg-yellow-500/10 text-yellow-400 border-yellow-500/20",
  red: "bg-red-500/10 text-red-400 border-red-500/20",
  gray: "bg-slate-500/10 text-slate-400 border-slate-500/20",
};

export function Badge({
  children,
  variant = "gray",
}: BadgeProps) {
  return (
    <span
      className={[
        "inline-flex items-center rounded-full border px-2.5 py-1",
        "text-xs font-medium",
        variants[variant],
      ].join(" ")}
    >
      {children}
    </span>
  );
}