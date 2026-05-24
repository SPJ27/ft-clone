import { hoursConverter } from '@/lib/converter'
import { cookies } from 'next/headers'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { FaClock, FaFileAlt, FaGithub, FaGlobe, FaRocket, FaTrash } from 'react-icons/fa'

const ProjectBanner = ({ id, banner_url: image, project_name: title, project_desc, total_hours, devlogs }) => {
    const [hours, minutes] = hoursConverter(total_hours)
    return (
        <Link href={`/projects/${id}`} className='text-white w-full border-14 mx-auto border-[hsl(22.59,34.14%,51.18%)] rounded-3xl  p-5 bg-[#7b4942]'>
            <div className='relative rounded-2xl items-center flex  overflow-hidden bg-[hsl(22.59,34.14%,51.18%)] h-48'>
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
            <div className='flex mt-6 px-3 items-center'>
                <div className='md:text-[2rem] text-[2.0rem] leading-tight flex-1 font-semibold text-[rgb(249,229,197)]'>
                    {title}
                </div>
            </div>
            <div className='flex px-3 md:text-[14px] text-[15px] mt-1 font-semibold text-[rgb(215,181,147)] gap-10'>
                <span className='flex gap-1 items-center'><FaClock /> Hours: {hours}h {minutes}m</span>
                <span className='flex gap-1 items-center'><FaFileAlt /> Devlogs: {devlogs.length}</span>
            </div>
            <div className='px-3 md:text-[1.12rem] text-[1.15rem] mt-3 leading-tight flex-1 font-semibold text-[rgb(249,229,197)]'>
                {project_desc.substring(0, 100).trimEnd()}...
            </div>
        </Link>
    )
}



const page = async () => {
    const cookieStore = await cookies()
    const res = await fetch(`${process.env.API_BASE_URL}/api/user`, {
        headers: {
            Cookie: cookieStore.toString()
        }
    })
    const { userProjects } = await res.json()
    console.log(userProjects)
    return (
        <div className='flex w-full items-center justify-center'>
            <div className='w-full max-w-4xl  items-center'>
                <div className='bg-[hsl(214,39%,39%)] text-center max-w-lg mx-auto text-white text-4xl font-bold px-15 py-3 rounded-2xl mt-10   '>
                    My Projects
                </div>
                <div className='w-full gap-x-16 gap-y-14 mt-13 grid grid-cols-2'>
                    {userProjects.map((project, i) => (
                        <ProjectBanner key={i} {...project} />
                    ))}
                </div>
            </div>
        </div>
    )
}

export default page