import Link from "next/link";
import { auth, currentUser } from "@clerk/nextjs/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { PageHeader } from "@/components/page-header";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

type RecentApp = {
  id: string;
  status: string;
  applied_at: string;
  jobs: {
    id: string;
    title: string;
    companies: {
      id: string;
      name: string;
      logo_url: string | null;
    } | {
      id: string;
      name: string;
      logo_url: string | null;
    }[] | null;
  } | {
    id: string;
    title: string;
    companies: {
      id: string;
      name: string;
      logo_url: string | null;
    } | {
      id: string;
      name: string;
      logo_url: string | null;
    }[] | null;
  }[] | null;
};

type RecentJob = {
  id: string;
  title: string;
  job_type: string;
  work_mode: string;
  location_city: string | null;
  salary_min: number | null;
  salary_max: number | null;
  salary_currency: string | null;
  companies: {
    name: string;
  } | {
    name: string;
  }[] | null;
};

const navigationModules = [
  {
    title: "Career Roadmaps",
    description: "Follow guided skill paths designed for modern software engineering.",
    href: "/roadmaps",
    icon: "🗺️",
    badge: "Guided",
  },
  {
    title: "Production Projects",
    description: "Build portfolio-grade software to verify real implementation skills.",
    href: "/projects",
    icon: "🚀",
    badge: "Portfolio",
  },
  {
    title: "Coding Challenges",
    description: "Practice algorithmic problem solving and coding interviews.",
    href: "/challenges",
    icon: "💻",
    badge: "Practice",
  },
  {
    title: "Job Opportunities",
    description: "Browse verified engineering roles and track your active applications.",
    href: "/jobs",
    icon: "💼",
    badge: "Hiring",
  },
  {
    title: "Learning Resources",
    description: "Hand-picked articles, videos, and guides curated by experts.",
    href: "/resources",
    icon: "📚",
    badge: "Resources",
  },
  {
    title: "Hackathons & Events",
    description: "Discover tech meetups, webinars, and developer hackathons.",
    href: "/events",
    icon: "🏆",
    badge: "Community",
  },
];

function getBadgeVariant(status: string): "default" | "blue" | "green" | "yellow" | "red" | "gray" {
  switch (status) {
    case "shortlisted":
    case "selected":
      return "green";
    case "interviewing":
      return "blue";
    case "reviewing":
      return "yellow";
    case "rejected":
      return "red";
    default:
      return "gray";
  }
}

