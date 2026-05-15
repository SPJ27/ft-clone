import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { FaClock, FaFileAlt, FaFolder, FaGithub, FaGlobe, FaIntercom, FaPage4, FaRocket, FaTrash } from 'react-icons/fa'
import { FaNoteSticky, FaWebAwesome } from 'react-icons/fa6'

const ProjectBanner = ({ image, title, desc, repo, demo, hours, user, devlogs, minutes, canShip }) => {
  return (
    <div className='text-white border-14 max-w-250 mx-auto border-[hsl(22.59,34.14%,51.18%)] rounded-3xl p-3 px-5 bg-[#7b4942]'>
      <div className='relative rounded-2xl overflow-hidden bg-[hsl(22.59,34.14%,51.18%)]'>
        <Image
          src={image}
          alt='project image'
          width={500}
          height={200}
          className='sm:max-w-7xl xs:max-w-5xl max-w-50 mx-auto h-auto object-cover object-top'
        />
      </div>
      <div className='flex mt-6 px-3 items-center '>
        <div className='md:text-[2.4rem] text-[2.0rem] leading-tight flex-1 font-semibold text-[rgb(249,229,197)]'>
          {title}
          <div className='md:text-[18.5px] text-[17px] text-[rgb(215,181,147)]'>
            Created By: {user}
          </div>
        </div>
        <div className="flex flex-1 justify-end ">
          <Link href={''} className='flex text-[rgb(78,44,51)] bg-[rgb(173,120,88)] justify-center items-center py-5 px-8 text-xl rounded-2xl h-12'>
            <FaTrash />
          </Link>
        </div>

      </div>
      <div className='flex px-3 md:text-[19px] text-[15px] mt-3 font-semibold text-[rgb(215,181,147)] gap-10'>
        <span className='flex gap-1 items-center'><FaClock /> Hours: {hours}h {minutes}m</span>
        <span className='flex gap-1 items-center'><FaFileAlt /> Devlogs: {devlogs}</span>
      </div>
      <div className='px-3 md:text-[1.3rem] text-[1.15rem] mt-3 leading-tight flex-1 font-semibold text-[rgb(249,229,197)]'>
        {desc}
      </div>
      <div className='grid px-3 gap-3 mt-4 sm:grid-cols-3 grid-cols-1'>
        <Link href={demo} className='flex text-[rgb(245,216,198)] bg-[rgb(78,44,51)] justify-center items-center md:py-5 px-8 text-xl rounded-2xl h-13 gap-2 w-full'><FaGlobe/> Demo</Link>
        <Link href={repo} className='flex text-[rgb(245,216,198)] bg-[rgb(78,44,51)] justify-center items-center md:py-5 px-8 text-xl rounded-2xl h-13 gap-2 w-full'><FaGithub/> Repository</Link>
        <Link href={'/'} className={`flex ${canShip ? 'text-[rgb(245,216,198)] bg-[rgb(78,44,51)]':'pointer-events-none  text-[rgb(187,157,140)] bg-[rgb(133,94,101)]'} justify-center items-center py-5 px-8 text-xl rounded-2xl h-13 gap-2 w-full`}><FaRocket/> Ship </Link>

      </div>
    </div>
  )
}

export default ProjectBanner