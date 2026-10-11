import { redirect } from "next/navigation";
import { hasAnyRole } from "@/lib/auth/roles";
import { getRecruiterStats } from "@/lib/recruiter/queries";
import { PageShell } from "@/components/layout/page-shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

export default async function RecruiterDashboardPage() {
  const allowed = await hasAnyRole(["recruiter", "admin"]);

  if (!allowed) {
    redirect("/unauthorized");
  }

  const stats = await getRecruiterStats();

  return (
    <PageShell>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm text-blue-400">Recruiter workspace</p>
            <h1 className="mt-1 text-3xl font-bold tracking-tight text-white">
              Hiring dashboard
            </h1>
            <p className="mt-2 text-sm text-slate-400">
              Manage jobs, candidates, and your hiring pipeline.
            </p>
          </div>

          <Button href="/recruiter/jobs/new">
            Create job
          </Button>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="p-5">
            <p className="text-sm text-slate-500">Total jobs</p>
            <p className="mt-2 text-3xl font-bold text-white">
              {stats.jobs}
            </p>
          </Card>

          <Card className="p-5">
            <p className="text-sm text-slate-500">Active jobs</p>
            <p className="mt-2 text-3xl font-bold text-white">
              {stats.activeJobs}
            </p>
          </Card>

          <Card className="p-5">
            <p className="text-sm text-slate-500">Applications</p>
            <p className="mt-2 text-3xl font-bold text-white">
              {stats.applications}
            </p>
          </Card>

          <Card className="p-5">
            <p className="text-sm text-slate-500">Shortlisted</p>
            <p className="mt-2 text-3xl font-bold text-white">
              {stats.shortlisted}
            </p>
          </Card>
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <Card className="p-6">
            <h2 className="text-lg font-semibold text-white">
              Jobs
            </h2>

            <p className="mt-2 text-sm text-slate-400">
              Create and manage job openings for your companies.
            </p>

            <div className="mt-5">
              <Button href="/recruiter/jobs" variant="secondary">
                Manage jobs
              </Button>
            </div>
          </Card>

          <Card className="p-6">
            <h2 className="text-lg font-semibold text-white">
              Companies
            </h2>

            <p className="mt-2 text-sm text-slate-400">
              View the companies where you have recruiting access.
            </p>

            <div className="mt-5">
              <Button href="/companies" variant="secondary">
                View companies
              </Button>
            </div>
          </Card>
        </div>
      </div>
    </PageShell>
  );
}