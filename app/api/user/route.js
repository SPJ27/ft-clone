import { createClient } from "@/supabase/server";
import { cookies } from "next/headers"
import { NextResponse } from "next/server";

export async function GET(request) {
  const cookieStore = await cookies()
  const session_id = cookieStore.get("session_id")?.value
  console.log('session_id', session_id)
  
  if (!session_id) {
    return NextResponse.json({ 'status': 420 })
  }
  const supabase = createClient(await cookies())
  const { data: currentUser } = await supabase.from('sessions').select('*').eq('session_id', session_id).single()

  if (!currentUser) {
    return NextResponse.json({ status: 401, error: 'Invalid session' })
  }
  let projects, projectData
  try {   
    projects = await fetch(
      "https://hackatime.hackclub.com/api/v1/authenticated/projects",
      {
        method: 'GET',
        headers: {
          Authorization: `Bearer ${currentUser.auth_token}`
        }
      }
    )

    if (!projects.ok) {
      return NextResponse.json({ 'status': projects.status, 'error': 'Failed to fetch projects' })
    }

    projectData = await projects.json()
  } catch (e) {
    return NextResponse.json({ 'status': 500, 'error': 'Failed to fetch projects' })
  }
  let { data: userData, error } = await supabase.from('users').select('*').eq('hackclub_id', currentUser.user_id).single()
  let {data: userProjects, error: userProjectsError} = await supabase.from('projects').select().eq('user_id', currentUser.user_id)
  return NextResponse.json({ user: userData, projects: projectData, userProjects, 'status': 200 })
}