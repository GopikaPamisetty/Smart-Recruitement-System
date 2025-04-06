import { User } from "../models/userModel.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";

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
        const { fullname, email, phoneNumber, bio, skills } = req.body;

        
        // Multer will place the uploaded files in req.files
        const profilePhoto = req.files?.profilePhoto?.[0]; // Get profile photo
        const resume = req.files?.resume?.[0]; // Get resume

        let profilePhotoUrl = '';
        let resumeUrl = '';

        if (profilePhoto) {
            // Upload profile photo to cloudinary
            
            const profilePhotoUri = getDataUri(profilePhoto);
            const profilePhotoUpload = await cloudinary.uploader.upload(profilePhotoUri.content);
            profilePhotoUrl = profilePhotoUpload.secure_url;
        }

        if (resume) {
            // Upload resume to cloudinary
            const resumeUri = getDataUri(resume);
            const resumeUpload = await cloudinary.uploader.upload(resumeUri.content);
            resumeUrl = resumeUpload.secure_url;
        }

        // Process skills
        let skillsArray;
        if (skills) {
            skillsArray = skills.split(",");
        }

        const userId = req.id; // middleware authenticationz
        let user = await User.findById(userId);

        if (!user) {
            return res.status(400).json({
                message: "User not found.",
                success: false
            });
        }

        // Update user fields
        if (fullname) user.fullname = fullname;
        if (email) user.email = email;
        if (phoneNumber) user.phoneNumber = phoneNumber;
        if (bio) user.profile.bio = bio;
        if (skills) user.profile.skills = skillsArray;

        // If profile photo is uploaded, update it
        if (profilePhotoUrl) {
            user.profile.profilePhoto = profilePhotoUrl;
        }

        // If resume is uploaded, update it
        if (resumeUrl) {
            user.profile.resume = resumeUrl;
            user.profile.resumeOriginalName = resume.originalname
        }

        // Save updated user data
        await user.save();

        // Send the response back with updated user data
        user = {
            _id: user._id,
            fullname: user.fullname,
            email: user.email,
            phoneNumber: user.phoneNumber,
            role: user.role,
            profile: user.profile
        };

        return res.status(200).json({
            message: "Profile updated successfully.",
            user,
            success: true
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "An error occurred.", success: false });
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
