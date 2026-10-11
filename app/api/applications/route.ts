import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export async function GET() {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createSupabaseAdminClient();

  const { data: profile } = await supabase
    .from("profiles")
    .select("id")
    .eq("clerk_user_id", userId)
    .maybeSingle();

  if (!profile) {
    return NextResponse.json({ error: "Profile not found" }, { status: 404 });
  }

  const { data, error } = await supabase
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
          location_city,
          location_country,
          job_type,
          work_mode,
          companies (
            id,
            name,
            logo_url
          )
        )
      `,
    )
    .eq("student_id", profile.id)
    .order("applied_at", { ascending: false });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  return NextResponse.json({
    applications: data ?? [],
  });
}

export async function POST(request: Request) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const supabase = createSupabaseAdminClient();

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, account_status")
    .eq("clerk_user_id", userId)
    .maybeSingle();

  if (!profile) {
    return NextResponse.json({ error: "Profile not found" }, { status: 404 });
  }

  if (profile.account_status !== "active") {
    return NextResponse.json({ error: "Account is not active" }, { status: 403 });
  }

  try {
    const body = await request.json();
    const { job_id, cover_letter, resume_id } = body;

    if (!job_id) {
      return NextResponse.json({ error: "job_id is required" }, { status: 400 });
    }

    // Check if already applied
    const { data: existing } = await supabase
      .from("applications")
      .select("id")
      .eq("job_id", job_id)
      .eq("student_id", profile.id)
      .maybeSingle();

    if (existing) {
      return NextResponse.json(
        { error: "You have already applied for this job", applicationId: existing.id },
        { status: 400 },
      );
    }

    const now = new Date().toISOString();

    const { data: application, error: insertError } = await supabase
      .from("applications")
      .insert({
        job_id,
        student_id: profile.id,
        resume_id: resume_id ?? null,
        cover_letter: typeof cover_letter === "string" ? cover_letter.trim() || null : null,
        status: "applied",
        applied_at: now,
        updated_at: now,
      })
      .select()
      .single();

    if (insertError) {
      return NextResponse.json({ error: insertError.message }, { status: 500 });
    }

    return NextResponse.json(
      { message: "Application submitted successfully", application },
      { status: 201 },
    );
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Server error" },
      { status: 500 },
    );
  }
}