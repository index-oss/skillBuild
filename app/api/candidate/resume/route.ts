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
      .select("id, resume_url, updated_at")
      .eq("clerk_user_id", userId)
      .maybeSingle();

    if (!profile) {
      return NextResponse.json({ error: "Profile not found" }, { status: 404 });
    }

    return NextResponse.json({
      resume_url: profile.resume_url || null,
      updated_at: profile.updated_at
    });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const { userId } = await auth();
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = await createSupabaseServerClient();
    const body = await request.json();
    const { resumeUrl } = body;

    if (!resumeUrl) {
      return NextResponse.json({ error: "resumeUrl is required" }, { status: 400 });
    }

    const { data: updatedProfile, error } = await supabase
      .from("profiles")
      .update({
        resume_url: resumeUrl,
        updated_at: new Date().toISOString()
      })
      .eq("clerk_user_id", userId)
      .select()
      .single();

    if (error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ profile: updatedProfile });
  } catch (err: any) {
    return NextResponse.json({ error: err.message || "Internal Server Error" }, { status: 500 });
  }
}