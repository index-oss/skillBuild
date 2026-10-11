import { NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { getAuthenticatedProfile, canManageCompany } from "@/lib/recruiter/permissions";

type RouteContext = {
  params: Promise<{ id: string }>;
};

const VALID_APPLICATION_STATUSES = [
  "applied",
  "reviewing",
  "shortlisted",
  "interviewing",
  "rejected",
  "selected",
];

export async function PATCH(
  request: Request,
  context: RouteContext,
) {
  const profile = await getAuthenticatedProfile();

  if (!profile) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;

  try {
    const body = await request.json();
    const { status } = body;

    if (!status || !VALID_APPLICATION_STATUSES.includes(status)) {
      return NextResponse.json(
        {
          error: `Invalid application status. Allowed values: ${VALID_APPLICATION_STATUSES.join(", ")}`,
        },
        { status: 400 },
      );
    }

    const supabase = createSupabaseAdminClient();

    // Fetch the application and its job to check recruiter permission
    const { data: application, error: appError } = await supabase
      .from("applications")
      .select("id, job_id, student_id, status")
      .eq("id", id)
      .maybeSingle();

    if (appError || !application) {
      return NextResponse.json({ error: "Application not found" }, { status: 404 });
    }

    const { data: job, error: jobError } = await supabase
      .from("jobs")
      .select("id, company_id")
      .eq("id", application.job_id)
      .maybeSingle();

    if (jobError || !job) {
      return NextResponse.json({ error: "Associated job not found" }, { status: 404 });
    }

    const allowed = await canManageCompany(job.company_id);
    if (!allowed) {
      return NextResponse.json(
        { error: "You do not have permission to manage applications for this company" },
        { status: 403 },
      );
    }

    const { data: updatedApp, error: updateError } = await supabase
      .from("applications")
      .update({
        status,
        updated_at: new Date().toISOString(),
      })
      .eq("id", id)
      .select()
      .single();

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    return NextResponse.json({
      message: `Applicant status updated to ${status}`,
      application: updatedApp,
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Server error" },
      { status: 500 },
    );
  }
}
