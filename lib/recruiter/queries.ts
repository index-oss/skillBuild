import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { getAuthenticatedProfile, canManageJob } from "@/lib/recruiter/permissions";

export async function getRecruiterJobs() {
  const profile = await getAuthenticatedProfile();

  if (!profile) {
    return [];
  }

  const supabase = createSupabaseAdminClient();

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
          logo_url,
          website_url
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

export async function getRecruiterJob(jobId: string) {
  const profile = await getAuthenticatedProfile();

  if (!profile) {
    return null;
  }

  const allowed = await canManageJob(jobId);
  if (!allowed) {
    return null;
  }

  const supabase = createSupabaseAdminClient();

  const { data: job, error } = await supabase
    .from("jobs")
    .select(
      `
        id,
        company_id,
        title,
        slug,
        description,
        job_type,
        work_mode,
        location_city,
        location_state,
        location_country,
        experience_min_years,
        experience_max_years,
        salary_min,
        salary_max,
        salary_currency,
        status,
        published_at,
        closes_at,
        created_at,
        companies (
          id,
          name,
          slug,
          logo_url,
          website_url,
          description,
          location_city,
          location_country
        )
      `,
    )
    .eq("id", jobId)
    .maybeSingle();

  if (error || !job) {
    console.error("Failed to load recruiter job:", error);
    return null;
  }

  const { count: applicantCount } = await supabase
    .from("applications")
    .select("id", { count: "exact", head: true })
    .eq("job_id", jobId);

  return {
    ...job,
    applicantCount: applicantCount ?? 0,
  };
}

export async function getJobApplicants(jobId: string) {
  const profile = await getAuthenticatedProfile();

  if (!profile) {
    return [];
  }

  const allowed = await canManageJob(jobId);
  if (!allowed) {
    return [];
  }

  const supabase = createSupabaseAdminClient();

  const { data: applications, error } = await supabase
    .from("applications")
    .select(
      `
        id,
        job_id,
        student_id,
        resume_id,
        cover_letter,
        status,
        applied_at,
        updated_at
      `,
    )
    .eq("job_id", jobId)
    .order("applied_at", { ascending: false });

  if (error) {
    console.error("Failed to load applicants:", error);
    return [];
  }

  if (!applications || applications.length === 0) {
    return [];
  }

  // Fetch profiles for all applicant student_ids
  const studentIds = Array.from(
    new Set(applications.map((app) => app.student_id).filter(Boolean)),
  );

  let profilesMap: Record<string, {
    id: string;
    display_name: string | null;
    first_name: string | null;
    last_name: string | null;
    avatar_url: string | null;
    location_city: string | null;
    location_country: string | null;
    bio: string | null;
  }> = {};

  if (studentIds.length > 0) {
    const { data: profiles } = await supabase
      .from("profiles")
      .select(
        "id, display_name, first_name, last_name, avatar_url, location_city, location_country, bio",
      )
      .in("id", studentIds);

    if (profiles) {
      profilesMap = Object.fromEntries(
        profiles.map((p) => [p.id, p]),
      );
    }
  }

  return applications.map((app) => ({
    ...app,
    profile: profilesMap[app.student_id] ?? null,
  }));
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

  const supabase = createSupabaseAdminClient();

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


