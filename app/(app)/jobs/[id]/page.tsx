import { ApplyButton } from "@/components/applications/apply-button";

import Link from "next/link";
import { auth } from "@clerk/nextjs/server";
import { notFound, redirect } from "next/navigation";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function JobDetailPage({ params }: Props) {
  const { id } = await params;

  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const supabase = await createSupabaseServerClient();

  const { data: job } = await supabase
    .from("jobs")
    .select(`
      id,
      title,
      description,
      requirements,
      responsibilities,
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
        logo_url,
        description
      )
    `)
    .eq("id", id)
    .eq("status", "published")
    .maybeSingle();

  if (!job) {
    notFound();
  }

  const company = Array.isArray(job.companies)
    ? job.companies[0]
    : job.companies;

  return (
    <main className="min-h-screen bg-[#070B14] px-4 py-8 text-white md:px-8">
      <div className="mx-auto max-w-4xl">
        <Link
          href="/jobs"
          className="text-sm text-slate-400 hover:text-white"
        >
          ← Back to jobs
        </Link>

        <section className="mt-6 rounded-2xl border border-slate-800 bg-[#0B1120] p-6 md:p-8">
          <p className="text-sm text-blue-400">
            {company?.name ?? "Company"}
          </p>

          <h1 className="mt-2 text-3xl font-bold">{job.title}</h1>

          <div className="mt-4 flex flex-wrap gap-2 text-xs text-slate-400">
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

          <div className="mt-8">
            <h2 className="text-xl font-semibold">About the role</h2>

            <p className="mt-3 whitespace-pre-wrap leading-7 text-slate-300">
              {job.description || "No description provided."}
            </p>
          </div>

          {job.responsibilities && (
            <div className="mt-8">
              <h2 className="text-xl font-semibold">Responsibilities</h2>
              <p className="mt-3 whitespace-pre-wrap leading-7 text-slate-300">
                {job.responsibilities}
              </p>
            </div>
          )}

          {job.requirements && (
            <div className="mt-8">
              <h2 className="text-xl font-semibold">Requirements</h2>
              <p className="mt-3 whitespace-pre-wrap leading-7 text-slate-300">
                {job.requirements}
              </p>
            </div>
          )}

          <div className="mt-10">
            <ApplyButton jobId={job.id} />
          </div>
        </section>
      </div>
    </main>
  );
}