import { Job } from "../models/jobModel.js";
import { User } from "../models/userModel.js";
import sendEmail from "../utils/sendEmail.js"; // make sure this utility exists

// admin post krega job
export const postJob = async (req, res) => {
    try {
        const { title, description, requirements, salary, location, jobType, experience, position, companyId } = req.body;
        const userId = req.id;

        if (!title || !description || !requirements || !salary || !location || !jobType || !experience || !position || !companyId) {
            return res.status(400).json({
                message: "Something is missing.",
                success: false
            });
        }

        const job = await Job.create({
            title,
            description,
            requirements: Array.isArray(requirements)
                ? requirements
                : requirements.split(",").map((r) => r.trim()),
            salary: Number(salary),
            location,
            jobType,
            experienceLevel: experience,
            position,
            company: companyId,
            created_by: userId
        });

        // ✅ Send email notifications to all users
        const users = await User.find({}, "email"); // fetch all emails only

        // You could also batch or throttle if users.length is large
        try {
            const users = await User.find({}, "email");
          
            for (let user of users) {
              try {
                await sendEmail({
                  email: user.email,
                  subject: `🚀 New Job Posted: ${job.title}`,
                  message: `Hey there!\n\nA new job titled "${job.title}" has just been posted on Job Hunt.\n\nCheck it out and apply now!`
                });
          
                // Optional delay between emails to avoid overwhelming the SMTP server
                await new Promise(resolve => setTimeout(resolve, 300));
              } catch (emailError) {
                console.error(`Failed to send to ${user.email}:`, emailError.message);
              }
            }
          } catch (err) {
            console.error("User fetching or email sending failed:", err);
          }
          

        return res.status(201).json({
            message: "New job created successfully and emails sent.",
            job,
            success: true
        });

    } catch (error) {
        console.log("Post job error:", error);
        return res.status(500).json({
            message: "Something went wrong.",
            success: false
        });
    }
};
// student k liye
export const getAllJobs = async (req, res) => {
    try {
        const keyword = req.query.keyword || "";
        const query = {
            $or: [
                { title: { $regex: keyword, $options: "i" } },
                { description: { $regex: keyword, $options: "i" } },
            ]
        };
        
        const allJobs = await Job.find(query).populate("company").sort({ createdAt: -1 });

// Filter jobs whose company is not deleted
const jobs = allJobs.filter(job => job.company && !job.company.isDeleted);

        if (!jobs) {
            return res.status(404).json({
                message: "Jobs not found.",
                success: false
            })
        };
        return res.status(200).json({
            jobs,
            success: true
        })
    } catch (error) {
        console.log(error);
    }
}
// student
export const getJobById = async (req, res) => {
    try {
        const jobId = req.params.id;

        if (!jobId || jobId.length !== 24) {
            return res.status(400).json({
                message: "Invalid job ID",
                success: false
            });
        }

        const job = await Job.findById(jobId).populate("company");

        if (!job) {
            return res.status(404).json({
                message: "Job not found",
                success: false
            });
        }

        return res.status(200).json({ job, success: true });
    } catch (error) {
        console.error("Error fetching job by ID:", error);
        res.status(500).json({ message: "Server error", success: false });
    }
};

// admin kitne job create kra hai abhi tk
export const getAdminJobs = async (req, res) => {
    try {
        const adminId = req.id;
        const allJobs = await Job.find({ created_by: adminId }).populate("company").sort({ createdAt: -1 });
const jobs = allJobs.filter(job => job.company && !job.company.isDeleted);

        if (!jobs) {
            return res.status(404).json({
                message: "Jobs not found.",
                success: false
            })
        };
        return res.status(200).json({
            jobs,
            success: true
        })
    } catch (error) {
        console.log(error);
    }
}

export const updateJob = async (req, res) => {
    try {
        const { title, description, requirements, salary, location, jobType, experience, position } = req.body;
        const jobId = req.params.id;

        const updatedJob = await Job.findByIdAndUpdate(
            jobId,
            {
                title,
                description,
                requirements: Array.isArray(requirements)
  ? requirements
  : requirements.split(",").map((r) => r.trim()),
 // Ensure it's stored as an array
                salary: Number(salary),
                location,
                jobType,
                experienceLevel: experience,
                position
            },
            { new: true } // Return the updated job
        );

        if (!updatedJob) {
            return res.status(404).json({
                message: "Job not found.",
                success: false
            });
        }

        return res.status(200).json({
            message: "Job updated successfully.",
            success: true,
            job: updatedJob
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Something went wrong.",
            success: false
        });
    }
};



export const deleteJob = async (req, res) => {
    try {
      const jobId = req.params.id;
      // Assuming you have a Job model
      const deletedJob = await Job.findByIdAndDelete(jobId);
      if (!deletedJob) {
        return res.status(404).json({ message: "Job not found" });
      }
      res.status(200).json({ message: "Job deleted successfully" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  }
  