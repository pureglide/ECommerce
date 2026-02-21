import React from 'react'
import { assets } from '../assets/assets'
import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <footer className='pt-10'>
      <div className='flex flex-col sm:grid grid-cols-[3fr_1fr_1fr] gap-14 my-10 mt-24 text-sm'>

        <div>
            <img src={assets.logo} className='mb-4 w-24 sm:w-28 rounded-2xl shadow-sm' alt="" />
            
            <p className='w-full md:w-2/3 text-slate-900 text-sm font-semibold tracking-wide'>JOIN OUR MOVEMENT</p>
            <p className='w-full md:w-2/3 text-slate-600 mt-1'>
            Whether you're a beginner or looking to expand your business, Pure Glide gives you the PURE, RELIABLE MATERIAL to succeed.
            </p>
            <p className='w-full md:w-2/3 text-slate-900 mt-3 text-sm font-semibold'>BUY · MAKE · EARN</p>
            <p className='w-full md:w-2/3 text-slate-600 mt-1'>Take the first step today and join the Pure movement!</p>
        </div>

        <div>
            <p className='text-base font-semibold mb-4 text-slate-900 tracking-wide'>COMPANY</p>
            <ul className='flex flex-col gap-2 text-slate-600'>
                <li><Link to='/' onClick={() => window.scrollTo(0, 0)}>Home</Link></li>
                <li><Link to='/about' onClick={() => window.scrollTo(0, 0)}>About us</Link></li>
                <li><Link to='/delivery' onClick={() => window.scrollTo(0, 0)}>Delivery</Link></li>
                <li><Link to='/privacy-policy' onClick={() => window.scrollTo(0, 0)}>Privacy policy</Link></li>
            </ul>
        </div>

        <div>
            <p className='text-base font-semibold mb-4 text-slate-900 tracking-wide'>GET IN TOUCH</p>
            <ul className='flex flex-col gap-2 text-slate-600'>
                <li><a href="https://wa.me/918708444561" target='_blank' rel='noopener noreferrer' className='hover:text-slate-900'>+91-8708444561</a></li>
                <li><a href="mailto:pureglide.mjhome@gmail.com" className='hover:text-slate-900'>pureglide.mjhome@gmail.com</a></li>
            </ul>
        </div>

      </div>

        <div>
            <hr className='border-slate-200' />
            <p className='py-5 text-xs sm:text-sm text-center text-slate-500'>
              Pure Glide · Copyright 2026 · All rights reserved.
            </p>
        </div>

    </footer>
  )
}

export default Footer
