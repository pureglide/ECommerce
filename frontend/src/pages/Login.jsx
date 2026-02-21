import React, { useContext, useEffect, useState } from 'react'
import { ShopContext } from '../context/ShopContext';
import axios from 'axios';
import { toast } from 'react-toastify';

const Login = () => {

  const [currentState, setCurrentState] = useState('Login');
  const { token, setToken, navigate, backendUrl } = useContext(ShopContext)

  const [name, setName] = useState('')
  const [password, setPassword] = useState('')
  const [email, setEmail] = useState('')
  
  // OTP State (for Sign Up)
  const [otp, setOtp] = useState('')
  const [isOtpSent, setIsOtpSent] = useState(false)

  // Forgot Password State
  const [isForgotPassword, setIsForgotPassword] = useState(false)
  const [forgotEmail, setForgotEmail] = useState('')
  const [forgotOtp, setForgotOtp] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [forgotOtpSent, setForgotOtpSent] = useState(false)

  const onSubmitHandler = async (event) => {
      event.preventDefault();
      try {
        // Forgot Password Flow
        if (isForgotPassword) {
          if (!forgotOtpSent) {
            const response = await axios.post(backendUrl + '/api/user/forgot-password/request', { email: forgotEmail })
            if (response.data.success && response.data.otpSent) {
              setForgotOtpSent(true)
              toast.success(response.data.message)
            } else {
              toast.info(response.data.message || 'Check your email for the OTP')
            }
          } else {
            const response = await axios.post(backendUrl + '/api/user/forgot-password/reset', {
              email: forgotEmail,
              otp: forgotOtp,
              newPassword
            })
            if (response.data.success) {
              toast.success(response.data.message)
              setIsForgotPassword(false)
              setForgotEmail('')
              setForgotOtp('')
              setNewPassword('')
              setForgotOtpSent(false)
            } else {
              toast.error(response.data.message)
            }
          }
          return
        }

        if (currentState === 'Sign Up') {
          
          if (!isOtpSent) {
            // Step 1: Request OTP
            const response = await axios.post(backendUrl + '/api/user/register', { name, email, password })
            if (response.data.success) {
                setToken(response.data.token)
                localStorage.setItem('token', response.data.token)
            } else {
                // Check if backend indicates OTP was sent
                if (response.data.otpSent) {
                    setIsOtpSent(true);
                    toast.success(response.data.message);
                } else {
                    toast.error(response.data.message)
                }
            }
          } else {
            // Step 2: Verify OTP
            const response = await axios.post(backendUrl + '/api/user/register', { name, email, password, otp })
            if (response.data.success) {
                setToken(response.data.token)
                localStorage.setItem('token', response.data.token)
                setIsOtpSent(false);
            } else {
                toast.error(response.data.message)
            }
          }

        } else {

          const response = await axios.post(backendUrl + '/api/user/login', {email,password})
          if (response.data.success) {
            setToken(response.data.token)
            localStorage.setItem('token',response.data.token)
          } else {
            toast.error(response.data.message)
          }

        }


      } catch (error) {
        console.log(error)
        toast.error(error.message)
      }
  }

  useEffect(()=>{
    if (token) {
      navigate('/')
    }
  },[token])

  return (
    <div className='flex items-center justify-center py-16'>
      <form
        onSubmit={onSubmitHandler}
        className='w-[90%] sm:max-w-md rounded-3xl bg-white shadow-lg shadow-slate-200 border border-slate-100 px-6 sm:px-8 py-8 flex flex-col gap-4 text-slate-800'
      >
          <div className='inline-flex items-center gap-2 mb-2'>
              <p className='prata-regular text-2xl sm:text-3xl'>{isForgotPassword ? 'Reset Password' : currentState}</p>
              <hr className='border-none h-[1.5px] w-8 bg-slate-900' />
          </div>
          
          {/* Forgot Password Form */}
          {isForgotPassword ? (
            <>
              {!forgotOtpSent ? (
                <>
                  <p className='text-sm text-slate-500'>Enter your email to receive a verification code</p>
                  <input
                    onChange={(e) => setForgotEmail(e.target.value)}
                    value={forgotEmail}
                    type="email"
                    className='w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-200 text-sm'
                    placeholder='Email'
                    required
                  />
                </>
              ) : (
                <>
                  <p className='text-xs sm:text-sm text-slate-500 mb-2'>Enter the code sent to {forgotEmail}</p>
                  <input
                    onChange={(e) => setForgotOtp(e.target.value)}
                    value={forgotOtp}
                    type="text"
                    maxLength={6}
                    className='w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-200 text-sm'
                    placeholder='6-digit OTP'
                    required
                  />
                  <input
                    onChange={(e) => setNewPassword(e.target.value)}
                    value={newPassword}
                    type="password"
                    className='w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-200 text-sm'
                    placeholder='New password (min 8 characters)'
                    minLength={8}
                    required
                  />
                </>
              )}
              <div className='w-full flex justify-between items-center text-xs sm:text-sm mt-[-4px] text-slate-500'>
                <p onClick={() => { setIsForgotPassword(false); setForgotOtpSent(false); setForgotEmail(''); setForgotOtp(''); setNewPassword(''); }} className='cursor-pointer hover:text-slate-800'>Back to Login</p>
              </div>
              <button
                className='mt-4 inline-flex items-center justify-center rounded-full bg-slate-900 text-white text-sm font-medium px-8 py-2.5 hover:bg-slate-800 transition-colors'
              >
                {forgotOtpSent ? 'Reset Password' : 'Send OTP'}
              </button>
            </>
          ) : (
          <>
          {currentState === 'Login' ? null : (
              isOtpSent ? 
              <div className='w-full'>
                  <p className='text-xs sm:text-sm text-slate-500 mb-2'>Enter the code sent to {email}</p>
                  <input
                    onChange={(e) => setOtp(e.target.value)}
                    value={otp}
                    type="text"
                    className='w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-200 text-sm'
                    placeholder='Enter 6-digit OTP'
                    required
                  />
              </div>
              : <input
                  onChange={(e) => setName(e.target.value)}
                  value={name}
                  type="text"
                  className='w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-200 text-sm'
                  placeholder='Name'
                  required
                />
          )}
          
          {/* Hide Email/Password fields during OTP verification to keep UI clean */}
          {!isOtpSent && (
            <>
              <input
                onChange={(e) => setEmail(e.target.value)}
                value={email}
                type="email"
                className='w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-200 text-sm'
                placeholder='Email'
                required
              />
              <input
                onChange={(e) => setPassword(e.target.value)}
                value={password}
                type="password"
                className='w-full px-3 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-200 text-sm'
                placeholder='Password'
                required
              />
            </>
          )}
          
          <div className='w-full flex justify-between items-center text-xs sm:text-sm mt-[-4px] text-slate-500'>
              <p onClick={() => setIsForgotPassword(true)} className='cursor-pointer hover:text-slate-800'>Forgot your password?</p>
              {
                currentState === 'Login' 
                ? <p onClick={()=>setCurrentState('Sign Up')} className='cursor-pointer text-slate-900 font-medium'>Create account</p>
                : <p onClick={() => { setCurrentState('Login'); setIsOtpSent(false); }} className='cursor-pointer text-slate-900 font-medium'>Login here</p>
              }
          </div>
          <button
            className='mt-4 inline-flex items-center justify-center rounded-full bg-slate-900 text-white text-sm font-medium px-8 py-2.5 hover:bg-slate-800 transition-colors'
          >
            {currentState === 'Login' ? 'Sign in' : (isOtpSent ? 'Verify & register' : 'Sign up')}
          </button>
          </>
          )}
      </form>
    </div>
  )
}

export default Login
