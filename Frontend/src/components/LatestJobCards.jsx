import React from 'react'
import { Badge } from './ui/badge'
import { useNavigate } from 'react-router-dom'

const LatestJobCards = ({ job }) => {
    const navigate = useNavigate()

    const daysLeft = job?.endDate
        ? Math.ceil((new Date(job.endDate) - new Date()) / (1000 * 60 * 60 * 24))
        : null;

    return (
        <div
            onClick={() => navigate(`/description/${job._id}`)}
            className='p-5 rounded-xl shadow-md bg-white border border-gray-100 cursor-pointer hover:shadow-lg transition-all duration-200 ease-in-out'
        >
            <div className='mb-2'>
                <h2 className='font-semibold text-lg text-gray-800 truncate'>{job?.company?.name}</h2>
                <p className='text-sm text-gray-500'>India</p>
            </div>

            <div className='mb-3'>
                <h3 className='font-bold text-lg text-[#6A38C2] truncate'>{job?.title}</h3>
                <p className='text-sm text-gray-600 line-clamp-3'>{job?.description}</p>
            </div>

            <div className='flex flex-wrap items-center gap-2 mt-2'>
                <Badge className='text-blue-700 font-semibold' variant="ghost">
                    {job?.position} Positions
                </Badge>
                <Badge className='text-[#F83002] font-semibold' variant="ghost">
                    {job?.jobType}
                </Badge>
                <Badge className='text-[#7209b7] font-semibold' variant="ghost">
                    {job?.salary} LPA
                </Badge>
                {daysLeft !== null && (
                    <Badge className='text-green-600 font-semibold' variant="ghost">
                        {daysLeft > 0 ? `${daysLeft} days left` : "Application closed"}
                    </Badge>
                )}
            </div>
        </div>
    )
}

export default LatestJobCards
