import { hoursConverter } from '@/lib/converter'
import Image from 'next/image'

const Devlog = ({ user, project, text, images, hours }) => {
  const [hour, minutes] = hoursConverter(hours)
  return (
    <div className='text-white tracking-tight leading-6 font-extrabold border-4 sm:border-14 text-base sm:text-lg max-w-180 mx-auto shadow-sm border-[hsl(68,50%,71%)] rounded-3xl py-5 sm:py-8 px-5 sm:px-10 bg-[#73a541]'>
      <div className='flex gap-3 sm:gap-4 items-center'>
        <div className='rounded-full bg-white h-8 w-8 sm:h-9 sm:w-9 shrink-0'></div>
        <div>
          <div className='text-[15px] sm:text-[17px]'>
            {user} <span className='text-neutral-200/70'>worked on</span> {project}
          </div>
          <div className='text-neutral-200/70 text-[14px] sm:text-[17px]'>
            {hour}h {minutes}m worked
          </div>
        </div>
      </div>
      <div className='my-3 sm:my-3.5 leading-6 sm:leading-7 text-[16px] sm:text-[19px]'>
        {text}
      </div>
      <Image src={images[0]} alt='devlog_image' unoptimized className='w-full sm:w-1/2 mx-auto rounded-xl' height={400} width={700} />
    </div>
  )
}

export default Devlog