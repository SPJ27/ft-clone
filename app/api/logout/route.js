import { createClient } from "@/supabase/server"
import { cookies } from "next/headers"

export async function POST() {
  try {
    const cookieStore = await cookies()
    const session_id = cookieStore.get("session_id")?.value

    if (session_id) {
      const supabase = createClient(cookieStore)
      await supabase.from("sessions").delete().eq("session_id", session_id)
      cookieStore.delete("session_id")
    }

    return Response.json({ success: true })
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 })
  }
}