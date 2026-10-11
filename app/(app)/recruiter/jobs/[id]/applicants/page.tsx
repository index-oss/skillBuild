import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { hasAnyRole } from "@/lib/auth/roles";
import { getRecruiterJob, getJobApplicants } from "@/lib/recruiter/queries";
import { PageShell } from "@/components/layout/page-shell";
import { JobApplicantsManager } from "@/components/recruiter/job-applicants-manager";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function RecruiterApplicantsPage({ params }: Props) {
  const allowed = await hasAnyRole(["recruiter", "admin"]);

  if (!allowed) {
    redirect("/unauthorized");
  }

  const { id } = await params;
  const job = await getRecruiterJob(id);

  if (!job) {
    notFound();
  }

  const applicants = await getJobApplicants(id);

  return (
    <PageShell>
      <div className="flex flex-col gap-6">
        <div>
          <Link
            href={`/recruiter/jobs/${job.id}`}
            className="mb-4 inline-block text-sm text-slate-400 hover:text-white"
          >
            ← Back to job overview
          </Link>

          <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
            <div>
              <p className="text-sm font-medium text-blue-400">
                Candidate Pipeline
              </p>
              <h1 className="mt-1 text-3xl font-bold tracking-tight text-white">
                Applicants: {job.title}
              </h1>
              <p className="mt-2 text-sm text-slate-400">
                Review submissions, shortlist top talent, and manage candidate statuses.
              </p>
            </div>
          </div>
        </div>

        <JobApplicantsManager jobId={job.id} initialApplicants={applicants} />
      </div>
    </PageShell>
  );
}
