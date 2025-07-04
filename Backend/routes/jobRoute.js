import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { checkBlockedUser } from "../middlewares/checkBlockedUser.js"; // ✅ Import middleware

import {
  getAdminJobs,
  getAllJobs,
  getJobById,
  postJob,
  updateJob,
  deleteJob
} from "../controllers/jobController.js";

const router = express.Router();

// ✅ Protect these routes with both middlewares
router.route("/post").post(isAuthenticated, checkBlockedUser, postJob);
router.route("/get").get(isAuthenticated, getAllJobs);
router.route("/getadminjobs").get(isAuthenticated, getAdminJobs);
router.route("/get/:id").get(isAuthenticated, getJobById);
router.route("/update/:id").put(isAuthenticated, checkBlockedUser, updateJob);

// 🔸 Optional: Protect delete with authentication and block check
router.delete("/:id", isAuthenticated, checkBlockedUser, deleteJob);

export default router;
