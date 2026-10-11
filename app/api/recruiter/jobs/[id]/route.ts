import { NextResponse } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { getAuthenticatedProfile, canManageJob } from "@/lib/recruiter/permissions";

type RouteContext = {
  params: Promise<{ id: string }>;
};

const JOB_TYPES = [
  "full_time",
  "part_time",
  "internship",
  "contract",
  "freelance",
];

const WORK_MODES = [
  "remote",
  "hybrid",
  "onsite",
];

const JOB_STATUSES = [
  "draft",
  "published",
  "closed",
  "archived",
];

function numberOrNull(value: unknown) {
  if (value === null || value === undefined || value === "") {
    return null;
  }
  const number = Number(value);
  return Number.isFinite(number) ? number : null;
}

export async function GET(
  _request: Request,
  context: RouteContext,
) {
  const profile = await getAuthenticatedProfile();

  if (!profile) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;

  const allowed = await canManageJob(id);
  if (!allowed) {
    return NextResponse.json(
      { error: "You do not have permission to view this job" },
      { status: 403 },
    );
  }

  const supabase = createSupabaseAdminClient();

  const { data: job, error } = await supabase
    .from("jobs")
    .select(
      `
        *,
        companies (
          id,
          name,
          slug,
          logo_url,
          website_url
        )
      `,
    )
    .eq("id", id)
    .maybeSingle();

  if (error || !job) {
    return NextResponse.json(
      { error: error?.message || "Job not found" },
      { status: 404 },
    );
  }

  const { count: applicantCount } = await supabase
    .from("applications")
    .select("id", { count: "exact", head: true })
    .eq("job_id", id);

  return NextResponse.json({
    job: {
      ...job,
      applicantCount: applicantCount ?? 0,
    },
  });
}

export async function PATCH(
  request: Request,
  context: RouteContext,
) {
  const profile = await getAuthenticatedProfile();

  if (!profile) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await context.params;

  const allowed = await canManageJob(id);
  if (!allowed) {
    return NextResponse.json(
      { error: "You do not have permission to update this job" },
      { status: 403 },
    );
  }

  try {
    const body = await request.json();
    const supabase = createSupabaseAdminClient();

    // Fetch existing job
    const { data: existingJob, error: fetchError } = await supabase
      .from("jobs")
      .select("id, status, published_at")
      .eq("id", id)
      .maybeSingle();

    if (fetchError || !existingJob) {
      return NextResponse.json({ error: "Job not found" }, { status: 404 });
    }

    const updates: Record<string, unknown> = {
      updated_at: new Date().toISOString(),
    };

    if (typeof body.title === "string") {
      const trimmed = body.title.trim();
      if (!trimmed) {
        return NextResponse.json({ error: "Title cannot be empty" }, { status: 400 });
      }
      updates.title = trimmed;
    }

    if (typeof body.description === "string") {
      const trimmed = body.description.trim();
      if (!trimmed) {
        return NextResponse.json({ error: "Description cannot be empty" }, { status: 400 });
      }
      updates.description = trimmed;
    }

    if (typeof body.job_type === "string") {
      if (!JOB_TYPES.includes(body.job_type)) {
        return NextResponse.json({ error: "Invalid job type" }, { status: 400 });
      }
      updates.job_type = body.job_type;
    }

    if (typeof body.work_mode === "string") {
      if (!WORK_MODES.includes(body.work_mode)) {
        return NextResponse.json({ error: "Invalid work mode" }, { status: 400 });
      }
      updates.work_mode = body.work_mode;
    }

    if ("location_city" in body) {
      updates.location_city = typeof body.location_city === "string" && body.location_city.trim() ? body.location_city.trim() : null;
    }
    if ("location_state" in body) {
      updates.location_state = typeof body.location_state === "string" && body.location_state.trim() ? body.location_state.trim() : null;
    }
    if ("location_country" in body) {
      updates.location_country = typeof body.location_country === "string" && body.location_country.trim() ? body.location_country.trim() : null;
    }

    if ("experience_min_years" in body) {
      updates.experience_min_years = numberOrNull(body.experience_min_years);
    }
    if ("experience_max_years" in body) {
      updates.experience_max_years = numberOrNull(body.experience_max_years);
    }
    if ("salary_min" in body) {
      updates.salary_min = numberOrNull(body.salary_min);
    }
    if ("salary_max" in body) {
      updates.salary_max = numberOrNull(body.salary_max);
    }
    if (typeof body.salary_currency === "string") {
      updates.salary_currency = body.salary_currency.toUpperCase();
    }

    if ("closes_at" in body) {
      updates.closes_at = typeof body.closes_at === "string" && body.closes_at ? `${body.closes_at}T23:59:59.000Z` : null;
    }

    if (typeof body.status === "string") {
      if (!JOB_STATUSES.includes(body.status)) {
        return NextResponse.json({ error: "Invalid job status" }, { status: 400 });
      }
      updates.status = body.status;
      if (body.status === "published" && !existingJob.published_at) {
        updates.published_at = new Date().toISOString();
      }
    }

    const { data: updatedJob, error: updateError } = await supabase
      .from("jobs")
      .update(updates)
      .eq("id", id)
      .select(
        `
          *,
          companies (
            id,
            name,
            slug,
            logo_url,
            website_url
          )
        `,
      )
      .single();

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 500 });
    }

    return NextResponse.json({
      message: "Job updated successfully",
      job: updatedJob,
    });
  } catch (err) {
    return NextResponse.json(
      { error: err instanceof Error ? err.message : "Server error" },
      { status: 500 },
    );
  }
}
