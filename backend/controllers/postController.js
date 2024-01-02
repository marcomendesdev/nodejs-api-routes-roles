import asyncHandler from "express-async-handler";
import Post from "../models/postModel.js";
import mongoose from "mongoose";

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

const createPost = asyncHandler(async (req, res) => {
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    image: req.body.image,
    userId: req.user._id, // assuming req.user contains the authenticated user
  });
  const createdPost = await post.save();
  res.status(201).json(createdPost);
});

const updatePost = asyncHandler(async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400);
    throw new Error("Invalid post id");
  }

  const post = await Post.findById(id);
  if (post) {
    post.title = req.body.title || post.title;
    post.content = req.body.content || post.content;
    post.image = req.body.image || post.image;

    const updatedPost = await post.save();
    res.json(updatedPost);
  } else {
    res.status(404);
    throw new Error("Post not found");
  }
});

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

export { getPosts, getPostById, createPost, updatePost, deletePost };
