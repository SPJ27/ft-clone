import { hoursConverter } from '@/lib/converter'
import Image from 'next/image'

const Devlog = ({ user, project, text, images, hours }) => {
  const [hour, minutes] = hoursConverter(hours)
  return (
    <div className='text-white tracking-tight leading-6 font-extrabold border-14 text-lg max-w-220 mx-auto shadow-sm border-[hsl(68,50%,71%)] rounded-3xl py-8 px-10 bg-[#73a541]'>
      <div className='flex gap-4 items-center'>
        <div className="rounded-full bg-white h-9 w-9"></div>
        <div>
          <div>
            {user} <span className='text-neutral-200/70'>worked on</span> {project}
          </div>
          <div className='text-neutral-200/70 text-[17px]'>
            {hour}h {minutes}m worked
          </div>
        </div>
      </div>
      <div className='my-3.5 leading-7 text-[19px]'>
        {text}
      </div>
      <Image src={images[1]} alt='devlog_image' unoptimized className='w-full' height={400} width={700}/>
    </div>
  )
}

export default Devlog