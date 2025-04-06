import React, { useState } from 'react'
import { Button } from './ui/button'
import { Search } from 'lucide-react'
import { useDispatch } from 'react-redux'
import { setSearchedQuery } from '@/redux/jobSlice'
import { useNavigate } from 'react-router-dom'

const HeroSection = () => {
  const [query, setQuery] = useState('')
  const dispatch = useDispatch()
  const navigate = useNavigate()

  const searchJobHandler = () => {
    dispatch(setSearchedQuery(query))
    navigate('/browse')
  }

  return (
    <div className='text-center px-4 py-8 sm:px-6 lg:px-8'>
      <div className='flex flex-col gap-6 sm:gap-8 md:gap-10'>
        <span className='mx-auto px-4 py-1.5 rounded-full bg-gray-100 text-[#F83002] font-medium text-sm sm:text-base'>
          No. 1 Job Hunt Website
        </span>

        <h1 className='text-3xl sm:text-4xl md:text-5xl font-bold leading-tight'>
          Search, Apply & <br />
          Get Your <span className='text-[#6A38C2]'>Dream Jobs</span>
        </h1>

        <p className='text-sm sm:text-base text-gray-600 max-w-xl mx-auto px-2'>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Aliquid aspernatur temporibus nihil tempora dolor!
        </p>

        <div className='flex flex-col sm:flex-row items-center gap-3 sm:gap-4 w-full max-w-lg mx-auto px-4 py-2 bg-white rounded-full shadow-md border border-gray-200'>
          <input
            type='text'
            placeholder='Find your dream jobs'
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className='flex-grow outline-none text-sm sm:text-base px-3 py-2 rounded-full w-full sm:w-auto'
          />
          <Button onClick={searchJobHandler} className='bg-[#6A38C2] rounded-full px-5 py-2 w-full sm:w-auto'>
            <Search className='h-5 w-5 mr-2' />
            <span className='hidden sm:inline'>Search</span>
          </Button>
        </div>
      </div>
    </div>
  )
}

export default HeroSection
