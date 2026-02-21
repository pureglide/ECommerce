import React from 'react'
import Title from '../components/Title'
import { assets } from '../assets/assets'
import NewsletterBox from '../components/NewsletterBox'

const Contact = () => {
  return (
    <section className='pt-8'>
      
      <div className='text-center text-2xl pt-2 border-t border-slate-100'>
          <Title text1={'CONTACT'} text2={'US'} />
      </div>

      <div className='my-10 flex flex-col justify-center md:flex-row gap-10 mb-20'>
        <img className='w-full md:max-w-[480px] rounded-3xl shadow-md shadow-slate-200' src={assets.contact_img} alt="" />
        <div className='flex flex-col justify-center items-start gap-4 text-slate-600 text-sm md:text-base'>
          <p className='font-semibold text-xl text-slate-900'>Our store</p>
          <p className='text-slate-500'>HQ: Palwal</p>
          <p className='text-slate-500'>
            Tel: <a href="https://wa.me/918708444561" target='_blank' rel='noopener noreferrer' className='hover:text-slate-900'>+91-8708444561</a> 
              <br /> 
            Email: <a href="mailto:pureglide.mjhome@gmail.com" className='hover:text-slate-900'>pureglide.mjhome@gmail.com</a>
          </p>
        </div>
      </div>

      {/* <NewsletterBox/> */}
    </section>
  )
}

export default Contact
