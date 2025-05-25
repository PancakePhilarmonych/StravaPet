import { Router } from 'express';
import axios from 'axios';

const router = Router();

router.post('/strava', async (req, res) => {
  const { code } = req.body;

  try {
    const response = await axios.post('https://www.strava.com/oauth/token', {
      client_id: process.env.STRAVA_CLIENT_ID,
      client_secret: process.env.STRAVA_CLIENT_SECRET,
      code,
      grant_type: 'authorization_code',
    })

    res.json(response.data);

  } catch (error) {
    res.status(500).json({
      error: 'Failed to fetch activities from Strava',
    });
  }
});

export default router;