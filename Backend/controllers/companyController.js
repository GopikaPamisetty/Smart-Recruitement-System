import { Company } from "../models/companyModel.js";
import getDataUri from "../utils/datauri.js";
import cloudinary from "../utils/cloudinary.js";
// export const registerCompany = async (req, res) => {
//     try {
//         const { companyName } = req.body;
//         if (!companyName) {
//             return res.status(400).json({
//                 message: "Company name is required.",
//                 success: false
//             });
//         }

//         let company = await Company.findOne({ name: companyName });

//         if (company && !company.isDeleted) {
//             return res.status(400).json({
//                 message: "You can't register same company.",
//                 success: false
//             });
//         }

//         if (company && company.isDeleted) {
//             company.isDeleted = false;
//             company.userId = req.id;
//             await company.save();

//             return res.status(200).json({
//                 message: "Company restored successfully.",
//                 company,
//                 success: true
//             });
//         }

//         company = await Company.create({
//             name: companyName,
//             userId: req.id
//         });

//         return res.status(201).json({
//             message: "Company registered successfully.",
//             company,
//             success: true
//         });
//     } catch (error) {
//         console.log(error);
//         res.status(500).json({ message: "Internal server error", success: false });
//     }
// };
import { User } from "../models/userModel.js"; // ✅ import User model

// export const registerCompany = async (req, res) => {
//     try {
//         const { companyName } = req.body;

//         if (!companyName) {
//             return res.status(400).json({
//                 message: "Company name is required.",
//                 success: false
//             });
//         }

//         // ✅ Check recruiter approval
//         const user = await User.findById(req.id);
//         if (!user || user.role !== "recruiter") {
//             return res.status(403).json({
//                 message: "Only recruiters can register companies.",
//                 success: false
//             });
//         }

//         if (!user.profile?.isApproved) {
//             return res.status(403).json({
//                 message: "Your account is not approved yet. Please wait for admin approval.",
//                 success: false
//             });
//         }

//         let company = await Company.findOne({ name: companyName });

//         if (company && !company.isDeleted) {
//             return res.status(400).json({
//                 message: "You can't register the same company again.",
//                 success: false
//             });
//         }

//         if (company && company.isDeleted) {
//             company.isDeleted = false;
//             company.userId = req.id;
//             await company.save();

//             return res.status(200).json({
//                 message: "Company restored successfully.",
//                 company,
//                 success: true
//             });
//         }

//         company = await Company.create({
//             name: companyName,
//             userId: req.id
//         });

//         return res.status(201).json({
//             message: "Company registered successfully.",
//             company,
//             success: true
//         });
//     } catch (error) {
//         console.log(error);
//         res.status(500).json({ message: "Internal server error", success: false });
//     }
// };
export const registerCompany = async (req, res) => {
    try {
        const { companyName } = req.body;

        if (!companyName) {
            return res.status(400).json({
                message: "Company name is required.",
                success: false
            });
        }

        const user = await User.findById(req.id);

        if (!user || user.role !== "recruiter") {
            return res.status(403).json({
                message: "Only recruiters can register companies.",
                success: false
            });
        }

        if (user.isBlocked) {
            return res.status(403).json({
                message: "You are blocked by admin. Cannot register a company.",
                success: false
            });
        }

        if (!user.profile?.isApproved) {
            return res.status(403).json({
                message: "Your account is not approved yet. Please wait for admin approval.",
                success: false
            });
        }

        // ✅ NEW: Check if recruiter already created a company
        const existingCompany = await Company.findOne({ userId: req.id, isDeleted: false });
        if (existingCompany) {
            return res.status(400).json({
                message: "You have already registered a company.",
                success: false
            });
        }

        // ✅ Optional: Also prevent duplicate names globally
        const companyWithSameName = await Company.findOne({ name: companyName });
        if (companyWithSameName && !companyWithSameName.isDeleted) {
            return res.status(400).json({
                message: "A company with this name already exists.",
                success: false
            });
        }

        const company = await Company.create({
            name: companyName,
            userId: req.id
        });

        return res.status(201).json({
            message: "Company registered successfully.",
            company,
            success: true
        });

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: "Internal server error", success: false });
    }
};

export const getCompany = async (req, res) => {
    try {
       
        const userId = req.id; // logged in user id
        const companies = await Company.find({ userId, isDeleted: false });

        if (!companies) {
            return res.status(404).json({
                message: "Companies not found.",
                success: false
            })
        }
        return res.status(200).json({
            companies,
            success:true
        })
    } catch (error) {
        console.log(error);
    }
}
// get company by id
export const getCompanyById = async (req, res) => {
    try {
        const companyId = req.params.id;
        const company = await Company.findById(companyId);
        if (!company) {
            return res.status(404).json({
                message: "Company not found.",
                success: false
            })
        }
        return res.status(200).json({
            company,
            success: true
        })
    } catch (error) {
        console.log(error);
    }
}
export const updateCompany = async (req, res) => {
    try {
        const { name, description, website, location } = req.body;
        let logo = null;

        // ✅ Ensure file is uploaded before processing
        if (req.file) {
            const fileUri = getDataUri(req.file);
            if (fileUri) {
                const cloudResponse = await cloudinary.uploader.upload(fileUri.content);
                logo = cloudResponse.secure_url;
            }
        }

        // ✅ Only update fields that are provided
        const updateData = { name, description, website, location };
        if (logo) updateData.logo = logo;

        const company = await Company.findByIdAndUpdate(req.params.id, updateData, { new: true });

        if (!company) {
            return res.status(404).json({
                message: "Company not found.",
                success: false
            });
        }

        return res.status(200).json({
            message: "Company information updated.",
            success: true,
            company
        });

    } catch (error) {
        console.error("Error updating company:", error);
        return res.status(500).json({
            message: "Internal Server Error",
            success: false
        });
    }
};

export const deleteCompany = async (req, res) => {
    try {
      const company = await Company.findByIdAndUpdate(
        req.params.id,
        { isDeleted: true },
        { new: true }
      );
      if (!company) {
        return res.status(404).json({ message: "Company not found" });
      }
      res.status(200).json({ message: "Company soft deleted successfully" });
    } catch (err) {
      console.error(err);
      res.status(500).json({ message: "Server error" });
    }
  };
  
  export const restoreCompany = async (req, res) => {
    try {
      const { name } = req.body;
      const company = await Company.findOne({ name, isDeleted: true });
  
      if (!company) {
        return res.status(404).json({ message: "Deleted company not found" });
      }
  
      company.isDeleted = false;
      await company.save();
  
      res.status(200).json({ message: "Company restored", company });
    } catch (error) {
      res.status(500).json({ message: "Restore failed", success: false });
    }
  }
  