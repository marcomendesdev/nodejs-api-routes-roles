import express from "express";
import {
  authUser,
  registerUser,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  deleteUser,
  getUsers,
} from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";
import Token from "../models/token.js";
import User from "../models/userModel.js";
import asyncHandler from "express-async-handler";

const router = express.Router();

router.route("/users").get(getUsers);

router.get(
  "/verify/:token",
  asyncHandler(async (req, res) => {
    try {
      const token = await Token.findOne({ token: req.params.token });
      await User.updateOne(
        { _id: token.userId },
        { $set: { verified: true } },
        { new: true }
      );
      await Token.findOneAndRemove(token._id);
      res.status(200).json({ message: "Account verified!" });
    } catch (error) {
      res.status(400).json({ message: "Invalid token!" });
    }
  })
);

router.post("/auth", authUser);
router.post("/register", registerUser);
router.post("/logout", logoutUser);
router
  .route("/profile")
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile)
  .delete(protect, deleteUser);

export default router;
