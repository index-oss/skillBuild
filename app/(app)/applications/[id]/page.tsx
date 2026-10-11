import Link from "next/link";
import { notFound } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { Badge } from "@/components/ui/badge";

type Props = {
  params: Promise<{ id: string }>;
};

const STAGES = [
  { key: "applied", label: "Applied" },
  { key: "reviewing", label: "Under Review" },
  { key: "shortlisted", label: "Shortlisted" },
  { key: "interviewing", label: "Interview" },
  { key: "selected", label: "Offer / Selected" },
];

function getStageIndex(status: string): number {
  switch (status) {
    case "applied":
      return 0;
    case "reviewing":
      return 1;
    case "shortlisted":
      return 2;
    case "interviewing":
      return 3;
    case "selected":
      return 4;
    case "rejected":
      return -1;
    default:
      return 0;
  }
}

export default async function ApplicationDetailPage({ params }: Props) {
  const { id } = await params;
  const { userId } = await auth();

  if (!userId) {
    notFound();
  }

  const supabase = createSupabaseAdminClient();

  const { data: profile } = await supabase
    .from("profiles")
    .select("id")
    .eq("clerk_user_id", userId)
    .maybeSingle();

  if (!profile) {
    notFound();
  }

  const { data: application } = await supabase
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
          description,
          location_city,
          location_country,
          job_type,
          work_mode,
          salary_min,
          salary_max,
          salary_currency,
          companies (
            id,
            name,
            logo_url,
            website_url
          )
        )
      `,
    )
    .eq("id", id)
    .eq("student_id", profile.id)
    .maybeSingle();

  if (!application) {
    notFound();
  }

  const job = Array.isArray(application.jobs)
    ? application.jobs[0]
    : application.jobs;

  const company = Array.isArray(job?.companies)
    ? job?.companies[0]
    : job?.companies;

  const currentStageIndex = getStageIndex(application.status);
  const isRejected = application.status === "rejected";

  return (
    <main className="min-h-screen bg-[#070B14] px-4 py-8 text-white md:px-8">
      <div className="mx-auto max-w-4xl">
        <Link
          href="/applications"
          className="text-sm text-slate-400 hover:text-white"
        >
          ← Back to all applications
        </Link>

        {/* Application Header Card */}
        <div className="mt-6 rounded-2xl border border-slate-800 bg-[#0B1120] p-6 md:p-8">
          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div>
              <p className="text-sm font-medium text-blue-400">
                {company?.name ?? "Company"}
              </p>
              <h1 className="mt-1 text-2xl font-bold sm:text-3xl">
                {job?.title ?? "Job Application"}
              </h1>
              <p className="mt-2 text-xs text-slate-400">
                Application ID: <span className="font-mono">{application.id}</span>
              </p>
            </div>

            <Badge
              variant={
                application.status === "selected" || application.status === "shortlisted"
                  ? "green"
                  : isRejected
                    ? "red"
                    : "blue"
              }
            >
              {application.status}
            </Badge>
          </div>

          {/* Progress Stepper */}
          <div className="mt-8 border-t border-slate-800 pt-6">
            <h3 className="mb-4 text-xs font-semibold uppercase tracking-wider text-slate-400">
              Application Progress
            </h3>

            {isRejected ? (
              <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-300">
                <span className="font-semibold">Application Closed:</span> Unfortunately, the hiring team has decided not to proceed with this application. Keep exploring and applying to other roles on SkillForge!
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
                {STAGES.map((stage, idx) => {
                  const isCompleted = idx <= currentStageIndex;
                  const isCurrent = idx === currentStageIndex;

                  return (
                    <div
                      key={stage.key}
                      className={[
                        "flex flex-col items-center rounded-xl p-3 text-center transition",
                        isCurrent
                          ? "border border-blue-500/40 bg-blue-500/10"
                          : isCompleted
                            ? "bg-slate-800/60"
                            : "bg-slate-900/30 opacity-40",
                      ].join(" ")}
                    >
                      <span
                        className={[
                          "flex h-7 w-7 items-center justify-center rounded-full text-xs font-bold",
                          isCurrent
                            ? "bg-blue-500 text-white"
                            : isCompleted
                              ? "bg-emerald-500/20 text-emerald-400"
                              : "bg-slate-800 text-slate-500",
                        ].join(" ")}
                      >
                        {isCompleted && !isCurrent ? "✓" : idx + 1}
                      </span>
                      <span className="mt-2 text-xs font-medium text-slate-200">
                        {stage.label}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {/* Submitted Cover Letter / Note */}
          {application.cover_letter && (
            <div className="mt-8 border-t border-slate-800 pt-6">
              <h3 className="text-sm font-semibold text-white">
                Your Note to the Recruiter
              </h3>
              <div className="mt-3 rounded-xl border border-slate-800 bg-[#070B14] p-4 text-xs leading-relaxed text-slate-300 whitespace-pre-wrap">
                {application.cover_letter}
              </div>
            </div>
          )}

          {/* Timeline details */}
          <div className="mt-8 grid gap-4 border-t border-slate-800 pt-6 text-xs text-slate-400 sm:grid-cols-2">
            <div>
              <span className="text-slate-500">Submitted on:</span>{" "}
              <span className="text-slate-300">
                {new Date(application.applied_at).toLocaleString()}
              </span>
            </div>
            <div>
              <span className="text-slate-500">Last updated:</span>{" "}
              <span className="text-slate-300">
                {new Date(application.updated_at).toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Opportunity Card */}
        {job && (
          <div className="mt-6 rounded-2xl border border-slate-800 bg-[#0B1120] p-6">
            <div className="flex flex-col justify-between gap-3 sm:flex-row sm:items-center">
              <div>
                <h3 className="text-lg font-semibold text-white">
                  About the Role: {job.title}
                </h3>
                <p className="mt-1 text-xs text-slate-400">
                  {job.work_mode} • {job.job_type?.replace("_", " ")}
                  {job.location_city ? ` • 📍 ${job.location_city}` : ""}
                </p>
              </div>

              <Link
                href={`/jobs/${job.id}`}
                className="rounded-xl border border-slate-700 px-4 py-2 text-xs font-semibold text-slate-300 hover:bg-slate-800 hover:text-white"
              >
                View Full Job Post →
              </Link>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
