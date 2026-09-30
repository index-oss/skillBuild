export const dynamic = "force-dynamic";

import { redirect } from "next/navigation";
import { hasAnyRole } from "@/lib/auth/roles";
import { getRecruiterCompanies } from "@/lib/recruiter/permissions";
import { PageShell } from "@/components/layout/page-shell";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/states/empty-state";

export default async function CompaniesPage() {
  const allowed = await hasAnyRole([
    "recruiter",
    "admin",
  ]);

  if (!allowed) {
    redirect("/unauthorized");
  }

  const memberships = await getRecruiterCompanies();

  return (
    <PageShell>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <p className="text-sm text-blue-400">
              Recruiter workspace
            </p>

            <h1 className="mt-1 text-3xl font-bold tracking-tight text-white">
              Companies
            </h1>

            <p className="mt-2 text-sm text-slate-400">
              Manage the companies connected to your recruiter account.
            </p>
          </div>

          <Button href="/companies/new">
            Add company
          </Button>
        </div>

        {memberships.length === 0 ? (
          <EmptyState
            title="No companies yet"
            description="Create a company to start posting jobs and managing candidates."
            action={
              <Button href="/companies/new">
                Create company
              </Button>
            }
          />
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {memberships.map((membership) => {
              const company = Array.isArray(membership.companies)
                ? membership.companies[0]
                : membership.companies;

              if (!company) {
                return null;
              }

              return (
                <Card
                  key={membership.company_id}
                  className="p-6"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="min-w-0">
                      <h2 className="text-xl font-semibold text-white">
                        {company.name}
                      </h2>

                      {company.location_city && (
                        <p className="mt-1 text-sm text-slate-500">
                          {company.location_city}
                          {company.location_country
                            ? `, ${company.location_country}`
                            : ""}
                        </p>
                      )}
                    </div>

                    <Badge
                      variant={
                        membership.role === "owner"
                          ? "blue"
                          : membership.role === "admin"
                            ? "green"
                            : "gray"
                      }
                    >
                      {membership.role}
                    </Badge>
                  </div>

                  {company.description && (
                    <p className="mt-4 line-clamp-3 text-sm leading-6 text-slate-400">
                      {company.description}
                    </p>
                  )}

                  <div className="mt-5 flex flex-wrap gap-2">
                    <Button
                      href={`/companies/${company.id}`}
                      variant="secondary"
                    >
                      View company
                    </Button>

                    <Button
                      href={`/recruiter/jobs?company=${company.id}`}
                      variant="ghost"
                    >
                      View jobs
                    </Button>
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
