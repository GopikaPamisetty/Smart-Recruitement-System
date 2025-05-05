import React, { useEffect, useState } from 'react'
import { Badge } from './ui/badge'
import { Button } from './ui/button'
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { APPLICATION_API_END_POINT, JOB_API_END_POINT } from '@/utils/constant';
import { setSingleJob } from '@/redux/jobSlice';
import { useDispatch, useSelector } from 'react-redux';
import { toast } from 'sonner';

const JobDescription = () => {
    const { singleJob } = useSelector(store => store.job);
    const { user } = useSelector(store => store.auth);

    const isIntiallyApplied = user 
        ? singleJob?.applications?.some(application => application.applicant === user._id) 
        : false;

    const [isApplied, setIsApplied] = useState(isIntiallyApplied);
    const [daysLeft, setDaysLeft] = useState(null);

    const params = useParams();
    const jobId = params.id;
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const applyJobHandler = async () => {
        if (!user) {
          navigate("/login");
          return;
        }
      
        // 🚫 Check if resume is missing
        if (!user.profile?.resume) {
          toast.error("Please upload your resume in profile before applying.");
          navigate("/profile");
          return;
        }
      
        try {
          const res = await axios.post(`${APPLICATION_API_END_POINT}/apply/${jobId}`, {}, {
            withCredentials: true,
          });
      
          if (res.data.success) {
            setIsApplied(true);
      
            const updatedSingleJob = {
              ...singleJob,
              applications: [...singleJob.applications, { applicant: user?._id }],
              position: singleJob.position - 1,
            };
      
            dispatch(setSingleJob(updatedSingleJob));
            toast.success(res.data.message);
          }
        } catch (error) {
          console.log(error);
          toast.error(error?.response?.data?.message || "Something went wrong");
        }
      };
      

    useEffect(() => {
        const fetchSingleJob = async () => {
            try {
                const res = await axios.get(`${JOB_API_END_POINT}/get/${jobId}`, { withCredentials: true });
                if (res.data.success) {
                    dispatch(setSingleJob(res.data.job));
                    setIsApplied(res.data.job.applications.some(application => application.applicant === user?._id));

                    const end = new Date(res.data.job.endDate);
                    const today = new Date();
                    const diffDays = Math.ceil((end - today) / (1000 * 60 * 60 * 24));
                    setDaysLeft(diffDays);
                }
            } catch (error) {
                console.log(error);
            }
        }
        fetchSingleJob();
    }, [jobId, dispatch, user?._id]);

    return (
        <div className='max-w-7xl mx-auto my-10 px-4'>
            <div className='flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4'>
                <div>
                    <h1 className='font-bold text-2xl sm:text-xl'>{singleJob?.title}</h1>
                    <div className='flex flex-wrap items-center gap-2 mt-4'>
                        <Badge className={'text-blue-700 font-bold'} variant="ghost">{singleJob?.position} Positions</Badge>
                        <Badge className={'text-[#F83002] font-bold'} variant="ghost">{singleJob?.jobType}</Badge>
                        <Badge className={'text-[#7209b7] font-bold'} variant="ghost">{singleJob?.salary} LPA</Badge>
                        {daysLeft !== null && (
                            <Badge className='text-green-600 font-bold' variant="ghost">
                                {daysLeft > 0 ? `${daysLeft} days left to apply` : "Application closed"}
                            </Badge>
                        )}
                    </div>
                </div>
                <Button
  onClick={() => {
    if (!user) {
      navigate("/login");
    } else if (!isApplied && daysLeft > 0 && singleJob.position > 0) {
      applyJobHandler();
    }
  }}
  disabled={user && (isApplied || daysLeft <= 0 || singleJob.position <= 0)}
  className={`rounded-lg w-full sm:w-auto ${
    !user || (isApplied || daysLeft <= 0 || singleJob.position <= 0)
      ? 'bg-gray-600 cursor-not-allowed'
      : 'bg-[#7209b7] hover:bg-[#5f32ad]'
  }`}
>
  {!user
    ? 'Login to Apply'
    : isApplied
    ? 'Already Applied'
    : daysLeft <= 0
    ? 'Application Closed'
    : singleJob.position <= 0
    ? 'No Positions Available'
    : 'Apply Now'}
</Button>



            </div>

            <h1 className='border-b-2 border-b-gray-300 font-medium py-4 mt-6 text-lg'>Job Description</h1>
            <div className='my-4 space-y-3 text-sm sm:text-base'>
                <h1 className='font-bold'>Role: <span className='pl-2 font-normal text-gray-800'>{singleJob?.title}</span></h1>
                <h1 className='font-bold'>Location: <span className='pl-2 font-normal text-gray-800'>{singleJob?.location}</span></h1>
                <h1 className='font-bold'>Description: <span className='pl-2 font-normal text-gray-800 break-words'>{singleJob?.description}</span></h1>
                <h1 className='font-bold'>Experience: <span className='pl-2 font-normal text-gray-800'>{singleJob?.experienceLevel || "Not specified"}</span></h1>
                <h1 className='font-bold'>Salary: <span className='pl-2 font-normal text-gray-800'>{singleJob?.salary} LPA</span></h1>
                <h1 className='font-bold'>Total Applicants: <span className='pl-2 font-normal text-gray-800'>{singleJob?.applications?.length}</span></h1>
                <h1 className='font-bold'>Posted Date: <span className='pl-2 font-normal text-gray-800'>{singleJob?.createdAt?.split("T")[0]}</span></h1>
                <h1 className='font-bold'>Start Date: <span className='pl-2 font-normal text-gray-800'>{singleJob?.startDate?.split("T")[0]}</span></h1>
                <h1 className='font-bold'>End Date: <span className='pl-2 font-normal text-gray-800'>{singleJob?.endDate?.split("T")[0]}</span></h1>
            </div>
        </div>
    )
}

export default JobDescription
