'use client'
import { useEffect, useState } from "react"

const Page = () => {
  const [loggedIn, setLoggedIn] = useState(false)
  useEffect(() => {
    const syncUser = async () => {
      const verifyLogin = await fetch(`/api/user`)
      const res = await verifyLogin.json()
      if (res.status == 200){
        setLoggedIn(true)
      }
    }
    syncUser()
  }, [])

  const handleLogin = () => {
    const scope = encodeURIComponent("profile read")
    window.location.href =
      `https://hackatime.hackclub.com/oauth/authorize?` +
      `client_id=${process.env.NEXT_PUBLIC_HACKATIME_CLIENT_ID}&` +
      `redirect_uri=${encodeURIComponent(process.env.NEXT_PUBLIC_REDIRECT_URI)}&` +
      `response_type=code&` +
      `scope=${scope}`
  }

  return (
    <div>
      <button
        className="bg-neutral-800 text-white rounded-xl px-4 py-1 ml-2 hover:bg-neutral-900 transition-colors cursor-pointer"
        onClick={handleLogin}
      >
        {!loggedIn ? 
        'Login with Hack Club'
      :
      'Go to the dashboard'}
      </button>
    </div>
  )
}

export default Page