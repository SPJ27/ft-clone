import { hoursConverter } from '@/lib/converter'
import { cookies, headers } from 'next/headers'
import Image from 'next/image'
import React from 'react'
import Link from 'next/link'
import ProjectBanner from '@/components/ProjectBanner'

const page = async ({ params }) => {
  const { id } = await params
  const cookieStore = await cookies()
  const res = await fetch(`${process.env.API_BASE_URL}/api/projects?project_id=${id}`, {
    headers: {
      Cookie: cookieStore.toString()
    }
  })

  const { projectData, canShip, isCurrentUserCreated, shipEvents } = await res.json()
  console.log(canShip)
  const [hours, minutes] = hoursConverter(projectData.total_hours)
  return (
    <div className='p-5'>
      <ProjectBanner canShip={canShip} title={projectData.project_name} devlogs={projectData.devlogs.length} desc={projectData.project_desc} demo={projectData.project_demo} repo={projectData.project_repo} hours={hours} minutes={minutes} image={projectData.banner_url}
        user={projectData.user_name} />
      {projectData.banner_url ? <Image alt="project banner" src={projectData.banner_url} width={1000} height={120} unoptimized /> : 'No image'}
      <h1 className='text-xl font-medium'>{projectData.project_name}</h1>
      <p>{projectData.project_desc}</p>
      <p>Hours Logged: {hours} hours and {minutes} minutes</p>
      <p>By: {projectData.user_name}</p>
      {isCurrentUserCreated && <Link href={`/projects/devlog/${id}`}>Add devlog</Link>}
      {shipEvents.map((data, i) => (
        <div key={i}>
          <p>Text: {data.ship_text}</p>
          <p>Shipped On: {data.created_at}</p>
        </div>
      ))}
    </div>
  )
}

export default page