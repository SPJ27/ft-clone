import { cookies } from 'next/headers'
import React from 'react'

const page = async () => {
    
    const body = await res.json()
    console.log(body)
  return (
    <div>page</div>
  )
}

export default page