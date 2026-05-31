import Image from 'next/image'
import Link from 'next/link'
import React from 'react'
import { FaClock, FaFileAlt, FaGithub, FaGlobe, FaRocket } from 'react-icons/fa'

const statusConfig = {
  PENDING:  { label: 'Pending Review', classes: 'bg-yellow-500 text-white border border-yellow-500/40' },
  APPROVED: { label: 'Approved',       classes: 'bg-green-500 text-white border border-green-500/40' },
  REJECTED: { label: 'Rejected',       classes: 'bg-red-500 text-white border border-red-500/40' },
}

const ProjectBanner = ({ id, image, title, desc, repo, demo, hours, user, devlogs, minutes, canShip, shipStatus, showShipButton=true }) => {
  const status = shipStatus ? statusConfig[shipStatus] : null
  
  return (
    <div className='text-white border-4 sm:border-10 max-w-230 mx-auto border-[hsl(22.59,34.14%,51.18%)] rounded-2xl p-2 sm:p-3 px-3 sm:px-5 bg-[#7b4942]'>
      <div className='relative rounded-2xl overflow-hidden bg-[hsl(22.59,34.14%,51.18%)] h-36 sm:h-52'>
        <Image
          src={image}
          alt='project image'
          fill
          unoptimized
          className='object-cover object-top'
        />
      </div>
      <div className='flex mt-4 sm:mt-6 px-2 sm:px-3 items-start gap-3'>
        <div className='flex-1'>
          <div className='text-[1.5rem] sm:text-[2rem] leading-tight font-normal text-[rgb(249,229,197)]'>
            {title}
          </div>
          <div className='text-[13px] sm:text-[14px] text-[rgb(215,181,147)]'>
            Created By: {user}
          </div>
        </div>
        {status && (
          <span className={`shrink-0 mt-1 text-[13px] sm:text-[14.5px] font-semibold px-3 py-1 rounded-full ${status.classes}`}>
            {status.label}
          </span>
        )}
      </div>
      <div className='flex flex-wrap px-2 sm:px-3 text-[14px] sm:text-[16px] mt-3 font-medium text-[rgb(215,181,147)] gap-5 sm:gap-10'>
        <span className='flex gap-1 items-center'><FaClock /> Hours: {hours}h {minutes}m</span>
        <span className='flex gap-1 items-center'><FaFileAlt /> Devlogs: {devlogs}</span>
      </div>
      <div className='px-2 sm:px-3 text-[1rem] sm:text-[1.19rem] mt-3 leading-tight flex-1 font-medium text-[rgb(249,229,197)]'>
        {desc}
      </div>
      <div className={`grid px-2 sm:px-3 gap-3 mt-4  ${showShipButton ? 'sm:grid-cols-3 grid-cols-1' : 'sm:grid-cols-2 grid-cols-1'}`}>
        <Link href={demo} className='flex text-[rgb(245,216,198)] bg-[rgb(78,44,51)] justify-center items-center py-4 sm:py-5 px-8 text-lg sm:text-xl rounded-lg h-12 sm:h-10 gap-2 w-full'><FaGlobe /> Demo</Link>
        <Link href={repo} className='flex text-[rgb(245,216,198)] bg-[rgb(78,44,51)] justify-center items-center py-4 sm:py-5 px-8 text-lg sm:text-xl rounded-lg h-12 sm:h-10 gap-2 w-full'><FaGithub /> Repository</Link>
        {showShipButton && (
          <Link href={`/projects/ship/${id}`} className={`flex ${canShip ? 'text-[rgb(245,216,198)] bg-[rgb(78,44,51)]' : 'pointer-events-none cursor-not-allowed text-[rgb(187,157,140)] bg-[rgb(133,94,101)]'} justify-center items-center py-4 sm:py-5 px-8 text-lg sm:text-xl rounded-lg h-12 sm:h-10 gap-2 w-full`}><FaRocket /> Ship</Link>
        )}
      </div>
    </div>
  )
}

export default ProjectBanner