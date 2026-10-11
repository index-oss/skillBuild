"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Company = {
  id: string;
  name: string;
  slug: string;
};

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

export default function NewJobPage() {
  const router = useRouter();

  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const [form, setForm] = useState({
    company_id: "",
    title: "",
    description: "",
    job_type: "full_time",
    work_mode: "remote",
    location_city: "",
    location_state: "",
    location_country: "India",
    experience_min_years: "",
    experience_max_years: "",
    salary_min: "",
    salary_max: "",
    salary_currency: "INR",
    closes_at: "",
  });

  useEffect(() => {
    async function loadCompanies() {
      try {
        const response = await fetch("/api/recruiter/jobs", {
          cache: "no-store",
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(
            result.error || "Unable to load companies",
          );
        }

        const list = result.companies ?? [];

        setCompanies(list);

        if (list.length === 1) {
          setForm((current) => ({
            ...current,
            company_id: list[0].id,
          }));
        }
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Unable to load companies",
        );
      } finally {
        setLoading(false);
      }
    }

    loadCompanies();
  }, []);

  function update(
    field: keyof typeof form,
    value: string,
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function createJob(
    event: FormEvent,
    status: "draft" | "published",
  ) {
    event.preventDefault();

    setError("");
    setSuccess("");

    if (!form.company_id) {
      setError("Please select a company.");
      return;
    }

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
      const response = await fetch("/api/recruiter/jobs", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          ...form,
          status,
        }),
      });

      const result = await response.json();

      if (!response.ok) {
        throw new Error(
          result.error || "Failed to create job",
        );
      }

      setSuccess(
        status === "published"
          ? "Job published successfully."
          : "Job saved as draft.",
      );

      setTimeout(() => {
        router.push(`/recruiter/jobs/${result.job.id}`);
        router.refresh();
      }, 500);
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to create job",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#070B14] px-4 py-8 text-white md:px-8">
      <div className="mx-auto max-w-4xl">

        <div className="mb-8">
          <button
            type="button"
            onClick={() => router.back()}
            className="mb-4 text-sm text-slate-400 hover:text-white"
          >
            ← Back
          </button>

          <h1 className="text-3xl font-bold">
            Create a Job
          </h1>

          <p className="mt-2 text-sm text-slate-400">
            Create and publish a new opportunity.
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-6 rounded-xl border border-green-500/30 bg-green-500/10 p-4 text-sm text-green-300">
            {success}
          </div>
        )}

        <form className="space-y-6">

          {/* COMPANY + BASIC INFO */}
          <section className="rounded-2xl border border-slate-800 bg-[#0B111D] p-6">
            <h2 className="text-lg font-semibold">
              Basic Information
            </h2>

            <div className="mt-5 space-y-5">

              <div>
                <label className="mb-2 block text-sm text-slate-300">
                  Company
                </label>

                <select
                  value={form.company_id}
                  onChange={(e) =>
                    update("company_id", e.target.value)
                  }
                  disabled={loading || saving}
                  className="w-full rounded-xl border border-slate-700 bg-[#070B14] px-4 py-3 text-sm focus:border-blue-500 focus:outline-none"
                >
                  <option value="">
                    {loading
                      ? "Loading companies..."
                      : "Select company"}
                  </option>

                  {companies.map((company) => (
                    <option
                      key={company.id}
                      value={company.id}
                    >
                      {company.name}
                    </option>
                  ))}
                </select>

                {!loading && companies.length === 0 && (
                  <p className="mt-2 text-xs text-amber-400">
                    No company is available for your recruiter
                    account.
                  </p>
                )}
              </div>

              <div>
                <label className="mb-2 block text-sm text-slate-300">
                  Job Title
                </label>

                <input
                  value={form.title}
                  onChange={(e) =>
                    update("title", e.target.value)
                  }
                  placeholder="e.g. Senior Frontend Engineer"
                  disabled={saving}
                  className="w-full rounded-xl border border-slate-700 bg-[#070B14] px-4 py-3 text-sm placeholder:text-slate-600 focus:border-blue-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-slate-300">
                  Job Description
                </label>

                <textarea
                  value={form.description}
                  onChange={(e) =>
                    update("description", e.target.value)
                  }
                  rows={9}
                  placeholder="Describe responsibilities, requirements, skills, and expectations..."
                  disabled={saving}
                  className="w-full resize-y rounded-xl border border-slate-700 bg-[#070B14] px-4 py-3 text-sm placeholder:text-slate-600 focus:border-blue-500 focus:outline-none"
                />
              </div>
            </div>
          </section>

          {/* EMPLOYMENT */}
          <section className="rounded-2xl border border-slate-800 bg-[#0B111D] p-6">
            <h2 className="text-lg font-semibold">
              Employment Details
            </h2>

            <div className="mt-5 grid gap-5 md:grid-cols-2">

              <div>
                <label className="mb-2 block text-sm text-slate-300">
                  Job Type
                </label>

                <select
                  value={form.job_type}
                  onChange={(e) =>
                    update("job_type", e.target.value)
                  }
                  disabled={saving}
                  className="w-full rounded-xl border border-slate-700 bg-[#070B14] px-4 py-3 text-sm focus:border-blue-500 focus:outline-none"
                >
                  {jobTypes.map(([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-2 block text-sm text-slate-300">
                  Work Mode
                </label>

                <select
                  value={form.work_mode}
                  onChange={(e) =>
                    update("work_mode", e.target.value)
                  }
                  disabled={saving}
                  className="w-full rounded-xl border border-slate-700 bg-[#070B14] px-4 py-3 text-sm focus:border-blue-500 focus:outline-none"
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
            <h2 className="text-lg font-semibold">
              Location
            </h2>

            <div className="mt-5 grid gap-5 md:grid-cols-3">

              <input
                value={form.location_city}
                onChange={(e) =>
                  update("location_city", e.target.value)
                }
                placeholder="City"
                disabled={saving}
                className="rounded-xl border border-slate-700 bg-[#070B14] px-4 py-3 text-sm placeholder:text-slate-600 focus:border-blue-500 focus:outline-none"
              />

              <input
                value={form.location_state}
                onChange={(e) =>
                  update("location_state", e.target.value)
                }
                placeholder="State"
                disabled={saving}
                className="rounded-xl border border-slate-700 bg-[#070B14] px-4 py-3 text-sm placeholder:text-slate-600 focus:border-blue-500 focus:outline-none"
              />

              <input
                value={form.location_country}
                onChange={(e) =>
                  update("location_country", e.target.value)
                }
                placeholder="Country"
                disabled={saving}
                className="rounded-xl border border-slate-700 bg-[#070B14] px-4 py-3 text-sm placeholder:text-slate-600 focus:border-blue-500 focus:outline-none"
              />
            </div>
          </section>

          {/* EXPERIENCE + SALARY */}
          <section className="rounded-2xl border border-slate-800 bg-[#0B111D] p-6">
            <h2 className="text-lg font-semibold">
              Experience & Salary
            </h2>

            <div className="mt-5 grid gap-5 md:grid-cols-2">

              <input
                type="number"
                min="0"
                step="0.1"
                value={form.experience_min_years}
                onChange={(e) =>
                  update(
                    "experience_min_years",
                    e.target.value,
                  )
                }
                placeholder="Minimum experience (years)"
                disabled={saving}
                className="rounded-xl border border-slate-700 bg-[#070B14] px-4 py-3 text-sm placeholder:text-slate-600 focus:border-blue-500 focus:outline-none"
              />

              <input
                type="number"
                min="0"
                step="0.1"
                value={form.experience_max_years}
                onChange={(e) =>
                  update(
                    "experience_max_years",
                    e.target.value,
                  )
                }
                placeholder="Maximum experience (years)"
                disabled={saving}
                className="rounded-xl border border-slate-700 bg-[#070B14] px-4 py-3 text-sm placeholder:text-slate-600 focus:border-blue-500 focus:outline-none"
              />

              <input
                type="number"
                min="0"
                value={form.salary_min}
                onChange={(e) =>
                  update("salary_min", e.target.value)
                }
                placeholder="Minimum salary"
                disabled={saving}
                className="rounded-xl border border-slate-700 bg-[#070B14] px-4 py-3 text-sm placeholder:text-slate-600 focus:border-blue-500 focus:outline-none"
              />

              <input
                type="number"
                min="0"
                value={form.salary_max}
                onChange={(e) =>
                  update("salary_max", e.target.value)
                }
                placeholder="Maximum salary"
                disabled={saving}
                className="rounded-xl border border-slate-700 bg-[#070B14] px-4 py-3 text-sm placeholder:text-slate-600 focus:border-blue-500 focus:outline-none"
              />

              <select
                value={form.salary_currency}
                onChange={(e) =>
                  update("salary_currency", e.target.value)
                }
                disabled={saving}
                className="rounded-xl border border-slate-700 bg-[#070B14] px-4 py-3 text-sm focus:border-blue-500 focus:outline-none"
              >
                <option value="INR">INR</option>
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="GBP">GBP</option>
              </select>

              <input
                type="date"
                value={form.closes_at}
                onChange={(e) =>
                  update("closes_at", e.target.value)
                }
                disabled={saving}
                className="rounded-xl border border-slate-700 bg-[#070B14] px-4 py-3 text-sm focus:border-blue-500 focus:outline-none"
              />
            </div>
          </section>

          {/* ACTIONS */}
          <div className="flex flex-col gap-3 sm:flex-row sm:justify-end">

            <button
              type="button"
              disabled={saving || loading}
              onClick={(e) => createJob(e, "draft")}
              className="rounded-xl border border-slate-700 px-6 py-3 text-sm font-semibold text-slate-300 transition hover:bg-slate-800 disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Draft"}
            </button>

            <button
              type="button"
              disabled={saving || loading}
              onClick={(e) => createJob(e, "published")}
              className="rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold transition hover:bg-blue-500 disabled:opacity-50"
            >
              {saving ? "Creating..." : "Publish Job"}
            </button>

          </div>
        </form>
      </div>
    </div>
  );
}