import Link from "next/link";
import { notFound } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function ApplicationDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const { userId } = await auth();

  if (!userId) {
    notFound();
  }

  const supabase = await createSupabaseServerClient();

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
    .select("*")
    .eq("id", id)
    .eq("student_id", profile.id)
    .maybeSingle();

  if (!application) {
    notFound();
  }

  return (
    <div className="p-6 md:p-8">
      <Link
        href="/applications"
        className="text-sm text-blue-400"
      >
        ← Back to applications
      </Link>

      <div className="mt-6 max-w-3xl">
        <span className="rounded-full bg-blue-500/10 px-3 py-1 text-xs text-blue-400">
          Application
        </span>

        <h1 className="mt-4 text-3xl font-bold">
          Application Details
        </h1>

        <div className="mt-8 rounded-2xl border border-slate-800 bg-slate-900/70 p-6">
          <div className="flex items-center justify-between">
            <span className="text-slate-400">Status</span>

            <span className="rounded-full bg-blue-500/10 px-3 py-1 text-sm text-blue-400">
              {application.status ?? "applied"}
            </span>
          </div>

          <div className="mt-6">
            <p className="text-sm text-slate-500">Job</p>
            <p className="mt-1 font-medium">
              {application.job_id}
            </p>
          </div>

          {application.created_at && (
            <div className="mt-6">
              <p className="text-sm text-slate-500">Applied</p>
              <p className="mt-1 text-slate-300">
                {new Date(application.created_at).toLocaleDateString()}
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
