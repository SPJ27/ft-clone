import { createClient } from "@/supabase/server";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";

export async function POST(request) {
  const userData = await getUser()
  if (!userData) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const user_name = userData.name
  const user_id = userData.hackclub_id

  const supabase = createClient(await cookies())
  const formData = await request.formData()

  const project_name = formData.get('project_name')
  const project_desc = formData.get('project_desc')
  const project_demo = formData.get('project_demo')
  const project_repo = formData.get('project_repo')
  const hackatime_projects = JSON.parse(formData.get('hackatime_projects') || '[]')
  const file = formData.get('file')

  if (!file) {
    return NextResponse.json({ error: "Banner image is required" }, { status: 400 })
  }

  const cdnForm = new FormData()
  cdnForm.append('file', file)
  const cdnRes = await fetch('https://cdn.hackclub.com/api/v4/upload', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${process.env.CDN_KEY}` },
    body: cdnForm
  })

  if (!cdnRes.ok) {
    return NextResponse.json({ error: "Failed to upload banner" }, { status: 502 })
  }

  const cdnData = await cdnRes.json()
  const banner_url = cdnData.url

  const { data: project, error } = await supabase
    .from('projects')
    .insert({ project_name, project_desc, project_demo, project_repo, hackatime_projects, user_name, banner_url, user_id })
    .select()
    .single()

  if (error) {
    console.error("Error inserting project:", error)
    return NextResponse.json({ error: "Failed to create project" }, { status: 500 })
  }

  return NextResponse.json(project, { status: 200 })
}

export async function PUT(request) {
  const userData = await getUser()
  if (!userData) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const supabase = createClient(await cookies())
  const { id, project_name, project_desc, project_demo, project_repo, hackatime_projects } = await request.json()

  if (!id) {
    return NextResponse.json({ error: "Project ID is required" }, { status: 400 })
  }

  const { data: existing } = await supabase
    .from('projects')
    .select('user_id')
    .eq('id', id)
    .single()

  if (existing?.user_id !== userData.hackclub_id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const { data: project, error } = await supabase
    .from('projects')
    .update({ project_name, project_desc, project_demo, project_repo, hackatime_projects })
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error("Error updating project:", error)
    return NextResponse.json({ error: "Failed to update project" }, { status: 500 })
  }

  return NextResponse.json(project, { status: 200 })
}

export async function DELETE(request) {
  const userData = await getUser()
  if (!userData) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
  }

  const supabase = createClient(await cookies())
  const { id } = await request.json()

  if (!id) {
    return NextResponse.json({ error: "Project ID is required" }, { status: 400 })
  }

  const { data: existing } = await supabase
    .from('projects')
    .select('user_id')
    .eq('id', id)
    .single()

  if (existing?.user_id !== userData.hackclub_id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 })
  }

  const { error } = await supabase
    .from('projects')
    .delete()
    .eq('id', id)

  if (error) {
    console.error("Error deleting project:", error)
    return NextResponse.json({ error: "Failed to delete project" }, { status: 500 })
  }

  return NextResponse.json({ message: "Project deleted successfully" }, { status: 200 })
}

export async function GET(request) {
  const { searchParams } = request.nextUrl
  const project_id = searchParams.get('project_id')

  if (!project_id) {
    return NextResponse.json({ error: "project_id is required" }, { status: 400 })
  }

  const supabase = createClient(await cookies())
  const userData = await getUser()

  const { data: projectData, error } = await supabase
    .from('projects')
    .select('*')
    .eq('id', project_id)
    .single()

  if (error || !projectData) {
    return NextResponse.json({ error: "Project not found" }, { status: 404 })
  }

  const { data: shipEvents } = await supabase
    .from('ship_events')
    .select()
    .eq('project_id', project_id)

  const isCurrentUserCreated = userData
    ? projectData.user_id === userData.hackclub_id  
    : false

  const canShip =
    !!projectData.project_demo?.trim() &&
    !!projectData.project_repo?.trim() &&
    (projectData.total_hours ?? 0) > 0

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

  return userData ?? null
}