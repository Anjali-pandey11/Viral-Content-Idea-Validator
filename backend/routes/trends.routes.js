import express from 'express';
import {
  getTrendByTopic,
  getLatestTrendingNews,
} from '../controllers/trends.controller.js';
import protect from '../middleware/auth.middleware.js';

const router = express.Router();

// ── Protected Routes ──────────────────────────
router.get('/topic', protect, getTrendByTopic);
router.get('/news', protect, getLatestTrendingNews);

export default router;