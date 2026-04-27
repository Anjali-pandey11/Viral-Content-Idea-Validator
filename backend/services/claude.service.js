import getGeminiClient from '../config/claude.js';
import { buildValidationPrompt } from '../utils/promptBuilder.js';
import { parseValidationResponse } from '../utils/scoreParser.js';
import { getTrendData } from './googleTrends.service.js';
import { getNewsByTopic } from './newsapi.service.js';

const validateContentIdea = async (idea, platform, tone, format) => {
  try {
    // Step 1 — Gemini client lo
    const model = getGeminiClient();

    // Step 2 — Trend + News parallel fetch karo
    const [trendsData, newsData] = await Promise.allSettled([ 
      getTrendData(idea),
      getNewsByTopic(idea),
    ]);

    // Step 3 — Results extract karo
    const trends = trendsData.status === 'fulfilled'
      ? trendsData.value
      : null;

    const news = newsData.status === 'fulfilled' && newsData.value.success
      ? newsData.value.articles
      : [];

    // Step 4 — Prompt build karo
    const prompt = buildValidationPrompt(
      idea,
      platform,
      tone,
      format,
      trends,
      news
    );

    // Step 5 — Gemini API call karo
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    // Step 6 — Parse karo
    const parsed = parseValidationResponse(responseText);

    return {
      success: true,
      data: parsed,
    };
  } catch (error) {
    console.error(`gemini.service Error: ${error.message}`);
    throw new Error(`Validation failed: ${error.message}`);
  }
};

export { validateContentIdea };