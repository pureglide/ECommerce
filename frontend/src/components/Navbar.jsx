import React, { useContext, useState } from 'react'
import {assets} from '../assets/assets'
import { Link, NavLink } from 'react-router-dom'
import { ShopContext } from '../context/ShopContext';

const Navbar = () => {

    const [visible,setVisible] = useState(false);

    const {setShowSearch , getCartCount , navigate, token, setToken, setCartItems} = useContext(ShopContext);

    const logout = () => {
        navigate('/login')
        localStorage.removeItem('token')
        setToken('')
        setCartItems({})
    }

  return (
    <>
      <header className='sticky top-0 z-40 backdrop-blur bg-white/80 border-b border-slate-100'>
      <div className='flex items-center justify-between py-4 sm:py-5 md:py-6 px-1 sm:px-3 md:px-4 font-medium'>
      
        <Link to='/' className='flex items-center gap-3'>
          <img src={assets.logo} className='w-10 sm:w-12 rounded-xl shadow-sm' alt="" />
          <span className='hidden sm:inline text-base font-semibold tracking-tight text-slate-900'>
            Pure Glide
          </span>
        </Link>

        <ul className='hidden md:flex gap-6 text-sm text-slate-600'>
        
          <NavLink to='/' className='flex flex-col items-center gap-1'>
              <p className='tracking-wide hover:text-slate-900 transition-colors' onClick={() => window.scrollTo(0, 0)}>Home</p>
              <hr className='w-2/4 border-none h-[2px] bg-slate-900 hidden rounded-full' />
          </NavLink>
          <NavLink to='/collection' className='flex flex-col items-center gap-1'>
              <p className='tracking-wide hover:text-slate-900 transition-colors' onClick={() => window.scrollTo(0, 0)}>Collection</p>
              <hr className='w-2/4 border-none h-[2px] bg-slate-900 hidden rounded-full' />
          </NavLink>
          <NavLink to='/about' className='flex flex-col items-center gap-1'>
              <p className='tracking-wide hover:text-slate-900 transition-colors' onClick={() => window.scrollTo(0, 0)}>About</p>
              <hr className='w-2/4 border-none h-[2px] bg-slate-900 hidden rounded-full' />
          </NavLink>
          <NavLink to='/contact' className='flex flex-col items-center gap-1'>
              <p className='tracking-wide hover:text-slate-900 transition-colors' onClick={() => window.scrollTo(0, 0)}>Contact</p>
              <hr className='w-2/4 border-none h-[2px] bg-slate-900 hidden rounded-full' />
          </NavLink>

        </ul>

        <div className='flex items-center gap-4 sm:gap-6'>
            <button
              type='button'
              onClick={()=> { setShowSearch(true); navigate('/collection'); window.scrollTo({ top: 0, left: 0, behavior: 'smooth' }) }}
              className='hidden sm:inline-flex items-center justify-center w-9 h-9 rounded-full border border-slate-200 bg-white text-slate-600 hover:text-slate-900 hover:border-slate-300 hover:shadow-sm transition-all'
            >
              <img src={assets.search_icon} className='w-4' alt="" />
            </button>
            
            <div className='group relative'>
                <button
                  type='button'
                  onClick={()=> token ? null : (navigate('/login'), window.scrollTo(0, 0)) }
                  className='inline-flex items-center justify-center w-9 h-9 rounded-full border border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm transition-all'
                >
                  <img className='w-4' src={assets.profile_icon} alt="" />
                </button>
                {token && 
                <div className='group-hover:block hidden absolute dropdown-menu right-0 pt-4'>
                    <div className='flex flex-col gap-2 w-40 py-3 px-5 bg-white border border-slate-200 shadow-lg rounded-xl text-slate-600 text-sm'>
                        <p className='cursor-pointer hover:text-slate-900'>My Profile</p>
                        <p onClick={()=>{ navigate('/orders'); window.scrollTo({ top: 0, left: 0, behavior: 'smooth' }) }} className='cursor-pointer hover:text-slate-900'>Orders</p>
                        <p onClick={() => {logout(); window.scrollTo({ top:0, left: 0, behavior: 'smooth'})} } className='cursor-pointer text-red-500 hover:text-red-600'>Logout</p>
                    </div>
                </div>}
            </div> 
            <Link to='/cart' className='relative'>
                <div className='inline-flex items-center justify-center w-9 h-9 rounded-full border border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm transition-all'>
                  <img src={assets.cart_icon} className='w-4 min-w-4' alt="" />
                </div>
                <p className='absolute right-0 bottom-0 translate-x-1/4 translate-y-1/4 w-4 text-center leading-4 bg-slate-900 text-white aspect-square rounded-full text-[10px] font-semibold shadow-sm'>
                  {getCartCount()}
                </p>
            </Link> 
            <button
              type='button'
              onClick={()=>setVisible(true)}
              className='inline-flex md:hidden items-center justify-center w-9 h-9 rounded-full border border-slate-200 bg-white hover:border-slate-300 hover:shadow-sm transition-all'
            >
              <img src={assets.menu_icon} className='w-4 cursor-pointer' alt="" />
            </button>
        </div>

      </div>
      </header>

      {/* Sidebar menu for small screens */}
      <div className={`fixed top-0 right-0 bottom-0 z-[100] bg-white transition-transform duration-300 w-full ${visible ? 'translate-x-0' : 'translate-x-full'}`}>
                <div className='flex flex-col text-slate-800 w-full h-screen bg-white'>
                    <div onClick={()=>setVisible(false)} className='flex items-center gap-4 p-4 cursor-pointer border-b border-slate-200'>
                        <img className='h-4 rotate-180' src={assets.dropdown_icon} alt="" />
                        <p className='font-semibold'>Back</p>
                    </div>
                    <NavLink onClick={()=>setVisible(false)} className='py-4 pl-6 border-b border-slate-200 text-lg font-medium hover:text-black transition-colors' to='/'>Home</NavLink>
                    <NavLink onClick={()=>setVisible(false)} className='py-4 pl-6 border-b border-slate-200 text-lg font-medium hover:text-black transition-colors' to='/collection'>Collection</NavLink>
                    <NavLink onClick={()=>setVisible(false)} className='py-4 pl-6 border-b border-slate-200 text-lg font-medium hover:text-black transition-colors' to='/about'>About</NavLink>
                    <NavLink onClick={()=>setVisible(false)} className='py-4 pl-6 border-b border-slate-200 text-lg font-medium hover:text-black transition-colors' to='/contact'>Contact</NavLink>
                </div>
        </div>

    </>
  )
}

export default Navbar
