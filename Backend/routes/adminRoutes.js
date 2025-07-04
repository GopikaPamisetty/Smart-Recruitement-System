import express from "express";
import isAdmin from "../middlewares/adminMiddleware.js";
import { getAllUsers,  getPlatformStats, toggleUserBlockStatus, disapproveRecruiter, 
    approveRecruiter, getAnalytics,getAllCompanies,getAllJobs } 
    from "../controllers/adminController.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
const router = express.Router();

router.get("/users", isAuthenticated, isAdmin, getAllUsers);
// router.put("/users/:userId/toggle-block", isAuthenticated, isAdmin, toggleBlockUser);
router.get("/analytics", isAuthenticated, isAdmin, getAnalytics);
router.put("/approve-recruiter/:recruiterId", isAuthenticated, isAdmin, approveRecruiter);
router.put("/disapprove-recruiter/:recruiterId", isAuthenticated, isAdmin, disapproveRecruiter);
router.get("/stats", isAuthenticated, isAdmin, getPlatformStats);
router.post("/user/:id/block-toggle", isAuthenticated, isAdmin, toggleUserBlockStatus);
router.get("/companies", isAuthenticated, isAdmin, getAllCompanies);
router.get("/jobs", isAuthenticated, isAdmin, getAllJobs);

export default router;


