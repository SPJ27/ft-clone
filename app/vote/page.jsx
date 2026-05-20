import { cookies } from 'next/headers'
import React from 'react'

const page = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/votes`, {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    Cookie: (await cookies()).toString()
  },
  body: JSON.stringify({
    ship_id: '5', technicality: 9, originality: 9, usability: 9, storytelling: 9, feedback: 9
  })
})
    const body = await res.json()
    console.log(body)
  return (
    <div>page</div>
  )
}

export default page