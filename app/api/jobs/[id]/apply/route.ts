import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function POST(
  request: Request,
  context: RouteContext,
) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id: jobId } = await context.params;
  const supabase = createSupabaseAdminClient();

  // Find profile of logged in user
  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id, account_status")
    .eq("clerk_user_id", userId)
    .maybeSingle();

  if (profileError || !profile) {
    return NextResponse.json(
      { error: "Profile not found. Please complete onboarding first." },
      { status: 404 },
    );
  }

  if (profile.account_status !== "active") {
    return NextResponse.json(
      { error: "Your account is not active." },
      { status: 403 },
    );
  }

  // Verify job exists and is open
  const { data: job, error: jobError } = await supabase
    .from("jobs")
    .select("id, title, status")
    .eq("id", jobId)
    .maybeSingle();

  if (jobError || !job) {
    return NextResponse.json(
      { error: "Job opportunity not found." },
      { status: 404 },
    );
  }

  if (job.status !== "published") {
    return NextResponse.json(
      { error: "This job is no longer accepting applications." },
      { status: 400 },
    );
  }

  // Check if student has already applied
  const { data: existingApp } = await supabase
    .from("applications")
    .select("id, status")
    .eq("job_id", jobId)
    .eq("student_id", profile.id)
    .maybeSingle();

  if (existingApp) {
    return NextResponse.json(
      {
        error: "You have already applied for this job.",
        applicationId: existingApp.id,
      },
      { status: 400 },
    );
  }

  let body: { cover_letter?: string; resume_id?: string } = {};
  try {
    body = await request.json();
  } catch {
    body = {};
  }

  const coverLetter =
    typeof body.cover_letter === "string" && body.cover_letter.trim()
      ? body.cover_letter.trim()
      : null;

  const resumeId =
    typeof body.resume_id === "string" && body.resume_id.trim()
      ? body.resume_id.trim()
      : null;

  const now = new Date().toISOString();

  const { data: application, error: insertError } = await supabase
    .from("applications")
    .insert({
      job_id: jobId,
      student_id: profile.id,
      resume_id: resumeId,
      cover_letter: coverLetter,
      status: "applied",
      applied_at: now,
      updated_at: now,
    })
    .select()
    .single();

  if (insertError) {
    console.error("Failed to submit application:", insertError);
    return NextResponse.json(
      { error: insertError.message || "Failed to submit application" },
      { status: 500 },
    );
  }

  return NextResponse.json(
    {
      message: "Application submitted successfully",
      application,
    },
    { status: 201 },
  );
}
