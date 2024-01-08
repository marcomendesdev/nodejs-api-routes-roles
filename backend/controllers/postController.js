import asyncHandler from "express-async-handler";
import Post from "../models/postModel.js";
import mongoose from "mongoose";
import multer from "multer";
import { check, validationResult } from "express-validator";

import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, join(__dirname, '..', 'uploads'));
  },
  filename: function (req, file, cb) {
    cb(
      null,
      new Date().toISOString().replace(/:/g, "-") + "-" + file.originalname
    );
  },
});

const upload = multer({ storage: storage });

const getPosts = asyncHandler(async (req, res) => {
  const posts = await Post.find();
  if (posts.length === 0) {
    res.status(404).json({ message: "Posts not found" });
    throw new Error("Posts not found");
  }
  res.json(posts);
});

const getPostById = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (post) {
    res.json(post);
  } else {
    res.status(404);
    throw new Error("Post not found");
  }
});

const createPost = [
  check("title").notEmpty().withMessage("Title is required"),
  check("content").notEmpty().withMessage("Content is required"),
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const post = new Post({
      title: req.body.title,
      content: req.body.content,
      image: req.file.path,
      userId: req.user._id,
    });
    console.log(req.file);
    const createdPost = await post.save();
    res.status(201).json(createdPost);
  }),
];

const updatePost = [
  check("title").optional().notEmpty().withMessage("Title cannot be empty"),
  check("content").optional().notEmpty().withMessage("Content cannot be empty"),
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      res.status(400);
      throw new Error("Invalid post id");
    }

    const post = await Post.findById(id);
    if (post) {
      post.title = req.body.title || post.title;
      post.content = req.body.content || post.content;
      post.image = req.file ? req.file.path : post.image;

      const updatedPost = await post.save();
      res.json(updatedPost);
    } else {
      res.status(404);
      throw new Error("Post not found");
    }
  }),
];

const deletePost = asyncHandler(async (req, res) => {
  const post = await Post.findById(req.params.id);
  if (post) {
    await post.deleteOne();
    res.json({ message: "Post removed" });
  } else {
    res.status(404);
    throw new Error("Post not found");
  }
});

export { getPosts, getPostById, createPost, updatePost, deletePost, upload };
