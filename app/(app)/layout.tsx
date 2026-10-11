import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { AppSidebar } from "@/components/app-sidebar";
import { MobileNav } from "@/components/layout/mobile-nav";

export const dynamic = "force-dynamic";

export default async function AppLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const supabase = createSupabaseAdminClient();

  const { data: profile, error } = await supabase
    .from("profiles")
    .select("id, account_status, display_name, avatar_url")
    .eq("clerk_user_id", userId)
    .maybeSingle();

  if (error) {
    console.error("Profile lookup failed:", error.message);
    throw new Error("Failed to verify account profile");
  }

  if (!profile) {
    redirect("/onboarding");
  }

  if (profile.account_status !== "active") {
    redirect("/unauthorized");
  }

  const { data: rolesData } = await supabase
    .from("user_roles")
    .select("role")
    .eq("user_id", profile.id);

  const roles = rolesData?.map((r: { role: string }) => r.role) || ["student"];
  const isRecruiter = roles.includes("recruiter") || roles.includes("admin");

  return (
    <div className="min-h-screen bg-[#070B14] text-white">
      <div className="flex min-h-screen">
        <AppSidebar
          profile={{
            displayName: profile.display_name,
            avatarUrl: profile.avatar_url,
            isRecruiter,
          }}
        />

        <main className="min-w-0 flex-1 pb-20 md:pb-0">
          {children}
        </main>
      </div>

      <MobileNav />
    </div>
  );
}
