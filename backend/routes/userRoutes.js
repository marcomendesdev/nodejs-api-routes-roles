import express from "express";
import {
  authUser,
  registerUser,
  resetPassword,
  confirmPassword,
  assignRole,
  getUserByEmail,
  emailConfirmation,
  logoutUser,
  getUserProfile,
  updateUserProfile,
  deleteUser,
  getUsers,
} from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";
import checkRole from "../middleware/checkUserRoleMiddleware.js";

const router = express.Router();

router.route("/users").get(getUsers);
router.route("/users/:email").get(protect, getUserByEmail);

router.get("/verify/:token", emailConfirmation);
router.post("/reset-password", resetPassword);
router.post("/confirm-password/:token", confirmPassword);

router
  .route("/assign-role")
  .patch(protect, checkRole("master"), assignRole);


router.post("/auth", authUser);
router.post("/register", registerUser);
router.post("/logout", logoutUser);
router
  .route("/profile")
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile)
  .delete(protect, deleteUser);

export default router;
