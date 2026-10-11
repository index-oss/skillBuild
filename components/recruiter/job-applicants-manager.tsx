"use client";

import { useState } from "react";
import { Badge } from "@/components/ui/badge";

export type ApplicantData = {
  id: string;
  job_id: string;
  student_id: string;
  resume_id: string | null;
  cover_letter: string | null;
  status: string;
  applied_at: string;
  updated_at: string;
  profile: {
    id: string;
    display_name: string | null;
    first_name: string | null;
    last_name: string | null;
    avatar_url: string | null;
    location_city: string | null;
    location_country: string | null;
    bio: string | null;
  } | null;
};

const STATUS_FILTERS = [
  { label: "All", value: "all" },
  { label: "Applied", value: "applied" },
  { label: "Reviewing", value: "reviewing" },
  { label: "Shortlisted", value: "shortlisted" },
  { label: "Interviewing", value: "interviewing" },
  { label: "Selected", value: "selected" },
  { label: "Rejected", value: "rejected" },
];

export function JobApplicantsManager({
  initialApplicants,
}: {
  jobId: string;
  initialApplicants: ApplicantData[];
}) {
  const [applicants, setApplicants] = useState<ApplicantData[]>(initialApplicants);
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [expandedCoverLetter, setExpandedCoverLetter] = useState<string | null>(null);

  const filteredApplicants = applicants.filter((app) => {
    if (selectedFilter === "all") return true;
    return app.status === selectedFilter;
  });

  async function updateApplicantStatus(applicationId: string, newStatus: string) {
    setUpdatingId(applicationId);

    try {
      const res = await fetch(`/api/recruiter/applications/${applicationId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Failed to update status");
      }

      setApplicants((prev) =>
        prev.map((app) =>
          app.id === applicationId ? { ...app, status: newStatus } : app,
        ),
      );
    } catch (err) {
      alert(err instanceof Error ? err.message : "Failed to update status");
    } finally {
      setUpdatingId(null);
    }
  }

  function getBadgeVariant(status: string): "default" | "blue" | "green" | "yellow" | "red" | "gray" {
    switch (status) {
      case "shortlisted":
      case "selected":
        return "green";
      case "interviewing":
        return "blue";
      case "reviewing":
        return "yellow";
      case "rejected":
        return "red";
      default:
        return "gray";
    }
  }

  return (
    <div className="space-y-6">
      {/* Filter Tabs */}
      <div className="flex flex-wrap gap-2 border-b border-slate-800 pb-4">
        {STATUS_FILTERS.map((tab) => {
          const count =
            tab.value === "all"
              ? applicants.length
              : applicants.filter((a) => a.status === tab.value).length;

          return (
            <button
              key={tab.value}
              onClick={() => setSelectedFilter(tab.value)}
              className={[
                "rounded-xl px-4 py-2 text-xs font-semibold transition-colors",
                selectedFilter === tab.value
                  ? "bg-blue-600 text-white"
                  : "bg-slate-900 text-slate-400 hover:bg-slate-800 hover:text-white",
              ].join(" ")}
            >
              {tab.label} ({count})
            </button>
          );
        })}
      </div>

      {/* Applicant Cards List */}
      {filteredApplicants.length === 0 ? (
        <div className="rounded-2xl border border-slate-800 bg-[#0B111D] p-12 text-center">
          <p className="text-base font-medium text-slate-300">
            No applicants found
          </p>
          <p className="mt-1 text-sm text-slate-500">
            {selectedFilter === "all"
              ? "No candidates have applied to this job yet."
              : `No candidates currently in '${selectedFilter}' status.`}
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          {filteredApplicants.map((app) => {
            const name =
              app.profile?.display_name ||
              (app.profile?.first_name
                ? `${app.profile.first_name} ${app.profile.last_name ?? ""}`
                : "Candidate");

            const isExpanded = expandedCoverLetter === app.id;
            const isUpdating = updatingId === app.id;

            return (
              <div
                key={app.id}
                className="rounded-2xl border border-slate-800 bg-[#0B111D] p-6 transition hover:border-slate-700"
              >
                <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
                  <div className="flex items-start gap-4">
                    <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-600 to-indigo-600 text-base font-bold text-white shadow-lg shadow-blue-500/20">
                      {name.charAt(0).toUpperCase()}
                    </div>

                    <div>
                      <div className="flex items-center gap-3">
                        <h3 className="text-lg font-semibold text-white">
                          {name}
                        </h3>
                        <Badge variant={getBadgeVariant(app.status)}>
                          {app.status}
                        </Badge>
                      </div>

                      <p className="mt-1 text-xs text-slate-400">
                        Applied {new Date(app.applied_at).toLocaleDateString()}
                        {app.profile?.location_city
                          ? ` • 📍 ${app.profile.location_city}${app.profile.location_country ? `, ${app.profile.location_country}` : ""}`
                          : ""}
                      </p>

                      {app.profile?.bio && (
                        <p className="mt-2 line-clamp-2 text-xs text-slate-300">
                          {app.profile.bio}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Status Actions */}
                  <div className="flex flex-wrap items-center gap-2 self-start">
                    <select
                      value={app.status}
                      disabled={isUpdating}
                      onChange={(e) => updateApplicantStatus(app.id, e.target.value)}
                      className="rounded-xl border border-slate-700 bg-[#070B14] px-3 py-2 text-xs text-white focus:border-blue-500 focus:outline-none disabled:opacity-50"
                    >
                      <option value="applied">Status: Applied</option>
                      <option value="reviewing">Status: Under Review</option>
                      <option value="shortlisted">Status: Shortlisted</option>
                      <option value="interviewing">Status: Interviewing</option>
                      <option value="selected">Status: Selected / Hired</option>
                      <option value="rejected">Status: Rejected</option>
                    </select>

                    <button
                      type="button"
                      disabled={isUpdating}
                      onClick={() => updateApplicantStatus(app.id, "shortlisted")}
                      className="rounded-xl bg-purple-600/20 px-3 py-2 text-xs font-medium text-purple-300 transition hover:bg-purple-600/30 disabled:opacity-50"
                    >
                      Shortlist
                    </button>

                    <button
                      type="button"
                      disabled={isUpdating}
                      onClick={() => updateApplicantStatus(app.id, "interviewing")}
                      className="rounded-xl bg-blue-600/20 px-3 py-2 text-xs font-medium text-blue-300 transition hover:bg-blue-600/30 disabled:opacity-50"
                    >
                      Interview
                    </button>

                    <button
                      type="button"
                      disabled={isUpdating}
                      onClick={() => updateApplicantStatus(app.id, "rejected")}
                      className="rounded-xl bg-red-600/20 px-3 py-2 text-xs font-medium text-red-300 transition hover:bg-red-600/30 disabled:opacity-50"
                    >
                      Reject
                    </button>
                  </div>
                </div>

                {/* Cover letter section */}
                {app.cover_letter && (
                  <div className="mt-4 border-t border-slate-800/80 pt-4">
                    <button
                      type="button"
                      onClick={() => setExpandedCoverLetter(isExpanded ? null : app.id)}
                      className="text-xs font-semibold text-blue-400 hover:text-blue-300"
                    >
                      {isExpanded ? "Hide Note / Cover Letter ▲" : "View Note / Cover Letter ▼"}
                    </button>

                    {isExpanded && (
                      <div className="mt-3 rounded-xl border border-slate-800 bg-[#070B14] p-4 text-xs leading-relaxed text-slate-300 whitespace-pre-wrap">
                        {app.cover_letter}
                      </div>
                    )}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
