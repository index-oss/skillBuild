import { createSupabaseServerClient } from "@/lib/supabase/server";
import { getAuthenticatedProfile } from "@/lib/recruiter/permissions";

export async function getRecruiterJobs() {
  const profile = await getAuthenticatedProfile();

  if (!profile) {
    return [];
  }

  const supabase = await createSupabaseServerClient();

  const { data: memberships, error: membershipError } = await supabase
    .from("company_members")
    .select("company_id")
    .eq("profile_id", profile.id)
    .eq("status", "active");

  if (membershipError || !memberships?.length) {
    return [];
  }

  const companyIds = memberships.map((item) => item.company_id);

  const { data, error } = await supabase
    .from("jobs")
    .select(
      `
        id,
        title,
        description,
        location_city,
        location_state,
        location_country,
        job_type,
        work_mode,
        status,
        created_at,
        companies (
          id,
          name,
          logo_url
        )
      `,
    )
    .in("company_id", companyIds)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to load recruiter jobs:", error);
    return [];
  }

  return data ?? [];
}

export async function getJobApplicants(jobId: string) {
  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("applications")
    .select(
      `
        id,
        status,
        created_at,
        updated_at,
        student_id,
        profiles (
          id,
          display_name,
          first_name,
          last_name,
          avatar_url,
          location_city,
          location_country
        )
      `,
    )
    .eq("job_id", jobId)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Failed to load applicants:", error);
    return [];
  }

  return data ?? [];
}

export async function getRecruiterStats() {
  const jobs = await getRecruiterJobs();

  const jobIds = jobs.map((job) => job.id);

  if (!jobIds.length) {
    return {
      jobs: 0,
      activeJobs: 0,
      applications: 0,
      shortlisted: 0,
    };
  }

  const supabase = await createSupabaseServerClient();

  const { data: applications } = await supabase
    .from("applications")
    .select("id, status, job_id")
    .in("job_id", jobIds);

  const allApplications = applications ?? [];

  return {
    jobs: jobs.length,
    activeJobs: jobs.filter((job) => job.status === "published").length,
    applications: allApplications.length,
    shortlisted: allApplications.filter(
      (application) => application.status === "shortlisted",
    ).length,
  };
}

