import mongoose from 'mongoose';

const validationSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
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
    viralityScore: {
      type: Number,
      min: 0,
      max: 100,
    },
    emotionTrigger: {
      type: String,
      enum: ['Curiosity', 'Fear', 'Humor', 'Inspiration', 'Anger', 'None'],
    },
    saturationLevel: {
      type: String,
      enum: ['High', 'Medium', 'Low'],
    },
    viralWindow: {
      type: String,
    },
    bestTimeToPost: {
      type: String,
    },
    audienceMatch: {
      ageGroup: String,
      interests: [String],
      recommendedPlatform: String,
    },
    suggestions: {
      type: [String],
    },
    rewrittenIdea: {
      type: String,
    },
    hooks: {
      type: [String],
    },
  },
  { timestamps: true }
);

const Validation = mongoose.model('Validation', validationSchema);

export default Validation;