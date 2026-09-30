import { auth } from "@clerk/nextjs/server";
import { currentUser } from "@clerk/nextjs/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
import { DashboardCard } from "@/components/dashboard-card";
import { PageHeader } from "@/components/page-header";

const cards = [
  {
    title: "Career Roadmap",
    description:
      "Build a personalized path toward your target career.",
    href: "/roadmaps",
    icon: "→",
  },
  {
    title: "Projects",
    description:
      "Discover projects that build real-world skills.",
    href: "/projects",
    icon: "◆",
  },
  {
    title: "Coding Challenges",
    description:
      "Practice coding and improve your problem-solving skills.",
    href: "/challenges",
    icon: "</>",
  },
  {
    title: "Jobs",
    description:
      "Discover jobs and track your applications.",
    href: "/jobs",
    icon: "↗",
  },
  {
    title: "Resume Analysis",
    description:
      "Analyze and improve your resume.",
    href: "/resume",
    icon: "▤",
  },
  {
    title: "Learning Resources",
    description:
      "Find courses, videos and useful learning material.",
    href: "/resources",
    icon: "◎",
  },
  {
    title: "Tech Events",
    description:
      "Find upcoming technology events.",
    href: "/events",
    icon: "◇",
  },
];

export default async function DashboardPage() {
  const { userId } = await auth();
  const user = await currentUser();

  const supabase = await createSupabaseServerClient();

  const { data: profile } = await supabase
    .from("profiles")
    .select("display_name")
    .eq("clerk_user_id", userId!)
    .maybeSingle();

  const name =
    profile?.display_name ||
    user?.firstName ||
    "there";

  return (
    <div className="px-6 py-10 lg:px-10">
      <div className="mx-auto max-w-7xl">
        <PageHeader
          eyebrow="CAREER WORKSPACE"
          title={`Welcome back, ${name}`}
          description="Everything you need to learn, practice, build and find your next opportunity."
        />

        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((card) => (
            <DashboardCard
              key={card.title}
              title={card.title}
              description={card.description}
              href={card.href}
              icon={card.icon}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
