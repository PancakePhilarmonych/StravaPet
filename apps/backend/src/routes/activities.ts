import { Router } from 'express';
import axios from 'axios';

const router = Router();

router.get('/', async (req, res) => {
  const accessToken = req.headers.authorization?.split(' ')[1];

  try {
    const result = await axios.get('https://www.strava.com/api/v3/athlete/activities', {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    res.json(result.data);
  } catch (error) {
    console.log('Error fetching activities');
    res.status(500).json({ error: 'Failed to fetch activities' });
  }
});

export default router;