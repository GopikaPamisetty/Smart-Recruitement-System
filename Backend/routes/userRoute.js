import express from "express";
import { login, logout, register, updateProfile, toggleSaveJob, getSavedJobs } from "../controllers/userController.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { uploadFiles } from "../middlewares/mutler.js";
 
const router = express.Router();

router.route("/register").post(uploadFiles,register);

router.route("/login").post(login);
router.route("/logout").get(logout);
router.route("/profile/update").post(isAuthenticated,uploadFiles,updateProfile);
// ✅ Save or unsave a job
router.post("/save-job/:jobId", isAuthenticated, toggleSaveJob);

// ✅ Get all saved jobs
router.get("/saved-jobs", isAuthenticated, getSavedJobs);

export default router;




