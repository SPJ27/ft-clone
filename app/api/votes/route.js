import { createClient } from "@/supabase/server"
import { getUser } from "../projects/route"
import { cookies } from "next/headers"
import { NextResponse } from "next/server"

async function payoutUnpaidShips(supabase, hackclub_id) {
  const { data: userProjects } = await supabase
    .from("projects")
    .select("id")
    .eq("user_id", hackclub_id)

  if (!userProjects || userProjects.length === 0) return

  const projectIds = userProjects.map((p) => p.id)

  const { data: unpaidShips } = await supabase
    .from("ship_events")
    .select("*")
    .in("project_id", projectIds)
    .eq("payout_status", false)
    .eq("approved", "APPROVED")

  if (!unpaidShips || unpaidShips.length === 0) return

  let totalCookiesEarned = 0

  for (const ship of unpaidShips) {
    if (!ship.votes_recieved || ship.votes_recieved.length === 0) continue

    const sum = ship.votes_recieved.reduce(
      (acc, vote) =>
        acc + (vote.technicality ?? 0) + (vote.originality ?? 0) +
        (vote.usability ?? 0) + (vote.storytelling ?? 0),
      0
    )
    const maxScore = ship.votes_recieved.length * 16
    const multiplier = (sum / maxScore) * 30
    const cookiesEarned = multiplier * ship.hours
    totalCookiesEarned += cookiesEarned

    await supabase
      .from("ship_events")
      .update({ payout_status: true, multiplier })
      .eq("id", ship.ship_id)
  }

  const { data: freshUser } = await supabase
    .from("users")
    .select("cookies")
    .eq("hackclub_id", hackclub_id)
    .single()

  await supabase
    .from("users")
    .update({ cookies: freshUser.cookies + totalCookiesEarned })
    .eq("hackclub_id", hackclub_id)
}

export async function POST(request) {
  const { ship_id, technicality, originality, usability, storytelling, feedback } = await request.json()
  const user = await getUser()
  if (!user) return NextResponse.json({ error: "unauthenticated" }, { status: 401 })

  const supabase = createClient(await cookies())

  const { data: votingData, error: votingError } = await supabase
    .from("ship_events")
    .select("*")
    .eq("id", ship_id)
    .single()

  if (votingError || !votingData) {
    return NextResponse.json({ error: "ship event not found" }, { status: 404 })
  }

  const { data: currentUser, error: currentUserError } = await supabase
    .from("users")
    .select("balance, cookies")
    .eq("hackclub_id", user.hackclub_id)
    .single()

  if (currentUserError || !currentUser) {
    return NextResponse.json({ error: "voter not found" }, { status: 404 })
  }

  if (currentUser.balance === 0) {
    return NextResponse.json({ error: "no voting balance" }, { status: 400 })
  }
  console.log(votingData)
  const votes = votingData.votes + 1
  const votes_recieved = [
  ...(votingData.votes_recieved ?? []),
  { originality, technicality, usability, storytelling, feedback },
]

  const newBalance = currentUser.balance + 1

  const { error: balanceError } = await supabase
    .from("users")
    .update({ balance: newBalance })
    .eq("hackclub_id", user.hackclub_id)

  if (balanceError) {
    return NextResponse.json({ error: balanceError.message }, { status: 400 })
  }

  if (votes < 12) {
    const { error: updateError } = await supabase
      .from("ship_events")
      .update({ votes, votes_recieved })
      .eq("id", ship_id)

    if (updateError) {
      return NextResponse.json({ error: updateError.message }, { status: 400 })
    }

    if (newBalance === 0) {
      await payoutUnpaidShips(supabase, user.hackclub_id)
    }

    return NextResponse.json({ message: "vote recorded", votes, newBalance })
  }

  const sum = votes_recieved.reduce(
    (acc, vote) => acc + vote.technicality + vote.originality + vote.usability + vote.storytelling,
    0
  )
  const multiplier = ((sum / (votes_recieved.length*9*4))) * 30
  const cookiesEarned = multiplier * votingData.hours

  const { error: shipUpdateError } = await supabase
    .from("ship_events")
    .update({ payout_status: true, multiplier, votes, votes_recieved })
    .eq("id", ship_id)

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
    .select("cookies, balance")
    .eq("hackclub_id", projectData.user_id)
    .single()

  if (projectUserError || !projectUser) {
    return NextResponse.json({ error: "project owner not found" }, { status: 404 })
  }

  if (projectUser.balance !== 0) {
    return NextResponse.json({ message: "voting complete, no cookies awarded" })
  }

  const { error: cookiesError } = await supabase
    .from("users")
    .update({ cookies: Math.round(projectUser.cookies + cookiesEarned)})
    .eq("hackclub_id", projectData.user_id)

  if (cookiesError) {
    return NextResponse.json({ error: cookiesError.message }, { status: 400 })
  }

  if (newBalance === 0) {
    await payoutUnpaidShips(supabase, user.hackclub_id)
  }

  return NextResponse.json({ message: "voting complete", multiplier, cookiesEarned })
}

export async function GET(request) {
  const user = await getUser()

  if (!user) {
    return NextResponse.json(
      { error: "unauthenticated" },
      { status: 401 }
    )
  }

  const supabase = createClient(await cookies())

  const { data: currentUser, error: currentUserError } = await supabase
    .from("users")
    .select("balance, cookies")
    .eq("hackclub_id", user.hackclub_id)
    .single()

  if (currentUserError || !currentUser) {
    return NextResponse.json(
      { error: "user not found" },
      { status: 404 }
    )
  }

  if (currentUser.balance >= 0) {
    return NextResponse.json(
      { error: "balance is not negative" },
      { status: 404 }
    )
  }
  const { data: shipEvent, error } = await supabase
    .from("ship_events")
    .select("*")
    .eq("payout_status", false)
    .eq("approved", "APPROVED")
    // .neq("user_id", parseInt(user.hackclub_id))
    .order("created_at", { ascending: true })
    .limit(1)
    .single()
  
  if (error || !shipEvent) {
    return NextResponse.json(
      { error: "no projects available for voting" },
      { status: 404 }
    )
  }

  const { data: project } = await supabase
    .from("projects")
    .select("*")
    .eq("id", shipEvent.project_id)
    .single()

  return NextResponse.json({
      shipEventId: shipEvent.id,   
      project
  })
}