import { hoursConverter } from '@/lib/converter'
import { cookies } from 'next/headers'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { FaClock, FaFileAlt } from 'react-icons/fa'

const ProjectBanner = ({ id, banner_url: image, project_name: title, project_desc, total_hours, devlogs }) => {
  const [hours, minutes] = hoursConverter(total_hours)

  return (
    <Link
      href={`/projects/${id}`}
      className='isolate group text-white w-full border-[10px] sm:border-[12px] md:border-[14px] border-[hsl(22.59,34.14%,51.18%)] rounded-2xl sm:rounded-3xl p-3.5 sm:p-4 md:p-5 bg-[#7b4942] hover:brightness-110 hover:scale-[1.015] transition-all duration-200 ease-out flex flex-col'
    >
      <div className='relative rounded-xl sm:rounded-2xl overflow-hidden bg-[hsl(22.59,34.14%,51.18%)] h-36 sm:h-44 md:h-48 w-full'>
        {image && (
          <Image
            src={image}
            alt={`${title} banner`}
            fill
            sizes='(max-width: 640px) 100vw, (max-width: 768px) 50vw, 400px'
            className='object-cover object-top z-0'
          />
        )}
      </div>

      <h2 className='mt-4 sm:mt-5 px-1 sm:px-2 text-[1.35rem] sm:text-[1.6rem] md:text-[1.85rem] leading-tight font-semibold text-[rgb(249,229,197)] line-clamp-2'>
        {title}
      </h2>

      <div className='flex flex-wrap px-1 sm:px-2 text-[11px] sm:text-[13px] md:text-[14px] mt-1.5 font-semibold text-[rgb(215,181,147)] gap-x-5 gap-y-1'>
        <span className='flex gap-1 items-center'>
          <FaClock className='shrink-0' />
          {hours}h {minutes}m
        </span>
        <span className='flex gap-1 items-center'>
          <FaFileAlt className='shrink-0' />
          {devlogs.length} devlog{devlogs.length !== 1 ? 's' : ''}
        </span>
      </div>

      <p className='px-1 sm:px-2 text-[0.9rem] sm:text-[1rem] md:text-[1.08rem] mt-2.5 sm:mt-3 leading-snug font-medium text-[rgb(249,229,197)] opacity-85 line-clamp-3 flex-1'>
        {project_desc}
      </p>
    </Link>
  )
}

const page = async () => {
  const cookieStore = await cookies()
  const res = await fetch(`${process.env.API_BASE_URL}/api/user`, {
    headers: { Cookie: cookieStore.toString() },
  })
  const { userProjects } = await res.json()

  return (
    <div className='flex w-full min-h-screen md:pl-24 lg:pl-28 pb-24 md:pb-8'>
      <div className='w-full max-w-5xl mx-auto px-4 sm:px-6 md:px-8 lg:px-10'>
        <div className='bg-[hsl(214,39%,39%)] text-white text-center font-bold text-lg sm:text-2xl md:text-3xl lg:text-4xl px-8 sm:px-12 py-3 rounded-xl sm:rounded-2xl mt-8 sm:mt-10 w-fit mx-auto shadow-md'>
          My Projects
        </div>

        {userProjects?.length > 0 ? (
          <div className='w-full grid grid-cols-1 sm:grid-cols-2 gap-x-8 md:gap-x-12 lg:gap-x-16 gap-y-8 sm:gap-y-10 md:gap-y-12 lg:gap-y-14 mt-8 sm:mt-10 md:mt-12'>
            {userProjects.map((project, i) => (
              <ProjectBanner key={project.id ?? i} {...project} />
            ))}
          </div>
        ) : (
          <div className='text-center text-[rgb(249,229,197)] opacity-60 mt-24 text-lg'>
            No projects yet.
          </div>
        )}
      </div>
    </div>
  )
}

export default page