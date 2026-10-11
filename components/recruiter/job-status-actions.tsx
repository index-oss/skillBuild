"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function JobStatusActions({
  jobId,
  currentStatus,
}: {
  jobId: string;
  currentStatus: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function updateStatus(newStatus: "draft" | "published" | "closed" | "archived") {
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`/api/recruiter/jobs/${jobId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to update status");
      }

      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error updating status");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex flex-col gap-2">
      {error && (
        <p className="text-xs text-red-400">{error}</p>
      )}

      <div className="flex flex-wrap items-center gap-2">
        {currentStatus === "draft" && (
          <button
            type="button"
            disabled={loading}
            onClick={() => updateStatus("published")}
            className="rounded-xl bg-emerald-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-emerald-500 disabled:opacity-50"
          >
            {loading ? "Updating..." : "Publish Job"}
          </button>
        )}

        {currentStatus === "published" && (
          <button
            type="button"
            disabled={loading}
            onClick={() => updateStatus("closed")}
            className="rounded-xl bg-amber-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-amber-500 disabled:opacity-50"
          >
            {loading ? "Updating..." : "Close Applications"}
          </button>
        )}

        {currentStatus === "closed" && (
          <>
            <button
              type="button"
              disabled={loading}
              onClick={() => updateStatus("published")}
              className="rounded-xl bg-emerald-600 px-4 py-2 text-xs font-semibold text-white transition hover:bg-emerald-500 disabled:opacity-50"
            >
              {loading ? "Updating..." : "Re-open Job"}
            </button>
            <button
              type="button"
              disabled={loading}
              onClick={() => updateStatus("archived")}
              className="rounded-xl bg-slate-700 px-4 py-2 text-xs font-semibold text-slate-300 transition hover:bg-slate-600 disabled:opacity-50"
            >
              {loading ? "Updating..." : "Archive Job"}
            </button>
          </>
        )}

        {currentStatus === "archived" && (
          <button
            type="button"
            disabled={loading}
            onClick={() => updateStatus("draft")}
            className="rounded-xl bg-slate-700 px-4 py-2 text-xs font-semibold text-slate-300 transition hover:bg-slate-600 disabled:opacity-50"
          >
            {loading ? "Updating..." : "Restore as Draft"}
          </button>
        )}
      </div>
    </div>
  );
}
