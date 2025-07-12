import { Router } from 'express';
import axios from 'axios';
import supabase from '../supabase';
import { StravaTokenResponse } from '../types';

const router = Router();

router.post('/strava', async (req, res) => {
  const { code } = req.body;

  try {
    const response = await axios.post<StravaTokenResponse>('https://www.strava.com/oauth/token', {
      client_id: process.env.STRAVA_CLIENT_ID,
      client_secret: process.env.STRAVA_CLIENT_SECRET,
      code,
      grant_type: 'authorization_code',
    });

    const { access_token, athlete } = response.data;

    const { error: supabaseError } = await supabase.from('users').upsert({
      id: athlete.id,
      email: athlete.email,
      avatar_url: athlete.profile,
      created_at: new Date().toISOString(),
    });

    if (supabaseError) {
      console.error('Ошибка при сохранении пользователя в Supabase:', supabaseError);
    }

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