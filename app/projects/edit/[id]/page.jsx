'use client'
import React, { useEffect, useRef, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'

const Page = () => {
  const router = useRouter()
  const { id } = useParams()
  const dropdownRef = useRef(null)

  const [project_name, setProjectName] = useState('')
  const [project_desc, setProjectDesc] = useState('')
  const [project_demo, setProjectDemo] = useState('')
  const [project_repo, setProjectRepo] = useState('')
  const [hackatime_projects, setHackatimeProjects] = useState([])
  const [selected_hackatime, setSelectedHackatime] = useState([])
  const [dropdownOpen, setDropdownOpen] = useState(false)
  const [submitting, setSubmitting] = useState(false)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Fetch existing project data + user's hackatime projects
  useEffect(() => {
    const load = async () => {
      try {
        const [projectRes, userRes] = await Promise.all([
          fetch(`/api/projects?project_id=${id}`),
          fetch('/api/user'),
        ])

        const projectJson = await projectRes.json()
        const userJson = await userRes.json()

        if (!projectRes.ok) {
          setError(projectJson.error || 'Failed to load project.')
          return
        }

        const p = projectJson.projectData
        setProjectName(p.project_name ?? '')
        setProjectDesc(p.project_desc ?? '')
        setProjectDemo(p.project_demo ?? '')
        setProjectRepo(p.project_repo ?? '')
        setSelectedHackatime(p.hackatime_projects ?? [])

        if (userJson.projects?.projects) {
          setHackatimeProjects(userJson.projects.projects)
        }
      } catch {
        setError('Failed to load project.')
      } finally {
        setLoading(false)
      }
    }
    if (id) load()
  }, [id])

  useEffect(() => {
    const handler = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handler)
    return () => document.removeEventListener('mousedown', handler)
  }, [])

  const toggleProject = (projectName) => {
    setSelectedHackatime(prev =>
      prev.includes(projectName)
        ? prev.filter(p => p !== projectName)
        : [...prev, projectName]
    )
  }

  const unlink = (projectName) => {
    setSelectedHackatime(prev => prev.filter(p => p !== projectName))
  }

  const handleSubmit = async () => {
    setError('')
    if (!project_name.trim()) return setError('Project name is required.')

    setSubmitting(true)
    try {
      const res = await fetch('/api/projects', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id,
          project_name,
          project_desc,
          project_demo,
          project_repo,
          hackatime_projects: selected_hackatime,
        }),
      })
      const data = await res.json()

      if (!res.ok) {
        setError(data.error || 'Failed to update project.')
        return
      }

      router.push(`/projects/${id}`)
    } catch {
      setError('Something went wrong. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const unselected = hackatime_projects.filter(p => !selected_hackatime.includes(p.name))

  if (loading) {
    return (
      <div className="p-8 max-w-2xl mx-auto w-full">
        <div className="bg-[hsl(214,39%,39%)] tracking-wide text-center max-w-xs mx-auto text-white text-2xl px-13 py-2.5 rounded-2xl mt-10">
          Edit Project
        </div>
        <p className="text-white text-center mt-8 opacity-70">Loading…</p>
      </div>
    )
  }

  return (
    <div className="p-8 max-w-2xl mx-auto w-full">
      <div className="bg-[hsl(214,39%,39%)] tracking-wide text-center max-w-xs mx-auto text-white text-2xl px-13 py-2.5 rounded-2xl mt-10">
        Edit Project
      </div>

      <form
        className="text-xl text-white rounded-2xl mt-6 bg-[#bc762b] border-[#e7c16e] border-[14px] p-8 space-y-4"
        onSubmit={e => { e.preventDefault(); handleSubmit() }}
      >
        {([
          ['Name', project_name, setProjectName, 'text', true],
          ['Description', project_desc, setProjectDesc, 'text', false],
          ['Demo URL', project_demo, setProjectDemo, 'url', false],
          ['Repo URL', project_repo, setProjectRepo, 'url', false],
        ].map(
          ([label, value, setter, type, required]) => (
            <div key={label}>
              <label className="block mb-1">{label}{required && <span className="text-red-300 ml-1">*</span>}</label>
              <input
                type={type}
                value={value}
                onChange={e => setter(e.target.value)}
                required={required}
                className="block border border-[#e7c16e] rounded-lg p-2 text-base bg-[#a8621f] placeholder-[#e7c16e]/50 text-white focus:outline-none focus:ring-2 focus:ring-[#e7c16e] w-full"
              />
            </div>
          )
        ))}

        {hackatime_projects.length > 0 && (
          <div>
            <label className="block mb-1">Hackatime Projects</label>

            <div className="relative" ref={dropdownRef}>
              <button
                type="button"
                onClick={() => setDropdownOpen(o => !o)}
                className="w-full flex items-center justify-between border border-[#e7c16e] rounded-lg px-3 py-2 text-base bg-[#a8621f] text-white focus:outline-none focus:ring-2 focus:ring-[#e7c16e]"
              >
                <span className="text-[#e7c16e]/80">
                  {unselected.length === 0 ? 'All projects linked' : 'Link a project…'}
                </span>
                <svg className={`w-4 h-4 transition-transform ${dropdownOpen ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {dropdownOpen && unselected.length > 0 && (
                <div className="absolute z-10 mt-1 w-full bg-[#a8621f] border border-[#e7c16e] rounded-lg shadow-lg max-h-48 overflow-y-auto">
                  {unselected.map(project => (
                    <button
                      key={project.name}
                      type="button"
                      onClick={() => { toggleProject(project.name); setDropdownOpen(false) }}
                      className="w-full text-left px-3 py-2 text-base text-white hover:bg-[#bc762b] transition-colors"
                    >
                      {project.name}
                    </button>
                  ))}
                </div>
              )}
            </div>

            {selected_hackatime.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-2">
                {selected_hackatime.map(name => (
                  <span
                    key={name}
                    className="flex items-center gap-1.5 bg-[#a8621f] border border-[#e7c16e] rounded-full px-3 py-1 text-sm text-white"
                  >
                    {name}
                    <button
                      type="button"
                      onClick={() => unlink(name)}
                      aria-label={`Unlink ${name}`}
                      className="text-[#e7c16e] hover:text-white transition-colors leading-none"
                    >
                      ✕
                    </button>
                  </span>
                ))}
              </div>
            )}
          </div>
        )}

        {error && (
          <p className="text-red-300 text-base">{error}</p>
        )}

        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => router.push(`/projects/${id}`)}
            className="flex-1 py-2 bg-[#a8621f] hover:bg-[#965516] border border-[#e7c16e] text-white text-lg rounded-xl transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="submit"
            disabled={submitting}
            className="flex-1 py-2 bg-[hsl(214,39%,39%)] hover:bg-[hsl(214,39%,32%)] disabled:opacity-60 disabled:cursor-not-allowed text-white text-lg rounded-xl transition-colors cursor-pointer"
          >
            {submitting ? 'Saving…' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default Page