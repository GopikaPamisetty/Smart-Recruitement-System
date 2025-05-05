import React, { useEffect, useState } from 'react';
import { Button } from './ui/button';
import { Bookmark } from 'lucide-react';
import { Avatar, AvatarImage } from './ui/avatar';
import { Badge } from './ui/badge';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useSelector, useDispatch } from 'react-redux';
import { toast } from 'sonner';
import { USER_API_END_POINT } from '@/utils/constant';
import { setUser } from '@/redux/authSlice';
import * as Tooltip from '@radix-ui/react-tooltip';
const Job = ({ job }) => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { user } = useSelector((store) => store.auth);
    const [saved, setSaved] = useState(false);

    // ✅ Sync button state with Redux
    useEffect(() => {
        if (user?.savedJobs?.includes(job._id)) {
            setSaved(true);
        } else {
            setSaved(false);
        }
    }, [user?.savedJobs, job._id]);

    const toggleSave = async () => {
        if (!user) {
            toast.warning("Please log in to save jobs.");
            navigate("/login"); // 🔁 Redirect to login if not authenticated
            return;
        }
    
        try {
            const res = await axios.post(`${USER_API_END_POINT}/save-job/${job._id}`, {}, {
                withCredentials: true
            });
    
            let updatedUser = { ...user };
    
            if (saved) {
                updatedUser.savedJobs = updatedUser.savedJobs.filter(id => id !== job._id);
            } else {
                updatedUser.savedJobs = [...(updatedUser.savedJobs || []), job._id];
            }
    
            dispatch(setUser(updatedUser));
            setSaved(!saved);
            toast.success(res.data.message);
        } catch (error) {
            console.error("Toggle save error:", error);
            toast.error("Failed to save job");
        }
    };
    

    const daysAgoFunction = (mongodbTime) => {
        const createdAt = new Date(mongodbTime);
        const currentTime = new Date();
        const timeDifference = currentTime - createdAt;
        return Math.floor(timeDifference / (1000 * 60 * 60 * 24));
    };

    return (
        <div className='p-5 rounded-md shadow-xl bg-white border border-gray-100 flex flex-col justify-between h-full'>
            <div className='flex items-center justify-between'>
                <p className='text-sm text-gray-500'>
                    {daysAgoFunction(job?.createdAt) === 0 ? "Today" : `${daysAgoFunction(job?.createdAt)} days ago`}
                </p>
                

<Tooltip.Provider>
  <Tooltip.Root>
    <Tooltip.Trigger asChild>
      <Button
        variant="outline"
        className="rounded-full"
        size="icon"
        onClick={toggleSave}
      >
        {saved ? <Bookmark fill="#22c55e" color="#22c55e" /> : <Bookmark />}
      </Button>
    </Tooltip.Trigger>
    <Tooltip.Portal>
      <Tooltip.Content
        className="bg-black text-white text-xs px-2 py-1 rounded shadow"
        side="top"
        align="center"
      >
        {saved ? "Remove from Saved Jobs" : "Save for Later"}
        <Tooltip.Arrow className="fill-black" />
      </Tooltip.Content>
    </Tooltip.Portal>
  </Tooltip.Root>
</Tooltip.Provider>


            </div>

            <div className='flex items-center gap-2 my-2'>
                <Button className="p-6" variant="outline" size="icon">
                    <Avatar>
                        <AvatarImage src={job?.company?.logo} />
                    </Avatar>
                </Button>
                <div>
                    <h1 className='font-medium text-lg'>{job?.company?.name}</h1>
                    <p className='text-sm text-gray-500'>India</p>
                </div>
            </div>

            <div>
                <h1 className='font-bold text-lg my-2'>{job?.title}</h1>
                <p className='text-sm text-gray-600 line-clamp-3 sm:line-clamp-2'>{job?.description}</p>
            </div>

            <div className='flex flex-wrap items-center gap-2 mt-4'>
                <Badge className={'text-blue-700 font-bold'} variant="ghost">{job?.position} Positions</Badge>
                <Badge className={'text-[#F83002] font-bold'} variant="ghost">{job?.jobType}</Badge>
                <Badge className={'text-[#7209b7] font-bold'} variant="ghost">{job?.salary} LPA</Badge>
            </div>

            <div className='flex flex-col sm:flex-row items-center gap-3 mt-4'>
                <Button onClick={() => navigate(`/description/${job?._id}`)} variant="outline" className='w-full sm:w-auto'>Details</Button>
                <Button
                    onClick={toggleSave}
                    className={`w-full sm:w-auto ${saved ? 'bg-green-600 hover:bg-green-700' : 'bg-[#7209b7] hover:bg-[#5f32ad]'}`}
                >
                    {saved ? "Saved" : "Save For Later"}
                </Button>
            </div>
        </div>
    );
};

export default Job;
