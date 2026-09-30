import { NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { createClient } from "@supabase/supabase-js";
import { createSupabaseServerClient } from "@/lib/supabase/server";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

export async function GET() {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 },
    );
  }

  const supabase = await createSupabaseServerClient();

  const { data, error } = await supabase
    .from("resources")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 },
    );
  }

  return NextResponse.json({ data });
}

export async function POST(request: Request) {
  const { userId } = await auth();

  if (!userId) {
    return NextResponse.json(
      { error: "Unauthorized" },
      { status: 401 },
    );
  }

  const body = await request.json();

  if (!body.title || !body.url) {
    return NextResponse.json(
      { error: "Title and URL are required." },
      { status: 400 },
    );
  }

  const { data: profile } = await supabaseAdmin
    .from("profiles")
    .select("id")
    .eq("clerk_user_id", userId)
    .maybeSingle();

  if (!profile) {
    return NextResponse.json(
      { error: "Profile not found." },
      { status: 404 },
    );
  }

  const { data, error } = await supabaseAdmin
    .from("resources")
    .insert({
      title: body.title,
      description: body.description ?? null,
      url: body.url,
      resource_type: body.resource_type ?? "article",
      status: "submitted",
      created_by: profile.id,
    })
    .select()
    .single();

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 },
    );
  }

  return NextResponse.json(
    { resource: data },
    { status: 201 },
  );
}
