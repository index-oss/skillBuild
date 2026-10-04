import Link from "next/link";

interface Props {
  percentage: number;
  missingFields: string[];
}

export function ProfileCompletionCard({ percentage, missingFields }: Props) {
  return (
    <div className="bg-[#090D17] border border-slate-800 rounded-xl p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-white font-semibold text-lg">Profile Readiness</h3>
          <p className="text-slate-400 text-xs mt-0.5">Complete your profile to increase visibility to recruiters.</p>
        </div>
        <span className="text-2xl font-bold text-blue-400">{percentage}%</span>
      </div>

      <div className="w-full bg-slate-800 rounded-full h-2">
        <div
          className="bg-blue-500 h-2 rounded-full transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
      </div>

      {missingFields.length > 0 && (
        <div className="pt-2 border-t border-slate-800/80">
          <p className="text-xs text-slate-400 mb-2">Missing recommendations:</p>
          <div className="flex flex-wrap gap-2">
            {missingFields.map((field) => (
              <span
                key={field}
                className="px-2.5 py-1 bg-slate-800/60 border border-slate-700/60 rounded-md text-xs text-slate-300 capitalize"
              >
                + Add {field.replace("_", " ")}
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}