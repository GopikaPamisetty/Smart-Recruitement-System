// components/UpdateProfileDialog.js
import React, { useState } from 'react';
import {
  Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle
} from './ui/dialog';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Loader2 } from 'lucide-react';
import { useDispatch, useSelector } from 'react-redux';
import axios from 'axios';
import { USER_API_END_POINT } from '@/utils/constant';
import { setUser } from '@/redux/authSlice';
import { toast } from 'sonner';
import { XMarkIcon } from '@heroicons/react/24/outline';

const UpdateProfileDialog = ({ open, setOpen }) => {
  const [loading, setLoading] = useState(false);
  const { user } = useSelector((store) => store.auth);
  const dispatch = useDispatch();

  const [input, setInput] = useState({
    fullname: user?.fullname || '',
    email: user?.email || '',
    phoneNumber: user?.phoneNumber || '',
    bio: user?.profile?.bio || '',
    skills: user?.profile?.skills?.join(', ') || '',
    resume: null,
    profilePhoto: null,
  });

  const [removePhoto, setRemovePhoto] = useState(false);
  const [previewPhoto, setPreviewPhoto] = useState(null);

  const changeEventHandler = (e) => {
    setInput({ ...input, [e.target.name]: e.target.value });
  };

  const fileChangeHandler = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setInput({ ...input, profilePhoto: file });
      setPreviewPhoto(URL.createObjectURL(file));
      setRemovePhoto(false);
    }
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('fullname', input.fullname);
    formData.append('email', input.email);
    formData.append('phoneNumber', input.phoneNumber);
    formData.append('skills', input.skills);
    if (input.resume) formData.append('resume', input.resume);
    if (input.profilePhoto) formData.append('profilePhoto', input.profilePhoto);
    if (user?.role !== 'recruiter') formData.append('bio', input.bio);
    if (removePhoto) formData.append('removeProfilePhoto', 'true');

    try {
      setLoading(true);
      const res = await axios.post(
        `${USER_API_END_POINT}/profile/update`,
        formData,
        {
          headers: { 'Content-Type': 'multipart/form-data' },
          withCredentials: true
        }
      );
      if (res.data.success) {
        dispatch(setUser(res.data.user));
        toast.success(res.data.message);
      }
    } catch (error) {
      console.log(error);
      toast.error(error.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
      setOpen(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader className="relative">
          <DialogTitle>Update Profile</DialogTitle>
          <button
            className="absolute top-0 right-0 p-2 text-gray-500"
            onClick={() => setOpen(false)}
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </DialogHeader>

        <form onSubmit={submitHandler} className="space-y-5">
          <div>
            <Label htmlFor="fullname">Name</Label>
            <Input id="fullname" name="fullname" type="text" value={input.fullname} onChange={changeEventHandler} />
          </div>

          <div>
            <Label htmlFor="email">Email</Label>
            <Input id="email" name="email" type="email" value={input.email} onChange={changeEventHandler} />
          </div>

          <div>
            <Label htmlFor="phoneNumber">Phone Number</Label>
            <Input id="phoneNumber" name="phoneNumber" type="text" value={input.phoneNumber} onChange={changeEventHandler} />
          </div>

          {user?.role !== 'recruiter' && (
            <>
              <div>
                <Label htmlFor="bio">Bio</Label>
                <Input id="bio" name="bio" type="text" value={input.bio} onChange={changeEventHandler} />
              </div>
              <div>
                <Label htmlFor="skills">Skills</Label>
                <Input id="skills" name="skills" type="text" value={input.skills} onChange={changeEventHandler} />
              </div>
              <div>
                <Label htmlFor="resume">Resume</Label>
                <Input id="resume" name="resume" type="file" accept="application/pdf" onChange={(e) => setInput({ ...input, resume: e.target.files[0] })} />
              </div>
            </>
          )}

          <div>
            <Label htmlFor="profilePhoto">Profile Photo</Label>
            <div className="space-y-2">
              {(previewPhoto || (user?.profile?.profilePhoto && !removePhoto)) && (
                <div className="flex flex-col items-start gap-2">
                  <img
                    src={previewPhoto || user.profile.profilePhoto}
                    alt="Profile Preview"
                    className="w-20 h-20 object-cover rounded border"
                  />
                  <Button
                    type="button"
                    variant="destructive"
                    size="sm"
                    onClick={() => {
                      setInput({ ...input, profilePhoto: null });
                      setPreviewPhoto(null);
                      setRemovePhoto(true);
                    }}
                  >
                    Remove Photo
                  </Button>
                </div>
              )}
              <Input
                id="profilePhoto"
                name="profilePhoto"
                type="file"
                accept="image/*"
                onChange={fileChangeHandler}
              />
            </div>
          </div>

          <DialogFooter>
            {loading ? (
              <Button className="w-full" disabled>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </Button>
            ) : (
              <Button type="submit" className="w-full">
                Update
              </Button>
            )}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default UpdateProfileDialog;
