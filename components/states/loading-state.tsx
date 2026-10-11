export function LoadingState({
  label = "Loading...",
}: {
  label?: string;
}) {
  return (
    <div className="flex min-h-[300px] items-center justify-center">
      <div className="text-center">
        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-2 border-slate-700 border-t-blue-500" />

        <p className="mt-4 text-sm text-slate-400">
          {label}
        </p>
      </div>
    </div>
  );
}