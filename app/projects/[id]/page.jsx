import { hoursConverter } from '@/lib/converter'
import { cookies, headers } from 'next/headers'
import Image from 'next/image'
import React from 'react'
import Link from 'next/link'
import ProjectBanner from '@/components/ProjectBanner'
import Devlog from '@/components/Devlog'
import { FaBook } from 'react-icons/fa'

const page = async ({ params }) => {
  const { id } = await params
  const cookieStore = await cookies()
  const res = await fetch(`${process.env.API_BASE_URL}/api/projects?project_id=${id}`, {
    headers: {
      Cookie: cookieStore.toString()
    }
  })

  const { projectData, canShip, isCurrentUserCreated, shipEvents } = await res.json()
  console.log(projectData.devlogs[0].devlog_images[0])
  const [hours, minutes] = hoursConverter(projectData.total_hours)
  return (
    <div className='p-5'>
      <ProjectBanner canShip={canShip} title={projectData.project_name} devlogs={projectData.devlogs.length} desc={projectData.project_desc} demo={projectData.project_demo} repo={projectData.project_repo} hours={hours} minutes={minutes} image={projectData.banner_url}
        user={projectData.user_name} />
      <div className='mx-auto mt-6 flex max-w-250'>
        <Link href={`/projects/devlog/${id}`} className={`flex ml-20 text-[rgb(245,216,198)] max-w-55 border-4 bg-[rgb(78,44,51)] border-[hsl(22.59,34.14%,51.18%)] justify-center items-center py-5 px-8 text-xl rounded-2xl h-13 gap-2 w-full`}><FaBook /> Add Devlog </Link>
      </div>
      {projectData.devlogs.reverse().map((data, i) => (
        <div className='mt-8' key={i}>
          <Devlog user={projectData.user_name} project={projectData.project_name} text={data.devlog_texts} images={data.devlog_images} hours={data.hours} />
        </div>
      ))}
    </div>
  )
}

export default page