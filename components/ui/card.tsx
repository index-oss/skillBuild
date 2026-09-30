import type { ReactNode } from "react";

type CardProps = {
  children: ReactNode;
  className?: string;
};

export function Card({
  children,
  className = "",
}: CardProps) {
  return (
    <div
      className={[
        "rounded-2xl border border-slate-800",
        "bg-slate-900/70",
        "shadow-lg shadow-black/10",
        className,
      ].join(" ")}
    >
      {children}
    </div>
  );
}