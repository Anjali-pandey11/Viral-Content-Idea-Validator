import express from 'express';
import {
  getUserHistory,
  getValidationDetail,
  deleteValidation,
  clearHistory,
} from '../controllers/history.controller.js';
import protect from '../middleware/auth.middleware.js';

const router = express.Router();

// ── Protected Routes ──────────────────────────
router.get('/', protect, getUserHistory);
router.get('/:id', protect, getValidationDetail);
router.delete('/:id', protect, deleteValidation);
router.delete('/', protect, clearHistory);

export default router;