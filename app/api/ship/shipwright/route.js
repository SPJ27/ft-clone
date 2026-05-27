import { createClient } from "@/supabase/server"
import {getUser} from '@/app/api/projects/route'
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function POST(request) {
  const { ship_id, approved, reviewer_note } = await request.json()

  const user = await getUser()
  if (!user) return NextResponse.json({ error: "unauthenticated" }, { status: 401 })

  const supabase = createClient(await cookies())

  if (approved) {
    const { data: shipData, error: shipError } = await supabase
      .from("ship_events")
      .select("project_id, hours")
      .eq("ship_id", ship_id)
      .single()

    if (shipError || !shipData) {
      return NextResponse.json({ error: "ship event not found" }, { status: 404 })
    }

    const { error: shipUpdateError } = await supabase
      .from("ship_events")
      .update({ approved: "APPROVED", reviewer_note, in_voting_queue: true })
      .eq("ship_id", ship_id)

    if (shipUpdateError) {
      return NextResponse.json({ error: shipUpdateError.message }, { status: 400 })
    }

    const { error: projectUpdateError } = await supabase
      .from("projects")
      .update({ unpaid_hours: 0 })
      .eq("id", shipData.project_id)

    if (projectUpdateError) {
      return NextResponse.json({ error: projectUpdateError.message }, { status: 400 })
    }

    return NextResponse.json({ message: "ship event approved and added to voting queue" })
  }

  const { error } = await supabase
    .from("ship_events")
    .update({ approved: "REJECTED", reviewer_note })
    .eq("ship_id", ship_id)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 })
  }

  return NextResponse.json({ message: "ship event rejected" })
}