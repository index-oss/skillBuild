import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function ApplicationsPage() {
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

  const { data: applications } = await supabase
    .from("applications")
    .select(`
      id,
      status,
      created_at,
      jobs (
        id,
        title,
        companies (
          id,
          name
        )
      )
    `)
    .eq("profile_id", profile.id)
    .order("created_at", { ascending: false });

  return (
    <main className="min-h-screen bg-[#070B14] px-4 py-8 text-white md:px-8">
      <div className="mx-auto max-w-5xl">
        <h1 className="text-3xl font-bold">My Applications</h1>

        <p className="mt-2 text-slate-400">
          Track every opportunity you've applied to.
        </p>

        <div className="mt-8 space-y-4">
          {!applications || applications.length === 0 ? (
            <div className="rounded-2xl border border-slate-800 bg-[#0B1120] p-10 text-center">
              <h2 className="text-xl font-semibold">
                No applications yet
              </h2>

              <p className="mt-2 text-slate-400">
                Find a job and submit your first application.
              </p>

              <Link
                href="/jobs"
                className="mt-6 inline-flex rounded-xl bg-blue-600 px-5 py-3 font-medium hover:bg-blue-500"
              >
                Browse jobs
              </Link>
            </div>
          ) : (
            applications.map((application: any) => {
              const job = Array.isArray(application.jobs)
                ? application.jobs[0]
                : application.jobs;

              const company = Array.isArray(job?.companies)
                ? job?.companies[0]
                : job?.companies;

              return (
                <Link
                  key={application.id}
                  href={`/applications/${application.id}`}
                  className="block rounded-2xl border border-slate-800 bg-[#0B1120] p-6 transition hover:border-blue-500/50"
                >
                  <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                    <div>
                      <h2 className="font-semibold">
                        {job?.title ?? "Job"}
                      </h2>

                      <p className="mt-1 text-sm text-slate-400">
                        {company?.name ?? "Company"}
                      </p>
                    </div>

                    <span className="w-fit rounded-full bg-blue-500/10 px-3 py-1 text-xs capitalize text-blue-400">
                      {application.status}
                    </span>
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