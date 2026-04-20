import mongoose from 'mongoose';

const validationSchema = new mongoose.Schema(
  {
    // ── User Reference ──────────────────────
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },

    // ── User Input ──────────────────────────
    idea: {
      type: String,
      required: [true, 'Content idea is required'],
      trim: true,
    },

    platform: {
      type: String,
      enum: ['Instagram', 'YouTube', 'LinkedIn', 'Twitter/X'],
      required: true,
    },

    tone: {
      type: String,
      enum: ['Funny', 'Inspirational', 'Aggressive', 'Storytelling',
             'Educational', 'Controversial', 'Professional'],
      required: true,
    },

    format: {
      type: String,
      enum: ['Hook-Heavy', 'Fast Cuts', 'Storytelling', 'Tutorial',
             'Listicle', 'Documentary', 'Vlog Style'],
      required: true,
    },

    // ── Core Scores ─────────────────────────
    viralityScore: {
      type: Number,
      min: 0,
      max: 100,
    },

    scrollStopScore: {
      type: Number,
      min: 0,
      max: 100,
    },

    viralWindow: {
      type: String,
    },

    emotionTrigger: {
      type: String,
      enum: ['Curiosity', 'Fear', 'Humor', 'Inspiration', 'Anger', 'None'],
    },

    saturationLevel: {
      type: String,
      enum: ['High', 'Medium', 'Low'],
    },
    
    trendAlignment: {
      type: String,
    },

    // ── Tone Analysis ────────────────────────
    toneAnalysis: {
      givenTone: { type: String },
      toneEffectiveness: {
        type: String,
        enum: ['High', 'Medium', 'Low'],
      },
      reason: { type: String },
      suggestedTone: { type: String },
    },

    // ── Format Analysis ──────────────────────
    formatAnalysis: {
      givenFormat: { type: String },
      formatEffectiveness: {
        type: String,
        enum: ['High', 'Medium', 'Low'],
      },
      reason: { type: String },
      suggestedFormat: { type: String },
    },

    // ── Hashtag Strategy ─────────────────────
    hashtagStrategy: {
      recommendedCount: { type: Number },
      suggestedHashtags: { type: [String] },
    },

    // ── Best Time To Post ────────────────────
    bestTimeToPost: {
      days: { type: [String] },
      time: { type: String },
      reason: { type: String },
    },

    // ── Audience Match ───────────────────────
    audienceMatch: {
      ageGroup: { type: String },
      interests: { type: [String] },
      recommendedPlatform: { type: String },
    },

    // ── Content Generation ───────────────────
    rewrittenIdea: {
      type: String,
    },
    hooks: {
      type: [String],
    },
    suggestions: {
      type: [String],
    },
  },
  { timestamps: true }
);

const Validation = mongoose.model('Validation', validationSchema);

export default Validation;