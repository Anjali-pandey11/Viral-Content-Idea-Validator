import { fetchNewsByTopic, fetchTrendingNews } from '../config/newsapi.js';

// Topic ke basis par news fetch karo
const getNewsByTopic = async (topic) => {
  try {
    const articles = await fetchNewsByTopic(topic);

    // Sirf relevant fields nikalo
    const cleaned = articles.map((article) => ({
      title: article.title,
      description: article.description,
      source: article.source?.name,
      publishedAt: article.publishedAt,
      url: article.url,
    }));

    return {
      success: true,
      articles: cleaned,
      total: cleaned.length,
    };
  } catch (error) {
    console.error(`newsapi.service getNewsByTopic Error: ${error.message}`);
    // App crash mat karo — empty return karo
    return {
      success: false,
      articles: [],
      total: 0,
    };
  }
};

// Overall trending news fetch karo
const getTrendingNews = async () => {
  try {
    const articles = await fetchTrendingNews();

    const cleaned = articles.map((article) => ({
      title: article.title,
      description: article.description,
      source: article.source?.name,
      publishedAt: article.publishedAt,
      url: article.url,
    }));

    return {
      success: true,
      articles: cleaned,
      total: cleaned.length,
    };
  } catch (error) {
    console.error(`newsapi.service getTrendingNews Error: ${error.message}`);
    return {
      success: false,
      articles: [],
      total: 0,
    };
  }
};

export { getNewsByTopic, getTrendingNews };