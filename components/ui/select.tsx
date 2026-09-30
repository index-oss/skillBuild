import type { SelectHTMLAttributes } from "react";

export function Select({
  className = "",
  ...props
}: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select
      {...props}
      className={[
        "w-full rounded-xl border border-slate-700",
        "bg-slate-950 px-4 py-2.5",
        "text-sm text-white",
        "outline-none transition",
        "focus:border-blue-500 focus:ring-2 focus:ring-blue-500/10",
        className,
      ].join(" ")}
    />
  );
}