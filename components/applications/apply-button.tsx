"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function ApplyButton({
  jobId,
  alreadyApplied = false,
  applicationId,
}: {
  jobId: string;
  alreadyApplied?: boolean;
  applicationId?: string;
}) {
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);
  const [coverLetter, setCoverLetter] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (alreadyApplied) {
    return (
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center">
        <span className="rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-4 py-2.5 text-sm font-semibold text-emerald-400">
          ✓ Application Submitted
        </span>
        {applicationId && (
          <button
            type="button"
            onClick={() => router.push(`/applications/${applicationId}`)}
            className="text-xs text-blue-400 hover:underline"
          >
            View your application →
          </button>
        )}
      </div>
    );
  }

  async function handleApply() {
    setLoading(true);
    setError("");

    try {
      const response = await fetch(`/api/jobs/${jobId}/apply`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          cover_letter: coverLetter,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error ?? "Unable to apply.");
      }

      router.push(`/applications/${result.application.id}`);
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      {!isOpen ? (
        <button
          type="button"
          onClick={() => setIsOpen(true)}
          className="rounded-xl bg-blue-600 px-6 py-3 font-semibold text-white transition hover:bg-blue-500 active:scale-[0.98]"
        >
          Apply for this position
        </button>
      ) : (
        <div className="rounded-2xl border border-blue-500/30 bg-blue-950/20 p-5 backdrop-blur-sm sm:p-6">
          <h3 className="text-base font-semibold text-white">
            Apply with SkillForge Profile
          </h3>
          <p className="mt-1 text-xs text-slate-400">
            Your verified profile and portfolio will be shared with the hiring team.
          </p>

          <div className="mt-4">
            <label className="mb-2 block text-xs font-medium text-slate-300">
              Note to the recruiter / Cover letter (optional)
            </label>
            <textarea
              value={coverLetter}
              onChange={(e) => setCoverLetter(e.target.value)}
              rows={4}
              placeholder="Why are you interested in this role? Highlight any key projects or skills..."
              disabled={loading}
              className="w-full resize-y rounded-xl border border-slate-700 bg-[#070B14] p-3 text-xs text-white placeholder:text-slate-600 focus:border-blue-500 focus:outline-none"
            />
          </div>

          {error && (
            <p className="mt-3 text-xs text-red-400">
              {error}
            </p>
          )}

          <div className="mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={handleApply}
              disabled={loading}
              className="rounded-xl bg-blue-600 px-5 py-2.5 text-xs font-semibold text-white transition hover:bg-blue-500 disabled:opacity-50"
            >
              {loading ? "Submitting Application..." : "Confirm & Submit Application"}
            </button>

            <button
              type="button"
              onClick={() => setIsOpen(false)}
              disabled={loading}
              className="rounded-xl border border-slate-700 px-4 py-2.5 text-xs font-semibold text-slate-400 transition hover:bg-slate-800 hover:text-white disabled:opacity-50"
            >
              Cancel
            </button>
          </div>
        </div>
      )}
    </div>
  );
}