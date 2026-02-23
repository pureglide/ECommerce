import React from 'react'
import Title from '../components/Title'
import { assets } from '../assets/assets'

const About = () => {
  return (
    <section className='pt-8'>

      <div className='text-2xl text-center pt-2 border-t border-slate-100'>
          <Title text1={'ABOUT'} text2={'US'} />
      </div>

      <div className='my-10 flex flex-col md:flex-row gap-12 md:gap-16'>
          <img className='w-full md:max-w-[450px] rounded-3xl shadow-md shadow-slate-200' src={assets.about_img} alt="" />
          <div className='flex flex-col justify-center gap-6 md:w-2/4 text-slate-600 text-sm md:text-base'>
              <p>At Pure Glide, we are dedicated to delivering powerful, reliable, and affordable cleaning solutions designed for modern homes and busy lifestyles. We specialize in manufacturing and selling high-quality cleaning products that help families and businesses maintain hygienic, fresh, and safe environments every day. Our product range covers a wide spectrum of cleaning needs, including Home Cleaning, Kitchen Cleaning, Laundry & Automotive Cleaning. From advanced Surface Cleaners and effective Wash Liquids to powerful Disinfectants and premium Vehicle Care solutions, every product is crafted with performance, safety, and convenience in mind. We combine innovation with carefully selected ingredients to ensure our products are tough on dirt yet safe for everyday use. Whether you're maintaining spotless floors, sparkling kitchens, fresh laundry, or a showroom-shine vehicle, PureGlide is your trusted cleaning partner. With a strong focus on quality control, customer satisfaction, and easy online accessibility, we make it simple for customers to shop reliable cleaning solutions from the comfort of their homes.</p>
              <p>At PureGlide, cleanliness isn’t just a task — it’s a standard.</p>
              <b className='text-slate-900 text-sm md:text-base tracking-wide'>Our mission</b>
              <p>Our mission at Pure Glide is to empower customers with choice, convenience, and confidence. We're dedicated to providing a seamless shopping experience that exceeds expectations, from browsing and ordering to delivery and beyond.</p>
          </div>
      </div>

      <div className='text-xl py-4'>
          <Title text1={'WHY'} text2={'CHOOSE US'} />
      </div>

      <div className='flex flex-col md:flex-row text-sm mb-20 gap-4'>
          <div className='border border-slate-100 rounded-2xl bg-white shadow-sm px-10 md:px-12 py-8 sm:py-10 flex flex-col gap-3'>
            <b>Quality Assurance:</b>
            <p className='text-slate-600'>We meticulously select and vet each product to ensure it meets our stringent quality standards.</p>
          </div>
          <div className='border border-slate-100 rounded-2xl bg-white shadow-sm px-10 md:px-12 py-8 sm:py-10 flex flex-col gap-3'>
            <b>Convenience:</b>
            <p className='text-slate-600'>With our user-friendly interface and hassle-free ordering process, shopping has never been easier.</p>
          </div>
          <div className='border border-slate-100 rounded-2xl bg-white shadow-sm px-10 md:px-12 py-8 sm:py-10 flex flex-col gap-3'>
            <b>Exceptional Customer Service:</b>
            <p className='text-slate-600'>Our team of dedicated professionals is here to assist you the way, ensuring your satisfaction is our top priority.</p>
          </div>
      </div>

    </section>
  )
}

export default About
