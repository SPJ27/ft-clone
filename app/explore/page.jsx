import { hoursConverter } from '@/lib/converter'
import { createClient } from '@/supabase/server'
import { cookies } from 'next/headers'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { FaClock, FaFileAlt } from 'react-icons/fa'

const ProjectBanner = ({ id, banner_url: image, project_name: title, project_desc, user_name: user, total_hours, devlogs }) => {
  const [hours, minutes] = hoursConverter(total_hours)
  return (
    <Link href={`/projects/${id}`} className='text-white w-full border-14 mx-auto border-[hsl(22.59,34.14%,51.18%)] rounded-3xl p-5 bg-[#7b4942]'>
      <div className='relative rounded-2xl items-center flex overflow-hidden bg-[hsl(22.59,34.14%,51.18%)] h-48'>
        {image && (
          <Image
            src={image}
            alt='project image'
            width={308}
            height={100}
            className='object-cover mx-auto object-top'
          />
        )}
      </div>
      <div className='mt-6 px-3 items-center'>
        <div className='md:text-[1.8rem] text-[1.4rem] leading-tight flex-1 font-semibold text-[rgb(249,229,197)]'>
          {title}
        </div>
        <span className='text-md font-bold text-[rgb(199,179,158)]'>By: {user}</span>
      </div>
      <div className='flex px-3 md:text-[19px] text-[15px] mt-3 font-semibold text-[rgb(215,181,147)] gap-10'>
        <span className='flex gap-1 items-center'><FaClock /> Hours: {hours}h {minutes}m</span>
        <span className='flex gap-1 items-center'><FaFileAlt /> Devlogs: {devlogs.length}</span>
      </div>
      <div className='px-3 md:text-[1.3rem] text-[1.15rem] mt-3 leading-tight flex-1 font-semibold text-[rgb(249,229,197)]'>
        {project_desc.substring(0, 100).trimEnd()}...
      </div>
    </Link>
  )
}

const page = async () => {
  const supabase = createClient(await cookies())
  const { data: projects, error } = await supabase.from('projects').select('*')

  if (error || !projects) {
    return (
      <div className='flex w-full items-center justify-center'>
        <p className='text-white mt-10'>Failed to load projects.</p>
      </div>
    )
  }

  return (
    <div className='flex w-full mx-auto items-center justify-center'>
      <div className='w-full max-w-4xl md:ml-24 items-center'>
        <div className='bg-[hsl(214,39%,39%)] text-center max-w-60 md:max-w-md mx-auto text-white text-md md:text-4xl font-bold px-15 py-3 rounded-2xl mt-10'>
          Random Projects
        </div>
        <div className='w-full gap-x-16 gap-y-14 mt-13 grid px-4 grid-cols-1 md:grid-cols-2'>
          {projects.map((project, i) => (
            <ProjectBanner key={i} {...project} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default page