export default async function DashboardPage() {
  const { userId } = await auth();
  const user = await currentUser();

  const supabase = createSupabaseAdminClient();

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, display_name, avatar_url")
    .eq("clerk_user_id", userId!)
    .maybeSingle();

  const name =
    profile?.display_name ||
    user?.firstName ||
    "there";

  // Check roles
  let isRecruiterOrAdmin = false;
  if (profile) {
    const { data: roles } = await supabase
      .from("user_roles")
      .select("role")
      .eq("user_id", profile.id);

    if (roles) {
      isRecruiterOrAdmin = roles.some((r) => ["recruiter", "admin"].includes(r.role));
    }
  }

  // Count active jobs
  const { count: totalJobs } = await supabase
    .from("jobs")
    .select("id", { count: "exact", head: true })
    .eq("status", "published");

  // Count roadmaps
  const { count: totalRoadmaps } = await supabase
    .from("career_roadmaps")
    .select("id", { count: "exact", head: true });

  // Get user's applications
  let myApplications: RecentApp[] = [];
  let applicationsCount = 0;

  if (profile) {
    const { data: apps, count: appCount } = await supabase
      .from("applications")
      .select(
        `
          id,
          status,
          applied_at,
          jobs (
            id,
            title,
            companies (
              id,
              name,
              logo_url
            )
          )
        `,
        { count: "exact" },
      )
      .eq("student_id", profile.id)
      .order("applied_at", { ascending: false })
      .limit(3);

    myApplications = (apps as unknown as RecentApp[]) ?? [];
    applicationsCount = appCount ?? 0;
  }

  // Get latest 3 jobs
  const { data: latestJobs } = await supabase
    .from("jobs")
    .select(
      `
        id,
        title,
        job_type,
        work_mode,
        location_city,
        salary_min,
        salary_max,
        salary_currency,
        companies (
          name
        )
      `,
    )
    .eq("status", "published")
    .order("created_at", { ascending: false })
    .limit(3);

  const featuredJobs = (latestJobs as unknown as RecentJob[]) ?? [];

  return (
    <div className="px-6 py-10 lg:px-10">
      <div className="mx-auto max-w-7xl space-y-8">
        {/* Recruiter Workspace Banner if applicable */}
        {isRecruiterOrAdmin && (
          <div className="flex flex-col justify-between gap-4 rounded-2xl border border-purple-500/30 bg-purple-950/20 p-5 sm:flex-row sm:items-center">
            <div className="flex items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-purple-500/20 text-lg text-purple-400">
                🏢
              </span>
              <div>
                <p className="text-sm font-semibold text-white">
                  Recruiter Workspace Available
                </p>
                <p className="text-xs text-purple-300/80">
                  You have access to post jobs, review candidate applications, and manage hiring.
                </p>
              </div>
            </div>

            <Link
              href="/recruiter"
              className="rounded-xl bg-purple-600 px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-purple-600/20 transition hover:bg-purple-500 self-start sm:self-center"
            >
              Open Recruiter Dashboard →
            </Link>
          </div>
        )}

        {/* Header */}
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <PageHeader
              eyebrow="CAREER WORKSPACE"
              title={`Welcome back, ${name}`}
              description="Track your applications, practice technical skills, and unlock your next opportunity."
            />
          </div>

          {profile?.avatar_url && (
            <div className="relative hidden h-16 w-16 overflow-hidden rounded-2xl border-2 border-blue-500/40 bg-slate-800 shadow-lg sm:block">
              <img
                src={profile.avatar_url}
                alt={name}
                className="h-full w-full object-cover"
              />
            </div>
          )}
        </div>

        {/* Real-Time Stats Overview */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card className="p-5">
            <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
              My Applications
            </p>
            <p className="mt-2 text-3xl font-bold text-white">
              {applicationsCount}
            </p>
            <Link
              href="/applications"
              className="mt-2 inline-block text-xs text-blue-400 hover:underline"
            >
              View tracking pipeline →
            </Link>
          </Card>

          <Card className="p-5">
            <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
              Open Positions
            </p>
            <p className="mt-2 text-3xl font-bold text-white">
              {totalJobs ?? 0}
            </p>
            <Link
              href="/jobs"
              className="mt-2 inline-block text-xs text-blue-400 hover:underline"
            >
              Browse all jobs →
            </Link>
          </Card>

          <Card className="p-5">
            <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
              Career Roadmaps
            </p>
            <p className="mt-2 text-3xl font-bold text-white">
              {totalRoadmaps ?? 0}
            </p>
            <Link
              href="/roadmaps"
              className="mt-2 inline-block text-xs text-blue-400 hover:underline"
            >
              View learning paths →
            </Link>
          </Card>

          <Card className="p-5">
            <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
              Profile Status
            </p>
            <div className="mt-2 flex items-center gap-2">
              <span className="flex h-2.5 w-2.5 rounded-full bg-emerald-400" />
              <p className="text-lg font-semibold text-white">Active &amp; Verified</p>
            </div>
            <Link
              href="/profile"
              className="mt-2 inline-block text-xs text-blue-400 hover:underline"
            >
              Manage profile →
            </Link>
          </Card>
        </div>

        {/* Dynamic Section: Active Applications & Featured Jobs */}
        <div className="grid gap-6 lg:grid-cols-2">
          {/* Applications Widget */}
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-white">
                  Active Applications ({applicationsCount})
                </h2>
                <p className="text-xs text-slate-400">
                  Recent hiring status updates
                </p>
              </div>

              <Link
                href="/applications"
                className="text-xs font-medium text-blue-400 hover:underline"
              >
                View all →
              </Link>
            </div>

            {myApplications.length === 0 ? (
              <div className="mt-6 rounded-xl border border-slate-800 bg-[#070B14] p-6 text-center">
                <p className="text-sm font-medium text-slate-300">
                  No applications submitted yet
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  Find an open role and submit an application to start tracking.
                </p>
                <Link
                  href="/jobs"
                  className="mt-4 inline-block rounded-xl bg-blue-600 px-4 py-2 text-xs font-semibold text-white hover:bg-blue-500"
                >
                  Explore open jobs
                </Link>
              </div>
            ) : (
              <div className="mt-4 divide-y divide-slate-800">
                {myApplications.map((app) => {
                  const job = Array.isArray(app.jobs) ? app.jobs[0] : app.jobs;
                  const company = Array.isArray(job?.companies)
                    ? job?.companies[0]
                    : job?.companies;

                  return (
                    <Link
                      key={app.id}
                      href={`/applications/${app.id}`}
                      className="group flex items-center justify-between py-3.5 transition hover:opacity-80"
                    >
                      <div>
                        <p className="text-sm font-semibold text-white group-hover:text-blue-400">
                          {job?.title ?? "Job Application"}
                        </p>
                        <p className="text-xs text-slate-400">
                          {company?.name ?? "Company"} • Applied{" "}
                          {new Date(app.applied_at).toLocaleDateString()}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <Badge variant={getBadgeVariant(app.status)}>
                          {app.status}
                        </Badge>
                        <span className="text-xs text-slate-500">→</span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </Card>

          {/* Featured Open Opportunities */}
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-lg font-semibold text-white">
                  Featured Opportunities
                </h2>
                <p className="text-xs text-slate-400">
                  Latest roles looking for talent
                </p>
              </div>

              <Link
                href="/jobs"
                className="text-xs font-medium text-blue-400 hover:underline"
              >
                Browse all →
              </Link>
            </div>

            {featuredJobs.length === 0 ? (
              <div className="mt-6 rounded-xl border border-slate-800 bg-[#070B14] p-6 text-center">
                <p className="text-sm font-medium text-slate-300">
                  No jobs currently open
                </p>
                <p className="mt-1 text-xs text-slate-500">
                  New opportunities will be listed soon.
                </p>
              </div>
            ) : (
              <div className="mt-4 divide-y divide-slate-800">
                {featuredJobs.map((job) => {
                  const company = Array.isArray(job.companies)
                    ? job.companies[0]
                    : job.companies;

                  return (
                    <Link
                      key={job.id}
                      href={`/jobs/${job.id}`}
                      className="group flex items-center justify-between py-3.5 transition hover:opacity-80"
                    >
                      <div>
                        <p className="text-sm font-semibold text-white group-hover:text-blue-400">
                          {job.title}
                        </p>
                        <p className="text-xs text-slate-400">
                          {company?.name ?? "Company"}{" "}
                          {job.location_city ? `• 📍 ${job.location_city}` : ""}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <Badge variant="blue">{job.work_mode}</Badge>
                        <span className="text-xs text-slate-500">→</span>
                      </div>
                    </Link>
                  );
                })}
              </div>
            )}
          </Card>
        </div>

        {/* Learning & Career Modules Grid */}
        <div>
          <h2 className="text-xl font-bold text-white">
            Skill &amp; Career Hub
          </h2>
          <p className="mt-1 text-sm text-slate-400">
            Access curated learning tracks, practical projects, and competitive challenges.
          </p>

          <div className="mt-5 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {navigationModules.map((item) => (
              <Link
                key={item.title}
                href={item.href}
                className="group rounded-2xl border border-slate-800 bg-[#0B1120] p-6 transition hover:border-blue-500/50 hover:bg-[#0E1628]"
              >
                <div className="flex items-center justify-between">
                  <span className="text-2xl">{item.icon}</span>
                  <span className="rounded-full bg-slate-800 px-2.5 py-0.5 text-[10px] font-semibold text-slate-400 group-hover:bg-blue-500/10 group-hover:text-blue-400">
                    {item.badge}
                  </span>
                </div>

                <h3 className="mt-4 text-base font-semibold text-white group-hover:text-blue-400">
                  {item.title}
                </h3>

                <p className="mt-2 text-xs leading-relaxed text-slate-400">
                  {item.description}
                </p>

                <div className="mt-4 flex items-center text-xs font-semibold text-blue-400">
                  Open module <span className="ml-1 transition group-hover:translate-x-1">→</span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
