import React, { useState } from 'react'
import Title from './Title'
import { assets } from '../assets/assets'

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const questions = [
    {
      question: "What is your return policy?",
      answer: "We offer a hassle-free exchange policy. You can return or exchange items within 5 days of delivery, provided they are in original condition."
    },
    {
      question: "How long does shipping take?",
      answer: "Shipping times vary by location. Typically, orders are processed within 1-2 days and delivered within 3-7 business days."
    },
    {
      question: "Do you offer international shipping?",
      answer: "Currently, we ship within the India. We are working on expanding our shipping to other countries soon."
    },
    {
      question: "How can I track my order?",
      answer: "You can easily track your order status in the 'My Orders' section of your account."
    },
    {
      question: "What payment methods do you accept?",
      answer: "We accept payments through UPI, Netbanking, debit/credit cards, and Cash on Delivery (COD)."
    }
  ];

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section className='my-12'>
      <div className='rounded-3xl bg-white shadow-sm border border-slate-100 px-4 sm:px-6 md:px-8 py-8 sm:py-10'>
        <div className='text-center text-3xl'>
          <Title text1={'FREQUENTLY'} text2={'ASKED QUESTIONS'} />
          <p className='w-full sm:w-3/4 md:w-2/3 mx-auto mt-2 text-xs sm:text-sm md:text-base text-slate-600'>
            Find answers to common questions about our products, shipping, and policies.
          </p>
        </div>

        <div className='mt-8 flex flex-col gap-4 w-full max-w-3xl mx-auto'>
          {questions.map((item, index) => (
            <div
              key={index}
              className='border border-slate-100 rounded-2xl px-4 sm:px-5 py-3 sm:py-4 bg-slate-50/40'
            >
              <button
                className='flex justify-between items-center w-full text-left text-slate-800 font-medium focus:outline-none'
                onClick={() => toggleFAQ(index)}
              >
                <span className='text-sm sm:text-base'>{item.question}</span>
                <img 
                  src={assets.dropdown_icon} 
                  className={`w-3 transition-transform duration-300 ${activeIndex === index ? 'rotate-90' : ''}`} 
                  alt="" 
                />
              </button>
              <div
                className={`overflow-hidden transition-all duration-300 ease-in-out ${
                  activeIndex === index ? 'max-h-40 opacity-100 mt-2' : 'max-h-0 opacity-0'
                }`}
              >
                <div className='text-slate-600 text-sm'>
                  {item.answer}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}

export default FAQ
