import claude from '../config/claude.js';
import { buildValidationPrompt } from '../utils/promptBuilder.js';
import { parseValidationResponse } from '../utils/scoreParser.js';
import { getTrendData } from './googleTrends.service.js';
import { getNewsByTopic } from './newsapi.service.js';

const validateContentIdea = async (idea, platform, tone, format) => {
  try {
    // Step 1 — Trend data fetch karo parallel mein
    const [trendsData, newsData] = await Promise.allSettled([
      getTrendData(idea),
      getNewsByTopic(idea),
    ]);

    // Step 2 — Results extract karo
    const trends = trendsData.status === 'fulfilled'
      ? trendsData.value
      : null;

    const news = newsData.status === 'fulfilled' && newsData.value.success
      ? newsData.value.articles
      : [];

    // Step 3 — Prompt build karo
    const prompt = buildValidationPrompt(
      idea,
      platform,
      tone,
      format,
      trends,
      news
    );

    // Step 4 — Claude API call karo
    const response = await claude.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 1000,
      messages: [
        {
          role: 'user',
          content: prompt,
        },
      ],
    });

    // Step 5 — Response text nikalo
    const responseText = response.content
      .filter((block) => block.type === 'text')
      .map((block) => block.text)
      .join('');

    // Step 6 — Parse karo aur validate karo
    const result = parseValidationResponse(responseText);

    return {
      success: true,
      data: result,
    };
  } catch (error) {
    console.error(`claude.service validateContentIdea Error: ${error.message}`);
    throw new Error(`Validation failed: ${error.message}`);
  }
};

export { validateContentIdea };