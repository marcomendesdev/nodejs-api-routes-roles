import express from "express";
import {
  getPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
} from "../controllers/postController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router.route("/posts").get(protect, getPosts).post(protect, createPost);
router.route("/posts/:id").get(protect, getPostById).put(protect, updatePost).delete(protect, deletePost);

export default router;
