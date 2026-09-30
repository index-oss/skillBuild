import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function GET() {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 },
    );
  }

  const supabase = await createSupabaseServerClient();

  const { data: profile } = await supabase
    .from("profiles")
    .select("id")
    .eq("clerk_user_id", userId)
    .maybeSingle();

  if (!profile) {
    return NextResponse.json(
      { error: "Profile not found" },
      { status: 404 },
    );
  }

  const { data, error } = await supabase
    .from("applications")
    .select(`
      id,
      status,
      cover_letter,
      created_at,
      jobs (
        id,
        title,
        companies (
          id,
          name
        )
      )
    `)
    .eq("profile_id", profile.id)
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 },
    );
  }

  return NextResponse.json({
    applications: data ?? [],
  });
}