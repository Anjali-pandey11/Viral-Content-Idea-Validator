const platformConfig = {
  Instagram: {
    maxHashtags: 30,
    recommendedHashtags: 10,
    maxVideoDuration: '90 seconds',
    contentTypes: ['Reels', 'Carousels', 'Stories', 'Static Posts'],
  },
  YouTube: {
    maxHashtags: 15,
    recommendedHashtags: 5,
    maxVideoDuration: 'No limit',
    contentTypes: ['Long Form', 'Shorts', 'Live', 'Tutorials'],
  },
  LinkedIn: {
    maxHashtags: 5,
    recommendedHashtags: 3,
    maxVideoDuration: '10 minutes',
    contentTypes: ['Text Posts', 'Carousels', 'Articles', 'Polls'],
  },
  'Twitter/X': {
    maxHashtags: 2,
    recommendedHashtags: 1,
    maxVideoDuration: '2 minutes 20 seconds',
    contentTypes: ['Threads', 'Tweets', 'Spaces', 'Polls'],
  },
};

export default platformConfig;