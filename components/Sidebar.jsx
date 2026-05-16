import React from 'react'
import { CgExtension } from 'react-icons/cg'
import {
  FaCompass,
  FaQuestionCircle,
  FaShoppingCart,
  FaStar,
  FaUtensils,
} from 'react-icons/fa'

const Sidebar = () => {
  const itemStyle =
    'w-full flex justify-center py-3 cursor-pointer hover:bg-[hsl(214,39%,39%)] transition-all duration-200'
  
  return (<>
    <div className='fixed left-10 top-1/2 -translate-y-1/2 bg-[#6199c2] text-[rgb(249,229,197)] flex justify-center w-24 h-150 rounded-2xl overflow-hidden'>
      <div className='flex flex-col items-center justify-center w-full gap-7 text-[38px]'>
        <div className={itemStyle}>
          <FaUtensils />
        </div>

        <div className={itemStyle}>
          <FaCompass />
        </div>

        <div className={itemStyle}>
          <CgExtension />
        </div>

        <div className={itemStyle}>
          <FaStar />
        </div>

        <div className={itemStyle}>
          <FaShoppingCart />
        </div>

        <div className={itemStyle}>
          <FaQuestionCircle />
        </div>
      </div>

    </div>
    <div>
      
    </div>
  </>
  )
}

export default Sidebar