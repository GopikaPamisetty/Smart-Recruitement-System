import { User } from "../models/userModel.js";
import { Job } from "../models/jobModel.js";
import { Company } from "../models/companyModel.js";


// export const getAllUsers = async (req, res) => {
//   try {
//     console.log("Query received:", req.query); // 👈 Add this line

//     const { role } = req.query;

//     const query = {};
//     if (role) {
//       query.role = role;
//     }

//     const users = await User.find(query).select("-password");
//     return res.status(200).json({ success: true, users });
//   } catch (err) {
//     return res.status(500).json({ success: false, message: "Server error" });
//   }
// };
export const getAllUsers = async (req, res) => {
  try {
    const { role, blocked } = req.query;
    const query = {};

    if (role) query.role = role;
    if (blocked === "true") query.isBlocked = true;

    const users = await User.find(query).select("-password");
    return res.status(200).json({ success: true, users });
  } catch (err) {
    return res.status(500).json({ success: false, message: "Server error" });
  }
};

export const getPlatformStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalStudents = await User.countDocuments({ role: "student" });
    const totalRecruiters = await User.countDocuments({ role: "recruiter" });
    const totalAdmins = await User.countDocuments({ role: "admin" });
    const totalBlockedUsers = await User.countDocuments({ isBlocked: true });

    const totalJobs = await Job.countDocuments();
    const totalCompanies = await Company.countDocuments({ isDeleted: false }); // ✅ Fix here

    res.status(200).json({
      stats: {
        totalUsers,
        totalStudents,
        totalRecruiters,
        totalAdmins,
        totalJobs,
        totalCompanies,
        totalBlockedUsers
      }
    });
  } catch (error) {
    console.error("🔥 Error fetching platform stats:", error);
    res.status(500).json({ message: "Error fetching statistics", error: error.message });
  }
};

// controllers/adminController.js
// controllers/adminController.js


// Example path: /api/admin/companies
// controllers/adminCompanyController.js

export const getAllCompanies = async (req, res) => {
  try {
    const companies = await Company.find({ isDeleted: false })
      .populate({
        path: "userId",
        select: "fullname email",
        strictPopulate: false, // helps in case the userId is missing
      })
      .lean();
      

    res.status(200).json({ companies });
  } catch (error) {
    console.error("❌ Error fetching companies:", error);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};



// GET /api/admin/jobs
export const getAllJobs = async (req, res) => {
  try {
    const jobs = await Job.find()
      .populate("company", "name location website")
      .populate("created_by", "fullname email");

      

    res.status(200).json({ jobs });
  } catch (error) {
    console.error("Error fetching jobs:", error);
    res.status(500).json({ message: "Server error while fetching jobs" });
  }
};



export const toggleUserBlockStatus = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    user.isBlocked = !user.isBlocked;
    await user.save();

    res.status(200).json({
      success: true,
      message: `User ${user.isBlocked ? "blocked" : "unblocked"} successfully`,
    });
  } catch (error) {
    console.error("Block toggle error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

// ✅ Platform analytics
export const getAnalytics = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalStudents = await User.countDocuments({ role: "student" });
    const totalRecruiters = await User.countDocuments({ role: "recruiter" });
    const totalJobs = await Job.countDocuments();

    res.status(200).json({
      success: true,
      stats: {
        totalUsers,
        totalStudents,
        totalRecruiters,
        totalJobs,
      },
    });
  } catch (error) {
    console.error("Error fetching analytics:", error);
    res.status(500).json({ success: false, message: "Failed to fetch analytics" });
  }
};
// Approve recruiter
export const approveRecruiter = async (req, res) => {
    try {
        const { recruiterId } = req.params;
        const user = await User.findById(recruiterId);

        if (!user || user.role !== 'recruiter') {
            return res.status(404).json({ message: "Recruiter not found" });
        }

        user.profile.isApproved = true;
        await user.save();

        res.status(200).json({ message: "Recruiter approved successfully" });
    } catch (error) {
        console.error("Approve Recruiter Error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

// Disapprove recruiter
export const disapproveRecruiter = async (req, res) => {
    try {
        const { recruiterId } = req.params;
        const user = await User.findById(recruiterId);

        if (!user || user.role !== 'recruiter') {
            return res.status(404).json({ message: "Recruiter not found" });
        }

        user.profile.isApproved = false;
        await user.save();

        res.status(200).json({ message: "Recruiter disapproved successfully" });
    } catch (error) {
        console.error("Disapprove Recruiter Error:", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};


