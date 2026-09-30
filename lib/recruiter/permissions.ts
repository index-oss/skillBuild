import { auth } from "@clerk/nextjs/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type CompanyMemberRole =
  | "owner"
  | "admin"
  | "recruiter"
  | "viewer";

export async function getAuthenticatedProfile() {
  const { userId } = await auth();

  if (!userId) {
    return null;
  }

  const supabase = await createSupabaseServerClient();

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("id, clerk_user_id, display_name, account_status")
    .eq("clerk_user_id", userId)
    .maybeSingle();

  if (error || !profile) {
    return null;
  }

  return profile;
}

export async function getRecruiterCompanies() {
  const profile = await getAuthenticatedProfile();

  if (!profile) {
    return [];
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
          location_country
        )
      `,
    )
    .eq("profile_id", profile.id)
    .eq("status", "active");

  if (error) {
    console.error("Failed to load recruiter companies:", error);
    return [];
  }

  return data ?? [];
}

export async function canManageCompany(companyId: string) {
  const profile = await getAuthenticatedProfile();

  if (!profile) {
    return false;
  }

  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("company_members")
    .select("role")
    .eq("company_id", companyId)
    .eq("profile_id", profile.id)
    .eq("status", "active")
    .maybeSingle();

  if (error || !data) {
    return false;
  }

  return ["owner", "admin", "recruiter"].includes(data.role);
}

export async function canManageJob(jobId: string) {
  const profile = await getAuthenticatedProfile();

  if (!profile) {
    return false;
  }

  const supabase = await createSupabaseServerClient();

  const { data: job, error: jobError } = await supabase
    .from("jobs")
    .select("id, company_id")
    .eq("id", jobId)
    .maybeSingle();

  if (jobError || !job) {
    return false;
  }

  return canManageCompany(job.company_id);
}

export async function isCompanyAdmin(companyId: string) {
  const profile = await getAuthenticatedProfile();

  if (!profile) {
    return false;
  }

  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("company_members")
    .select("role")
    .eq("company_id", companyId)
    .eq("profile_id", profile.id)
    .eq("status", "active")
    .maybeSingle();

  if (error || !data) {
    return false;
  }

  return ["owner", "admin"].includes(data.role);
}

