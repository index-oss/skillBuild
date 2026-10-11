export const dynamic = "force-dynamic";

import { notFound, redirect } from "next/navigation";
import { hasAnyRole } from "@/lib/auth/roles";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getAuthenticatedProfile } from "@/lib/recruiter/permissions";
import { PageShell } from "@/components/layout/page-shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

type CompanyPageProps = {
  params: Promise<{
    id: string;
  }>;
};

export default async function CompanyDetailPage({
  params,
}: CompanyPageProps) {
  const allowed = await hasAnyRole([
    "recruiter",
    "admin",
  ]);

  if (!allowed) {
    redirect("/unauthorized");
  }

  const profile = await getAuthenticatedProfile();

  if (!profile) {
    redirect("/sign-in");
  }

  const { id } = await params;

  const supabase = await createSupabaseServerClient();

  const { data: membership } = await supabase
    .from("company_members")
    .select("role, status")
    .eq("company_id", id)
    .eq("profile_id", profile.id)
    .eq("status", "active")
    .maybeSingle();

  if (!membership) {
    redirect("/unauthorized");
  }

  const { data: company, error } = await supabase
    .from("companies")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  if (!company) {
    notFound();
  }

  const { data: jobs } = await supabase
    .from("jobs")
    .select(
      `
        id,
        title,
        job_type,
        work_mode,
        status,
        created_at
      `,
    )
    .eq("company_id", id)
    .order("created_at", { ascending: false });

  return (
    <PageShell>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-start">
          <div>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-3xl font-bold tracking-tight text-white">
                {company.name}
              </h1>

              <Badge variant="blue">
                {membership.role}
              </Badge>
            </div>

            {company.location_city && (
              <p className="mt-2 text-sm text-slate-500">
                {company.location_city}
                {company.location_country
                  ? `, ${company.location_country}`
                  : ""}
              </p>
            )}
          </div>

          <div className="flex flex-wrap gap-2">
            <Button
              href={`/recruiter/jobs/new?company=${company.id}`}
            >
              Create job
            </Button>

            <Button
              href="/companies"
              variant="secondary"
            >
              All companies
            </Button>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          <Card className="p-6 lg:col-span-2">
            <h2 className="text-lg font-semibold text-white">
              About
            </h2>

            <p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-slate-400">
              {company.description ||
                "No company description has been added yet."}
            </p>

            {company.website && (
              <div className="mt-5">
                <a
                  href={company.website}
                  target="_blank"
                  rel="noreferrer"
                  className="text-sm text-blue-400 hover:text-blue-300"
                >
                  Visit company website
                </a>
              </div>
            )}
          </Card>

          <Card className="p-6">
            <h2 className="text-lg font-semibold text-white">
              Company details
            </h2>

            <div className="mt-4 space-y-4 text-sm">
              <div>
                <p className="text-slate-500">Role</p>
                <p className="mt-1 text-white">
                  {membership.role}
                </p>
              </div>

              <div>
                <p className="text-slate-500">City</p>
                <p className="mt-1 text-white">
                  {company.location_city || "Not specified"}
                </p>
              </div>

              <div>
                <p className="text-slate-500">Country</p>
                <p className="mt-1 text-white">
                  {company.location_country || "Not specified"}
                </p>
              </div>
            </div>
          </Card>
        </div>

        <Card className="p-6">
          <div className="flex items-center justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-white">
                Jobs
              </h2>

              <p className="mt-1 text-sm text-slate-500">
                Job openings belonging to this company.
              </p>
            </div>

            <Badge>
              {jobs?.length ?? 0} jobs
            </Badge>
          </div>

          {!jobs?.length ? (
            <div className="mt-6 rounded-xl border border-dashed border-slate-700 p-8 text-center">
              <p className="text-sm text-slate-400">
                This company has no jobs yet.
              </p>

              <div className="mt-4">
                <Button
                  href={`/recruiter/jobs/new?company=${company.id}`}
                >
                  Create job
                </Button>
              </div>
            </div>
          ) : (
            <div className="mt-5 divide-y divide-slate-800">
              {jobs.map((job) => (
                <div
                  key={job.id}
                  className="flex flex-col justify-between gap-4 py-4 sm:flex-row sm:items-center"
                >
                  <div>
                    <h3 className="font-medium text-white">
                      {job.title}
                    </h3>

                    <div className="mt-2 flex flex-wrap gap-2">
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

                  <Button
                    href={`/recruiter/jobs/${job.id}`}
                    variant="secondary"
                  >
                    View job
                  </Button>
                </div>
              ))}
            </div>
          )}
        </Card>
      </div>
    </PageShell>
  );
}


