"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";

export type PublicJob = {
  id: string;
  title: string;
  slug: string;
  description: string | null;
  location_city: string | null;
  location_state: string | null;
  location_country: string | null;
  job_type: string;
  work_mode: string;
  experience_min_years: number | null;
  experience_max_years: number | null;
  salary_min: number | null;
  salary_max: number | null;
  salary_currency: string | null;
  status: string;
  created_at: string;
  companies: {
    id: string;
    name: string;
    logo_url: string | null;
  } | {
    id: string;
    name: string;
    logo_url: string | null;
  }[] | null;
};

const JOB_TYPES = [
  { label: "All Types", value: "all" },
  { label: "Full Time", value: "full_time" },
  { label: "Part Time", value: "part_time" },
  { label: "Internship", value: "internship" },
  { label: "Contract", value: "contract" },
  { label: "Freelance", value: "freelance" },
];

const WORK_MODES = [
  { label: "All Modes", value: "all" },
  { label: "Remote", value: "remote" },
  { label: "Hybrid", value: "hybrid" },
  { label: "On-site", value: "onsite" },
];

export function JobsExplorer({
  jobs,
  appliedJobIds = [],
}: {
  jobs: PublicJob[];
  appliedJobIds?: string[];
}) {
  const [search, setSearch] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [selectedMode, setSelectedMode] = useState("all");

  const appliedSet = useMemo(() => new Set(appliedJobIds), [appliedJobIds]);

  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      const company = Array.isArray(job.companies)
        ? job.companies[0]
        : job.companies;

      const q = search.toLowerCase().trim();
      const matchSearch =
        !q ||
        job.title.toLowerCase().includes(q) ||
        (company?.name && company.name.toLowerCase().includes(q)) ||
        (job.description && job.description.toLowerCase().includes(q)) ||
        (job.location_city && job.location_city.toLowerCase().includes(q));

      const matchType =
        selectedType === "all" || job.job_type === selectedType;

      const matchMode =
        selectedMode === "all" || job.work_mode === selectedMode;

      return matchSearch && matchType && matchMode;
    });
  }, [jobs, search, selectedType, selectedMode]);

  return (
    <div className="space-y-6">
      {/* Search & Filter Bar */}
      <div className="space-y-4 rounded-2xl border border-slate-800 bg-[#0B1120] p-5">
        <div className="relative">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by job title, company name, skill, or location..."
            className="w-full rounded-xl border border-slate-700 bg-[#070B14] px-4 py-3 text-sm text-white placeholder:text-slate-500 focus:border-blue-500 focus:outline-none"
          />
          {search && (
            <button
              type="button"
              onClick={() => setSearch("")}
              className="absolute right-3 top-3 text-xs text-slate-400 hover:text-white"
            >
              Clear
            </button>
          )}
        </div>

        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-slate-400">Type:</span>
            {JOB_TYPES.map((type) => (
              <button
                key={type.value}
                onClick={() => setSelectedType(type.value)}
                className={[
                  "rounded-lg px-3 py-1.5 text-xs font-medium transition",
                  selectedType === type.value
                    ? "bg-blue-600 text-white"
                    : "bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white",
                ].join(" ")}
              >
                {type.label}
              </button>
            ))}
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <span className="text-xs text-slate-400">Mode:</span>
            {WORK_MODES.map((mode) => (
              <button
                key={mode.value}
                onClick={() => setSelectedMode(mode.value)}
                className={[
                  "rounded-lg px-3 py-1.5 text-xs font-medium transition",
                  selectedMode === mode.value
                    ? "bg-blue-600 text-white"
                    : "bg-slate-800 text-slate-400 hover:bg-slate-700 hover:text-white",
                ].join(" ")}
              >
                {mode.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Results Header */}
      <div className="flex items-center justify-between text-xs text-slate-400">
        <span>
          Showing {filteredJobs.length} {filteredJobs.length === 1 ? "opportunity" : "opportunities"}
        </span>
        {(search || selectedType !== "all" || selectedMode !== "all") && (
          <button
            type="button"
            onClick={() => {
              setSearch("");
              setSelectedType("all");
              setSelectedMode("all");
            }}
            className="text-blue-400 hover:underline"
          >
            Reset filters
          </button>
        )}
      </div>

      {/* Jobs Grid */}
      {filteredJobs.length === 0 ? (
        <div className="rounded-2xl border border-slate-800 bg-[#0B1120] p-12 text-center">
          <h3 className="text-lg font-semibold text-white">No jobs found</h3>
          <p className="mt-1 text-sm text-slate-400">
            Try adjusting your search keywords or filter options.
          </p>
          <button
            type="button"
            onClick={() => {
              setSearch("");
              setSelectedType("all");
              setSelectedMode("all");
            }}
            className="mt-4 rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-500"
          >
            Clear filters
          </button>
        </div>
      ) : (
        <div className="grid gap-5 md:grid-cols-2">
          {filteredJobs.map((job) => {
            const company = Array.isArray(job.companies)
              ? job.companies[0]
              : job.companies;

            const isApplied = appliedSet.has(job.id);

            return (
              <Link
                key={job.id}
                href={`/jobs/${job.id}`}
                className="group relative flex flex-col justify-between rounded-2xl border border-slate-800 bg-[#0B1120] p-6 transition hover:border-blue-500/50 hover:bg-[#0E1628]"
              >
                <div>
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <p className="text-xs font-medium text-blue-400">
                        {company?.name ?? "Company"}
                      </p>
                      <h2 className="mt-1 text-lg font-semibold text-white group-hover:text-blue-400">
                        {job.title}
                      </h2>
                    </div>

                    {isApplied ? (
                      <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-400">
                        Applied ✓
                      </span>
                    ) : (
                      <span className="rounded-full bg-blue-500/10 px-3 py-1 text-xs text-blue-400">
                        Active
                      </span>
                    )}
                  </div>

                  <p className="mt-3 line-clamp-3 text-xs leading-relaxed text-slate-400">
                    {job.description || "No description provided."}
                  </p>
                </div>

                <div className="mt-5 border-t border-slate-800/80 pt-4">
                  <div className="flex flex-wrap items-center gap-2">
                    <Badge variant="blue">{job.job_type.replace("_", " ")}</Badge>
                    <Badge variant="gray">{job.work_mode}</Badge>
                    {job.location_city && (
                      <span className="text-xs text-slate-400">
                        📍 {job.location_city}
                      </span>
                    )}
                    {(job.salary_min || job.salary_max) && (
                      <span className="ml-auto text-xs font-medium text-emerald-400">
                        {job.salary_currency ?? "INR"}{" "}
                        {job.salary_min ? job.salary_min.toLocaleString() : "0"} -{" "}
                        {job.salary_max ? job.salary_max.toLocaleString() : "DOE"}
                      </span>
                    )}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
