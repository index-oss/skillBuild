import { auth } from "@clerk/nextjs/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export type CompanyMemberRole =
  | "owner"
  | "admin"
  | "company_admin"
  | "recruiter"
  | "viewer";

export async function getAuthenticatedProfile() {
  const { userId } = await auth();

  if (!userId) {
    return null;
  }

  const supabase = createSupabaseAdminClient();

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

  const supabase = createSupabaseAdminClient();

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
          website_url,
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

  const supabase = createSupabaseAdminClient();

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

<<<<<<< HEAD
  return ["owner", "admin", "company_admin", "recruiter"].includes(data.role);
=======
  return ["owner", "company_admin", "recruiter"].includes(data.role);
>>>>>>> 01e3ebe (Intital commit)
}

export async function canManageJob(jobId: string) {
  const profile = await getAuthenticatedProfile();

  if (!profile) {
    return false;
  }

  const supabase = createSupabaseAdminClient();

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

  const supabase = createSupabaseAdminClient();

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

<<<<<<< HEAD
  return ["owner", "admin", "company_admin"].includes(data.role);
=======
  return ["owner", "company_admin"].includes(data.role);
>>>>>>> 01e3ebe (Intital commit)
}


