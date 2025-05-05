import React, { useEffect, useState } from 'react';
import Navbar from './shared/Navbar';
import FilterCard from './FilterCard';
import LatestJobCards from './LatestJobCards';
import { useSelector } from 'react-redux';
import { motion } from 'framer-motion';

const Jobs = () => {
  const { allJobs, searchedQuery } = useSelector((store) => store.job);
  const [filterJobs, setFilterJobs] = useState(allJobs);

  useEffect(() => {
    if (!searchedQuery) {
      setFilterJobs(allJobs);
      return;
    }

    let filtered = [];

    if (typeof searchedQuery === 'object') {
      if (searchedQuery.type === 'salary') {
        const { min, max } = searchedQuery;

        // ✅ Updated to ensure salaries are compared as numbers
        filtered = allJobs.filter(job => Number(job.salary) >= min && Number(job.salary) <= max);

      } else if (searchedQuery.type === 'text') {
        const value = searchedQuery.value.toLowerCase();
        filtered = allJobs.filter(job =>
          job.title?.toLowerCase().includes(value) ||
          job.description?.toLowerCase().includes(value) ||
          job.location?.toLowerCase().includes(value) ||
          job.jobType?.toLowerCase().includes(value) ||
          job.company?.name?.toLowerCase().includes(value)
        );
      }
    } else if (typeof searchedQuery === 'string') {
      const value = searchedQuery.toLowerCase();
      filtered = allJobs.filter(job =>
        job.title?.toLowerCase().includes(value) ||
        job.description?.toLowerCase().includes(value) ||
        job.location?.toLowerCase().includes(value) ||
        job.jobType?.toLowerCase().includes(value) ||
        job.company?.name?.toLowerCase().includes(value)
      );
    }

    setFilterJobs(filtered);
  }, [allJobs, searchedQuery]);

  return (
    <div>
      <Navbar />
      <div className='max-w-7xl mx-auto mt-5 px-4'>
        <div className='flex flex-col md:flex-row gap-5'>
          <div className='md:w-1/4 w-full'>
            <FilterCard />
          </div>

          <div className='flex-1'>
            {
              filterJobs.length <= 0 ? (
                <span className="text-gray-600 text-center block mt-10">No jobs found</span>
              ) : (
                <div className='h-[80vh] overflow-y-auto pb-5'>
                  <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4'>
                    {
                      filterJobs.map((job) => (
                        <motion.div
                          initial={{ opacity: 0, x: 100 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -100 }}
                          transition={{ duration: 0.3 }}
                          key={job?._id}
                        >
                          <LatestJobCards job={job} />
                        </motion.div>
                      ))
                    }
                  </div>
                </div>
              )
            }
          </div>
        </div>
      </div>
    </div>
  );
};

export default Jobs;
