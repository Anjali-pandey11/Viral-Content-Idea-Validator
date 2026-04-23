const NEWS_API_BASE_URL = process.env.NEWS_API_BASE_URL;

export const fetchNewsByTopic = async (topic) => {
  
  try {
    const response = await fetch(
      `${NEWS_API_BASE_URL}/everything?q=${encodeURIComponent(topic)}&sortBy=popularity&pageSize=10&apiKey=${process.env.NEWS_API_KEY}`
    );
    const data = await response.json();

    if (data.status !== 'ok') {
      throw new Error(data.message || 'NewsAPI error');
    }

    return data.articles;
  } catch (error) {
    console.error(`NewsAPI Error: ${error.message}`);
    throw error;
  }
};

export const fetchTrendingNews = async () => {
  try {
    const response = await fetch(
      `${NEWS_API_BASE_URL}/top-headlines?language=en&pageSize=20&apiKey=${process.env.NEWS_API_KEY}`
    );
    const data = await response.json();

    if (data.status !== 'ok') {
      throw new Error(data.message || 'NewsAPI error');
    }

    return data.articles;
  } catch (error) {
    console.error(`NewsAPI Error: ${error.message}`);
    throw error;
  }
};