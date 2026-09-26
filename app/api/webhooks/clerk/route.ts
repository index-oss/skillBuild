import { verifyWebhook } from "@clerk/nextjs/webhooks";
import { NextRequest } from "next/server";
import { createSupabaseAdminClient } from "@/lib/supabase/admin";

export async function POST(req: NextRequest) {
  try {
    const evt = await verifyWebhook(req);

    if (evt.type === "user.created") {
      const user = evt.data;

      const primaryEmail =
        user.email_addresses?.find(
          (email) => email.id === user.primary_email_address_id
        )?.email_address ?? null;

      const supabase = createSupabaseAdminClient();

      const { error } = await supabase
        .from("profiles")
        .upsert(
          {
            clerk_user_id: user.id,
            email: primaryEmail,
            first_name: user.first_name,
            last_name: user.last_name,
            avatar_url: user.image_url,
          },
          {
            onConflict: "clerk_user_id",
          }
        );

      if (error) {
        console.error("Profile creation failed:", error);
        return new Response("Database error", { status: 500 });
      }
    }

    return new Response("Webhook received", { status: 200 });
  } catch (error) {
    console.error("Clerk webhook verification failed:", error);
    return new Response("Invalid webhook", { status: 400 });
  }
}