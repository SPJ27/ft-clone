import { createClient } from "@/supabase/server";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request) {
  const userData = await getUser()
  const user_name = userData.name
  const user_id = userData.hackclub_id

  const supabase = createClient(await cookies());

  const formData = await request.formData()
  const project_name = formData.get('project_name')
  const project_desc = formData.get('project_desc')
  const project_demo = formData.get('project_demo')
  const project_repo = formData.get('project_repo')
  const hackatime_projects = JSON.parse(formData.get('hackatime_projects'))

  const cdnForm = new FormData()
  cdnForm.append('file', file)
  const cdnRes = await fetch('https://cdn.hackclub.com/api/v4/upload', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${process.env.CDN_KEY}` },
    body: cdnForm
  })
  const cdnData = await cdnRes.json()
  const banner_url = cdnData.url
  console.log(banner_url)
  const { data: project, error } = await supabase
    .from('projects')
    .insert({ project_name, project_desc, project_demo, project_repo, hackatime_projects, user_name, banner_url, user_id })
    .select()
    .single();

  if (error) {
    console.error("Error inserting project:", error);
    return Response.json({ error: "Failed to create project" }, { status: 500 });
  }
  return Response.json(project, { status: 200 });
}

export async function PUT(request) {
  const supabase = createClient(await cookies());
  const { id, project_name, project_desc, project_demo, project_repo, hackatime_projects } = await request.json();
  const { data: project, error } = await supabase
    .from('projects')
    .update({ project_name, project_desc, project_demo, project_repo, hackatime_projects })
    .eq('id', id)
    .select()
    .single();
  if (error) {
    console.error("Error updating project:", error);
    return Response.json({ error: "Failed to update project" }, { status: 500 });
  }
  return Response.json(project, { status: 200 });
}

export async function DELETE(request) {
  const supabase = createClient(await cookies());
  const { id } = await request.json();
  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', id);
  if (error) {
    console.error("Error deleting project:", error);
    return Response.json({ error: "Failed to delete project" }, { status: 500 });
  }
  return Response.json({ message: "Project deleted successfully" }, { status: 200 });
}

export async function GET(request) {
  let isCurrentUserCreated = false
  const { searchParams } = request.nextUrl
  const project_id = searchParams.get('project_id')
  const supabase = createClient(await cookies())
  const userData = await getUser()
  const { data: projectData, error } = await supabase.from('projects').select('*').eq('id', project_id).single()
  const {data: shipEvents, error: shipEventsError} = await supabase.from('ship_events').select().eq('project_id', project_id)
  if (userData != null) isCurrentUserCreated = projectData.user_name === userData.name 
  console.log('isCurrentUserCreated', isCurrentUserCreated)
  let canShip = false
  if (projectData.project_demo && projectData.project_repo && projectData.total_hours > 0) canShip = true
  return NextResponse.json({ projectData, canShip, shipEvents, isCurrentUserCreated })
}

export async function getUser() {
  const cookieStore = await cookies()
  const session_id = cookieStore.get("session_id")?.value
  if (!session_id) return null
  const supabase = createClient(cookieStore)
  const { data: currentUser } = await supabase
    .from('sessions')
    .select('*')
    .eq('session_id', session_id)
    .single()
  if (!currentUser) return null
  const { data: userData } = await supabase
    .from('users')
    .select('*')
    .eq('hackclub_id', currentUser.user_id)
    .single()
  return userData
}