import { Application } from "../models/applicationModel.js";
import { Job } from "../models/jobModel.js";
import {User} from "../models/userModel.js";

export const applyJob = async (req, res) => {
    try {
        const userId = req.id;
        const jobId = req.params.id;

        if (!jobId) {
            return res.status(400).json({
                message: "Job ID is required.",
                success: false
            });
        }

        // 1️⃣ Check if job exists
        const job = await Job.findById(jobId);
        if (!job) {
            return res.status(404).json({
                message: "Job not found.",
                success: false
            });
        }

        // 2️⃣ Check application window (startDate and endDate)
        const currentDate = new Date();
        if (currentDate < job.startDate) {
            return res.status(400).json({
                message: "Applications haven't opened yet.",
                success: false
            });
        }
        if (currentDate > job.endDate) {
            return res.status(400).json({
                message: "Application deadline has passed.",
                success: false
            });
        }

        // 3️⃣ Check if user already applied
        const existingApplication = await Application.findOne({
            job: jobId,
            applicant: userId
        });

        if (existingApplication) {
            return res.status(400).json({
                message: "You have already applied for this job.",
                success: false
            });
        }

        // 4️⃣ Check if resume exists for user
        const user = await User.findById(userId);
        if (!user?.profile?.resume) {
            return res.status(400).json({
                message: "Please upload your resume before applying for jobs.",
                success: false
            });
        }

        // 5️⃣ Check position availability
        if (job.position <= 0) {
            return res.status(400).json({
                message: "No positions available for this job.",
                success: false
            });
        }

        // 6️⃣ Create new application
        const newApplication = await Application.create({
            job: jobId,
            applicant: userId
        });

        // 7️⃣ Update job: push application + decrement position
        job.applications.push(newApplication._id);
        job.position = job.position - 1;
        await job.save();

        return res.status(201).json({
            message: "Job applied successfully.",
            success: true
        });

    } catch (error) {
        console.error("Error applying to job:", error);
        return res.status(500).json({
            message: "Internal server error.",
            success: false
        });
    }
};

export const getAppliedJobs = async (req,res) => {
    try {
        const userId = req.id;
        const application = await Application.find({applicant:userId}).sort({createdAt:-1}).populate({
            path:'job',
            options:{sort:{createdAt:-1}},
            populate:{
                path:'company',
                options:{sort:{createdAt:-1}},
            }
        });
        if(!application){
            return res.status(404).json({
                message:"No Applications",
                success:false
            })
        };
        return res.status(200).json({
            application,
            success:true
        })
    } catch (error) {
        console.log(error);
    }
}
// admin dekhega kitna user ne apply kiya hai
export const getApplicants = async (req,res) => {
    try {
        const jobId = req.params.id;
        const job = await Job.findById(jobId).populate({
            path:'applications',
            options:{sort:{createdAt:-1}},
            populate:{
                path:'applicant'
            }
        });
        if(!job){
            return res.status(404).json({
                message:'Job not found.',
                success:false
            })
        };
        return res.status(200).json({
            job, 
            succees:true
        });
    } catch (error) {
        console.log(error);
    }
}
export const updateStatus = async (req,res) => {
    try {
        const {status} = req.body;
        const applicationId = req.params.id;
        if(!status){
            return res.status(400).json({
                message:'status is required',
                success:false
            })
        };

        // find the application by applicantion id
        const application = await Application.findOne({_id:applicationId});
        if(!application){
            return res.status(404).json({
                message:"Application not found.",
                success:false
            })
        };

        // update the status
        application.status = status.toLowerCase();
        await application.save();

        return res.status(200).json({
            message:"Status updated successfully.",
            success:true
        });

    } catch (error) {
        console.log(error);
    }
}


// controllers/applicationController.js

export const deleteApplication = async (req, res) => {
    try {
        console.log("User ID from token:", req.id);
        console.log("Deleting application with ID:", req.params.id);

        const application = await Application.findById(req.params.id);

        if (!application) {
            return res.status(404).json({ success: false, message: "Application not found" });
        }

        if (application.applicant.toString() !== req.id) {
            return res.status(403).json({ success: false, message: "Unauthorized" });
        }

        await Application.findByIdAndDelete(req.params.id);

        res.status(200).json({ success: true, message: "Application deleted successfully" });
    } catch (error) {
        console.error("Delete Error:", error);
        res.status(500).json({ success: false, message: "Server error", error: error.message });
    }
};
