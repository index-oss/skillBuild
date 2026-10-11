import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { ApplyButton } from "@/components/applications/apply-button";
import { Badge } from "@/components/ui/badge";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function JobDetailPage({ params }: Props) {
  const { id } = await params;
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const supabase = createSupabaseAdminClient();

  const { data: profile } = await supabase
    .from("profiles")
    .select("id")
    .eq("clerk_user_id", userId)
    .maybeSingle();

  const { data: job } = await supabase
    .from("jobs")
    .select(
      `
        id,
        title,
        slug,
        description,
        location_city,
        location_state,
        location_country,
        job_type,
        work_mode,
        experience_min_years,
        experience_max_years,
        salary_min,
        salary_max,
        salary_currency,
        status,
        published_at,
        closes_at,
        created_at,
        companies (
          id,
          name,
          slug,
          logo_url,
          website_url,
          description,
          location_city,
          location_country
        )
      `,
    )
    .eq("id", id)
    .eq("status", "published")
    .maybeSingle();

  if (!job) {
    notFound();
  }

  const company = Array.isArray(job.companies)
    ? job.companies[0]
    : job.companies;

  // Check if student has applied
  let existingApplication = null;
  if (profile) {
    const { data: app } = await supabase
      .from("applications")
      .select("id, status, applied_at")
      .eq("job_id", id)
      .eq("student_id", profile.id)
      .maybeSingle();

    existingApplication = app;
  }

  return (
    <main className="min-h-screen bg-[#070B14] px-4 py-8 text-white md:px-8">
      <div className="mx-auto max-w-4xl">
        <Link
          href="/jobs"
          className="text-sm text-slate-400 hover:text-white"
        >
          ← Back to jobs
        </Link>

        {/* Existing Application Banner */}
        {existingApplication && (
          <div className="mt-6 flex flex-col justify-between gap-3 rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-5 sm:flex-row sm:items-center">
            <div className="flex items-center gap-3">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-500/20 text-emerald-400">
                ✓
              </span>
              <div>
                <p className="text-sm font-semibold text-emerald-300">
                  You applied for this role on{" "}
                  {new Date(existingApplication.applied_at).toLocaleDateString()}
                </p>
                <p className="text-xs text-emerald-400/80">
                  Current Status: <span className="font-semibold uppercase">{existingApplication.status}</span>
                </p>
              </div>
            </div>

            <Link
              href={`/applications/${existingApplication.id}`}
              className="text-xs font-semibold text-emerald-400 hover:underline"
            >
              Track your application →
            </Link>
          </div>
        )}

        <section className="mt-6 rounded-2xl border border-slate-800 bg-[#0B1120] p-6 md:p-8">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-start">
            <div>
              <p className="text-sm font-medium text-blue-400">
                {company?.name ?? "Company"}
              </p>
              <h1 className="mt-1 text-3xl font-bold">{job.title}</h1>
              <div className="mt-3 flex flex-wrap items-center gap-2">
                <Badge variant="blue">{job.job_type.replace("_", " ")}</Badge>
                <Badge variant="gray">{job.work_mode}</Badge>
                {job.location_city && (
                  <span className="text-xs text-slate-400">
                    📍 {job.location_city}
                    {job.location_country ? `, ${job.location_country}` : ""}
                  </span>
                )}
              </div>
            </div>

            <ApplyButton
              jobId={job.id}
              alreadyApplied={Boolean(existingApplication)}
              applicationId={existingApplication?.id}
            />
          </div>

          {/* Quick Metrics */}
          <div className="mt-8 grid gap-4 rounded-xl border border-slate-800 bg-[#070B14] p-4 sm:grid-cols-3">
            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wider">Salary</p>
              <p className="mt-1 text-sm font-semibold text-white">
                {job.salary_min || job.salary_max
                  ? `${job.salary_currency ?? "INR"} ${job.salary_min?.toLocaleString() ?? 0} - ${job.salary_max?.toLocaleString() ?? "DOE"}`
                  : "Competitive / DOE"}
              </p>
            </div>

            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wider">Experience</p>
              <p className="mt-1 text-sm font-semibold text-white">
                {job.experience_min_years !== null || job.experience_max_years !== null
                  ? `${job.experience_min_years ?? 0} - ${job.experience_max_years ?? "Any"} years`
                  : "All experience levels"}
              </p>
            </div>

            <div>
              <p className="text-xs text-slate-500 uppercase tracking-wider">Deadline</p>
              <p className="mt-1 text-sm font-semibold text-white">
                {job.closes_at
                  ? new Date(job.closes_at).toLocaleDateString()
                  : "Open until filled"}
              </p>
            </div>
          </div>

          {/* Job Details */}
          <div className="mt-8">
            <h2 className="text-xl font-semibold">About the role</h2>
            <div className="mt-4 whitespace-pre-wrap text-sm leading-relaxed text-slate-300">
              {job.description || "No description provided."}
            </div>
          </div>

          {/* Company Details */}
          {company && (
            <div className="mt-10 border-t border-slate-800 pt-8">
              <h2 className="text-xl font-semibold">About {company.name}</h2>
              {company.description && (
                <p className="mt-3 text-sm leading-relaxed text-slate-400">
                  {company.description}
                </p>
              )}
              {company.website_url && (
                <a
                  href={company.website_url}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-3 inline-block text-xs text-blue-400 hover:underline"
                >
                  Visit official website ↗
                </a>
              )}
            </div>
          )}

          {/* Bottom Apply Action */}
          <div className="mt-10 border-t border-slate-800 pt-8">
            <ApplyButton
              jobId={job.id}
              alreadyApplied={Boolean(existingApplication)}
              applicationId={existingApplication?.id}
            />
          </div>
        </section>
      </div>
    </main>
  );
}