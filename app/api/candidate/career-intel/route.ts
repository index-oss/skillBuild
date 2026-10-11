import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

type ProfileField = "display_name" | "bio" | "avatar_url" | "resume_url" | "target_role" | "location";

export async function GET() {
  try {
    const session = await auth();
    const userId = session?.userId;

    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Agar aapka client async hai toh 'await' lagana zaroori hai
    const supabase = await createSupabaseServerClient();

    // 1. Fetch internal profile
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("clerk_user_id", userId)
      .maybeSingle();

    if (profileError) {
      return NextResponse.json({ error: profileError.message }, { status: 500 });
    }

    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    // 2. Fetch candidate applications count
    const { count: applicationCount, error: appError } = await supabase
      .from("applications")
      .select("id", { count: "exact", head: true })
      .eq("applicant_profile_id", profile.id);

    if (appError) {
      return NextResponse.json({ error: appError.message }, { status: 500 });
    }

    // 3. Compute Profile Completion Score safely
    const checkFields: ProfileField[] = [
      "display_name",
      "bio",
      "avatar_url",
      "resume_url",
      "target_role",
      "location"
    ];
    
    let filledFields = 0;
    const missingFields: string[] = [];

    checkFields.forEach((field) => {
      const val = profile[field];
      // Check if value exists and is not an empty string
      if (val !== null && val !== undefined && val !== "") {
        filledFields++;
      } else {
        missingFields.push(field);
      }
    });

    const completionPercentage = Math.round((filledFields / checkFields.length) * 100);

    return NextResponse.json({
      profile,
      metrics: {
        completionPercentage,
        missingFields,
        totalApplications: applicationCount || 0
      }
    });
  } catch (err: unknown) {
    const errorMessage = err instanceof Error ? err.message : "Internal Server Error";
    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}