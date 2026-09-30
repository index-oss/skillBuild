import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function JobsPage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const supabase = await createSupabaseServerClient();

  const { data: profile } = await supabase
    .from("profiles")
    .select("id")
    .eq("clerk_user_id", userId)
    .maybeSingle();

  if (!profile) {
    redirect("/onboarding");
  }

  const { data: jobs, error } = await supabase
    .from("jobs")
    .select(`
      id,
      title,
      description,
      location_city,
      location_state,
      location_country,
      employment_type,
      workplace_type,
      status,
      created_at,
      companies (
        id,
        name,
        logo_url
      )
    `)
    .eq("status", "published")
    .order("created_at", { ascending: false });

  return (
    <main className="min-h-screen bg-[#070B14] px-4 py-8 text-white md:px-8">
      <div className="mx-auto max-w-6xl">
        <div className="mb-8">
          <p className="text-sm text-blue-400">CAREER OPPORTUNITIES</p>
          <h1 className="mt-2 text-3xl font-bold">Find your next role</h1>
          <p className="mt-2 text-slate-400">
            Explore opportunities from companies on SkillForge.
          </p>
        </div>

        {error ? (
          <div className="rounded-2xl border border-red-500/20 bg-red-500/10 p-6 text-red-300">
            Unable to load jobs right now.
          </div>
        ) : !jobs || jobs.length === 0 ? (
          <div className="rounded-2xl border border-slate-800 bg-[#0B1120] p-10 text-center">
            <h2 className="text-xl font-semibold">No jobs available</h2>
            <p className="mt-2 text-slate-400">
              Published opportunities will appear here.
            </p>
          </div>
        ) : (
          <div className="grid gap-5 md:grid-cols-2">
            {jobs.map((job: any) => {
              const company = Array.isArray(job.companies)
                ? job.companies[0]
                : job.companies;

              return (
                <Link
                  key={job.id}
                  href={`/jobs/${job.id}`}
                  className="group rounded-2xl border border-slate-800 bg-[#0B1120] p-6 transition hover:border-blue-500/50 hover:bg-[#0E1628]"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div>
                      <h2 className="text-lg font-semibold group-hover:text-blue-400">
                        {job.title}
                      </h2>

                      <p className="mt-1 text-sm text-slate-400">
                        {company?.name ?? "Company"}
                      </p>
                    </div>

                    <span className="rounded-full bg-emerald-500/10 px-3 py-1 text-xs text-emerald-400">
                      {job.status}
                    </span>
                  </div>

                  <p className="mt-4 line-clamp-3 text-sm text-slate-400">
                    {job.description || "No description provided."}
                  </p>

                  <div className="mt-5 flex flex-wrap gap-2 text-xs text-slate-400">
                    {job.employment_type && (
                      <span className="rounded-lg bg-slate-800 px-3 py-1">
                        {job.employment_type}
                      </span>
                    )}

                    {job.workplace_type && (
                      <span className="rounded-lg bg-slate-800 px-3 py-1">
                        {job.workplace_type}
                      </span>
                    )}

                    {job.location_city && (
                      <span className="rounded-lg bg-slate-800 px-3 py-1">
                        {job.location_city}
                      </span>
                    )}
                  </div>
                </Link>
              );
            })}
          </div>
        )}
      </div>
    </main>
  );
}