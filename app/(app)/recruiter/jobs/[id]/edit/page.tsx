import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { hasAnyRole } from "@/lib/auth/roles";
import { getRecruiterJob } from "@/lib/recruiter/queries";
import { PageShell } from "@/components/layout/page-shell";
import { EditJobForm } from "@/components/recruiter/edit-job-form";

type Props = {
  params: Promise<{ id: string }>;
};

export default async function EditRecruiterJobPage({ params }: Props) {
  const allowed = await hasAnyRole(["recruiter", "admin"]);

  if (!allowed) {
    redirect("/unauthorized");
  }

  const { id } = await params;
  const job = await getRecruiterJob(id);

  if (!job) {
    notFound();
  }

  return (
    <PageShell>
      <div className="mx-auto max-w-4xl">
        <div className="mb-8">
          <Link
            href={`/recruiter/jobs/${job.id}`}
            className="mb-4 inline-block text-sm text-slate-400 hover:text-white"
          >
            ← Back to job overview
          </Link>

          <h1 className="text-3xl font-bold tracking-tight text-white">
            Edit Job
          </h1>

          <p className="mt-2 text-sm text-slate-400">
            Update job details, requirements, and status.
          </p>
        </div>

        <EditJobForm job={job} />
      </div>
    </PageShell>
  );
}
