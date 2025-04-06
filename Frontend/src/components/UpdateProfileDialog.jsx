import React, { useState } from 'react';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Loader2 } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { USER_API_END_POINT } from '@/utils/constant';
import { setUser } from '@/redux/authSlice';
import { toast } from 'sonner';
import { XMarkIcon } from "@heroicons/react/24/outline"; // Ensure this is properly imported

const UpdateProfileDialog = ({ open, setOpen }) => {
    const [loading, setLoading] = useState(false);
    const { user } = useSelector(store => store.auth);
    const dispatch = useDispatch();

    const [input, setInput] = useState({
        fullname: user?.fullname || "",
        email: user?.email || "",
        phoneNumber: user?.phoneNumber || "",
        bio: user?.profile?.bio || "",
        skills: user?.profile?.skills?.join(', ') || "",
        resume: null,
        profilePhoto: null
    });

    const changeEventHandler = (e) => {
        setInput({ ...input, [e.target.name]: e.target.value });
    };

    const fileChangeHandler = (e) => {
        const file = e.target.files?.[0];
        setInput({ ...input, [e.target.name]: file });
    };

    const submitHandler = async (e) => {
        e.preventDefault();
        const formData = new FormData();
        formData.append("fullname", input.fullname);
        formData.append("email", input.email);
        formData.append("phoneNumber", input.phoneNumber);
        formData.append("skills", input.skills);
        if (input.resume) {
            formData.append("resume", input.resume);
        }
        if (input.profilePhoto) {
            formData.append("profilePhoto", input.profilePhoto);
        }
        if (user?.role !== 'recruiter') {
            formData.append("bio", input.bio); // Only append bio if not recruiter
        }
        try {
            setLoading(true);
            const res = await axios.post(`${USER_API_END_POINT}/profile/update`, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
                withCredentials: true
            });
            if (res.data.success) {
                dispatch(setUser(res.data.user));
                toast.success(res.data.message);
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || "Something went wrong");
        } finally {
            setLoading(false);
            setOpen(false);  // Close the dialog after submission
        }
    };

    return (
        <Dialog open={open} onClose={() => setOpen(false)} disableBackdropClick>
            <DialogContent className="sm:max-w-[425px]" onInteractOutside={() => setOpen(false)}>
                <DialogHeader className="relative">
                    <DialogTitle>Update Profile</DialogTitle>
                    {/* Custom close button */}
                    <button
                        className="absolute top-0 right-0 p-2 text-gray-500"
                        onClick={() => setOpen(false)}  // Close the dialog when clicked
                    >
                        <XMarkIcon className="h-6 w-6" /> {/* Custom X icon */}
                    </button>
                </DialogHeader>
                <form onSubmit={submitHandler}>
                    <div className='grid gap-4 py-4'>
                        <div className='grid grid-cols-4 items-center gap-4'>
                            <Label htmlFor="fullname" className="text-right">Name</Label>
                            <Input id="fullname" name="fullname" type="text" value={input.fullname} onChange={changeEventHandler} className="col-span-3" />
                        </div>
                        <div className='grid grid-cols-4 items-center gap-4'>
                            <Label htmlFor="email" className="text-right">Email</Label>
                            <Input id="email" name="email" type="email" value={input.email} onChange={changeEventHandler} className="col-span-3" />
                        </div>
                        <div className='grid grid-cols-4 items-center gap-4'>
                            <Label htmlFor="phoneNumber" className="text-right">Number</Label>
                            <Input id="phoneNumber" name="phoneNumber" type="text" value={input.phoneNumber} onChange={changeEventHandler} className="col-span-3" />
                        </div>

                        {/* Show bio and skills fields only for non-recruiters */}
                        {user?.role !== 'recruiter' && (
                            <>
                                <div className='grid grid-cols-4 items-center gap-4'>
                                    <Label htmlFor="bio" className="text-right">Bio</Label>
                                    <Input id="bio" name="bio" type="text" value={input.bio} onChange={changeEventHandler} className="col-span-3" />
                                </div>
                                <div className='grid grid-cols-4 items-center gap-4'>
                                    <Label htmlFor="skills" className="text-right">Skills</Label>
                                    <Input id="skills" name="skills" type="text" value={input.skills} onChange={changeEventHandler} className="col-span-3" />
                                </div>
                                <div className='grid grid-cols-4 items-center gap-4'>
                                    <Label htmlFor="resume" className="text-right">Resume</Label>
                                    <Input id="resume" name="resume" type="file" accept="application/pdf" onChange={fileChangeHandler} className="col-span-3" />
                                </div>
                            </>
                        )}

                        {/* Show profile photo field for both roles */}
                        <div className='grid grid-cols-4 items-center gap-4'>
                            <Label htmlFor="profilePhoto" className="text-right">Profile Photo</Label>
                            <Input id="profilePhoto" name="profilePhoto" type="file" accept="image/*" onChange={fileChangeHandler} className="col-span-3" />
                        </div>
                    </div>
                    <DialogFooter>
                        {loading ? (
                            <Button className="w-full my-4"> <Loader2 className='mr-2 h-2 w-2 animate-spin' /> Please wait </Button>
                        ) : (
                            <Button type="submit" className="w-full my-4">Update</Button>
                        )}
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};

export default UpdateProfileDialog;
