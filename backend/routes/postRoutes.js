import express from "express";
import {
  getPosts,
  getPostById,
  createPost,
  updatePost,
  deletePost,
  upload,
} from "../controllers/postController.js";
import { protect } from "../middleware/authMiddleware.js";

const router = express.Router();

router
  .route("/posts")
  .get(protect, getPosts)
  .post(protect, upload.single("image"), createPost);
router
  .route("/posts/:id")
  .get(protect, getPostById)
  .put(protect, upload.single("image"), updatePost)
  .delete(deletePost);

export default router;
