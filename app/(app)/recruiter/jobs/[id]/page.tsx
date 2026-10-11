import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { hasAnyRole } from "@/lib/auth/roles";
import { getRecruiterJob, getJobApplicants } from "@/lib/recruiter/queries";
import { PageShell } from "@/components/layout/page-shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { JobStatusActions } from "@/components/recruiter/job-status-actions";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function RecruiterJobDetailPage({ params }: Props) {
  const allowed = await hasAnyRole(["recruiter", "admin"]);

  if (!allowed) {
    redirect("/unauthorized");
  }

  const { id } = await params;
  const job = await getRecruiterJob(id);

  if (!job) {
    notFound();
  }

  const applicants = await getJobApplicants(id);

  const company = Array.isArray(job.companies)
    ? job.companies[0]
    : job.companies;

  return (
    <PageShell>
      <div className="flex flex-col gap-6">
        {/* Navigation / Header */}
        <div className="flex flex-col gap-4">
          <Link
            href="/recruiter/jobs"
            className="text-sm text-slate-400 hover:text-white"
          >
            ← Back to jobs
          </Link>

          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div>
              <p className="text-sm font-medium text-blue-400">
                {company?.name ?? "Company"}
              </p>
              <h1 className="mt-1 text-3xl font-bold tracking-tight text-white">
                {job.title}
              </h1>
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <Badge
                  variant={
                    job.status === "published"
                      ? "green"
                      : job.status === "closed"
                        ? "red"
                        : "yellow"
                  }
                >
                  {job.status}
                </Badge>
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

            <div className="flex flex-wrap items-center gap-3">
              <JobStatusActions jobId={job.id} currentStatus={job.status} />

              <Button href={`/recruiter/jobs/${job.id}/edit`} variant="secondary">
                Edit Job
              </Button>

              <Button href={`/recruiter/jobs/${job.id}/applicants`}>
                Applicants ({job.applicantCount})
              </Button>

              {job.status === "published" && (
                <Button href={`/jobs/${job.id}`} variant="ghost">
                  Public View ↗
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="p-5">
            <p className="text-xs text-slate-400 uppercase tracking-wider">
              Total Applicants
            </p>
            <p className="mt-2 text-2xl font-bold text-white">
              {job.applicantCount}
            </p>
          </Card>

          <Card className="p-5">
            <p className="text-xs text-slate-400 uppercase tracking-wider">
              Compensation
            </p>
            <p className="mt-2 text-lg font-semibold text-white">
              {job.salary_min || job.salary_max
                ? `${job.salary_currency ?? "INR"} ${job.salary_min?.toLocaleString() ?? 0} - ${job.salary_max?.toLocaleString() ?? "DOE"}`
                : "Not disclosed"}
            </p>
          </Card>

          <Card className="p-5">
            <p className="text-xs text-slate-400 uppercase tracking-wider">
              Experience Required
            </p>
            <p className="mt-2 text-lg font-semibold text-white">
              {job.experience_min_years !== null || job.experience_max_years !== null
                ? `${job.experience_min_years ?? 0} - ${job.experience_max_years ?? "any"} years`
                : "Not specified"}
            </p>
          </Card>

          <Card className="p-5">
            <p className="text-xs text-slate-400 uppercase tracking-wider">
              Deadline
            </p>
            <p className="mt-2 text-sm font-semibold text-white">
              {job.closes_at
                ? new Date(job.closes_at).toLocaleDateString()
                : "No deadline set"}
            </p>
          </Card>
        </div>

        {/* Content sections */}
        <div className="grid gap-6 lg:grid-cols-3">
          <div className="space-y-6 lg:col-span-2">
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-white">About the Job</h2>
              <div className="mt-4 whitespace-pre-wrap text-sm leading-relaxed text-slate-300">
                {job.description || "No job description provided."}
              </div>
            </Card>

            {/* Recent Applicants */}
            <Card className="p-6">
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold text-white">
                  Recent Applicants ({applicants.length})
                </h2>
                {applicants.length > 0 && (
                  <Link
                    href={`/recruiter/jobs/${job.id}/applicants`}
                    className="text-xs text-blue-400 hover:underline"
                  >
                    View all candidates →
                  </Link>
                )}
              </div>

              {applicants.length === 0 ? (
                <p className="mt-4 text-sm text-slate-400">
                  No applications received yet. Share the public job link to attract candidates!
                </p>
              ) : (
                <div className="mt-4 divide-y divide-slate-800">
                  {applicants.slice(0, 5).map((app) => (
                    <div
                      key={app.id}
                      className="flex items-center justify-between py-3"
                    >
                      <div>
                        <p className="font-medium text-white">
                          {app.profile?.display_name ||
                            (app.profile?.first_name
                              ? `${app.profile.first_name} ${app.profile.last_name ?? ""}`
                              : "Applicant")}
                        </p>
                        <p className="text-xs text-slate-400">
                          Applied {new Date(app.applied_at).toLocaleDateString()}
                          {app.profile?.location_city ? ` • ${app.profile.location_city}` : ""}
                        </p>
                      </div>

                      <Badge
                        variant={
                          app.status === "shortlisted" || app.status === "selected"
                            ? "green"
                            : app.status === "rejected"
                              ? "red"
                              : "blue"
                        }
                      >
                        {app.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              )}
            </Card>
          </div>

          <div className="space-y-6">
            <Card className="p-6">
              <h2 className="text-lg font-semibold text-white">Company Info</h2>
              <p className="mt-3 font-medium text-white">
                {company?.name ?? "Company"}
              </p>
              {company?.description && (
                <p className="mt-2 text-xs text-slate-400">
                  {company.description}
                </p>
              )}
              {company?.website_url && (
                <a
                  href={company.website_url}
                  target="_blank"
                  rel="noreferrer"
                  className="mt-3 inline-block text-xs text-blue-400 hover:underline"
                >
                  Visit website ↗
                </a>
              )}
            </Card>

            <Card className="p-6">
              <h2 className="text-lg font-semibold text-white">Job Meta</h2>
              <div className="mt-3 space-y-2 text-xs text-slate-400">
                <p>Created: {new Date(job.created_at).toLocaleDateString()}</p>
                {job.published_at && (
                  <p>Published: {new Date(job.published_at).toLocaleDateString()}</p>
                )}
                <p>Slug: {job.slug}</p>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </PageShell>
  );
}
