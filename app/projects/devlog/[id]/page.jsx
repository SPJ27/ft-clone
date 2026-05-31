'use client'
import React, { useEffect, useState } from 'react'
import { redirect, useParams } from 'next/navigation'
import { hoursConverter } from '@/lib/converter'
import Image from 'next/image'

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
        if (minutes < 15 && hours == 0) { alert('You need to log atleast 15m of work'); setLoading(false) }
        else if (!devlog_images) { alert('Please add atleast 1 image to continue!'); setLoading(false) }
        else {
            const res = await fetch(`/api/devlog`, {
                method: 'POST',
                body: formData,
            })
            const data = await res.json()
            setLoading(false)
            if (!res.ok) {
                setError(data.error || 'Something went wrong')
            } else {
                setSuccess(`Devlog added! Hours logged: ${(data.devlogHours / 3600).toFixed(2)}h`)
                redirect(`/projects/${project_id}`)
            }
        }
    }
    return (
        <div className="md:max-w-2xl xs:max-w-xl max-w-xs w-full mx-auto text-[rgb(250,238,218)] mt-10 border-[#e7c16e] border-14 rounded-3xl p-4 px-8 bg-[#bc762b] shadow">
            <h1 className="text-3xl font-semibold">Add Devlog</h1>
            <p className='text-[rgb(236,208,180)] mb-3 text-[16px]'>Add a devlog to log some time into flavortown! You need to attach atleast one image or one video to add a devlog. A devlog must have more than 15 minutes.</p>
            <p className='text-lg mb-2'>{hours}h {minutes}m</p>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-1">
                    <label className="text-sm font-medium">Text</label>
                    <textarea
                        className="w-full border border-[#e7c16e] rounded-lg p-2 text-lg resize-none focus:outline-none"
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
                        required
                    />
                    {devlog_previews.map((src, i) => (
                        <Image key={i} height={80} width={80} alt='Devlog Image' src={src} className="w-20 h-20 object-cover rounded-lg border" />
                    ))}
                </div>
                {error && <p className="text-sm text-red-500">{error}</p>}
                {success && <p className="text-sm text-green-500">{success}</p>}
                <button
                    type="submit"
                    disabled={loading}
                    className="w-full hover:bg-[#e0ac3c] text-white py-2 rounded-lg text-sm font-medium bg-[#e9b23c] cursor-pointer disabled:opacity-50"
                >
                    {loading ? 'Submitting...' : 'Add Devlog'}
                </button>
            </form>
        </div>
    )
}

export default Page