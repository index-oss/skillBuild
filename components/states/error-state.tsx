import { Button } from "@/components/ui/button";

export function ErrorState({
  title = "Something went wrong",
  description = "We couldn't load this page. Please try again.",
}: {
  title?: string;
  description?: string;
}) {
  return (
    <div className="rounded-2xl border border-red-500/20 bg-red-500/5 p-10 text-center">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-red-500/10 text-red-400">
        !
      </div>

      <h2 className="mt-4 text-lg font-semibold text-white">
        {title}
      </h2>

      <p className="mx-auto mt-2 max-w-md text-sm text-slate-400">
        {description}
      </p>

      <div className="mt-5">
        <Button
          href="/dashboard"
          variant="secondary"
        >
          Back to dashboard
        </Button>
      </div>
    </div>
  );
}