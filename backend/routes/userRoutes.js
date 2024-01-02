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

const router = express.Router();

router.route('/users').get(getUsers);

router.post("/auth", authUser);
router.post("/register", registerUser);
router.post("/logout", logoutUser);
router.route("/profile").get(protect, getUserProfile).put(protect, updateUserProfile).delete(protect, deleteUser);

export default router;
