import asyncHandler from '../utils/asyncHandler.js';
import { getTrendData } from '../services/googleTrends.service.js';
import { getNewsByTopic, getTrendingNews } from '../services/newsapi.service.js';

// ── Get Trend Data by Topic ───────────────────
// GET /api/trends/topic?keyword=morning habits
const getTrendByTopic = asyncHandler(async (req, res) => {
  const { keyword } = req.query;

  // Keyword check karo
  if (!keyword) {
    res.status(400);
    throw new Error('Keyword is required');
  }

  // Google Trends + NewsAPI parallel fetch karo
  const [trendsResult, newsResult] = await Promise.allSettled([
    getTrendData(keyword),
    getNewsByTopic(keyword),
  ]);

  // Results extract karo
  const trendsData = trendsResult.status === 'fulfilled'
    ? trendsResult.value
    : null;

  const newsData = newsResult.status === 'fulfilled' && newsResult.value.success
    ? newsResult.value.articles
    : [];

  res.status(200).json({
    success: true,
    data: {
      keyword,
      trends: trendsData,
      news: newsData,
    },
  });
});

// ── Get Trending News ─────────────────────────
// GET /api/trends/news
const getLatestTrendingNews = asyncHandler(async (req, res) => {
  const result = await getTrendingNews();

  res.status(200).json({
    success: true,
    data: {
      articles: result.success ? result.articles : [],
      total: result.success ? result.total : 0,
    },
  });
});

export { getTrendByTopic, getLatestTrendingNews };