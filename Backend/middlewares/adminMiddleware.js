import jwt from "jsonwebtoken";
import { User } from "../models/userModel.js";

const isAdmin = async (req, res, next) => {
    try {
        const token = req.cookies.token;

        if (!token) {
            return res.status(401).json({ message: "Not authenticated" });
        }

        const decoded = jwt.verify(token, process.env.SECRET_KEY);
        const user = await User.findById(decoded.userId);

        if (!user || user.role !== "admin") {
            return res.status(403).json({ message: "Forbidden: Admins only" });
        }

        req.adminId = user._id;
        next();
    } catch (error) {
        console.error("Admin auth error:", error);
        return res.status(401).json({ message: "Invalid token or not authorized" });
    }
};

export default isAdmin;
