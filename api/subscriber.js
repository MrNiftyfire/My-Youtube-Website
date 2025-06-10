export default async function handler(req, res) {
  const API_KEY = process.env.YOUTUBE_API_KEY;
  const CHANNEL_ID = 'UC0KdIoPfAh_aKEOcBlexMMw';

  try {
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/channels?part=statistics&id=${CHANNEL_ID}&key=${API_KEY}`
    );
    const data = await response.json();
    const count = data.items[0].statistics.subscriberCount;
    res.status(200).json({ subscriberCount: count });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch subscriber count' });
  }
}