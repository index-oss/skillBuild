import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function GET() {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 },
    );
  }

  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("jobs")
    .select(`
      id,
      title,
      description,
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

export async function POST(request: Request) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 },
    );
  }

  const body = await request.json();

  const supabase = await createSupabaseServerClient();

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
    requirements,
    responsibilities,
    company_id,
    location_city,
    location_state,
    location_country,
    employment_type,
    workplace_type,
  } = body;

  if (!title || !company_id) {
    return NextResponse.json(
      { error: "title and company_id are required" },
      { status: 400 },
    );
  }

  const { data: job, error } = await supabase
    .from("jobs")
    .insert({
      title,
      description: description ?? null,
      requirements: requirements ?? null,
      responsibilities: responsibilities ?? null,
      company_id,
      location_city: location_city ?? null,
      location_state: location_state ?? null,
      location_country: location_country ?? null,
      employment_type: employment_type ?? null,
      workplace_type: workplace_type ?? null,
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