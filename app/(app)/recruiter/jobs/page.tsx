import { redirect } from "next/navigation";
import { hasAnyRole } from "@/lib/auth/roles";
import { getRecruiterJobs } from "@/lib/recruiter/queries";
import { PageShell } from "@/components/layout/page-shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/states/empty-state";

export default async function RecruiterJobsPage() {
  const allowed = await hasAnyRole(["recruiter", "admin"]);

  if (!allowed) {
    redirect("/unauthorized");
  }

  const jobs = await getRecruiterJobs();

  return (
    <PageShell>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-white">
              Your jobs
            </h1>

            <p className="mt-2 text-sm text-slate-400">
              Manage your company job openings and applicants.
            </p>
          </div>

          <Button href="/recruiter/jobs/new">
            Create job
          </Button>
        </div>

        {jobs.length === 0 ? (
          <EmptyState
            title="No jobs yet"
            description="Create your first job opening to start receiving applications."
            action={
              <Button href="/recruiter/jobs/new">
                Create your first job
              </Button>
            }
          />
        ) : (
          <div className="grid gap-4">
            {jobs.map((job) => {
              const company = Array.isArray(job.companies)
                ? job.companies[0]
                : job.companies;

              return (
                <Card key={job.id} className="p-5">
                  <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                    <div className="min-w-0">
                      <h2 className="text-lg font-semibold text-white">
                        {job.title}
                      </h2>

                      <p className="mt-1 text-sm text-slate-400">
                        {company?.name ?? "Company"}
                      </p>

                      <div className="mt-3 flex flex-wrap gap-2">
                        <Badge>{job.job_type}</Badge>
                        <Badge variant="blue">
                          {job.work_mode}
                        </Badge>
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
                      </div>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      <Button
                        href={`/recruiter/jobs/${job.id}`}
                        variant="secondary"
                      >
                        View
                      </Button>

                      <Button
                        href={`/recruiter/jobs/${job.id}/applicants`}
                        variant="secondary"
                      >
                        Applicants
                      </Button>

                      <Button
                        href={`/recruiter/jobs/${job.id}/edit`}
                        variant="ghost"
                      >
                        Edit
                      </Button>
                    </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </div>
    </PageShell>
  );
}