import { hoursConverter } from '@/lib/converter'
import { createClient } from '@/supabase/server'
import { cookies } from 'next/headers'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { FaClock, FaFileAlt } from 'react-icons/fa'

const ProjectBanner = async ({ id, banner_url: image, project_name: title, project_desc, user_name: user, user_id , total_hours, devlogs }) => {
  const [hours, minutes] = hoursConverter(total_hours)
  const supabase = createClient(await cookies())
  const { data: creator } = await supabase.from('users').select().eq('hackclub_id', user_id).single()
  console.log('creator', creator)
  return (
    <div  className='text-white w-full border-14 mx-auto border-[hsl(22.59,34.14%,51.18%)] rounded-3xl p-5 bg-[#7b4942]'>
      <Link href={`/projects/${id}`} className='relative rounded-2xl items-center flex overflow-hidden bg-[hsl(22.59,34.14%,51.18%)] h-48'>
        {image && (
          <Image
            src={image}
            alt='project image'
            width={300}
            height={100}
            className='object-cover mx-auto object-top'
          />
        )}
      </Link>
      <div className='mt-6 px-3 items-center'>
        <Link href={`/projects/${id}`} className='md:text-[1.8rem] block text-[1.4rem] leading-tight flex-1 font-semibold text-[rgb(249,229,197)]'>
          {title}
        </Link>
        <Link href={`/u/${creator?.id || user_id}`} className='hover:underline text-xs md:text-md font-bold text-[rgb(199,179,158)]'>
          By: {creator?.name || user}
        </Link>
      </div>
      <Link href={`/projects/${id}`} className='flex px-3 md:text-[13px] text-[12px] mt-1 font-semibold text-[rgb(215,181,147)] gap-10'>
        <span className='flex gap-1 items-center'><FaClock /> Hours: {hours}h {minutes}m</span>
        <span className='flex gap-1 items-center'><FaFileAlt /> Devlogs: {devlogs.length}</span>
      </Link>
      <Link href={`/projects/${id}`} className='px-3 md:text-[1rem] text-[0.875rem] md:mt-20 mt-3 leading-tight flex-1 font-semibold text-[rgb(249,229,197)]'>
        {project_desc.substring(0, 70).trimEnd()}...
      </Link>
    </div>
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
      <div className='w-full max-w-220 md:ml-24 items-center'>
        <div className='bg-[hsl(214,39%,39%)] text-center max-w-73 md:max-w-sm mx-auto text-white text-lg md:text-2xl font-bold px-15 py-3 rounded-2xl mt-10'>
          Random Projects
        </div>
        <div className='w-full gap-x-16 gap-y-14 mt-8 grid px-4 grid-cols-1 md:grid-cols-2'>
          {projects.map((project, i) => (
            <ProjectBanner key={i} {...project} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default page