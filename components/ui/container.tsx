import type { ReactNode } from "react";

export function Container({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  return (
    <div
      className={[
        "mx-auto w-full max-w-7xl px-4 py-6 sm:px-6 lg:px-8",
        className,
      ].join(" ")}
    >
      {children}
    </div>
  );
}