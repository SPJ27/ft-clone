'use client'
import React, { useEffect, useState } from 'react'
import { redirect, useParams } from 'next/navigation'
import { hoursConverter } from '@/lib/converter'

const Page = () => {
    const params = useParams()
    const project_id = params.id
    const [devlog_texts, setDevlogTexts] = useState('')
    const [devlog_images, setDevlogImages] = useState([])
    const [devlog_previews, setDevlogPreviews] = useState([])
    const [error, setError] = useState(null)
    const [success, setSuccess] = useState(null)
    const [hours, setHours] = useState(0)
    const [minutes, setMinutes] = useState(0)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        const fetchFunction = async () => {
            const res = await fetch(`/api/devlog?project_id=${project_id}`)
            const hoursRes = await res.json()
            let [hourseOut, minutesOut] = hoursConverter(hoursRes.hours)
            setHours(hourseOut)
            setMinutes(minutesOut)
        }
        fetchFunction()
    }, [project_id])

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files)
        setDevlogImages(files)

        const previews = files.map((file) => URL.createObjectURL(file))
        setDevlogPreviews(previews)
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError(null)
        setSuccess(null)

        const formData = new FormData()
        formData.append('project_id', project_id)
        formData.append('devlog_texts', devlog_texts)
        devlog_images.forEach((file) => {
            formData.append('devlog_images', file)
        })
        const res = await fetch(`/api/devlog`, {
            method: 'POST',
            body: formData,
        })

        const data = await res.json()
        setLoading(false)

        if (!res.ok) {
            setError(data.error || 'Something went wrong')
        } else {
            setSuccess(`Devlog added! Hours logged: ${(data.hours / 3600).toFixed(2)}h`)
            redirect(`/projects/${project_id}`)
        }
    }

    return (
        <div className="max-w-lg mx-auto mt-10 p-6 border rounded-xl shadow space-y-4">
            <h1 className="text-xl font-semibold">Add Devlog</h1>
            <p>{hours} Hours {minutes} Minutes</p>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1">
                    <label className="text-sm font-medium">Text</label>
                    <textarea
                        className="w-full border rounded-lg p-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                        rows={4}
                        value={devlog_texts}
                        onChange={(e) => setDevlogTexts(e.target.value)}
                        placeholder="What did you work on?"
                        required
                    />
                </div>
                <div className="space-y-1">
                    <label className="text-sm font-medium">Images</label>
                    <input
                        type="file"
                        accept="image/*"
                        multiple
                        onChange={handleImageChange}
                        className="text-sm"
                    />
                    {devlog_previews.map((src, i) => (
                        <img key={i} src={src} className="w-20 h-20 object-cover rounded-lg border" />
                    ))}
                </div>
                {error && <p className="text-sm text-red-500">{error}</p>}
                {success && <p className="text-sm text-green-500">{success}</p>}
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full bg-blue-600 text-white py-2 rounded-lg text-sm font-medium hover:bg-blue-700 disabled:opacity-50"
                >
                    {loading ? 'Submitting...' : 'Add Devlog'}
                </button>
            </form>
        </div>
    )
}

export default Page