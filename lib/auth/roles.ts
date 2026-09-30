import { auth } from "@clerk/nextjs/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export type AppRole =
  | "student"
  | "educator"
  | "recruiter"
  | "admin";

export async function getCurrentUserRoles(): Promise<AppRole[]> {
  const { userId } = await auth();

  if (!userId) {
    return [];
  }

  const supabase = await createSupabaseServerClient();

  const { data: profile } = await supabase
    .from("profiles")
    .select("id")
    .eq("clerk_user_id", userId)
    .maybeSingle();

  if (!profile) {
    return [];
  }

  const { data } = await supabase
    .from("user_roles")
    .select("role")
    .eq("profile_id", profile.id);

  return (data ?? [])
    .map((item) => item.role as AppRole)
    .filter(Boolean);
}

export async function hasRole(role: AppRole) {
  const roles = await getCurrentUserRoles();
  return roles.includes(role);
}

export async function hasAnyRole(allowedRoles: AppRole[]) {
  const roles = await getCurrentUserRoles();

  return roles.some((role) => allowedRoles.includes(role));
}

