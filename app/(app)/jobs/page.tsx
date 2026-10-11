import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { JobsExplorer, type PublicJob } from "@/components/jobs/jobs-explorer";

export default async function JobsPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const supabase = createSupabaseAdminClient();

  // Find profile of logged in user
  const { data: profile } = await supabase
    .from("profiles")
    .select("id")
    .eq("clerk_user_id", userId)
    .maybeSingle();

  // Get published jobs with company info
  const { data: jobs, error } = await supabase
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
        created_at,
        companies (
          id,
          name,
          logo_url
        )
      `,
    )
    .eq("status", "published")
    .order("created_at", { ascending: false });

  // Get jobs already applied by current user
  let appliedJobIds: string[] = [];
  if (profile) {
    const { data: myApps } = await supabase
      .from("applications")
      .select("job_id")
      .eq("student_id", profile.id);

    if (myApps) {
      appliedJobIds = myApps.map((a) => a.job_id);
    }
  }

  return (
    <main className="min-h-screen bg-[#070B14] px-4 py-8 text-white md:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <p className="text-sm font-semibold tracking-wider text-blue-400 uppercase">
            Career Opportunities
          </p>
          <h1 className="mt-2 text-3xl font-bold">Find your next role</h1>
          <p className="mt-2 text-sm text-slate-400">
            Explore opportunities from verified companies on SkillForge.
          </p>
        </div>

        {error ? (
          <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-6 text-red-300">
            Unable to load jobs right now. Please try again later.
          </div>
        ) : (
          <JobsExplorer
            jobs={(jobs as unknown as PublicJob[]) ?? []}
            appliedJobIds={appliedJobIds}
          />
        )}
      </div>
    </main>
  );
}