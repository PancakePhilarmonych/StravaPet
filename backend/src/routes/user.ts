import { Router } from 'express';
import axios from 'axios';
import supabase from '../services/supabase/client';

const router = Router();

router.get('/', async (req, res) => {
  const accessToken = req.headers.authorization?.split(' ')[1];

  if (!accessToken) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const { data } = await supabase.from('users').select('avatar_url, lastName, firstName, id').eq('access_token', accessToken).single();
    const { data: coinsData  } = await supabase.from('coins').select('total, updated_at').eq('user_id', data?.id).single();

    console.log('User data fetched:', data, 'Coins data:', coinsData?.total);

    return res.json({ ...data, ...{ totalCoins: coinsData?.total, coinsUpdatedTime: coinsData?.updated_at} })
  }

  catch (error) {
    console.error('Error fetching user data:', error);
    return res.status(500).json({ error: 'Internal Server Error' });
  }
});

export default router;