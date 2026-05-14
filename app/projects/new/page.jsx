'use client'
import React, { useEffect, useState } from 'react'

const page = () => {
  const [project_name, setProjectName] = useState('')
  const [project_desc, setProjectDesc] = useState('')
  const [project_demo, setProjectDemo] = useState('')
  const [project_repo, setProjectRepo] = useState('')
  const [hackatime_projects, setHackatimeProjects] = useState([])
  const [selected_hackatime, setSelectedHackatime] = useState([])
  const [file, setFile] = useState(null)

  useEffect(() => {
    const getProjects = async () => {
      const res = await fetch('/api/user')
      const data = await res.json()
      if (data.projects?.projects) {
        setHackatimeProjects(data.projects.projects)
      }
    }
    getProjects()
  }, [])

  const toggleProject = (projectName) => {
    setSelectedHackatime(prev =>
      prev.includes(projectName)
        ? prev.filter(p => p !== projectName)
        : [...prev, projectName]
    )
  }

  return (
    <div>
      <form className='p-8'>
        Name: <input className='block border mb-3' type="text" value={project_name} onChange={e => setProjectName(e.target.value)} />
        Description: <input className='block border mb-3' type="text" value={project_desc} onChange={e => setProjectDesc(e.target.value)} />
        Demo: <input className='block border mb-3' type="text" value={project_demo} onChange={e => setProjectDemo(e.target.value)} />
        Repo: <input className='block border mb-3' type="text" value={project_repo} onChange={e => setProjectRepo(e.target.value)} />
        Banner: <input type="file" onChange={e => setFile(e.target.files[0])} />
        Hackatime Projects:
        {hackatime_projects.map(project => (
          <div key={project.name}>
            <input
              type="checkbox"
              id={project.name}
              checked={selected_hackatime.includes(project.name)}
              onChange={() => toggleProject(project.name)}
            />
            <label htmlFor={project.name}>{project.name}</label>
          </div>
        ))}
        <button
          type='button'
          className='px-4 py-2 bg-amber-600 text-white rounded-sm cursor-pointer'
          onClick={async (e) => {
            e.preventDefault()
            if (!file) return alert('Please select a banner image')
            const formData = new FormData()
            formData.append('file', file)
            formData.append('project_name', project_name)
            formData.append('project_desc', project_desc)
            formData.append('project_demo', project_demo)
            formData.append('project_repo', project_repo)
            formData.append('hackatime_projects', JSON.stringify(selected_hackatime))
            console.log('here')
            try {
              
              const data = await fetch('/api/projects', {
                method: 'POST',
                body: formData
              })
              console.log(await data.json())
            } catch (e) {
              console.log(e)
            }
            
          }}
        >
          Create
        </button>
      </form>
    </div>
  )
}

export default page