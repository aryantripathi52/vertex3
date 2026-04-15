import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: NextRequest) {
  try {
    const { connection_id, action, current_user_db_id } = await req.json();
    // action: 'accept' | 'reject'

    if (!connection_id || !action || !current_user_db_id) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    // Fetch the connection to verify receiver and get requester_id
    const { data: conn, error: fetchErr } = await supabase
      .from("connections")
      .select("id, requester_id, receiver_id, status")
      .eq("id", connection_id)
      .single();

    if (fetchErr || !conn) {
      return NextResponse.json({ error: "Connection not found" }, { status: 404 });
    }

    // Only the receiver can respond
    if (conn.receiver_id !== current_user_db_id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
    }

    if (conn.status !== "pending") {
      return NextResponse.json({ error: "Already responded" }, { status: 409 });
    }

    if (action === "reject") {
      // Delete the connection row on rejection
      await supabase.from("connections").delete().eq("id", connection_id);
      return NextResponse.json({ success: true, action: "rejected" });
    }

    // Accept: update to accepted
    const { error: updateErr } = await supabase
      .from("connections")
      .update({ status: "accepted" })
      .eq("id", connection_id);

    if (updateErr) throw updateErr;

    // Fetch receiver's name to send a notification back to requester
    const { data: receiver } = await supabase
      .from("users")
      .select("full_name, username")
      .eq("id", current_user_db_id)
      .single();

    const receiverName = receiver?.full_name || receiver?.username || "Someone";

    // Notify the requester that connection was accepted
    await supabase.from("notifications").insert({
      user_id: conn.requester_id,
      type: "connection_accepted",
      title: `${receiverName} accepted your connection`,
      body: `You and ${receiverName} are now connected on Vertex3!`,
      reference_id: connection_id,
      is_read: false,
    });

    return NextResponse.json({ success: true, action: "accepted" });
  } catch (err: any) {
    console.error("Connection respond error:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
