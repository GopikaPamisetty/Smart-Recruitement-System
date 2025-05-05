import React, { useState } from 'react';
import { Button } from './ui/button';
import { Search } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { setSearchedQuery } from '@/redux/jobSlice';
import { useNavigate } from 'react-router-dom';

const HeroSection = () => {
  const [query, setQuery] = useState('');
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleSearch = () => {
    dispatch(setSearchedQuery(query));
    navigate('/browse');
  };

  return (
    <section className='text-center px-4 py-12 sm:px-6 lg:px-8 bg-gradient-to-r from-indigo-50 to-purple-100'>
      <div className='flex flex-col gap-6 sm:gap-10 md:gap-12'>
        <span className='mx-auto px-5 py-2 rounded-full bg-purple-200 text-purple-800 font-semibold text-sm sm:text-base shadow-sm'>
          Your Career Journey Starts Here
        </span>

        <h1 className='text-4xl sm:text-5xl md:text-6xl font-extrabold leading-snug text-gray-900'>
          Discover Opportunities,<br />
          Build Your <span className='text-[#6A38C2]'>Future</span>
        </h1>

        <p className='text-base sm:text-lg text-gray-700 max-w-2xl mx-auto px-2'>
          Explore curated roles across tech, design, marketing, and more. Tailored just for you.
        </p>

        <div className='flex flex-col sm:flex-row items-center gap-4 w-full max-w-2xl mx-auto px-4 py-3 bg-white rounded-full shadow-lg border border-gray-200'>
          <input
            type='text'
            placeholder='Search by role, skill, or company'
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className='flex-grow outline-none text-base px-4 py-2 rounded-full w-full sm:w-auto text-gray-700 placeholder:text-gray-400'
          />
          <Button
            onClick={handleSearch}
            className='bg-[#6A38C2] text-white font-medium rounded-full px-6 py-2 w-full sm:w-auto hover:bg-[#592aa1] transition-colors duration-200'
          >
            <Search className='h-5 w-5 mr-2' />
            <span className='hidden sm:inline'>Find Jobs</span>
          </Button>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
