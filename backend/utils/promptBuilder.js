import platformConfig from './platformConfig.js';

const buildValidationPrompt = (idea, platform, tone, format, trendsData, newsData) => {
  const config = platformConfig[platform];

  const trends = trendsData
    ? `Trend Score: ${trendsData.value}/100
       Trend Direction: ${trendsData.direction}
       Related Queries: ${trendsData.relatedQueries?.join(', ') || 'Not available'}`
    : 'Google Trends data not available for this topic';

  const news = newsData && newsData.length > 0
    ? newsData
        .slice(0, 5)
        .map((article, i) => `${i + 1}. ${article.title}`)
        .join('\n')
    : 'No recent news found for this topic';

  return `
You are an expert social media virality analyst and content strategist.

Analyze this content idea and return ONLY a JSON response.
No explanation, no extra text outside JSON.

CONTENT IDEA: "${idea}"
TARGET PLATFORM: ${platform}
CONTENT TONE: ${tone}
CONTENT FORMAT: ${format}

PLATFORM RULES:
- Content Types: ${config.contentTypes.join(', ')}
- Max Hashtags: ${config.maxHashtags}
- Recommended Hashtags: ${config.recommendedHashtags}
- Max Video Duration: ${config.maxVideoDuration}

TREND DATA:
${trends}

NEWS DATA:
${news}

SCORING CRITERIA (weighted):
1. Trend Alignment   → 25%
2. Emotion Trigger   → 20%
3. Tone & Format Fit → 20%
4. Uniqueness        → 15%
5. Platform Fit      → 10%
6. News Relevance    → 10%

Tone-Platform Match Guide:
- Instagram → Funny, Inspirational
- LinkedIn  → Professional, Storytelling
- YouTube   → Storytelling, Educational
- Twitter/X → Aggressive, Controversial

Scoring Guide:
0-30   = Low viral potential
31-60  = Medium viral potential
61-80  = High viral potential
81-100 = Very high viral potential

Respond ONLY in this exact JSON format:
{
  "viralityScore": <number 0-100>,
  "viralWindow": "<when this idea will peak>",
  "emotionTrigger": "<Curiosity | Fear | Humor | Inspiration | Anger | None>",
  "scrollStopScore": <number 0-100>,
  "saturationLevel": "<High | Medium | Low>",
  "trendAlignment": "<how well idea aligns with trends>",
  "toneAnalysis": {
    "givenTone": "${tone}",
    "toneEffectiveness": "<High | Medium | Low>",
    "reason": "<why this tone works or not>",
    "suggestedTone": "<better tone if needed>"
  },
  "formatAnalysis": {
    "givenFormat": "${format}",
    "formatEffectiveness": "<High | Medium | Low>",
    "reason": "<why this format works or not>",
    "suggestedFormat": "<better format if needed>"
  },
  "hashtagStrategy": {
    "recommendedCount": ${config.recommendedHashtags},
    "suggestedHashtags": ["<hashtag1>", "<hashtag2>", "<hashtag3>", "<hashtag4>", "<hashtag5>"]
  },
  "bestTimeToPost": {
    "days": ["<day1>", "<day2>"],
    "time": "<best time range>",
    "reason": "<why this time>"
  },
  "audienceMatch": {
    "ageGroup": "<age range>",
    "interests": ["<interest1>", "<interest2>", "<interest3>"],
    "recommendedPlatform": "<best platform for this idea>"
  },
  "rewrittenIdea": "<improved version aligned with trends>",
  "hooks": [
    "<hook 1>",
    "<hook 2>",
    "<hook 3>",
    "<hook 4>",
    "<hook 5>"
  ],
  "suggestions": [
    "<suggestion 1>",
    "<suggestion 2>",
    "<suggestion 3>"
  ]
}
`;
};

export { buildValidationPrompt };