import { Webhook } from "svix";
import { headers } from "next/headers";
import { WebhookEvent } from "@clerk/nextjs/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

function generateReferralCode(): string {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let code = "V3-";
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;
  if (!WEBHOOK_SECRET) {
    throw new Error("Please add CLERK_WEBHOOK_SECRET to .env.local");
  }

  const headerPayload = await headers();
  const svix_id = headerPayload.get("svix-id");
  const svix_timestamp = headerPayload.get("svix-timestamp");
  const svix_signature = headerPayload.get("svix-signature");

  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error: Missing svix headers", { status: 400 });
  }

  const payload = await req.json();
  const body = JSON.stringify(payload);

  const wh = new Webhook(WEBHOOK_SECRET);
  let evt: WebhookEvent;

  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent;
  } catch (err) {
    console.error("Error verifying webhook:", err);
    return new Response("Error: Verification failed", { status: 400 });
  }

  if (evt.type === "user.created") {
    const { id, email_addresses, phone_numbers, first_name, last_name, username, image_url } =
export async function POST(req: Request) {
      const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET;

      if (!WEBHOOK_SECRET) {
        throw new Error(
          "Please add CLERK_WEBHOOK_SECRET from Clerk Dashboard to .env.local"
        );
      }

      // Get the headers
      const headerPayload = headers();
      const svix_id = headerPayload.get("svix-id");
      const svix_timestamp = headerPayload.get("svix-timestamp");
      const svix_signature = headerPayload.get("svix-signature");

      if (!svix_id || !svix_timestamp || !svix_signature) {
        return new Response("Error: Missing svix headers", { status: 400 });
      }

      // Get the body
      const payload = await req.json();
      const body = JSON.stringify(payload);

      // Verify the webhook
      const wh = new Webhook(WEBHOOK_SECRET);
      let evt: WebhookEvent;

      try {
        evt = wh.verify(body, {
          "svix-id": svix_id,
          "svix-timestamp": svix_timestamp,
          "svix-signature": svix_signature,
        }) as WebhookEvent;
      } catch (err) {
        console.error("Error verifying webhook:", err);
        return new Response("Error: Verification failed", { status: 400 });
      }

      // Handle the user.created event
      if (evt.type === "user.created") {
        const { id, email_addresses, phone_numbers } = evt.data;

        const primaryEmail =
          email_addresses && email_addresses.length > 0
            ? email_addresses[0].email_address
            : "";

        const primaryPhone =
          phone_numbers && phone_numbers.length > 0
            ? phone_numbers[0].phone_number
            : null;

        const referralCode = generateReferralCode();

        const { error } = await supabase.from("users").insert({
          clerk_id: id,
          email: primaryEmail,
          phone: primaryPhone,
          referral_code: referralCode,
        });

        if (error) {
          console.error("Error inserting user into Supabase:", error);
          return new Response("Error: Failed to create user", { status: 500 });
        }

        console.log(`User created: ${id} with referral code: ${referralCode}`);
      }

      return new Response("Webhook processed", { status: 200 });
    }
