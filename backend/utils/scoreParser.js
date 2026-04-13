// ============================================
// Type Validators
// ============================================

const isValidScore = (val) =>
  typeof val === 'number' && val >= 0 && val <= 100;

const isValidString = (val) =>
  typeof val === 'string' && val.trim().length > 0;

const isValidArray = (val) =>
  Array.isArray(val) && val.length > 0;

const isValidEnum = (val, allowed) =>
  typeof val === 'string' && allowed.includes(val);

// ============================================
// Safe JSON Extractor
// ============================================

const extractJSON = (text) => {
  const matches = [];
  let depth = 0;
  let start = null;

  for (let i = 0; i < text.length; i++) {
    if (text[i] === '{') {
      if (depth === 0) start = i;
      depth++;
    } else if (text[i] === '}') {
      depth--;
      if (depth === 0 && start !== null) {
        matches.push(text.slice(start, i + 1));
        start = null;
      }
    }
  }

  for (const match of matches.sort((a, b) => b.length - a.length)) {
    try {
      const cleaned = match.replace(/,\s*([}\]])/g, '$1');
      const parsed = JSON.parse(cleaned);
      if (typeof parsed === 'object' && parsed !== null) {
        return parsed;
      }
    } catch {
      continue;
    }
  }

  return null;
};

// ============================================
// Core Parser
// ============================================

const parseClaudeResponse = (responseText) => {
  try {
    let cleaned = responseText.trim();

    if (cleaned.includes('```')) {
      const match = cleaned.match(/```(?:json)?\s*([\s\S]*?)```/);
      if (match) cleaned = match[1].trim();
    }

    cleaned = cleaned.replace(/,\s*([}\]])/g, '$1');

    try {
      const parsed = JSON.parse(cleaned);
      return { success: true, data: parsed };
    } catch {
      const extracted = extractJSON(responseText);
      if (extracted) {
        return { success: true, data: extracted };
      }
      throw new Error('No valid JSON found');
    }
  } catch (error) {
    console.error('scoreParser Error:', error.message);
    console.error('Raw Response:', responseText);
    return { success: false, error: error.message, raw: responseText };
  }
};

// ============================================
// Main Validation Response Parser
// ============================================

const parseValidationResponse = (responseText) => {
  const result = parseClaudeResponse(responseText);

  if (!result.success) {
    return getDefaultValidation();
  }

  const d = result.data;

  return {
    // Core scores
    viralityScore: isValidScore(d.viralityScore)
      ? d.viralityScore : 50,

    viralWindow: isValidString(d.viralWindow)
      ? d.viralWindow : 'Unable to predict',

    emotionTrigger: isValidEnum(d.emotionTrigger, [
      'Curiosity', 'Fear', 'Humor', 'Inspiration', 'Anger', 'None',
    ]) ? d.emotionTrigger : 'None',

    scrollStopScore: isValidScore(d.scrollStopScore)
      ? d.scrollStopScore : 50,

    saturationLevel: isValidEnum(d.saturationLevel, ['High', 'Medium', 'Low'])
      ? d.saturationLevel : 'Medium',

    trendAlignment: isValidString(d.trendAlignment)
      ? d.trendAlignment : 'Unable to analyze',

    // Tone analysis
    toneAnalysis: {
      givenTone: isValidString(d.toneAnalysis?.givenTone)
        ? d.toneAnalysis.givenTone : 'Unknown',
      toneEffectiveness: isValidEnum(d.toneAnalysis?.toneEffectiveness,
        ['High', 'Medium', 'Low'])
        ? d.toneAnalysis.toneEffectiveness : 'Medium',
      reason: isValidString(d.toneAnalysis?.reason)
        ? d.toneAnalysis.reason : 'Analysis failed',
      suggestedTone: isValidString(d.toneAnalysis?.suggestedTone)
        ? d.toneAnalysis.suggestedTone : 'Inspirational',
    },

    // Format analysis
    formatAnalysis: {
      givenFormat: isValidString(d.formatAnalysis?.givenFormat)
        ? d.formatAnalysis.givenFormat : 'Unknown',
      formatEffectiveness: isValidEnum(d.formatAnalysis?.formatEffectiveness,
        ['High', 'Medium', 'Low'])
        ? d.formatAnalysis.formatEffectiveness : 'Medium',
      reason: isValidString(d.formatAnalysis?.reason)
        ? d.formatAnalysis.reason : 'Analysis failed',
      suggestedFormat: isValidString(d.formatAnalysis?.suggestedFormat)
        ? d.formatAnalysis.suggestedFormat : 'Hook-Heavy',
    },

    // Hashtag strategy
    hashtagStrategy: {
      recommendedCount: typeof d.hashtagStrategy?.recommendedCount === 'number'
        ? d.hashtagStrategy.recommendedCount : 5,
      suggestedHashtags: isValidArray(d.hashtagStrategy?.suggestedHashtags)
        ? d.hashtagStrategy.suggestedHashtags.slice(0, 5) : [],
    },

    // Best time to post
    bestTimeToPost: {
      days: isValidArray(d.bestTimeToPost?.days)
        ? d.bestTimeToPost.days : ['Monday', 'Wednesday'],
      time: isValidString(d.bestTimeToPost?.time)
        ? d.bestTimeToPost.time : '7:00 PM - 9:00 PM',
      reason: isValidString(d.bestTimeToPost?.reason)
        ? d.bestTimeToPost.reason : 'General best practice',
    },

    // Audience match
    audienceMatch: {
      ageGroup: isValidString(d.audienceMatch?.ageGroup)
        ? d.audienceMatch.ageGroup : '18-34',
      interests: isValidArray(d.audienceMatch?.interests)
        ? d.audienceMatch.interests : [],
      recommendedPlatform: isValidString(d.audienceMatch?.recommendedPlatform)
        ? d.audienceMatch.recommendedPlatform : 'Instagram',
    },

    // Content generation
    rewrittenIdea: isValidString(d.rewrittenIdea)
      ? d.rewrittenIdea : 'Unable to generate rewritten idea',

    hooks: isValidArray(d.hooks) && d.hooks.every(isValidString)
      ? d.hooks.slice(0, 5) : ['Please try again to generate hooks'],

    suggestions: isValidArray(d.suggestions) && d.suggestions.every(isValidString)
      ? d.suggestions.slice(0, 3) : ['Please try validating your idea again'],
  };
};

// ============================================
// Default Fallback
// ============================================

const getDefaultValidation = () => ({
  viralityScore: 50,
  viralWindow: 'Unable to predict',
  emotionTrigger: 'None',
  scrollStopScore: 50,
  saturationLevel: 'Medium',
  trendAlignment: 'Unable to analyze',
  toneAnalysis: {
    givenTone: 'Unknown',
    toneEffectiveness: 'Medium',
    reason: 'Analysis failed',
    suggestedTone: 'Inspirational',
  },
  formatAnalysis: {
    givenFormat: 'Unknown',
    formatEffectiveness: 'Medium',
    reason: 'Analysis failed',
    suggestedFormat: 'Hook-Heavy',
  },
  hashtagStrategy: {
    recommendedCount: 5,
    suggestedHashtags: [],
  },
  bestTimeToPost: {
    days: ['Monday', 'Wednesday'],
    time: '7:00 PM - 9:00 PM',
    reason: 'General best practice',
  },
  audienceMatch: {
    ageGroup: '18-34',
    interests: [],
    recommendedPlatform: 'Instagram',
  },
  rewrittenIdea: 'Unable to generate',
  hooks: ['Please try again to generate hooks'],
  suggestions: ['Please try validating your idea again'],
});

export { parseValidationResponse };