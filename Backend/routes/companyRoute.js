import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import { getCompany, getCompanyById, registerCompany, updateCompany , deleteCompany, restoreCompany} from "../controllers/companyController.js";
import { singleUpload } from "../middlewares/mutler.js";

const router = express.Router();

router.route("/register").post(isAuthenticated,registerCompany);
router.route("/get").get(isAuthenticated,getCompany);
router.route("/get/:id").get(isAuthenticated,getCompanyById);
router.route("/update/:id").put(isAuthenticated,singleUpload, updateCompany);
//router.route("/update/:id").put(isAuthenticated,updateCompany);
router.delete("/:id", deleteCompany)
router.post("/restore", restoreCompany);

export default router;



