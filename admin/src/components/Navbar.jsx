import React from 'react'
import {assets} from '../assets/assets'

const Navbar = ({setToken}) => {
  return (
    <div className='flex items-center py-2 px-[4%] justify-between'>
        {/* <img className='w-[max(10%,80px)]' src={assets.logo} alt="" /> */}
        <img src={assets.logo} className='w-10 sm:w-12 rounded-xl shadow-sm' alt="" />
        <span className='hidden sm:inline text-base font-semibold tracking-tight text-slate-900'>
          Pure Glide
        </span>
        <button onClick={()=>setToken('')} className='bg-gray-600 text-white px-5 py-2 sm:px-7 sm:py-2 rounded-full text-xs sm:text-sm'>Logout</button>
    </div>
  )
}

export default Navbar