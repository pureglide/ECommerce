import React from 'react'
import { assets } from '../assets/assets'
import { Link } from 'react-router-dom'

const Hero = () => {
  return ( 
    <section className='mt-4 sm:mt-6'>
      <div className='flex flex-col sm:flex-row overflow-hidden rounded-3xl bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 text-white shadow-[0_18px_45px_rgba(15,23,42,0.28)]'>
        {/* Hero Left Side */}
        <div className='w-full sm:w-1/2 flex items-center justify-center py-10 sm:py-14 px-8 sm:px-10'>
              <div className='max-w-md'>
                  <div className='inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-medium tracking-wide'>
                      <span className='inline-block h-[2px] w-6 rounded-full bg-emerald-400'></span>
                      <span className='uppercase text-[11px] text-emerald-200'>Our bestsellers</span>
                  </div>
                  <h1 className='prata-regular text-3xl sm:text-4xl lg:text-5xl leading-tight mt-4'>
                    Pure materials. <br className='hidden sm:block' /> Smooth performance.
                  </h1>
                  <p className='mt-4 text-sm sm:text-base text-slate-200'>
                    Latest arrivals crafted for makers, brands, and businesses that don’t compromise on quality.
                  </p>
                  <div className='mt-6 flex flex-wrap items-center gap-3'>
                    <button
                      onClick={() => document.getElementById('bestsellers')?.scrollIntoView({ behavior: 'smooth' })}
                      type='button'
                      className='inline-flex items-center justify-center rounded-full bg-white px-6 py-2.5 text-sm font-semibold text-slate-900 shadow-md shadow-slate-900/20 hover:bg-slate-100 hover:shadow-lg hover:-translate-y-[1px] transition-all'
                    >
                      Shop now
                    </button>
                    <Link to='/collection'>
                    <button
                      type='button'
                      className='inline-flex items-center justify-center text-sm font-medium text-slate-100/80 hover:text-white gap-2'
                    >
                      View collection
                      <span className='inline-block h-[1px] w-6 bg-slate-200'></span>
                    </button>
                    </Link>
                  </div>
              </div>
        </div>
        {/* Hero Right Side */}
        <div className='w-full sm:w-1/2 bg-slate-900/40'>
          <img className='w-full h-full object-cover' src={assets.hero_img} alt="" />
        </div>
      </div>
    </section>
  )
}

export default Hero
