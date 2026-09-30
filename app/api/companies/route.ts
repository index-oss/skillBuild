import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getAuthenticatedProfile } from "@/lib/recruiter/permissions";

export async function GET() {
  const profile = await getAuthenticatedProfile();

  if (!profile) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 },
    );
  }

  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("company_members")
    .select(
      `
        company_id,
        role,
        status,
        companies (
          id,
          name,
          slug,
          description,
          website,
          logo_url,
          location_city,
          location_state,
          location_country,
          created_at
        )
      `,
    )
    .eq("profile_id", profile.id)
    .eq("status", "active")
    .order("company_id");

  if (error) {
    console.error("Failed to load companies:", error);

    return NextResponse.json(
      { error: "Failed to load companies" },
      { status: 500 },
    );
  }

  return NextResponse.json({
    companies: data ?? [],
  });
}

export async function POST(request: Request) {
  const profile = await getAuthenticatedProfile();

  if (!profile) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 },
    );
  }

  const body = await request.json();

  const name =
    typeof body.name === "string"
      ? body.name.trim()
      : "";

  if (!name) {
    return NextResponse.json(
      { error: "Company name is required" },
      { status: 400 },
    );
  }

  const slug =
    typeof body.slug === "string" && body.slug.trim()
      ? body.slug.trim().toLowerCase()
      : name
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, "-")
          .replace(/^-|-$/g, "");

  const supabase = await createSupabaseServerClient();

  const { data: company, error: companyError } = await supabase
    .from("companies")
    .insert({
      name,
      slug,
      description:
        typeof body.description === "string"
          ? body.description.trim() || null
          : null,
      website:
        typeof body.website === "string"
          ? body.website.trim() || null
          : null,
      logo_url:
        typeof body.logo_url === "string"
          ? body.logo_url.trim() || null
          : null,
      location_city:
        typeof body.location_city === "string"
          ? body.location_city.trim() || null
          : null,
      location_state:
        typeof body.location_state === "string"
          ? body.location_state.trim() || null
          : null,
      location_country:
        typeof body.location_country === "string"
          ? body.location_country.trim() || null
          : null,
    })
    .select()
    .single();

  if (companyError) {
    console.error("Failed to create company:", companyError);

    return NextResponse.json(
      { error: companyError.message },
      { status: 500 },
    );
  }

  const { error: memberError } = await supabase
    .from("company_members")
    .insert({
      company_id: company.id,
      profile_id: profile.id,
      role: "owner",
      status: "active",
    });

  if (memberError) {
    console.error(
      "Failed to create company membership:",
      memberError,
    );

    await supabase
      .from("companies")
      .delete()
      .eq("id", company.id);

    return NextResponse.json(
      { error: "Company membership could not be created" },
      { status: 500 },
    );
  }

  return NextResponse.json(
    { company },
    { status: 201 },
  );
}

