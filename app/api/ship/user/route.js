import { createClient } from "@/supabase/server";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import { getUser } from "../../projects/route";

export async function GET(request) {
  const currentUser = await getUser();
  if (!currentUser) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const project_id = searchParams.get("project_id");

  const supabase = createClient(await cookies());

  let query = supabase
    .from("ship_events")
    .select("*, projects(project_name, user_id)")
    .order("created_at", { ascending: false });

  if (project_id) {
    query = query.eq("project_id", project_id).limit(1).single();
  }

  const { data, error } = await query;

  if (error && error.code === "PGRST116") {
    return NextResponse.json({ data: null });
  }

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ data });
}

export async function POST(request) {
  const currentUser = await getUser();
  if (!currentUser) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const { project_id, ship_text } = await request.json();
  const supabase = createClient(await cookies());

  const { data: checkUser, error: checkError } = await supabase
    .from("projects")
    .select("user_id, unpaid_hours")
    .eq("id", project_id)
    .single();

  if (checkError || checkUser.user_id !== parseInt(currentUser.hackclub_id, 10)) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const { data: prevShipEvents, error: prevShipEventsError } = await supabase
    .from("ship_events")
    .select("approved, payout_status")
    .eq("project_id", project_id);

  if (prevShipEventsError) {
    return NextResponse.json({ error: prevShipEventsError.message }, { status: 400 });
  }

  const hasPendingApproval = prevShipEvents.some((e) => e.approved === "PENDING");
  const hasUnpaidApproval = prevShipEvents.some((e) => e.approved === "APPROVED" && e.payout_status === false);

  if (hasPendingApproval || hasUnpaidApproval) {
    return NextResponse.json(
      { error: "cannot ship: previous ship event is pending or unpaid" },
      { status: 403 }
    );
  }

  const { data, error } = await supabase
    .from("ship_events")
    .insert({ project_id, ship_text, hours: checkUser.unpaid_hours })
    .select()
    .single();

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ data });
}