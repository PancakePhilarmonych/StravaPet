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

router.get('/strava/redirect', (req, res) => {
  const redirectUri = req.query.redirect_uri;
  const clientId = process.env.STRAVA_CLIENT_ID;

  const stravaAuthUrl = `https://www.strava.com/oauth/authorize?client_id=${clientId}&response_type=code&redirect_uri=${redirectUri}&scope=activity:read_all,read&approval_prompt=auto`;

  res.json({ url: stravaAuthUrl });
});

export default router;