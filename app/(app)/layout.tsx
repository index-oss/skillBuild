import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";
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

  const supabase = await createSupabaseServerClient();

  const { data: profile } = await supabase
    .from("profiles")
    .select("id, account_status")
    .eq("clerk_user_id", userId)
    .maybeSingle();

  if (!profile) {
    redirect("/onboarding");
  }

  if (profile.account_status !== "active") {
    redirect("/unauthorized");
  }

  return (
    <div className="min-h-screen bg-[#070B14] text-white">
      <div className="flex min-h-screen">
        <AppSidebar />

        <main className="min-w-0 flex-1 pb-20 md:pb-0">
          {children}
        </main>
      </div>

      <MobileNav />
    </div>
  );
}

