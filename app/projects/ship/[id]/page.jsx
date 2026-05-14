'use client'
import { useParams } from 'next/navigation'
import { useState } from 'react'

const page = () => {
    const [text, setText] = useState('')
    const params = useParams()
    const project_id = params.id
    return (
        <div>
            <form>
                Ship Text: <input value={text} onChange={(e) => setText(e.target.value)} className='border' />
                <button
                className=''
                    onClick={async (e) => {
                        e.preventDefault()
                        const res = await fetch('/api/ship/user', {
                            method: 'POST',
                            body: JSON.stringify({project_id, ship_text: text})
                        })
                    }}
                >Ship!</button>
            </form>
        </div>
    )
}

export default page