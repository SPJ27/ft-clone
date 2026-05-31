'use client'
import Link from 'next/link'
import Image from 'next/image'
import { useState, useEffect } from 'react'
import { FaClock, FaFileAlt, FaGithub, FaGlobe, FaCheck, FaTimes, FaShip } from 'react-icons/fa'

const DevlogItem = ({ devlog, user, initials, title }) => (
  <div className='px-5 py-4 border-b border-[hsl(22,34%,43%)] last:border-b-0'>
    <div className='flex items-center gap-2 mb-2'>
      <div className='w-7 h-7 rounded-full bg-[hsl(22,34%,60%)] flex items-center justify-center text-[11px] font-medium text-[rgb(249,229,197)] shrink-0'>
        {initials}
      </div>
      <div className='text-[12px] text-[rgb(215,181,147)]'>
        <span className='text-[rgb(249,229,197)] font-medium'>{user}</span> worked on {title}
      </div>
      <div className='ml-auto flex items-center gap-1 text-[11px] text-[rgb(155,120,100)] shrink-0'>
        <FaClock className='text-[10px]' />
        {devlog.hours}h {devlog.minutes}m · {devlog.date}
      </div>
    </div>
    <p className='text-[13px] text-[rgb(215,181,147)] font-medium leading-relaxed mb-3'>
      {devlog.text}
    </p>
    {devlog.images?.length > 0 && (
      <div className={`grid gap-2 ${devlog.images.length === 1 ? 'grid-cols-1' : 'grid-cols-2'}`}>
        {devlog.images.map((img, i) => (
          <div key={i} className='relative rounded-xl overflow-hidden bg-[hsl(22,34%,35%)] aspect-video'>
            <Image
              src={img}
              alt={`devlog image ${i + 1}`}
              fill
              unoptimized
              className='object-cover'
            />
          </div>
        ))}
      </div>
    )}
  </div>
)

const ProjectListItem = ({ project, active, onClick }) => (
  <button
    onClick={onClick}
    className={`w-full text-left rounded-lg p-3 transition-colors cursor-pointer bg-[rgb(100,58,53)] ${active ? 'border-[rgb(249,229,197)]' : 'border-transparent hover:border-[hsl(22,34%,60%)]'}`}
  >
    <div className='flex items-center justify-between gap-2 mb-1'>
      <span className='text-[14px] font-medium text-[rgb(249,229,197)] truncate'>{project.title}</span>
      <span className='shrink-0 text-[10px] font-medium bg-[#EF9F27] text-[#412402] px-2 py-0.5 rounded-full'>
        pending
      </span>
    </div>
    <div className='text-[12px] text-[rgb(215,181,147)] mb-2'>{project.user}</div>
    <div className='flex gap-3 text-[11px] text-[rgb(215,181,147)]'>
      <span className='flex items-center gap-1'><FaClock className='text-[10px]' /> {project.hours}h {project.minutes}m</span>
      <span className='flex items-center gap-1'><FaFileAlt className='text-[10px]' /> {project.devlogs.length} devlogs</span>
    </div>
  </button>
)

