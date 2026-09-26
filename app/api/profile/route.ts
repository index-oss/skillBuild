import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
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

  const supabase = createSupabaseServerClient();

  const { data, error } = await supabase
    .from("profiles")
    .select("*")
    .eq("clerk_user_id", userId)
    .maybeSingle();

  if (error) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 },
    );
  }

  return NextResponse.json({
    userId,
    profile: data,
  });
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

  const { data: profile, error: profileError } =
    await supabaseAdmin
      .from("profiles")
      .upsert(
        {
          clerk_user_id: userId,
          display_name: body.display_name ?? null,
          bio: body.bio ?? null,
          location_city: body.location_city ?? null,
          location_state: body.location_state ?? null,
          location_country: body.location_country ?? null,
          timezone: body.timezone ?? null,
          account_status: "active",
        },
        {
          onConflict: "clerk_user_id",
        },
      )
      .select()
      .single();

  if (profileError) {
    return NextResponse.json(
      { error: profileError.message },
      { status: 500 },
    );
  }

  const { error: roleError } = await supabaseAdmin
    .from("user_roles")
    .upsert(
      {
        user_id: profile.id,
        role: "student",
      },
      {
        onConflict: "user_id,role",
      },
    );

  if (roleError) {
    return NextResponse.json(
      { error: roleError.message },
      { status: 500 },
    );
  }

  return NextResponse.json({
    profile,
    role: "student",
  });
}