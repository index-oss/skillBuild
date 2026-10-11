import Link from "next/link";
import type { ReactNode } from "react";

type ButtonProps = {
  children: ReactNode;
  href?: string;
  type?: "button" | "submit";
  variant?: "primary" | "secondary" | "danger" | "ghost";
  className?: string;
  disabled?: boolean;
  onClick?: () => void;
};

const variants = {
  primary:
    "bg-blue-600 text-white hover:bg-blue-500",
  secondary:
    "border border-slate-700 bg-slate-800 text-white hover:bg-slate-700",
  danger:
    "bg-red-600 text-white hover:bg-red-500",
  ghost:
    "text-slate-300 hover:bg-slate-800 hover:text-white",
};

export function Button({
  children,
  href,
  type = "button",
  variant = "primary",
  className = "",
  disabled = false,
  onClick,
}: ButtonProps) {
  const classes = [
    "inline-flex items-center justify-center rounded-xl px-4 py-2.5",
    "text-sm font-medium transition",
    "focus:outline-none focus:ring-2 focus:ring-blue-500/50",
    "disabled:pointer-events-none disabled:opacity-50",
    variants[variant],
    className,
  ].join(" ");

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    );
  }

  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={classes}
    >
      {children}
    </button>
  );
}