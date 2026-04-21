import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import User from '../models/User.model.js';
import asyncHandler from '../utils/asyncHandler.js';

// ── Token Generate Karo ──────────────────────
const generateToken = (userId) => {
  return jwt.sign(
    { id: userId },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRE }
  );
};

// ── Register ─────────────────────────────────
// POST /api/auth/register
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, niche, platform } = req.body;

  // Step 1 — Required fields check karo
  if (!name || !email || !password) {
    res.status(400);
    throw new Error('Name, email and password are required');
  }

  // Step 2 — User already exists?
  const existingUser = await User.findOne({ email });
  if (existingUser) {
    res.status(400);
    throw new Error('User already exists with this email');
  }

  // Step 3 — Password hash karo
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);

  // Step 4 — User banao
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    niche: niche || 'Other',
    platform: platform || ['Instagram'],
  });

  // Step 5 — Token generate karo
  const token = generateToken(user._id);

  res.status(201).json({
    success: true,
    token,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      niche: user.niche,
      platform: user.platform,
    },
  });
});

// ── Login ─────────────────────────────────────
// POST /api/auth/login
const loginUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  // Step 1 — Required fields check karo
  if (!email || !password) {
    res.status(400);
    throw new Error('Email and password are required');
  }

  // Step 2 — User dhundo
  const user = await User.findOne({ email });
  if (!user) {
    res.status(401);
    throw new Error('Invalid email or password');
  }

  // Step 3 — Password compare karo
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    res.status(401);
    throw new Error('Invalid email or password');
  }

  // Step 4 — Token generate karo
  const token = generateToken(user._id);

  res.status(200).json({
    success: true,
    token,
    user: {
      _id: user._id,
      name: user.name,
      email: user.email,
      niche: user.niche,
      platform: user.platform,
    },
  });
});

// ── Get Current User ──────────────────────────
// GET /api/auth/me
const getMe = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).select('-password');

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  res.status(200).json({
    success: true,
    user,
  });
});

// ── Update Profile ────────────────────────────
// PUT /api/auth/update
const updateProfile = asyncHandler(async (req, res) => {
  const { name, niche, platform } = req.body;

  const user = await User.findById(req.user._id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  // Sirf jo fields aaye hain unhe update karo
  if (name) user.name = name;
  if (niche) user.niche = niche;
  if (platform) user.platform = platform;

  const updatedUser = await user.save();

  res.status(200).json({
    success: true,
    user: {
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      niche: updatedUser.niche,
      platform: updatedUser.platform,
    },
  });
});

export { registerUser, loginUser, getMe, updateProfile };