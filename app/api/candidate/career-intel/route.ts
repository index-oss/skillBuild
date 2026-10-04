import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createSupabaseServerClient } from "@/lib/supabase/server";

export async function GET() {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = await createSupabaseServerClient();

    const { data: profile } = await supabase
      .from("profiles")
      .select("*")
      .eq("clerk_user_id", userId)
      .maybeSingle();

    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    const { count: applicationCount } = await supabase
      .from("applications")
      .select("id", { count: "exact", head: true })
      .eq("applicant_profile_id", profile.id);

    const checkFields = [
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
      if (profile[field]) {
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
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Internal Server Error" }, { status: 500 });
  }
}