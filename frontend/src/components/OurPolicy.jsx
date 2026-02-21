import React from 'react'
import { assets } from '../assets/assets'

const OurPolicy = () => {
  return (
    <section className='py-14'>
      <div className='grid grid-cols-1 sm:grid-cols-3 gap-6 sm:gap-4 text-center text-xs sm:text-sm md:text-base text-slate-700'>
        
        <div className='rounded-2xl border border-slate-100 bg-white shadow-sm px-6 py-8 flex flex-col items-center'>
          <img src={assets.exchange_icon} className='w-12 m-auto mb-5' alt="" />
          <p className='font-semibold text-slate-900'>Easy exchange policy</p>
          <p className='mt-1 text-slate-500'>We offer a hassle-free exchange experience.</p>
        </div>

        <div className='rounded-2xl border border-slate-100 bg-white shadow-sm px-6 py-8 flex flex-col items-center'>
          <img src={assets.quality_icon} className='w-12 m-auto mb-5' alt="" />
          <p className='font-semibold text-slate-900'>5 day return window</p>
          <p className='mt-1 text-slate-500'>Enjoy easy returns within 5 days of delivery.</p>
          <p className='mt-1 text-[11px] text-slate-400'>*Terms & conditions apply</p>
        </div>

        <div className='rounded-2xl border border-slate-100 bg-white shadow-sm px-6 py-8 flex flex-col items-center'>
          <img src={assets.support_img} className='w-12 m-auto mb-5' alt="" />
          <p className='font-semibold text-slate-900'>Dedicated support</p>
          <p className='mt-1 text-slate-500'>We’re here to help, whenever you need us.</p>
        </div>

      </div>
    </section>
  )
}

export default OurPolicy
