'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import React, { useEffect, useState } from 'react'
import { CgExtension } from 'react-icons/cg'
import {
  FaCompass, FaQuestionCircle, FaShoppingCart,
  FaStar, FaUtensils, FaStarHalfAlt, FaShip,
} from 'react-icons/fa'

const navItems = [
  { icon: <FaUtensils />, label: 'Kitchen', to: '/' },
  { icon: <FaCompass />, label: 'Explore', to: '/explore' },
  { icon: <CgExtension />, label: 'Projects', to: '/projects' },
  { icon: <FaQuestionCircle />, label: 'About', to: '/about' },
  { icon: <FaStar />, label: 'Vote', to: '/vote' },
  { icon: <FaShoppingCart />, label: 'Shop', to: '/shop' },
  { icon: <FaShip />, label: 'Shipwright', to: '/shipwright' },
  { icon: <FaStarHalfAlt />, label: 'Wrapped', to: '/wrapped' },
]

const Sidebar = () => {
  const pathname = usePathname()
  const [user, setUser] = useState(null)

  useEffect(() => {
    const func = async () => {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_BASE_URL}/api/user`)
      const { user: userRes } = await res.json()
      setUser(userRes)
    }
    func()
  }, [])

  return (
    <div className='fixed left-12 top-1/2 -translate-y-1/2 group'>
      <div className='w-30 group-hover:w-64 transition-[width] duration-300 ease-in-out bg-[#6199c2] text-[rgb(249,229,197)] flex flex-col rounded-2xl overflow-hidden h-170'>
        <div className='flex flex-col flex-1 py-6'>
          {navItems.map(({ icon, label, to }) => {
            const active = to === '/' ? pathname === '/' : pathname.startsWith(to)
            return (
              <Link
                href={to}
                key={label}
                className={`flex items-center py-4 text-center cursor-pointer whitespace-nowrap transition-colors duration-150 ${active ? 'bg-[hsl(214,39%,42%)]' : 'hover:bg-[hsl(214,39%,39%)]'
                  }`}
              >
                <span className='text-[38px] w-30 shrink-0 flex justify-center'>{icon}</span>
                <span className='text-[22px] font-bold opacity-0 group-hover:opacity-100 transition-opacity duration-200 delay-100 overflow-hidden'>
                  {label}
                </span>
              </Link>
            )
          })}
        </div>

        <div className='relative bg-[rgb(190,75,83)] hover:bg-[rgb(170,60,68)] transition-colors rounded-b-2xl h-16 shrink-0 cursor-pointer flex items-center'>
          <div className='w-30 shrink-0 flex justify-center'>
            <div className='w-10 h-10 rounded-full bg-white flex items-center justify-center text-xl' />
          </div>
          {user && (
            <div className='absolute left-24 opacity-0 group-hover:opacity-100 transition-opacity duration-200 delay-100'>
              <p className='text-[20px] mt-1.5 font-medium leading-none'>{user.name}</p>
              <p className='text-md opacity-70'>🍪 {user.cookies}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Sidebar