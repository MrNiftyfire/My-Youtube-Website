const fetch = require('node-fetch');

exports.handler = async function(event, context) {
  const API_KEY = process.env.YOUTUBE_API_KEY;
  const CHANNEL_ID = 'UC0KdIoPfAh_aKEOcBlexMMw';

  try {
    const response = await fetch(`https://www.googleapis.com/youtube/v3/channels?part=statistics&id=${CHANNEL_ID}&key=${API_KEY}`);
    const data = await response.json();

    const count = data.items[0].statistics.subscriberCount;

    return {
      statusCode: 200,
      headers: {
        'Access-Control-Allow-Origin': '*',
      },
      body: JSON.stringify({ subscriberCount: count }),
    };
  } catch (error) {
    return {
      statusCode: 500,
      body: JSON.stringify({ error: 'Failed to fetch subscriber count' }),
    };
  }
};
