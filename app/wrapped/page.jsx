import { cookies } from 'next/headers'
import React from 'react'

const page = async () => {
    const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user`, { headers: { Cookie: (await cookies()).toString() } })
    const {user} = await res.json()
    return (
        <div className='  mx-auto max-w-7xl mt-15'>
            <div className='text-2xl max-w-md bg-[hsl(30,46%,71%)] px-5 py-3 rounded-2xl font-extrabold text-[hsl(7,40%,25%)]'>
                ID: {user.id}<br/>
                Name: {user.name}<br/>
                Joined On: {new Date(user.created_at).toLocaleDateString()}
            </div>
            <div className='text-2xl max-w-md bg-[hsl(30,46%,71%)] px-5 py-3 rounded-2xl font-extrabold text-[hsl(7,40%,25%)]'>
                Cookies: {user.id}<br/>
                Name: {user.name}<br/>
                Joined On: {new Date(user.created_at).toLocaleDateString()}
            </div>
        </div>
    )
}

export default page