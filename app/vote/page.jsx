'use client'

import { hoursConverter } from '@/lib/converter'
import React, { useState, useEffect } from 'react'
import ProjectBanner from '@/components/ProjectBanner'
import { FaStar, FaPaperPlane } from 'react-icons/fa'

const criteria = [
  { key: 'technicality', label: 'Technicality', desc: 'How technically impressive is this?', color: 'hsl(210, 80%, 65%)' },
  { key: 'originality', label: 'Originality', desc: 'How creative and unique is this?', color: 'hsl(280, 70%, 70%)' },
  { key: 'usability', label: 'Usability', desc: 'How polished and usable is it?', color: 'hsl(140, 60%, 60%)' },
  { key: 'storytelling', label: 'Storytelling', desc: 'How well does it communicate its purpose?', color: 'hsl(35, 90%, 65%)' },
]

const StarRating = ({ value, onChange, color }) => {
  const [hovered, setHovered] = useState(null)
  return (
    <div className='flex gap-1'>
      {[1, 2, 3, 4, 5, 6, 7, 8, 9].map((star) => (
        <button key={star} type='button' onClick={() => onChange(star)} onMouseEnter={() => setHovered(star)} onMouseLeave={() => setHovered(null)} className='text-3xl transition-transform hover:scale-110' style={{ color: star <= (hovered ?? value) ? color : 'rgba(255,255,255,0.2)' }}>
          <FaStar />
        </button>
      ))}
    </div>
  )
}

export default function VotePage() {
  const [project, setProject] = useState(null)
  const [shipEventId, setShipEventId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [scores, setScores] = useState({ technicality: 0, originality: 0, usability: 0, storytelling: 0 })
  const [feedback, setFeedback] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetch('/api/votes')
      .then((r) => r.json())
      .then((data) => {
        setProject(data.project)
        setShipEventId(data.shipEventId)
        setLoading(false)
      })
      .catch(() => setLoading(false))
  }, [])

  const allScored = Object.values(scores).every((v) => v > 0)

  const handleSubmit = async () => {
    if (!allScored) return
    setSubmitting(true)
    setError(null)
    try {
      const res = await fetch('/api/votes', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ship_id: shipEventId, ...scores, feedback }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Failed to submit')
      setSubmitted(true)
    } catch (e) {
      setError(e.message)
    } finally {
      setSubmitting(false)
    }
  }

  if (loading) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='text-[rgb(249,229,197)] text-xl animate-pulse'>Loading...</div>
      </div>
    )
  }

  if (!project) {
    return (
      <div className='min-h-screen flex items-center justify-center'>
        <div className='text-white text-center'>
          <div className='text-4xl mb-3'>🍪</div>
          <div className='text-xl font-bold text-[rgb(249,229,197)]'>No projects to vote on right now</div>
          <div className='text-[rgb(215,181,147)] mt-2'>Check back later!</div>
        </div>
      </div>
    )
  }

  const [hours, minutes] = hoursConverter(project.total_hours)

  return (
    <div className=" min-h-screen">
      <div className="px-23 max-w-275 mx-auto">
        <div className="bg-[hsl(214,39%,39%)] mb-5 tracking-wide text-center max-w-xs mx-auto text-white text-3xl font-bold px-13 py-2.5 rounded-2xl mt-10   ">
          Vote
        </div>
        <div className="flex flex-col lg:flex-row gap-6 items-start">
          <div className="w-full lg:w-1/2">
            <ProjectBanner
              id={project.id}
              canShip={false}
              title={project.project_name}
              devlogs={project.devlogs?.length ?? 0}
              desc={project.project_desc}
              demo={project.project_demo}
              repo={project.project_repo}
              hours={hours}
              minutes={minutes}
              image={project.banner_url}
              user={project.user_name}
              shipStatus={null}
            />
          </div>
          <div className="w-full lg:w-1/2 lg:sticky top-5">
            {submitted ? (
              <div className="text-white border-4 sm:border-14 border-[hsl(22.59,34.14%,51.18%)] rounded-3xl p-8 bg-[#7b4942] flex flex-col items-center justify-center gap-4 min-h-60">
                <div className="text-5xl">🍪</div>
                <div className="text-2xl font-bold text-[rgb(249,229,197)]">
                  Vote submitted!
                </div>
                <div className="text-[rgb(215,181,147)] text-center">
                  Thanks for reviewing. Your balance has been updated.
                </div>
              </div>
            ) : (
              <div className="text-white border-4 sm:border-14 border-[hsl(22.59,34.14%,51.18%)] rounded-3xl p-5 sm:p-8 bg-[#7b4942]">
                <h2 className="text-2xl font-bold text-[rgb(249,229,197)] mb-1">
                  Scorecard
                </h2>
                <p className="text-[rgb(215,181,147)] text-sm mb-6">
                  Rate each dimension out of 9 stars
                </p>
                <div className="flex flex-col gap-5">
                  {criteria.map(({ key, label, desc, color }) => (
                    <div key={key}>
                      <div className="gap-4 items-center justify-between mb-1">
                        <div className="mb-2">
                          <div className="text-xl font-semibold text-[rgb(249,229,197)]">
                            {label}
                          </div>
                          <div className="text-[rgb(215,181,147)] text-sm">
                            {desc}
                          </div>
                        </div>
                        <div className="flex">
                          {" "}
                          <StarRating
                            value={scores[key]}
                            onChange={(v) =>
                              setScores((s) => ({ ...s, [key]: v }))
                            }
                            color={color}
                          />
                          <div className='text-2xl flex  text-[rgb(215,181,147)] ml-4 self-end'>
                      {scores[key]}/9
                      </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
                <div className="mt-6">
                  <label className="text-[rgb(249,229,197)] text-sm font-semibold block mb-2">
                    Feedback{" "}
                    <span className="text-[rgb(215,181,147)] font-normal">
                      (optional)
                    </span>
                  </label>
                  <textarea
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    rows={3}
                    placeholder="Leave a note for the creator..."
                    className="w-full bg-[rgb(78,44,51)] border-2 border-[hsl(22.59,34.14%,51.18%)] rounded-2xl px-4 py-3 text-[rgb(249,229,197)] placeholder:text-[rgb(215,181,147)]/50 resize-none outline-none focus:border-[rgb(215,181,147)] transition-colors text-sm"
                  />
                </div>
                {error && (
                  <div className="mt-3 text-red-400 text-sm bg-red-500/10 border border-red-500/20 rounded-xl px-4 py-2">
                    {error}
                  </div>
                )}
                <button
                  onClick={handleSubmit}
                  disabled={!allScored || submitting}
                  className={`mt-5 w-full flex items-center justify-center gap-2 py-4 px-8 text-lg rounded-2xl h-13 font-semibold transition-all ${allScored && !submitting ? "text-[rgb(245,216,198)] bg-[rgb(78,44,51)] hover:bg-[rgb(60,34,40)] cursor-pointer" : "text-[rgb(187,157,140)] bg-[rgb(133,94,101)] pointer-events-none"}`}
                >
                  <FaPaperPlane />
                  {submitting ? "Submitting..." : "Submit Vote"}
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}