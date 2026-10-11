"use client";

import { FormEvent, useState } from "react";
import { useRouter } from "next/navigation";

const jobTypes = [
  ["full_time", "Full Time"],
  ["part_time", "Part Time"],
  ["internship", "Internship"],
  ["contract", "Contract"],
  ["freelance", "Freelance"],
];

const workModes = [
  ["remote", "Remote"],
  ["hybrid", "Hybrid"],
  ["onsite", "On-site"],
];

const jobStatuses = [
  ["draft", "Draft"],
  ["published", "Published"],
  ["closed", "Closed"],
  ["archived", "Archived"],
];

interface JobData {
  id: string;
  title: string;
  description: string;
  job_type: string;
  work_mode: string;
  location_city: string | null;
  location_state: string | null;
  location_country: string | null;
  experience_min_years: number | null;
  experience_max_years: number | null;
  salary_min: number | null;
  salary_max: number | null;
  salary_currency: string | null;
  closes_at: string | null;
  status: string;
}

export function EditJobForm({ job }: { job: JobData }) {
  const router = useRouter();

  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [form, setForm] = useState({
    title: job.title ?? "",
    description: job.description ?? "",
    job_type: job.job_type ?? "full_time",
    work_mode: job.work_mode ?? "remote",
    location_city: job.location_city ?? "",
    location_state: job.location_state ?? "",
    location_country: job.location_country ?? "India",
    experience_min_years: job.experience_min_years !== null ? String(job.experience_min_years) : "",
    experience_max_years: job.experience_max_years !== null ? String(job.experience_max_years) : "",
    salary_min: job.salary_min !== null ? String(job.salary_min) : "",
    salary_max: job.salary_max !== null ? String(job.salary_max) : "",
    salary_currency: job.salary_currency ?? "INR",
    closes_at: job.closes_at ? job.closes_at.split("T")[0] : "",
    status: job.status ?? "draft",
  });

  function update(field: keyof typeof form, value: string) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setError("");
    setSuccess("");

    if (!form.title.trim()) {
      setError("Job title is required.");
      return;
    }

    if (!form.description.trim()) {
      setError("Job description is required.");
      return;
    }

    setSaving(true);

    try {
      const response = await fetch(`/api/recruiter/jobs/${job.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || "Failed to update job");
      }

      setSuccess("Job updated successfully.");
      setTimeout(() => {
        router.push(`/recruiter/jobs/${job.id}`);
        router.refresh();
      }, 500);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to update job");
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">
          {error}
        </div>
      )}

      {success && (
        <div className="rounded-xl border border-green-500/30 bg-green-500/10 p-4 text-sm text-green-300">
          {success}
        </div>
      )}

      {/* BASIC INFO */}
      <section className="rounded-2xl border border-slate-800 bg-[#0B111D] p-6">
        <h2 className="text-lg font-semibold text-white">Basic Information</h2>

        <div className="mt-5 space-y-5">
          <div>
            <label className="mb-2 block text-sm text-slate-300">Job Title</label>
            <input
              value={form.title}
              onChange={(e) => update("title", e.target.value)}
              disabled={saving}
              className="w-full rounded-xl border border-slate-700 bg-[#070B14] px-4 py-3 text-sm text-white placeholder:text-slate-600 focus:border-blue-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm text-slate-300">Job Status</label>
            <select
              value={form.status}
              onChange={(e) => update("status", e.target.value)}
              disabled={saving}
              className="w-full rounded-xl border border-slate-700 bg-[#070B14] px-4 py-3 text-sm text-white focus:border-blue-500 focus:outline-none"
            >
              {jobStatuses.map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm text-slate-300">Job Description</label>
            <textarea
              value={form.description}
              onChange={(e) => update("description", e.target.value)}
              rows={9}
              disabled={saving}
              className="w-full resize-y rounded-xl border border-slate-700 bg-[#070B14] px-4 py-3 text-sm text-white placeholder:text-slate-600 focus:border-blue-500 focus:outline-none"
            />
          </div>
        </div>
      </section>

      {/* EMPLOYMENT DETAILS */}
      <section className="rounded-2xl border border-slate-800 bg-[#0B111D] p-6">
        <h2 className="text-lg font-semibold text-white">Employment Details</h2>

        <div className="mt-5 grid gap-5 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm text-slate-300">Job Type</label>
            <select
              value={form.job_type}
              onChange={(e) => update("job_type", e.target.value)}
              disabled={saving}
              className="w-full rounded-xl border border-slate-700 bg-[#070B14] px-4 py-3 text-sm text-white focus:border-blue-500 focus:outline-none"
            >
              {jobTypes.map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm text-slate-300">Work Mode</label>
            <select
              value={form.work_mode}
              onChange={(e) => update("work_mode", e.target.value)}
              disabled={saving}
              className="w-full rounded-xl border border-slate-700 bg-[#070B14] px-4 py-3 text-sm text-white focus:border-blue-500 focus:outline-none"
            >
              {workModes.map(([value, label]) => (
                <option key={value} value={value}>
                  {label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </section>

      {/* LOCATION */}
      <section className="rounded-2xl border border-slate-800 bg-[#0B111D] p-6">
        <h2 className="text-lg font-semibold text-white">Location</h2>

        <div className="mt-5 grid gap-5 md:grid-cols-3">
          <input
            value={form.location_city}
            onChange={(e) => update("location_city", e.target.value)}
            placeholder="City"
            disabled={saving}
            className="rounded-xl border border-slate-700 bg-[#070B14] px-4 py-3 text-sm text-white placeholder:text-slate-600 focus:border-blue-500 focus:outline-none"
          />

          <input
            value={form.location_state}
            onChange={(e) => update("location_state", e.target.value)}
            placeholder="State"
            disabled={saving}
            className="rounded-xl border border-slate-700 bg-[#070B14] px-4 py-3 text-sm text-white placeholder:text-slate-600 focus:border-blue-500 focus:outline-none"
          />

          <input
            value={form.location_country}
            onChange={(e) => update("location_country", e.target.value)}
            placeholder="Country"
            disabled={saving}
            className="rounded-xl border border-slate-700 bg-[#070B14] px-4 py-3 text-sm text-white placeholder:text-slate-600 focus:border-blue-500 focus:outline-none"
          />
        </div>
      </section>

      {/* EXPERIENCE & SALARY */}
      <section className="rounded-2xl border border-slate-800 bg-[#0B111D] p-6">
        <h2 className="text-lg font-semibold text-white">Experience & Compensation</h2>

        <div className="mt-5 grid gap-5 md:grid-cols-2">
          <input
            type="number"
            min="0"
            step="0.5"
            value={form.experience_min_years}
            onChange={(e) => update("experience_min_years", e.target.value)}
            placeholder="Min experience (years)"
            disabled={saving}
            className="rounded-xl border border-slate-700 bg-[#070B14] px-4 py-3 text-sm text-white placeholder:text-slate-600 focus:border-blue-500 focus:outline-none"
          />

          <input
            type="number"
            min="0"
            step="0.5"
            value={form.experience_max_years}
            onChange={(e) => update("experience_max_years", e.target.value)}
            placeholder="Max experience (years)"
            disabled={saving}
            className="rounded-xl border border-slate-700 bg-[#070B14] px-4 py-3 text-sm text-white placeholder:text-slate-600 focus:border-blue-500 focus:outline-none"
          />

          <input
            type="number"
            min="0"
            value={form.salary_min}
            onChange={(e) => update("salary_min", e.target.value)}
            placeholder="Min salary"
            disabled={saving}
            className="rounded-xl border border-slate-700 bg-[#070B14] px-4 py-3 text-sm text-white placeholder:text-slate-600 focus:border-blue-500 focus:outline-none"
          />

          <input
            type="number"
            min="0"
            value={form.salary_max}
            onChange={(e) => update("salary_max", e.target.value)}
            placeholder="Max salary"
            disabled={saving}
            className="rounded-xl border border-slate-700 bg-[#070B14] px-4 py-3 text-sm text-white placeholder:text-slate-600 focus:border-blue-500 focus:outline-none"
          />

          <select
            value={form.salary_currency}
            onChange={(e) => update("salary_currency", e.target.value)}
            disabled={saving}
            className="rounded-xl border border-slate-700 bg-[#070B14] px-4 py-3 text-sm text-white focus:border-blue-500 focus:outline-none"
          >
            <option value="INR">INR</option>
            <option value="USD">USD</option>
            <option value="EUR">EUR</option>
            <option value="GBP">GBP</option>
          </select>

          <input
            type="date"
            value={form.closes_at}
            onChange={(e) => update("closes_at", e.target.value)}
            disabled={saving}
            className="rounded-xl border border-slate-700 bg-[#070B14] px-4 py-3 text-sm text-white focus:border-blue-500 focus:outline-none"
          />
        </div>
      </section>

      {/* ACTIONS */}
      <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">
        <button
          type="button"
          onClick={() => router.back()}
          disabled={saving}
          className="rounded-xl border border-slate-700 px-6 py-3 text-sm font-semibold text-slate-300 transition hover:bg-slate-800 disabled:opacity-50"
        >
          Cancel
        </button>

        <button
          type="submit"
          disabled={saving}
          className="rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-500 disabled:opacity-50"
        >
          {saving ? "Saving Changes..." : "Save Changes"}
        </button>
      </div>
    </form>
  );
}
