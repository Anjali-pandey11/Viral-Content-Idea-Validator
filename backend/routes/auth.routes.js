import express from 'express';
import {
  registerUser,
  loginUser,
  getMe,
  updateProfile,
} from '../controllers/auth.controller.js';
import protect from '../middleware/auth.middleware.js';
import { authLimiter } from '../middleware/rateLimiter.middleware.js';

const router = express.Router();

// ── Public Routes ─────────────────────────────
router.post('/register', authLimiter, registerUser);
router.post('/login', authLimiter, loginUser);

// ── Protected Routes ──────────────────────────
router.get('/me', protect, getMe);
router.put('/update', protect, updateProfile);

export default router;