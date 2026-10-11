import type { ReactNode } from "react";
import { Card } from "@/components/ui/card";

export function EmptyState({
  title,
  description,
  action,
}: {
  title: string;
  description?: string;
  action?: ReactNode;
}) {
  return (
    <Card className="p-10 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-slate-800 text-xl">
        ○
      </div>

      <h2 className="mt-4 text-lg font-semibold text-white">
        {title}
      </h2>

      {description && (
        <p className="mx-auto mt-2 max-w-md text-sm text-slate-400">
          {description}
        </p>
      )}

      {action && <div className="mt-5">{action}</div>}
    </Card>
  );
}