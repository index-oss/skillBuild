import { auth, currentUser } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { PageHeader } from "@/components/page-header";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { ResumeBuilderClient } from "@/components/resume/resume-builder";

export default async function ResumePage() {
  const { userId } = await auth();

  if (!userId) {
    redirect("/sign-in");
  }

  const user = await currentUser();
  const supabase = createSupabaseAdminClient();

  const { data: profile } = await supabase
    .from("profiles")
    .select("display_name, bio, location_city, location_country")
    .eq("clerk_user_id", userId)
    .maybeSingle();

  return (
    <div className="px-6 py-10 lg:px-10">
      <div className="mx-auto max-w-6xl">
        <PageHeader
          eyebrow="CAREER TOOLS"
          title="Resume Builder"
          description="Craft a professional resume customized for tech applications. Edit in real-time and export to PDF."
        />

        <ResumeBuilderClient
          initialProfile={profile}
          email={user?.primaryEmailAddress?.emailAddress}
        />
      </div>
    </div>
  );
}
