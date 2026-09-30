import { currentUser } from "@clerk/nextjs/server";
import { PageHeader } from "@/components/page-header";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export default async function ProfilePage() {
  const user = await currentUser();

  const supabase = await createSupabaseServerClient();

  const { data: profile } = await supabase
    .from("profiles")
    .select("*")
    .eq("clerk_user_id", user?.id)
    .maybeSingle();

  const { data: roles } = profile
    ? await supabase
        .from("user_roles")
        .select("role")
        .eq("user_id", profile.id)
    : { data: [] };

  return (
    <div className="px-6 py-10 lg:px-10">
      <div className="mx-auto max-w-4xl">
        <PageHeader
          eyebrow="ACCOUNT"
          title="Your profile"
          description="Manage your SkillForge profile information."
        />

        <div className="space-y-6">
          <section className="rounded-2xl border border-white/10 bg-[#0D1422] p-6">
            <h2 className="text-lg font-semibold">
              Account
            </h2>

            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              <ProfileField
                label="Name"
                value={profile?.display_name}
              />

              <ProfileField
                label="Email"
                value={user?.primaryEmailAddress?.emailAddress}
              />

              <ProfileField
                label="City"
                value={profile?.location_city}
              />

              <ProfileField
                label="Country"
                value={profile?.location_country}
              />

              <ProfileField
                label="Status"
                value={profile?.account_status}
              />

              <ProfileField
                label="Roles"
                value={
                  roles?.map((item) => item.role).join(", ") ||
                  "student"
                }
              />
            </div>
          </section>

          <section className="rounded-2xl border border-white/10 bg-[#0D1422] p-6">
            <h2 className="text-lg font-semibold">
              About
            </h2>

            <p className="mt-4 whitespace-pre-wrap text-sm leading-7 text-slate-400">
              {profile?.bio || "No bio added yet."}
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}

function ProfileField({
  label,
  value,
}: {
  label: string;
  value?: string | null;
}) {
  return (
    <div>
      <p className="text-xs uppercase tracking-wide text-slate-500">
        {label}
      </p>

      <p className="mt-2 text-sm text-white">
        {value || "Not provided"}
      </p>
    </div>
  );
}
