// middlewares/checkBlockedUser.js
import { User } from "../models/userModel.js";

export const checkBlockedUser = async (req, res, next) => {
  try {
    const user = await User.findById(req.id); // or req.user._id
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.isBlocked) {
      return res.status(403).json({ message: "You are blocked from performing this action." });
    }

    next();
  } catch (error) {
    return res.status(500).json({ message: "Internal Server Error" });
  }
};
