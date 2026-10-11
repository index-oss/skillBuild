import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

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
];

function makeSlug(title: string) {
  const base = title
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return `${base}-${Date.now()}`;
}

function numberOrNull(value: unknown) {
  if (
    value === null ||
    value === undefined ||
    value === ""
  ) {
    return null;
  }

  const number = Number(value);

  return Number.isFinite(number) ? number : null;
}

async function getRecruiterProfile(userId: string) {
  const { data, error } = await supabaseAdmin
    .from("profiles")
    .select("id, account_status")
    .eq("clerk_user_id", userId)
    .maybeSingle();

  if (error) {
    throw new Error(error.message);
  }

  return data;
}

export async function GET() {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 },
    );
  }

  try {
    const profile = await getRecruiterProfile(userId);

    if (!profile) {
      return NextResponse.json(
        { error: "Profile not found" },
        { status: 404 },
      );
    }

    if (profile.account_status !== "active") {
      return NextResponse.json(
        { error: "Account is not active" },
        { status: 403 },
      );
    }

    const { data: memberships, error } =
      await supabaseAdmin
        .from("company_members")
        .select("company_id, role, status")
        .eq("profile_id", profile.id)
        .eq("status", "active")
        .in("role", [
          "owner",
          "admin",
          "company_admin",
          "recruiter",
        ]);

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 },
      );
    }

    const companyIds =
      memberships?.map((item) => item.company_id) ?? [];

    if (companyIds.length === 0) {
      return NextResponse.json({
        companies: [],
      });
    }

    const { data: companies, error: companyError } =
      await supabaseAdmin
        .from("companies")
        .select("id, name, slug")
        .in("id", companyIds)
        .order("name");

    if (companyError) {
      return NextResponse.json(
        { error: companyError.message },
        { status: 500 },
      );
    }

    return NextResponse.json({
      companies: companies ?? [],
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Server error",
      },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 },
    );
  }

  try {
    const profile = await getRecruiterProfile(userId);

    if (!profile) {
      return NextResponse.json(
        { error: "Profile not found" },
        { status: 404 },
      );
    }

    if (profile.account_status !== "active") {
      return NextResponse.json(
        { error: "Account is not active" },
        { status: 403 },
      );
    }

    const body = await request.json();

    const companyId =
      typeof body.company_id === "string"
        ? body.company_id
        : "";

    const title =
      typeof body.title === "string"
        ? body.title.trim()
        : "";

    const description =
      typeof body.description === "string"
        ? body.description.trim()
        : "";

    if (!companyId) {
      return NextResponse.json(
        { error: "Company is required" },
        { status: 400 },
      );
    }

    if (!title) {
      return NextResponse.json(
        { error: "Job title is required" },
        { status: 400 },
      );
    }

    if (!description) {
      return NextResponse.json(
        { error: "Job description is required" },
        { status: 400 },
      );
    }

    const { data: membership, error: membershipError } =
      await supabaseAdmin
        .from("company_members")
        .select("id, role, status")
        .eq("company_id", companyId)
        .eq("profile_id", profile.id)
        .eq("status", "active")
        .in("role", [
          "owner",
          "admin",
          "company_admin",
          "recruiter",
        ])
        .maybeSingle();

    if (membershipError) {
      return NextResponse.json(
        { error: membershipError.message },
        { status: 500 },
      );
    }

    if (!membership) {
      return NextResponse.json(
        {
          error:
            "Your account does not have access to this company.",
        },
        { status: 403 },
      );
    }

    const jobType =
      typeof body.job_type === "string"
        ? body.job_type
        : "full_time";

    const workMode =
      typeof body.work_mode === "string"
        ? body.work_mode
        : "remote";

    const status =
      typeof body.status === "string"
        ? body.status
        : "draft";

    if (!JOB_TYPES.includes(jobType)) {
      return NextResponse.json(
        { error: "Invalid job type" },
        { status: 400 },
      );
    }

    if (!WORK_MODES.includes(workMode)) {
      return NextResponse.json(
        { error: "Invalid work mode" },
        { status: 400 },
      );
    }

    if (!JOB_STATUSES.includes(status)) {
      return NextResponse.json(
        { error: "Invalid job status" },
        { status: 400 },
      );
    }

    const experienceMin = numberOrNull(
      body.experience_min_years,
    );

    const experienceMax = numberOrNull(
      body.experience_max_years,
    );

    const salaryMin = numberOrNull(body.salary_min);
    const salaryMax = numberOrNull(body.salary_max);

    if (
      experienceMin !== null &&
      experienceMax !== null &&
      experienceMin > experienceMax
    ) {
      return NextResponse.json(
        {
          error:
            "Minimum experience cannot exceed maximum experience.",
        },
        { status: 400 },
      );
    }

    if (
      salaryMin !== null &&
      salaryMax !== null &&
      salaryMin > salaryMax
    ) {
      return NextResponse.json(
        {
          error:
            "Minimum salary cannot exceed maximum salary.",
        },
        { status: 400 },
      );
    }

    const closesAt =
      typeof body.closes_at === "string" &&
      body.closes_at
        ? `${body.closes_at}T23:59:59.000Z`
        : null;

    const { data: job, error: jobError } =
      await supabaseAdmin
        .from("jobs")
        .insert({
          company_id: companyId,
          created_by: profile.id,
          title,
          slug: makeSlug(title),
          description,
          job_type: jobType,
          work_mode: workMode,
          location_city:
            typeof body.location_city === "string" &&
            body.location_city.trim()
              ? body.location_city.trim()
              : null,
          location_state:
            typeof body.location_state === "string" &&
            body.location_state.trim()
              ? body.location_state.trim()
              : null,
          location_country:
            typeof body.location_country === "string" &&
            body.location_country.trim()
              ? body.location_country.trim()
              : null,
          experience_min_years: experienceMin,
          experience_max_years: experienceMax,
          salary_min: salaryMin,
          salary_max: salaryMax,
          salary_currency:
            typeof body.salary_currency === "string"
              ? body.salary_currency.toUpperCase()
              : "INR",
          status,
          published_at:
            status === "published"
              ? new Date().toISOString()
              : null,
          closes_at: closesAt,
        })
        .select("*")
        .single();

    if (jobError) {
      return NextResponse.json(
        { error: jobError.message },
        { status: 500 },
      );
    }

    return NextResponse.json(
      {
        message:
          status === "published"
            ? "Job published successfully"
            : "Job saved as draft",
        job,
      },
      { status: 201 },
    );
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Server error",
      },
      { status: 500 },
    );
  }
}