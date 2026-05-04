'use client'

import { useEffect } from "react"

const Page = () => {
  useEffect(async () => {
    fetch("/api/v1/a")
  const handleLogin = () => {
    const scope = encodeURIComponent(
      "profile read"
    )

    window.location.href =
      `https://hackatime.hackclub.com/oauth/authorize?` +
      `client_id=${process.env.NEXT_PUBLIC_HACKATIME_CLIENT_ID}&` +
      `redirect_uri=${encodeURIComponent(
        process.env.NEXT_PUBLIC_REDIRECT_URI
      )}&` +
      `response_type=code&` +
      `scope=${scope}`
  }

  return (
    <div>
      <button onClick={handleLogin}>
        Login with Hack Club
      </button>
    </div>
  )
}

export default Page