import express from 'express';
import {
  validateIdea,
  getValidation,
} from '../controllers/validator.controller.js';
import protect from '../middleware/auth.middleware.js';
import { claudeLimiter } from '../middleware/rateLimiter.middleware.js';

const router = express.Router();

// ── Protected Routes ──────────────────────────
router.post('/', protect, claudeLimiter, validateIdea);
router.get('/:id', protect, getValidation);

export default router;