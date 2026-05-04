export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url)
    const code = searchParams.get("code")

    if (!code) {
      return Response.json(
        { error: "No authorization code received" },
        { status: 400 }
      )
    }

    const tokenRes = await fetch(
      "https://hackatime.hackclub.com/oauth/token",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          client_id: process.env.NEXT_PUBLIC_HACKATIME_CLIENT_ID,
          client_secret: process.env.HACKATIME_CLIENT_SECRET,
          redirect_uri: process.env.NEXT_PUBLIC_REDIRECT_URI,
          code,
          grant_type: "authorization_code"
        })
      }
    )

    const tokenData = await tokenRes.json()

    if (!tokenRes.ok) {
      console.error("Token exchange failed:", tokenData)

      return Response.json(
        {
          error: "Failed to exchange code for token",
          details: tokenData
        },
        { status: 500 }
      )
    }

    const userRes = await fetch(
      "https://hackatime.hackclub.com/api/v1/authenticated/me",
      {
        headers: {
          Authorization: `Bearer ${tokenData.access_token}`
        }
      }
    )

    const userData = await userRes.json()

    if (!userRes.ok) {
      console.error("Failed to fetch user:", userData)

      return Response.json(
        {
          error: "Failed to fetch user info",
          details: userData
        },
        { status: 500 }
      )
    }
    
    return Response.json({
      success: true,
      token: tokenData,
      user: userData
    })

  } catch (error) {
    console.error("Callback error:", error)

    return Response.json(
      {
        error: error.message
      },
      { status: 500 }
    )
  }
}