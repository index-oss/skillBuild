import { NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { getAuthenticatedProfile, canManageJob } from "@/lib/recruiter/permissions";

type RouteContext = {
  params: Promise<{ id: string }>;
};

const VALID_STATUSES = ["draft", "published", "closed", "archived"];

export async function PATCH(
  request: Request,
  context: RouteContext,
) {
  const profile = await getAuthenticatedProfile();

  if (!profile) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;

  const allowed = await canManageJob(id);
  if (!allowed) {
    return NextResponse.json(
      { error: "You do not have permission to manage this job status" },
      { status: 403 },
    );
  }

  try {
    const body = await request.json();
    const { status } = body;

    if (!status || !VALID_STATUSES.includes(status)) {
      return NextResponse.json(
        { error: `Invalid status. Must be one of: ${VALID_STATUSES.join(", ")}` },
        { status: 400 },
      );
    }

    const supabase = createSupabaseAdminClient();

    const { data: existingJob, error: fetchError } = await supabase
      .from("jobs")
      .select("id, status, published_at")
      .eq("id", id)
      .maybeSingle();

    if (fetchError || !existingJob) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    const updates: Record<string, unknown> = {
      status,
      updated_at: new Date().toISOString(),
    };

    if (status === "published" && !existingJob.published_at) {
      updates.published_at = new Date().toISOString();
    }

    const { data: job, error: updateError } = await supabase
      .from("jobs")
      .update(updates)
      .eq("id", id)
      .select("id, title, status, published_at, updated_at")
      .single();

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    return NextResponse.json({
      message: `Job status updated to ${status}`,
      job,
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Server error" },
      { status: 500 },
    );
  }
}
