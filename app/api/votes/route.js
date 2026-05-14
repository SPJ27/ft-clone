import { createClient } from "@/supabase/server"
import { getUser } from "../projects/route"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

export async function POST(request) {
  const { ship_id, technicality, originality, usability, storytelling, feedback } = await request.json()

  const user = await getUser()
  if (!user) return NextResponse.json({ error: "unauthenticated" }, { status: 401 })

  const supabase = createClient(await cookies())

  const { data: votingData, error: votingError } = await supabase
    .from("ship_events")
    .select("*")
    .eq("ship_id", ship_id)
    .single()

  if (votingError || !votingData) {
    return NextResponse.json({ error: "ship event not found" }, { status: 404 })
  }

  const votes = votingData.votes + 1
  const votes_received = [
    ...votingData.votes_received,
    { originality, technicality, usability, storytelling, feedback },
  ]

  if (votes < 12) {
    const { error: updateError } = await supabase
      .from("ship_events")
      .update({ votes, votes_received })
      .eq("ship_id", ship_id)

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 400 })
    }

    return NextResponse.json({ message: "vote recorded", votes })
  }

  const sum = votes_received.reduce(
    (acc, vote) => acc + vote.technicality + vote.originality + vote.usability + vote.storytelling,
    0
  )
  const multiplier = (sum / 48) * 30
  const cookiesEarned = multiplier * votingData.hours

  const { error: shipUpdateError } = await supabase
    .from("ship_events")
    .update({ payout_status: true, multiplier, votes, votes_received })
    .eq("ship_id", ship_id)

  if (shipUpdateError) {
    return NextResponse.json({ error: shipUpdateError.message }, { status: 400 })
  }

  const { data: projectData, error: projectError } = await supabase
    .from("projects")
    .select("user_id")
    .eq("id", votingData.project_id)
    .single()

  if (projectError || !projectData) {
    return NextResponse.json({ error: "project not found" }, { status: 404 })
  }

  const { data: projectUser, error: projectUserError } = await supabase
    .from("users")
    .select("cookies")
    .eq("hackclub_id", projectData.user_id)
    .single()

  if (projectUserError || !projectUser) {
    return NextResponse.json({ error: "project owner not found" }, { status: 404 })
  }

  const { error: cookiesError } = await supabase
    .from("users")
    .update({ cookies: projectUser.cookies + cookiesEarned })
    .eq("hackclub_id", projectData.user_id)

  if (cookiesError) {
    return NextResponse.json({ error: cookiesError.message }, { status: 400 })
  }

  return NextResponse.json({ message: "voting complete", multiplier, cookiesEarned })
}

export async function GET(request) {
  const user = await getUser()
  if (!user) return NextResponse.json({ error: "unauthenticated" }, { status: 401 })

  const supabase = createClient(await cookies())

  const { data, error } = await supabase
    .from("ship_events")
    .select("*, projects(*)")
    .eq("payout_status", false)
    .eq("approved", 'APPROVED')
    .order("created_at", { ascending: true })
    .limit(1)
    .single()

  if (error || !data) {
    return NextResponse.json({ error: "no projects available for voting" }, { status: 404 })
  }

  return NextResponse.json({ data })
}