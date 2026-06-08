import { createClient } from "@/supabase/server";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function GET(request) {
  const supabase = createClient(await cookies());
  const { searchParams } = new URL(request.url);
  const project_id = searchParams.get("project_id");
  if (!project_id) {
    return NextResponse.json({ error: "Project ID is required" }, { status: 400 });
  }
  const { data, error } = await supabase
    .from("projects")
    .select(
      "id, created_at, total_hours, project_name, project_desc, project_demo, project_repo, banner_url, devlogs",
    )
    .eq("id", project_id)
    .single();
  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
  return NextResponse.json({ data });
}
