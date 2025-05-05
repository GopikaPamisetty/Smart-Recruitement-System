import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Navbar from "../shared/Navbar";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Button } from "../ui/button";
import axios from "axios";
import { JOB_API_END_POINT } from "@/utils/constant";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

const EditPostJob = () => {
    const [input, setInput] = useState({
        title: "",
        description: "",
        requirements: "",
        salary: "",
        location: "",
        jobType: "",
        experience: "",
        position: 0,
        startDate: "",
        endDate: ""
    });

    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();
    const { jobId } = useParams();

    useEffect(() => {
        const fetchJob = async () => {
            try {
                const res = await axios.get(`${JOB_API_END_POINT}/get/${jobId}`, {
                    withCredentials: true
                });

                const job = res.data.job;
                setInput({
                    ...job,
                    startDate: job.startDate ? job.startDate.split("T")[0] : "",
                    endDate: job.endDate ? job.endDate.split("T")[0] : ""
                });
            } catch (error) {
                console.error("Error fetching job:", error);
                toast.error(error.response?.data?.message || "Failed to fetch job.");
            }
        };

        if (jobId) {
            fetchJob();
        }
    }, [jobId]);

    const changeEventHandler = (e) => {
        const { name, value } = e.target;
        setInput(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const submitHandler = async (e) => {
        e.preventDefault();

        if (!input.title || !input.description || !input.location || !input.endDate) {
            toast.error("Please fill in all required fields");
            return;
        }

        try {
            setLoading(true);
            const res = await axios.put(`${JOB_API_END_POINT}/update/${jobId}`, input, {
                headers: {
                    'Content-Type': 'application/json'
                },
                withCredentials: true
            });
            if (res.data.success) {
                toast.success(res.data.message);
                navigate("/admin/jobs");
            }
        } catch (error) {
            toast.error(error.response?.data?.message || "Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <Navbar />
            <div className="flex items-center justify-center w-screen my-5">
                <form onSubmit={submitHandler} className="p-8 max-w-4xl border border-gray-200 shadow-lg rounded-md">
                    <div className="grid grid-cols-2 gap-2">
                        <div>
                            <Label>Title</Label>
                            <Input type="text" name="title" value={input.title} onChange={changeEventHandler} />
                        </div>
                        <div>
                            <Label>Description</Label>
                            <Input type="text" name="description" value={input.description} onChange={changeEventHandler} />
                        </div>
                        <div>
                            <Label>Requirements</Label>
                            <Input type="text" name="requirements" value={input.requirements} onChange={changeEventHandler} />
                        </div>
                        <div>
                            <Label>Salary</Label>
                            <Input type="text" name="salary" value={input.salary} onChange={changeEventHandler} />
                        </div>
                        <div>
                            <Label>Location</Label>
                            <Input type="text" name="location" value={input.location} onChange={changeEventHandler} />
                        </div>
                        <div>
                            <Label>Job Type</Label>
                            <Input type="text" name="jobType" value={input.jobType} onChange={changeEventHandler} />
                        </div>
                        <div>
                            <Label>Experience Level</Label>
                            <Input type="text" name="experience" value={input.experience} onChange={changeEventHandler} />
                        </div>
                        <div>
                            <Label>No of Positions</Label>
                            <Input type="number" name="position" value={input.position} onChange={changeEventHandler} />
                        </div>
                        <div>
                            <Label>Start Date</Label>
                            <Input type="date" name="startDate" value={input.startDate} readOnly />
                        </div>
                        <div>
                            <Label>End Date</Label>
                            <Input type="date" name="endDate" value={input.endDate} onChange={changeEventHandler} required />
                        </div>
                    </div>
                    {loading ? (
                        <Button className="w-full my-4" disabled>
                            <Loader2 className="mr-2 h-4 w-4 animate-spin" /> Please wait
                        </Button>
                    ) : (
                        <Button type="submit" className="w-full my-4">Update Job</Button>
                    )}
                </form>
            </div>
        </div>
    );
};

export default EditPostJob;
