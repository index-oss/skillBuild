import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { Badge } from "@/components/ui/badge";

type ApplicationItem = {
  id: string;
  status: string;
  cover_letter: string | null;
  applied_at: string;
  updated_at: string;
  jobs: {
    id: string;
    title: string;
    slug: string;
    location_city: string | null;
    location_country: string | null;
    job_type: string | null;
    work_mode: string | null;
    companies: {
      id: string;
      name: string;
      logo_url: string | null;
    } | {
      id: string;
      name: string;
      logo_url: string | null;
    }[] | null;
  } | {
    id: string;
    title: string;
    slug: string;
    location_city: string | null;
    location_country: string | null;
    job_type: string | null;
    work_mode: string | null;
    companies: {
      id: string;
      name: string;
      logo_url: string | null;
    } | {
      id: string;
      name: string;
      logo_url: string | null;
    }[] | null;
  }[] | null;
};

function getBadgeVariant(status: string): "default" | "blue" | "green" | "yellow" | "red" | "gray" {
  switch (status) {
    case "shortlisted":
    case "selected":
      return "green";
    case "interviewing":
      return "blue";
    case "reviewing":
      return "yellow";
    case "rejected":
      return "red";
    default:
      return "gray";
  }
}

export default async function ApplicationsPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const supabase = createSupabaseAdminClient();

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id")
    .eq("clerk_user_id", userId)
    .maybeSingle();

  if (profileError) {
    console.error("Profile lookup failed:", profileError.message);
    throw new Error("Failed to verify account profile");
  }

  if (!profile) {
    redirect("/onboarding");
  }

  const { data: rawApplications } = await supabase
    .from("applications")
    .select(
      `
        id,
        status,
        cover_letter,
        applied_at,
        updated_at,
        jobs (
          id,
          title,
          slug,
          location_city,
          location_country,
          job_type,
          work_mode,
          companies (
            id,
            name,
            logo_url
          )
        )
      `,
    )
    .eq("student_id", profile.id)
    .order("applied_at", { ascending: false });

  const applications = (rawApplications as unknown as ApplicationItem[]) ?? [];

  return (
    <main className="min-h-screen bg-[#070B14] px-4 py-8 text-white md:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-col justify-between gap-4 sm:flex-row sm:items-center">
          <div>
            <h1 className="text-3xl font-bold">My Applications</h1>
            <p className="mt-2 text-sm text-slate-400">
              Track the status of all opportunities you&apos;ve applied to.
            </p>
          </div>

          <Link
            href="/jobs"
            className="rounded-xl bg-blue-600 px-4 py-2.5 text-xs font-semibold text-white transition hover:bg-blue-500"
          >
            Browse More Jobs →
          </Link>
        </div>

        <div className="mt-8 space-y-4">
          {applications.length === 0 ? (
            <div className="rounded-2xl border border-slate-800 bg-[#0B1120] p-12 text-center">
              <h2 className="text-xl font-semibold">No applications yet</h2>
              <p className="mt-2 text-sm text-slate-400">
                Explore open jobs and submit your first application to kickstart your career.
              </p>
              <Link
                href="/jobs"
                className="mt-6 inline-flex rounded-xl bg-blue-600 px-5 py-3 text-sm font-semibold hover:bg-blue-500"
              >
                Browse open positions
              </Link>
            </div>
          ) : (
            applications.map((app) => {
              const job = Array.isArray(app.jobs) ? app.jobs[0] : app.jobs;
              const company = Array.isArray(job?.companies)
                ? job?.companies[0]
                : job?.companies;

              return (
                <Link
                  key={app.id}
                  href={`/applications/${app.id}`}
                  className="block rounded-2xl border border-slate-800 bg-[#0B1120] p-6 transition hover:border-blue-500/50 hover:bg-[#0E1628]"
                >
                  <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                    <div>
                      <p className="text-xs font-medium text-blue-400">
                        {company?.name ?? "Company"}
                      </p>
                      <h2 className="mt-1 text-lg font-semibold text-white">
                        {job?.title ?? "Job Opportunity"}
                      </h2>

                      <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-slate-400">
                        <span>Applied on {new Date(app.applied_at).toLocaleDateString()}</span>
                        {job?.location_city && (
                          <span>• 📍 {job.location_city}</span>
                        )}
                        {job?.work_mode && (
                          <span>• {job.work_mode}</span>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Badge variant={getBadgeVariant(app.status)}>
                        {app.status}
                      </Badge>
                      <span className="text-slate-500">→</span>
                    </div>
                  </div>
                </Link>
              );
            })
          )}
        </div>
      </div>
    </main>
  );
}