import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { applyJob, getApplicants, getAppliedJobs, updateStatus , deleteApplication } from "../controllers/applicationController.js";
import { checkBlockedUser } from "../middlewares/checkBlockedUser.js"; // ✅ Import middleware

const router = express.Router();

router.route("/apply/:id").post(isAuthenticated,checkBlockedUser, applyJob);
router.route("/get").get(isAuthenticated, getAppliedJobs);  // ✅ Correct API route
router.route("/:id/applicants").get(isAuthenticated, getApplicants);
router.route("/status/:id/update").post(isAuthenticated, updateStatus);
router.route("/delete/:id").delete(isAuthenticated,checkBlockedUser, deleteApplication);

export default router;


