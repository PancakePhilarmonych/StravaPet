import { Router } from 'express';
import { randomBytes } from 'crypto';
import { findUserById, createUser, updateUserTokens } from '../services/supabase/supabase';
import { exchangeStravaCode } from '../services/strava';

const router = Router();

router.post('/strava', async (req, res) => {
  const { code } = req.body;

  try {
    const { access_token, refresh_token, expires_at, athlete } = await exchangeStravaCode(code);
    
    const sessionToken = randomBytes(32).toString('hex');
    const tokenData = {
      access_token,
      refresh_token,
      token_expires_at: new Date(expires_at * 1000).toISOString(),
      session_token: sessionToken,
    };

    const existingUser = await findUserById(athlete.id);

    try {
      if (existingUser) {
        await updateUserTokens(athlete.id, tokenData);
      } else {
        await createUser({
          id: athlete.id,
          ...tokenData,
        });
      }
    } catch (error) {
      console.error('Ошибка при работе с пользователем:', error);
      return res.status(500).json({ error: 'Failed to save user data' });
    }

    res.json({
      session_token: sessionToken,
      user_id: athlete.id,
    });

  } catch (error) {
    console.error('Error exchanging code with Strava:', error);
    
    res.status(500).json({
      error: 'Failed to fetch activities from Strava',
    });
  }
});

router.get('/strava/redirect', (req, res) => {
  const redirectUri = req.query.redirect_uri;
  const clientId = process.env.STRAVA_CLIENT_ID;

  const stravaAuthUrl = `https://www.strava.com/oauth/authorize?client_id=${clientId}&response_type=code&redirect_uri=${redirectUri}&scope=activity:read_all,read&approval_prompt=force`;

  res.json({ url: stravaAuthUrl });
});

export default router;