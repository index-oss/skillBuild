"use client";

import { FormEvent, useEffect, useState } from "react";
import { useRouter } from "next/navigation";

type Company = {
  id: string;
  name: string;
  slug: string;
};

const jobTypes = [
  { value: "full_time", label: "Full Time" },
  { value: "part_time", label: "Part Time" },
  { value: "internship", label: "Internship" },
  { value: "contract", label: "Contract" },
  { value: "freelance", label: "Freelance" },
];

const workModes = [
  { value: "remote", label: "Remote" },
  { value: "hybrid", label: "Hybrid" },
  { value: "onsite", label: "On-site" },
];

export default function NewRecruiterJobPage() {
  const router = useRouter();

  const [companies, setCompanies] = useState<Company[]>([]);
  const [loadingCompanies, setLoadingCompanies] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  const [form, setForm] = useState({
    company_id: "",
    title: "",
    description: "",
    job_type: "full_time",
    work_mode: "remote",
    location_city: "",
    location_state: "",
    location_country: "",
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
          method: "GET",
          cache: "no-store",
        });

        const result = await response.json();

        if (!response.ok) {
          throw new Error(result.error || "Failed to load companies");
        }

        setCompanies(result.companies ?? []);

        if (result.companies?.length === 1) {
          setForm((current) => ({
            ...current,
            company_id: result.companies[0].id,
          }));
        }
      } catch (err) {
        setError(
          err instanceof Error
            ? err.message
            : "Failed to load companies",
        );
      } finally {
        setLoadingCompanies(false);
      }
    }

    loadCompanies();
  }, []);

  function updateField(
    field: keyof typeof form,
    value: string,
  ) {
    setForm((current) => ({
      ...current,
      [field]: value,
    }));
  }

  async function submitJob(
    event: FormEvent<HTMLFormElement>,
    status: "draft" | "published",
  ) {
    event.preventDefault();

    setError("");

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

    setSubmitting(true);

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
        throw new Error(result.error || "Failed to create job");
      }

      router.push(`/recruiter/jobs/${result.job.id}`);
      router.refresh();
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to create job",
      );
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="min-h-screen bg-[#070B14] px-4 py-8 text-white md:px-8">
      <div className="mx-auto max-w-4xl">
        <div className="mb-8">
          <button
            type="button"
            onClick={() => router.back()}
            className="mb-4 text-sm text-slate-400 transition hover:text-white"
          >
            ← Back
          </button>

          <h1 className="text-3xl font-bold tracking-tight">
            Create a Job
          </h1>

          <p className="mt-2 text-sm text-slate-400">
            Create a new opportunity for candidates.
          </p>
        </div>

        {error && (
          <div className="mb-6 rounded-xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-300">
            {error}
          </div>
        )}

        <form className="space-y-6">
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
                    updateField("company_id", e.target.value)
                  }
                  disabled={loadingCompanies || submitting}
                  className="w-full rounded-xl border border-slate-700 bg-[#070B14] px-4 py-3 text-sm outline-none transition focus:border-blue-500"
                >
                  <option value="">
                    {loadingCompanies
                      ? "Loading companies..."
                      : "Select company"}
                  </option>

                  {companies.map((company) => (
                    <option key={company.id} value={company.id}>
                      {company.name}
                    </option>
                  ))}
                </select>

                {!loadingCompanies && companies.length === 0 && (
                  <p className="mt-2 text-xs text-amber-400">
                    You don&apos;t have an active recruiter/company-admin
                    membership for any company.
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
                    updateField("title", e.target.value)
                  }
                  placeholder="e.g. Senior Frontend Engineer"
                  disabled={submitting}
                  className="w-full rounded-xl border border-slate-700 bg-[#070B14] px-4 py-3 text-sm outline-none transition placeholder:text-slate-600 focus:border-blue-500"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm text-slate-300">
                  Description
                </label>

                <textarea
                  value={form.description}
                  onChange={(e) =>
                    updateField("description", e.target.value)
                  }
                  placeholder="Describe the role, responsibilities, and requirements..."
                  rows={8}
                  disabled={submitting}
                  className="w-full resize-y rounded-xl border border-slate-700 bg-[#070B14] px-4 py-3 text-sm outline-none transition placeholder:text-slate-600 focus:border-blue-500"
                />
              </div>
            </div>
          </section>

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
                    updateField("job_type", e.target.value)
                  }
                  disabled={submitting}
                  className="w-full rounded-xl border border-slate-700 bg-[#070B14] px-4 py-3 text-sm outline-none focus:border-blue-500"
                >
                  {jobTypes.map((type) => (
                    <option key={type.value} value={type.value}>
                      {type.label}
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
                    updateField("work_mode", e.target.value)
                  }
                  disabled={submitting}
                  className="w-full rounded-xl border border-slate-700 bg-[#070B14] px-4 py-3 text-sm outline-none focus:border-blue-500"
                >
                  {workModes.map((mode) => (
                    <option key={mode.value} value={mode.value}>
                      {mode.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </section>

          <section className="rounded-2xl border border-slate-800 bg-[#0B111D] p-6">
            <h2 className="text-lg font-semibold">
              Location
            </h2>

            <div className="mt-5 grid gap-5 md:grid-cols-3">
              <input
                value={form.location_city}
                onChange={(e) =>
                  updateField("location_city", e.target.value)
                }
                placeholder="City"
                disabled={submitting}
                className="rounded-xl border border-slate-700 bg-[#070B14] px-4 py-3 text-sm outline-none placeholder:text-slate-600 focus:border-blue-500"
              />

              <input
                value={form.location_state}
                onChange={(e) =>
                  updateField("location_state", e.target.value)
                }
                placeholder="State"
                disabled={submitting}
                className="rounded-xl border border-slate-700 bg-[#070B14] px-4 py-3 text-sm outline-none placeholder:text-slate-600 focus:border-blue-500"
              />

              <input
                value={form.location_country}
                onChange={(e) =>
                  updateField("location_country", e.target.value)
                }
                placeholder="Country"
                disabled={submitting}
                className="rounded-xl border border-slate-700 bg-[#070B14] px-4 py-3 text-sm outline-none placeholder:text-slate-600 focus:border-blue-500"
              />
            </div>
          </section>

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
                  updateField(
                    "experience_min_years",
                    e.target.value,
                  )
                }
                placeholder="Minimum experience (years)"
                disabled={submitting}
                className="rounded-xl border border-slate-700 bg-[#070B14] px-4 py-3 text-sm outline-none placeholder:text-slate-600 focus:border-blue-500"
              />

              <input
                type="number"
                min="0"
                step="0.1"
                value={form.experience_max_years}
                onChange={(e) =>
                  updateField(
                    "experience_max_years",
                    e.target.value,
                  )
                }
                placeholder="Maximum experience (years)"
                disabled={submitting}
                className="rounded-xl border border-slate-700 bg-[#070B14] px-4 py-3 text-sm outline-none placeholder:text-slate-600 focus:border-blue-500"
              />

              <input
                type="number"
                min="0"
                value={form.salary_min}
                onChange={(e) =>
                  updateField("salary_min", e.target.value)
                }
                placeholder="Minimum salary"
                disabled={submitting}
                className="rounded-xl border border-slate-700 bg-[#070B14] px-4 py-3 text-sm outline-none placeholder:text-slate-600 focus:border-blue-500"
              />

              <input
                type="number"
                min="0"
                value={form.salary_max}
                onChange={(e) =>
                  updateField("salary_max", e.target.value)
                }
                placeholder="Maximum salary"
                disabled={submitting}
                className="rounded-xl border border-slate-700 bg-[#070B14] px-4 py-3 text-sm outline-none placeholder:text-slate-600 focus:border-blue-500"
              />

              <select
                value={form.salary_currency}
                onChange={(e) =>
                  updateField("salary_currency", e.target.value)
                }
                disabled={submitting}
                className="rounded-xl border border-slate-700 bg-[#070B14] px-4 py-3 text-sm outline-none focus:border-blue-500"
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
                  updateField("closes_at", e.target.value)
                }
                disabled={submitting}
                className="rounded-xl border border-slate-700 bg-[#070B14] px-4 py-3 text-sm outline-none focus:border-blue-500"
              />
            </div>
          </section>

          <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
            <button
              type="button"
              onClick={(e) =>
                submitJob(
                  e as unknown as FormEvent<HTMLFormElement>,
                  "draft",
                )
              }
              disabled={submitting || loadingCompanies}
              className="rounded-xl border border-slate-700 px-6 py-3 text-sm font-medium text-slate-300 transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting ? "Saving..." : "Save Draft"}
            </button>

            <button
              type="button"
              onClick={(e) =>
                submitJob(
                  e as unknown as FormEvent<HTMLFormElement>,
                  "published",
                )
              }
              disabled={submitting || loadingCompanies}
              className="rounded-xl bg-blue-600 px-6 py-3 text-sm font-semibold text-white transition hover:bg-blue-500 disabled:cursor-not-allowed disabled:opacity-50"
            >
              {submitting ? "Creating..." : "Publish Job"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}