import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";
import generateToken from "../utils/generateToken.js";
import Token from "../models/token.js";
import crypto from "crypto";
import verifyEmail from "../utils/verifyEmail.js";
import { check, validationResult } from "express-validator";

// logs in user
const authUser = [
  check("email").isEmail(),
  check("password").isLength({ min: 5 }),
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (user && (await user.matchPassword(password))) {
      generateToken(res, user._id);
      res.status(201).json({
        _id: user._id,
        email: user.email,
      });
    } else {
      res.status(400).json({ message: "Invalid credentials" });
    }
  }),
];

// registers user
const registerUser = [
  check("name").notEmpty(),
  check("email").isEmail(),
  check("password").isLength({ min: 5 }),
  asyncHandler(async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;
    const userExists = await User.findOne({ email });

    if (userExists) {
      res.status(400).json({ message: "User already exists" });
      return;
    }

    let role;
    if (email === process.env.ADMIN_EMAIL) {
      role = "admin";
    } else if (email === process.env.MASTER_EMAIL) {
      role = "master";
    }

    let verified;

    const user = await User.create({ name, email, password, role, verified });

    const token = new Token({
      userId: user._id,
      token: crypto.randomBytes(16).toString("hex"),
    });

    await token.save();

    const link = `${process.env.API_URL}/verify/${token.token}`;
    const linkUrl = new URL(link);
    if (
      linkUrl.protocol !== "http:" ||
      linkUrl.host !== new URL(process.env.API_URL).host
    ) {
      throw new Error("Invalid link");
    }
    await verifyEmail(user.email, link);

    res.status(200).json({ message: "Check your email" });
  }),
];

// resets user password
const resetPassword = asyncHandler(async (req, res) => {
  const user = await User.findOne({ email: req.body.email });

  if (user) {
    const token = new Token({
      userId: user._id,
      token: crypto.randomBytes(16).toString("hex"),
    });

    await token.save();

    const link = `${process.env.CLIENT_URL}/confirm-password/${token.token}`;
    await verifyEmail(user.email, link);

    res.status(200).json({ message: "Check your email" });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// confirms password reset
const confirmPassword = [
  check("email").isEmail(),
  check("password").isLength({ min: 5 }),
  asyncHandler(async (req, res) => {
    try {
      const token = await Token.findOne({ token: req.params.token });
      const user = await User.findById(token.userId);

      if (user) {
        user.password = req.body.password;
        const updatedUser = await user.save();
        await Token.findOneAndRemove(token._id);
        res.status(200).json(updatedUser);
      } else {
        res.status(404);
        throw new Error("User not found");
      }
    } catch (error) {
      res.status(400).json({ message: "Invalid token" });
    }
  }),
];

// assigns role to user
const assignRole = asyncHandler(async (req, res) => {
  const user = await User.findOne({ email: req.body.email });
  console.log(user);
  if (user) {
    user.role = req.body.role;
    const updatedUser = await user.save();
    res.json(updatedUser);
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// finds user by email
const getUserByEmail = asyncHandler(async (req, res) => {
  const user = await User.findOne({ email: req.params.email });

  console.log(user);

  if (user) {
    res.json(user);
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// verifies user email and activates account
const emailConfirmation = asyncHandler(async (req, res) => {
  try {
    const token = await Token.findOne({ token: req.params.token });
    await User.updateOne(
      { _id: token.userId },
      { $set: { verified: true } },
      { new: true }
    );
    await Token.findOneAndRemove(token._id);
    res.redirect(`${process.env.EMAIL_VERIFIED_URL}`);
  } catch (error) {
    res.redirect(`${process.env.EMAIL_NOT_VERIFIED_URL}`);
  }
});

// logs out user
const logoutUser = asyncHandler(async (req, res) => {
  res.cookie("token", "", { httpOnly: true, expires: new Date(0) });
  res.status(200).json({ message: "Logout user" });
});

// gets own user profile
const getUserProfile = asyncHandler(async (req, res) => {
  const user = {
    _id: req.user._id,
    name: req.user.name,
    email: req.user.email,
  };
  res.status(200).json(user);
});

// updates own user profile
const updateUserProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);

  if (user) {
    user.name = req.body.name || user.name;
    user.email = req.body.email || user.email;

    if (req.body.password) {
      user.password = req.body.password;
    }

    const updatedUser = await user.save();
    res.status(200).json(updatedUser);
  } else {
    res.status(404);
    throw new Error("User not found");
  }
  generateToken(res, updatedUser._id);
});

// deletes own user profile
const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (user) {
    await user.deleteOne();
    res.status(200).json({ message: "User removed" });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

// gets all users
const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({});
  res.status(200).json(users);
});

export {
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
};
