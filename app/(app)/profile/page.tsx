import { currentUser } from "@clerk/nextjs/server";
import { PageHeader } from "@/components/page-header";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";
import { ProfileEditForm } from "@/components/profile/profile-edit-form";

export default async function ProfilePage() {
  const user = await currentUser();

  const supabase = createSupabaseAdminClient();

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("clerk_user_id", user?.id)
    .maybeSingle();

  const { data: rolesData } = profile
    ? await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", profile.id)
    : { data: [] };

  const roles = rolesData?.map((r: { role: string }) => r.role) || ["student"];

  return (
    <div className="px-6 py-10 lg:px-10">
      <div className="mx-auto max-w-4xl">
        <PageHeader
          eyebrow="ACCOUNT"
          title="Your profile"
          description="Manage your SkillForge profile information, picture, and personal bio."
        />

        <ProfileEditForm
          initialProfile={profile}
          email={user?.primaryEmailAddress?.emailAddress}
          roles={roles}
        />
      </div>
    </div>
  );
}
