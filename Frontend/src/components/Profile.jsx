import React, { useState } from 'react'
import { useDispatch, useSelector } from "react-redux";
import Navbar from './shared/Navbar';
import { Avatar, AvatarImage } from './ui/avatar';
import { Button } from './ui/button';
import { Contact, Mail, Pen, Trash } from 'lucide-react';
import { Badge } from './ui/badge';
import { Label } from './ui/label';
//import UpdateProfileDialog from './UpdateProfileDialog';
import useGetAppliedJobs from '@/hooks/useGetAppliedJobs';
import { APPLICATION_API_END_POINT } from '@/utils/constant';
import axios from 'axios';
import { toast } from 'sonner';
import { setAllAppliedJobs } from '@/redux/jobSlice';
import { Progress } from './ui/progress';
import UpdateProfileDialog from "@/components/UpdateProfileDialog";

const Profile = () => {
    const [open, setOpen] = useState(false);
    const dispatch = useDispatch();
    const { user } = useSelector(store => store.auth);
    const { allAppliedJobs } = useSelector(store => store.job);
    const { loading, error } = useGetAppliedJobs();

    const isRecruiter = user?.role === 'recruiter';

    const deleteAppliedJob = async (applicationId) => {
        try {
            const res = await axios.delete(`${APPLICATION_API_END_POINT}/delete/${applicationId}`, {
                withCredentials: true
            });
            if (res.data.success) {
                const updatedJobs = allAppliedJobs.filter(job => job._id !== applicationId);
                dispatch(setAllAppliedJobs(updatedJobs));
                toast.success("Application deleted.");
            }
        } catch (err) {
            console.log(err);
            toast.error(err?.response?.data?.message || "Error deleting job");
        }
    };
    

    // ✅ Profile completion logic
    const calculateProfileCompletion = () => {
        if (!user || user.role === 'recruiter') return 100;

        const { bio, resume, skills, profilePhoto } = user?.profile || {};
        let fieldsFilled = 0;
        if (bio) fieldsFilled++;
        if (resume) fieldsFilled++;
        if (skills?.length > 0) fieldsFilled++;
        if (profilePhoto) fieldsFilled++;
        return Math.floor((fieldsFilled / 4) * 100);
    };

    const profileCompletion = calculateProfileCompletion();

    return (
        <div>
            <Navbar />
            <div className='max-w-4xl mx-auto bg-white border border-gray-200 rounded-2xl my-5 p-8'>
                <div className='flex justify-between'>
                    <div className='flex items-center gap-4'>
                        <Avatar className="h-24 w-24">
                            <AvatarImage src={user?.profile?.profilePhoto || "/profile.png"} alt="profile" />
                        </Avatar>
                        <div>
                            <h1 className='font-medium text-xl'>{user?.fullname || "User"}</h1>
                            <p>{user?.profile?.bio || "No bio available"}</p>
                        </div>
                    </div>
                    <Button onClick={() => setOpen(true)} className="text-right" variant="outline">
                        <Pen />
                    </Button>
                </div>

                {/* 🎯 Profile completion meter */}
                {!isRecruiter && (
                    <div className='mt-5'>
                        <h2 className='mb-1 font-medium'>Profile Completion: {profileCompletion}%</h2>
                        <Progress value={profileCompletion} />
                    </div>
                )}

                <div className='my-5'>
                    <div className='flex items-center gap-3 my-2'>
                        <Mail />
                        <span>{user?.email || "No email provided"}</span>
                    </div>
                    <div className='flex items-center gap-3 my-2'>
                        <Contact />
                        <span>{user?.phoneNumber || "No phone number"}</span>
                    </div>
                </div>

                {!isRecruiter && (
                    <>
                        <div className='my-5'>
                            <h1>Skills</h1>
                            <div className='flex items-center gap-1 flex-wrap'>
                                {user?.profile?.skills?.length > 0
                                    ? user.profile.skills.map((item, index) => (
                                        <Badge key={index}>{item}</Badge>
                                    ))
                                    : <span>NA</span>}
                            </div>
                        </div>
                        <div className='grid w-full max-w-sm items-center gap-1.5'>
                            <Label className="text-md font-bold">Resume</Label>
                            {user?.profile?.resume ? (
                                <a target='_blank' href={user.profile.resume} className='text-blue-500 w-full hover:underline cursor-pointer'>
                                    {user.profile.resumeOriginalName || "View Resume"}
                                </a>
                            ) : <span>NA</span>}
                        </div>
                    </>
                )}
            </div>

            {!isRecruiter && (
                <div className='max-w-4xl mx-auto bg-white rounded-2xl'>
                    <h1 className='font-bold text-lg my-5'>Applied Jobs</h1>

                    {loading && <p>Loading applied jobs...</p>}
                    {error && <p className="text-red-500">Error: {error}</p>}

                    {allAppliedJobs?.length > 0 ? (
                        <div className='overflow-x-auto'>
                            <table className='w-full border'>
                                <thead className='bg-gray-100'>
                                    <tr>
                                        <th className='p-2 text-left'>Company</th>
                                        <th className='p-2 text-left'>Job Title</th>
                                        <th className='p-2 text-left'>Location</th>
                                        <th className='p-2 text-left'>Status</th>
                                        <th className='p-2 text-left'>Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {allAppliedJobs.map((application) => (
                                        <tr key={application._id} className='border-t'>
                                            <td className='p-2'>{application.job?.company?.name}</td>
                                            <td className='p-2'>{application.job?.title}</td>
                                            <td className='p-2'>{application.job?.location}</td>
                                            <td className='p-2'>{application.status}</td>
                                            <td className='p-2'>
                                                {application.status === "pending" ? (
                                                    <Button
                                                        onClick={() => deleteAppliedJob(application._id)}
                                                        variant="destructive"
                                                        size="sm"
                                                    >
                                                        <Trash size={16} />
                                                    </Button>
                                                ) : (
                                                    <span className="text-gray-500">—</span>
                                                )}
                                            </td>

                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    ) : (
                        <p>No applied jobs found.</p>
                    )}
                </div>
            )}

            <UpdateProfileDialog open={open} setOpen={setOpen} />
        </div>
    );
};

export default Profile;
