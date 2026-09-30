import { verifyWebhook } from "@clerk/backend/webhooks";
import { createClient } from "@supabase/supabase-js";
import { NextResponse } from "next/server";

const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!,
);

export async function POST(req: Request) {
  try {
    const event = await verifyWebhook(req);

    if (event.type === "user.created") {
      const user = event.data;

      const { error } = await supabaseAdmin
        .from("profiles")
        .upsert(
          {
            clerk_user_id: user.id,
            display_name:
              user.first_name || user.last_name
                ? `${user.first_name ?? ""} ${user.last_name ?? ""}`.trim()
                : null,
            first_name: user.first_name ?? null,
            last_name: user.last_name ?? null,
            avatar_url: user.image_url ?? null,
            account_status: "active",
          },
          {
            onConflict: "clerk_user_id",
          },
        );

      if (error) {
        console.error("Profile creation failed:", error);
        return NextResponse.json(
          { error: "Profile creation failed" },
          { status: 500 },
        );
      }
    }

    if (event.type === "user.updated") {
      const user = event.data;

      const { error } = await supabaseAdmin
        .from("profiles")
        .update({
          display_name:
            user.first_name || user.last_name
              ? `${user.first_name ?? ""} ${user.last_name ?? ""}`.trim()
              : null,
          first_name: user.first_name ?? null,
          last_name: user.last_name ?? null,
          avatar_url: user.image_url ?? null,
        })
        .eq("clerk_user_id", user.id);

      if (error) {
        console.error("Profile update failed:", error);
        return NextResponse.json(
          { error: "Profile update failed" },
          { status: 500 },
        );
      }
    }

    if (event.type === "user.deleted") {
      const user = event.data;

      const { error } = await supabaseAdmin
        .from("profiles")
        .update({
          account_status: "suspended",
        })
        .eq("clerk_user_id", user.id);

      if (error) {
        console.error("Profile deactivation failed:", error);
        return NextResponse.json(
          { error: "Profile deactivation failed" },
          { status: 500 },
        );
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Clerk webhook failed:", error);

    return NextResponse.json(
      { error: "Invalid webhook" },
      { status: 400 },
    );
  }
}