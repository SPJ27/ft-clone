import { createClient } from "@/supabase/server"
import { getUser } from '@/app/api/projects/route'
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function GET() {
  const user = await getUser()
  if (!user) return NextResponse.json({ error: "unauthenticated" }, { status: 401 })

  const supabase = createClient(await cookies())

  const { data: shipEvents, error: shipError } = await supabase
    .from("ship_events")
    .select("id, hours, reviewer_note, project_id")
    .eq("approved", "PENDING")
    .order("created_at", { ascending: true })
  console.log(shipError)
  if (shipError) return NextResponse.json({ error: shipError.message }, { status: 400 })

    if (!shipEvents.length) return NextResponse.json({ ships: [] })

  const projectIds = shipEvents.map(s => s.project_id)

  const { data: projects, error: projectError } = await supabase
    .from("projects")
    .select("id, project_name, project_desc, project_repo, project_demo, banner_url, user_name, devlogs, unpaid_hours")
    .in("id", projectIds)
  console.log(projectError)
  if (projectError) return NextResponse.json({ error: projectError.message }, { status: 400 })

  const projectMap = Object.fromEntries(projects.map(p => [p.id, p]))

  const ships = shipEvents.map(ship => {
    const project = projectMap[ship.project_id] ?? {}
    const wholeHours = Math.floor(ship.hours)
    const minutes = Math.round((ship.hours % 1) * 60)
    const userName = project.user_name ?? "Unknown"
    const initials = userName.split(" ").map(w => w[0]).join("").slice(0, 2).toUpperCase()

    const devlogs = (project.devlogs ?? []).map(d => {
      const dHours = Math.floor(d.hours)
      const dMinutes = Math.round((d.hours % 1) * 60)
      const text = d.devlog_texts ?? ""
      const images = d.devlog_images ?? []
      return { text, hours: dHours, minutes: dMinutes, images }
    })

    return {
      id: ship.id,
      title: project.project_name ?? "Untitled",
      desc: project.project_desc ?? "",
      repo: project.project_repo ?? "",
      demo: project.project_demo ?? null,
      image: project.banner_url ?? null,
      user: userName,
      initials,
      hours: wholeHours,
      unpaid_hours: project.unpaid_hours ?? 0,
      minutes,
      devlogs,
    }
  })

  return NextResponse.json({ ships })
}

export async function POST(request) {
  const { ship_id, approved, reviewer_note } = await request.json()

  const user = await getUser()
  if (!user) return NextResponse.json({ error: "unauthenticated" }, { status: 401 })

  const supabase = createClient(await cookies())

  if (approved) {
    const { data: shipData, error: shipError } = await supabase
      .from("ship_events")
      .select("project_id, hours")
      .eq("id", ship_id)
      .single()

    if (shipError || !shipData) {
      return NextResponse.json({ error: "ship event not found" }, { status: 404 })
    }

    const { error: shipUpdateError } = await supabase
      .from("ship_events")
      .update({ approved: "APPROVED", reviewer_note })
      .eq("id", ship_id)
    console.log(shipUpdateError)
    if (shipUpdateError) {
      return NextResponse.json({ error: shipUpdateError.message }, { status: 400 })
    }

    const { error: projectUpdateError } = await supabase
      .from("projects")
      .update({ unpaid_hours: 0 })
      .eq("id", shipData.project_id)
    console.log(projectUpdateError)
    if (projectUpdateError) {
      return NextResponse.json({ error: projectUpdateError.message }, { status: 400 })
    }

    return NextResponse.json({ message: "ship event approved and added to voting queue" })
  }

  const { error } = await supabase
    .from("ship_events")
    .update({ approved: "REJECTED", reviewer_note })
    .eq("id", ship_id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  return NextResponse.json({ message: "ship event rejected" })
}