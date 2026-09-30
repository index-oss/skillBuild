"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export function ApplyButton({ jobId }: { jobId: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  async function apply() {
    setLoading(true);
    setMessage("");

    try {
      const response = await fetch(`/api/jobs/${jobId}/apply`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
      });

      const result = await response.json();

      if (!response.ok) {
        setMessage(result.error ?? "Unable to apply.");
        return;
      }

      router.push(`/applications/${result.application.id}`);
      router.refresh();
    } catch {
      setMessage("Something went wrong.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div>
      <button
        type="button"
        onClick={apply}
        disabled={loading}
        className="rounded-xl bg-blue-600 px-6 py-3 font-medium text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
      >
        {loading ? "Applying..." : "Apply now"}
      </button>

      {message && (
        <p className="mt-3 text-sm text-red-400">
          {message}
        </p>
      )}
    </div>
  );
}