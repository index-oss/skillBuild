import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import {
  getAuthenticatedProfile,
  isCompanyAdmin,
} from "@/lib/recruiter/permissions";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

export async function GET(
  _request: Request,
  context: RouteContext,
) {
  const profile = await getAuthenticatedProfile();

  if (!profile) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 },
    );
  }

  const { id } = await context.params;

  const supabase = await createSupabaseServerClient();

  const { data: membership } = await supabase
    .from("company_members")
    .select("role, status")
    .eq("company_id", id)
    .eq("profile_id", profile.id)
    .eq("status", "active")
    .maybeSingle();

  if (!membership) {
    return NextResponse.json(
      { error: "You do not have access to this company" },
      { status: 403 },
    );
  }

  const { data: company, error } = await supabase
    .from("companies")
    .select("*")
    .eq("id", id)
    .maybeSingle();

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 },
    );
  }

  if (!company) {
    return NextResponse.json(
      { error: "Company not found" },
      { status: 404 },
    );
  }

  const { data: members } = await supabase
    .from("company_members")
    .select(
      `
        profile_id,
        role,
        status,
        profiles (
          id,
          display_name,
          first_name,
          last_name,
          avatar_url
        )
      `,
    )
    .eq("company_id", id)
    .eq("status", "active");

  return NextResponse.json({
    company,
    membership,
    members: members ?? [],
  });
}

export async function PATCH(
  request: Request,
  context: RouteContext,
) {
  const profile = await getAuthenticatedProfile();

  if (!profile) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 },
    );
  }

  const { id } = await context.params;

  const allowed = await isCompanyAdmin(id);

  if (!allowed) {
    return NextResponse.json(
      { error: "Only company owners or admins can update this company" },
      { status: 403 },
    );
  }

  const body = await request.json();

  const updates: Record<string, string | null> = {};

  const fields = [
    "name",
    "slug",
    "description",
    "website",
    "logo_url",
    "location_city",
    "location_state",
    "location_country",
  ];

  for (const field of fields) {
    if (field in body) {
      updates[field] =
        typeof body[field] === "string"
          ? body[field].trim() || null
          : null;
    }
  }

  if (
    "name" in updates &&
    !updates.name
  ) {
    return NextResponse.json(
      { error: "Company name cannot be empty" },
      { status: 400 },
    );
  }

  const supabase = await createSupabaseServerClient();

  const { data: company, error } = await supabase
    .from("companies")
    .update(updates)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 },
    );
  }

  return NextResponse.json({ company });
}


