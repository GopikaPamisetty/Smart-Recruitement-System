import { User } from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";

//import { User } from "../models/userModel.js";
import { Job } from "../models/jobModel.js";

export const register = async (req, res) => {
    try {
        const { fullname, email, phoneNumber, password, role } = req.body;

        if (!fullname || !email || !phoneNumber || !password || !role) {
            return res.status(400).json({
                message: "Something is missing",
                success: false
            });
        }

        // Get the uploaded profile photo (optional)
        let profilePhotoUrl = null;
        const file = req.files?.profilePhoto?.[0]; 
        if (file) {
            const fileUri = getDataUri(file);
            const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
            profilePhotoUrl = cloudResponse.secure_url;
        }

        // Check if user already exists
        const user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({
                message: 'User already exists with this email.',
                success: false,
            });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create user in database
        await User.create({
            fullname,
            email,
            phoneNumber,
            password: hashedPassword,
            role,
            profile: {
                profilePhoto: profilePhotoUrl, // Store profile photo URL or null
            }
        });

        return res.status(201).json({
            message: "Account created successfully.",
            success: true
        });
    } catch (error) {
        console.error("Error in register:", error);
        return res.status(500).json({
            message: "Internal Server Error",
            success: false
        });
    }
};


export const login = async (req, res) => {
    try {
        const { email, password, role } = req.body;
        
        if (!email || !password || !role) {
            return res.status(400).json({
                message: "Something is missing",
                success: false
            });
        };
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                message: "Incorrect email or password.",
                success: false,
            })
        }
        const isPasswordMatch = await bcrypt.compare(password, user.password);
        if (!isPasswordMatch) {
            return res.status(400).json({
                message: "Incorrect email or password.",
                success: false,
            })
        };
        // check role is correct or not
        if (role !== user.role) {
            return res.status(400).json({
                message: "Account doesn't exist with current role.",
                success: false
            })
        };

        const tokenData = {
            userId: user._id
        }
        const token = await jwt.sign(tokenData, process.env.SECRET_KEY, { expiresIn: '1d' });

        user = {
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            profile: user.profile
        }

        return res.status(200).cookie("token", token, { maxAge: 1 * 24 * 60 * 60 * 1000, httpsOnly: true, sameSite: 'strict' }).json({
            message: `Welcome back ${user.fullname}`,
            user,
            success: true
        })
    } catch (error) {
        console.log(error);
    }
}
export const logout = async (req, res) => {
    try {
        return res.status(200).cookie("token", "", { maxAge: 0 }).json({
            message: "Logged out successfully.",
            success: true
        })
    } catch (error) {
        console.log(error);
    }
}
export const updateProfile = async (req, res) => {
    try {
      const { fullname, email, phoneNumber, bio, skills, removeProfilePhoto } = req.body;
  
      // Uploaded files via multer
      const profilePhoto = req?.files?.profilePhoto?.[0] || null;
      const resume = req?.files?.resume?.[0] || null;
  
      let profilePhotoUrl = '';
      let resumeUrl = '';
  
      // 📤 Upload new profile photo if provided
      if (profilePhoto) {
        const profilePhotoUri = getDataUri(profilePhoto);
        const uploadRes = await cloudinary.uploader.upload(profilePhotoUri.content);
        profilePhotoUrl = uploadRes.secure_url;
      }
  
      // 📤 Upload new resume if provided
      if (resume) {
        const resumeUri = getDataUri(resume);
        const uploadRes = await cloudinary.uploader.upload(resumeUri.content, {
          resource_type: 'raw'
        });
        resumeUrl = uploadRes.secure_url;
      }
  
      // 🧠 Parse skills to array
      const skillsArray = skills ? skills.split(',').map(s => s.trim()) : [];
  
      // 🔐 Get user
      const userId = req.id;
      let user = await User.findById(userId);
  
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found."
        });
      }
  
      // 🔄 Update basic info
      user.fullname = fullname || user.fullname;
      user.email = email || user.email;
      user.phoneNumber = phoneNumber || user.phoneNumber;
  
      // 🧠 Update profile fields for job seekers
      if (user.role !== 'recruiter') {
        user.profile.bio = bio || user.profile.bio;
        if (skillsArray.length > 0) {
          user.profile.skills = skillsArray;
        }
      }
  
      // 🖼️ Handle profile photo
if (removeProfilePhoto === 'true') {
  user.profile.profilePhoto = '';
} else if (profilePhotoUrl) {
  // Only set new photo if not removing
  user.profile.profilePhoto = profilePhotoUrl;
}

  
      // 📄 Handle resume
      if (resumeUrl) {
        user.profile.resume = resumeUrl;
        user.profile.resumeOriginalName = resume.originalname || 'resume.pdf';
      }
  
      // ✅ Save and respond
      await user.save();
  
      return res.status(200).json({
        success: true,
        message: "Profile updated successfully.",
        user: {
          _id: user._id,
          fullname: user.fullname,
          email: user.email,
          phoneNumber: user.phoneNumber,
          role: user.role,
          profile: user.profile
        }
      });
  
    } catch (error) {
      console.error("❌ Error in updateProfile:", error);
      return res.status(500).json({
        success: false,
        message: "An error occurred while updating profile.",
        error: error.message
      });
    }
  };
  

export const getAppliedJobs = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ error: "Unauthorized - Please log in" });
        }

        console.log("Fetching applied jobs for user:", req.user.id);

        const appliedJobs = await Application.find({ applicant: req.user.id }).populate("job");

        res.status(200).json(appliedJobs.length ? appliedJobs : []); // ✅ Always return JSON
    } catch (error) {
        console.error("Error fetching applied jobs:", error);
        res.status(500).json({ error: "Internal server error" }); // ✅ Always return JSON
    }
};





export const toggleSaveJob = async (req, res) => {
  try {
    const userId = req.id;
    const { jobId } = req.params;

    const user = await User.findById(userId);

    if (!user) return res.status(404).json({ message: "User not found" });

    const alreadySaved = user.savedJobs.includes(jobId);

    if (alreadySaved) {
      user.savedJobs = user.savedJobs.filter(id => id.toString() !== jobId);
      await user.save();
      return res.status(200).json({ message: "Job removed from saved jobs" });
    } else {
      user.savedJobs.push(jobId);
      await user.save();
      return res.status(200).json({ message: "Job saved successfully" });
    }
  } catch (err) {
    console.error("Save job error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

export const getSavedJobs = async (req, res) => {
  try {
    const userId = req.id;

    const user = await User.findById(userId).populate("savedJobs");

    if (!user) return res.status(404).json({ message: "User not found" });

    return res.status(200).json({ savedJobs: user.savedJobs });
  } catch (error) {
    console.error("Error fetching saved jobs:", error);
    return res.status(500).json({ message: "Server error" });
  }
};
