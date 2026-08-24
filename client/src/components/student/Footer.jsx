import React, { useState, useContext } from 'react'
import { assets } from '../../assets/assets'
import { AppContext } from '../../context/AppContext'
import { Link, useNavigate } from 'react-router-dom'
import axios from 'axios'
import { toast } from 'react-toastify'

const Footer = () => {
  const [email, setEmail] = useState('')
  const { backendUrl } = useContext(AppContext)
  const navigate = useNavigate()

  const handleSubscription = async (e) => {
    e.preventDefault()
    try {
      const { data } = await axios.post(backendUrl + '/api/user/subscribe', { email })
      if (data.success) {
        toast.success(data.message)
        setEmail('')
      } else {
        toast.error(data.message)
      }
    } catch (error) {
      toast.error(error.message)
    }
  }

  // Smooth scroll helper
  const scrollToSection = (id) => {
    navigate('/')
    setTimeout(() => {
      const element = document.getElementById(id)
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' })
      }
    }, 100)
  }

  return (
    <footer className='bg-gray-900 md:px-36 text-left w-full mt-10'>
      <div className='flex flex-col md:flex-row items-start px-8 md:px-0 justify-center gap-10 md:gap-32 py-10 border-b border-white/30'>
        
        {/* Brand & Description */}
        <div className='flex flex-col md:items-start items-center w-full'>
          <img src={assets.logo_dark} alt="logo" />
          <p className='mt-6 text-center md:text-left text-sm text-white/80'>
            Discover a wide range of courses to boost your skills. Everything students and educators need to succeed.
          </p>
        </div>

        {/* Company Links */}
        <div className='flex flex-col md:items-start items-center w-full'>
          <h2 className='font-semibold text-white mb-5'>Company</h2>
          <ul className='flex md:flex-col w-full justify-between text-sm text-white/80 md:space-y-2 cursor-pointer'>
            <li>
              <Link to="/" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
                Home
              </Link>
            </li>
            <li>
              <button onClick={() => scrollToSection('courses')} className='hover:text-white transition'>
                Courses
              </button>
            </li>
            <li>
              <button onClick={() => scrollToSection('about-us')} className='hover:text-white transition'>
                About us
              </button>
            </li>
            <li>
              <button onClick={() => scrollToSection('contact-us')} className='hover:text-white transition'>
                Contact us
              </button>
            </li>
          </ul>
        </div>

        {/* Newsletter Subscription */}
        <div className='hidden md:flex flex-col items-start w-full'>
          <h2 className='font-semibold text-white mb-5'>Subscribe to our newsletter</h2>
          <p className='text-sm text-white/80'>
            The latest news, articles, and resources, sent to your inbox weekly.
          </p>
          <form onSubmit={handleSubscription} className='flex items-center gap-2 pt-4'>
            <input 
              type="email" 
              placeholder='Enter your email' 
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className='border border-gray-500/30 bg-gray-800 text-white placeholder-gray-500 outline-none w-64 h-9 rounded px-2 text-sm'
            />
            <button type="submit" className='bg-blue-600 w-24 h-9 text-white rounded font-medium text-sm'>
              Subscribe
            </button>
          </form>
        </div>

      </div>

      {/* Copyright Bar */}
      <p className='py-4 text-center text-xs md:text-sm text-white/60'>
        Copyright 2026 © FASTSOL. All Right Reserved.
      </p>
    </footer>
  )
}

export default Footer