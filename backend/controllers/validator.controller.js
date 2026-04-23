import asyncHandler from '../utils/asyncHandler.js';
import { validateContentIdea } from '../services/claude.service.js';
import Validation from '../models/Validation.model.js';

// ── Validate Content Idea ─────────────────────
// POST /api/validate
const validateIdea = asyncHandler(async (req, res) => {
  const { idea, platform, tone, format } = req.body;

  // Step 1 — Required fields check karo
  if (!idea || !platform || !tone || !format) {
    res.status(400);
    throw new Error('Idea, platform, tone and format are required');
  }

  // Step 2 — Platform valid hai?
  const validPlatforms = ['Instagram', 'YouTube', 'LinkedIn', 'Twitter/X'];
  if (!validPlatforms.includes(platform)) {
    res.status(400);
    throw new Error('Invalid platform selected');
  }

  // Step 3 — Tone valid hai?
  const validTones = [
    'Funny', 'Inspirational', 'Aggressive',
    'Storytelling', 'Educational', 'Controversial', 'Professional',
  ];
  if (!validTones.includes(tone)) {
    res.status(400);
    throw new Error('Invalid tone selected');
  }

  // Step 4 — Format valid hai?
  const validFormats = [
    'Hook-Heavy', 'Fast Cuts', 'Storytelling',
    'Tutorial', 'Listicle', 'Documentary', 'Vlog Style',
  ];
  if (!validFormats.includes(format)) {
    res.status(400);
    throw new Error('Invalid format selected');
  }

  // Step 5 — Claude service call karo
  const result = await validateContentIdea(idea, platform, tone, format);

  if (!result.success) {
    res.status(500);
    throw new Error('Validation failed, please try again');
  }

  // Step 6 — Result DB mein save karo
  const validation = await Validation.create({
    user: req.user._id,
    idea,
    platform,
    tone,
    format,
    ...result.data,
  });

  // Step 7 — Response bhejo
  res.status(201).json({
    success: true,
    data: validation,
  });
});

// ── Get Single Validation ─────────────────────
// GET /api/validate/:id
const getValidation = asyncHandler(async (req, res) => {
  const validation = await Validation.findById(req.params.id);

  // Validation exist karta hai?
  if (!validation) {
    res.status(404);
    throw new Error('Validation not found');
  }

  // Ye validation is user ki hai?
  if (validation.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to access this validation');
  }

  res.status(200).json({
    success: true,
    data: validation,
  });
});

export { validateIdea, getValidation };