const Page = () => {
  const [projects, setProjects] = useState([])
  const [selectedId, setSelectedId] = useState(null)
  const [notes, setNotes] = useState({})
  const [loading, setLoading] = useState(false)
  const [fetching, setFetching] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/ship/shipwright`)
        if (!res.ok) throw new Error('Failed to load ships')
        const { ships } = await res.json()
    console.log(ships)
        setProjects(ships)
        setSelectedId(ships[0]?.id ?? null)
      } catch (e) {
        setError(e.message)
      } finally {
        setFetching(false)
      }
    }
    load()
  }, [])

  const selected = projects.find(p => p.id === selectedId)

  const handleDecide = async (approved) => {
    if (!selected) return
    setLoading(true)
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/ship/shipwright`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ship_id: selected.id,
          approved,
          reviewer_note: notes[selected.id] ?? '',
        }),
      })
      if (!res.ok) throw new Error('Failed to submit decision')
      const remaining = projects.filter(p => p.id !== selected.id)
      setProjects(remaining)
      setSelectedId(remaining[0]?.id ?? null)
    } catch (e) {
      console.error(e)
    } finally {
      setLoading(false)
    }
  }

  if (fetching) {
    return (
      <div className='min-h-screen bg-[rgb(249,229,197)] flex items-center justify-center'>
        <div className='text-[#7b4942] text-[14px]'>Loading ships...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className='min-h-screen bg-[rgb(249,229,197)] flex items-center justify-center'>
        <div className='text-[#791F1F] text-[14px]'>Error: {error}</div>
      </div>
    )
  }
  return (
    <div className='min-h-screen bg-[rgb(249,229,197)] p-4 sm:p-6'>
      <div className='max-w-225 mx-auto'>

        <div className='mb-5 flex items-center gap-3'>
          <FaShip className='text-[#7b4942] text-2xl' />
          <div>
            <h1 className='text-[22px] font-medium text-[#7b4942] leading-none'>Shipwright</h1>
            <p className='text-[13px] text-[hsl(22,34%,45%)] mt-0.5'>{projects.length} ships awaiting review</p>
          </div>
        </div>

        <div className='flex gap-4 items-start'>

          <div className='w-64 shrink-0 bg-[#7b4942] border-4 border-[hsl(22,34%,51%)] rounded-lg overflow-hidden'>
            <div className='px-4 py-3 border-b border-[hsl(22,34%,45%)]'>
              <div className='text-[14px] font-medium text-[rgb(249,229,197)] flex items-center gap-2'>
                <FaShip /> Pending ships
              </div>
              <div className='text-[12px] text-[rgb(215,181,147)] mt-0.5'>{projects.length} awaiting review</div>
            </div>
            <div className='p-2.5 flex flex-col gap-2 max-h-[calc(100vh-180px)] overflow-y-auto'>
              {projects.length === 0 && (
                <div className='py-8 text-center text-[13px] text-[rgb(155,120,100)]'>
                  All ships reviewed!
                </div>
              )}
              {projects.map(p => (
                <ProjectListItem
                  key={p.id}
                  project={p}
                  active={p.id === selectedId}
                  onClick={() => setSelectedId(p.id)}
                />
              ))}
            </div>
          </div>

          <div className='flex-1 min-w-0 flex flex-col gap-4'>
            {!selected ? (
              <div className='bg-[#7b4942] border-4 border-[hsl(22,34%,51%)] rounded-lg p-10 text-center text-[rgb(155,120,100)] text-[14px]'>
                All ships reviewed — great work!
              </div>
            ) : (
              <>
                <div className='bg-[#7b4942] border-4 border-[hsl(22,34%,51%)] rounded-lg overflow-hidden'>

                  {selected.image && (
                    <div className='relative w-full h-48 sm:h-60 bg-[hsl(22,34%,35%)]'>
                      <Image
                        src={selected.image}
                        alt={selected.title}
                        fill
                        unoptimized
                        className='object-cover object-top'
                      />
                    </div>
                  )}

                  <div className='p-5'>
                    <div className='flex items-start justify-between gap-3 mb-3'>
                      <div>
                        <h2 className='text-[22px] font-normal text-[rgb(249,229,197)] leading-tight'>{selected.title}</h2>
                        <p className='text-[13px] text-[rgb(215,181,147)] mt-0.5'>by {selected.user}</p>
                      </div>
                      <span className='shrink-0 mt-1 text-[11px] font-medium bg-[#EF9F27] text-[#412402] px-3 py-1 rounded-full'>
                        pending review
                      </span>
                    </div>

                    <div className='flex flex-wrap gap-2 mb-3'>
                      {[
                        { icon: <FaClock />, label: `${selected.hours}h ${selected.minutes}m logged` },
                        { icon: <FaFileAlt />, label: `${selected.devlogs.length} devlogs` },
                        { label: `~ ${Math.round(selected.unpaid_hours)} unpaid hours` },
                      ].map((s, i) => (
                        <div key={i} className='flex items-center gap-1.5 bg-[rgb(100,58,53)] rounded-full px-3 py-1 text-[12px] text-[rgb(215,181,147)]'>
                          {s.icon && <span className='text-[11px]'>{s.icon}</span>}
                          <span className='font-medium text-[rgb(249,229,197)]'>{s.label}</span>
                        </div>
                      ))}
                    </div>

                    <p className='text-[13px] text-[rgb(215,181,147)] leading-relaxed mb-4'>{selected.desc}</p>

                    <div className='grid grid-cols-2 gap-2 mb-4'>
                      <Link
                        href={selected.repo}
                        target='_blank'
                        className='flex items-center justify-center gap-2 bg-[rgb(78,44,51)] hover:bg-[rgb(95,54,60)] text-[rgb(245,216,198)] rounded-lg py-2.5 text-[13px] transition-colors'
                      >
                        <FaGithub /> Repository
                      </Link>
                      {selected.demo ? (
                        <Link
                          href={selected.demo}
                          target='_blank'
                          className='flex items-center justify-center gap-2 bg-[rgb(78,44,51)] hover:bg-[rgb(95,54,60)] text-[rgb(245,216,198)] rounded-lg py-2.5 text-[13px] transition-colors'
                        >
                          <FaGlobe /> Demo
                        </Link>
                      ) : (
                        <div className='flex items-center justify-center gap-2 bg-[rgb(78,44,51)] text-[rgb(155,120,100)] rounded-lg py-2.5 text-[13px] opacity-50 cursor-not-allowed'>
                          <FaGlobe /> No demo
                        </div>
                      )}
                    </div>
                    <div className='mb-3'>
                      <label className='block text-[11px] uppercase tracking-wider text-[rgb(215,181,147)] mb-1.5'>
                        Reviewer note
                      </label>
                      <textarea
                        value={notes[selected.id] ?? ''}
                        onChange={e => setNotes(n => ({ ...n, [selected.id]: e.target.value }))}
                        placeholder='Leave a note for the creator...'
                        rows={2}
                        className='w-full bg-[rgb(100,58,53)] border border-[hsl(22,34%,45%)] focus:border-[rgb(215,181,147)] outline-none rounded-xl px-3 py-2.5 text-[13px] text-[rgb(249,229,197)] placeholder:text-[rgb(130,95,78)] resize-none transition-colors'
                      />
                    </div>
                    <div className='grid grid-cols-2 gap-2'>
                      <button
                        onClick={() => handleDecide(false)}
                        disabled={loading}
                        className='flex items-center justify-center gap-2 bg-[#c73a3a] border border-[#A32D2D] text-white rounded-lg py-2.5 text-[13px] font-medium transition-colors disabled:opacity-50 cursor-pointer'
                      >
                        <FaTimes /> Reject
                      </button>
                      <button
                        onClick={() => handleDecide(true)}
                        disabled={loading}
                        className='flex items-center justify-center gap-2 bg-[#60a02c] border border-[#3B6D11] text-white rounded-lg py-2.5 text-[13px] font-medium transition-colors disabled:opacity-50 cursor-pointer'
                      >
                        <FaCheck /> Approve
                      </button>
                    </div>
                  </div>
                </div>
                <div className='bg-[#7b4942] border-4 border-[hsl(22,34%,51%)] rounded-xl overflow-hidden'>
                  <div className='px-5 py-3 border-b border-[hsl(22,34%,45%)]'>
                    <div className='text-[14px] font-medium text-[rgb(249,229,197)] flex items-center gap-2'>
                      <FaFileAlt /> Devlogs ({selected.devlogs.length})
                    </div>
                  </div>
                  <div>
                    {selected.devlogs.length === 0 && (
                      <div className='px-5 py-8 text-center text-[13px] text-[rgb(155,120,100)]'>
                        No devlogs yet
                      </div>
                    )}
                    {selected.devlogs.map((d, i) => (
                      <DevlogItem
                        key={i}
                        devlog={d}
                        user={selected.user}
                        initials={selected.initials}
                        title={selected.title}
                      />
                    ))}
                  </div>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Page