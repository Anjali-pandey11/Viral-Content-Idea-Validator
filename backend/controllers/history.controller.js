import asyncHandler from '../utils/asyncHandler.js';
import Validation from '../models/Validation.model.js';

// ── Get All Validations of User ───────────────
// GET /api/history
const getUserHistory = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const total = await Validation.countDocuments({ user: req.user._id });

  const validations = await Validation.find({ user: req.user._id })
    .sort({ createdAt: -1 }) // Latest pehle
    .skip(skip)
    .limit(limit)
    .select(
      'idea platform tone format viralityScore emotionTrigger saturationLevel createdAt'
    ); // Sirf summary fields

  res.status(200).json({
    success: true,
    total,
    page,
    pages: Math.ceil(total / limit),
    data: validations,
  });
});

// ── Get Single Validation Detail ──────────────
// GET /api/history/:id
const getValidationDetail = asyncHandler(async (req, res) => {
  // Valid MongoDB ObjectId hai?
  if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
    res.status(400);
    throw new Error('Invalid validation ID');
  }

  const validation = await Validation.findById(req.params.id);

  if (!validation) {
    res.status(404);
    throw new Error('Validation not found');
  }

  // Sirf apni validation dekh sakta hai
  if (validation.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to access this validation');
  }

  res.status(200).json({
    success: true,
    data: validation,
  });
});

// ── Delete Validation ─────────────────────────
// DELETE /api/history/:id
const deleteValidation = asyncHandler(async (req, res) => {
  // Valid MongoDB ObjectId hai?
  if (!req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
    res.status(400);
    throw new Error('Invalid validation ID');
  }

  const validation = await Validation.findById(req.params.id);

  if (!validation) {
    res.status(404);
    throw new Error('Validation not found');
  }

  // Sirf apni validation delete kar sakta hai
  if (validation.user.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to delete this validation');
  }

  await validation.deleteOne();

  res.status(200).json({
    success: true,
    message: 'Validation deleted successfully',
  });
});

// ── Clear All History ─────────────────────────
// DELETE /api/history
const clearHistory = asyncHandler(async (req, res) => {
  await Validation.deleteMany({ user: req.user._id });

  res.status(200).json({
    success: true,
    message: 'All history cleared successfully',
  });
});

export { getUserHistory, getValidationDetail, deleteValidation, clearHistory };