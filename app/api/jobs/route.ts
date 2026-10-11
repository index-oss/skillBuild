import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export async function GET() {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 },
    );
  }

  const supabase = createSupabaseAdminClient();

  const { data, error } = await supabase
    .from("jobs")
    .select(`
      id,
      title,
      slug,
      description,
      location_city,
      location_state,
      location_country,
      job_type,
      work_mode,
      salary_min,
      salary_max,
      salary_currency,
      experience_min_years,
      experience_max_years,
      status,
      created_at,
      companies (
        id,
        name,
        logo_url
      )
    `)
    .eq("status", "published")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 },
    );
  }

  return NextResponse.json({
    jobs: data ?? [],
  });
}

function makeSlug(title: string) {
  const base = title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return `${base}-${Date.now()}`;
}

export async function POST(request: Request) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 },
    );
  }

  const body = await request.json();
  const supabase = createSupabaseAdminClient();

  const { data: profile } = await supabase
    .from("profiles")
    .select("id")
    .eq("clerk_user_id", userId)
    .maybeSingle();

  if (!profile) {
    return NextResponse.json(
      { error: "Profile not found" },
      { status: 404 },
    );
  }

  const {
    title,
    description,
    company_id,
    location_city,
    location_state,
    location_country,
    job_type,
    work_mode,
    employment_type,
    workplace_type,
    salary_min,
    salary_max,
    salary_currency,
    experience_min_years,
    experience_max_years,
  } = body;

  if (!title || !company_id) {
    return NextResponse.json(
      { error: "title and company_id are required" },
      { status: 400 },
    );
  }

  const resolvedJobType = job_type || employment_type || "full_time";
  const resolvedWorkMode = work_mode || workplace_type || "remote";

  const { data: job, error } = await supabase
    .from("jobs")
    .insert({
      title,
      slug: makeSlug(title),
      description: description ?? null,
      company_id,
      created_by: profile.id,
      location_city: location_city ?? null,
      location_state: location_state ?? null,
      location_country: location_country ?? null,
      job_type: resolvedJobType,
      work_mode: resolvedWorkMode,
      salary_min: salary_min ? Number(salary_min) : null,
      salary_max: salary_max ? Number(salary_max) : null,
      salary_currency: salary_currency || "INR",
      experience_min_years: experience_min_years ? Number(experience_min_years) : null,
      experience_max_years: experience_max_years ? Number(experience_max_years) : null,
      status: "draft",
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 },
    );
  }

  return NextResponse.json(
    { job },
    { status: 201 },
  );
}