import express from "express";
import { login, logout, register, updateProfile } from "../controllers/userController.js";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { uploadFiles } from "../middlewares/mutler.js";
 
const router = express.Router();

router.route("/register").post(uploadFiles,register);

router.route("/login").post(login);
router.route("/logout").get(logout);
router.route("/profile/update").post(isAuthenticated,uploadFiles,updateProfile);

export default router;
