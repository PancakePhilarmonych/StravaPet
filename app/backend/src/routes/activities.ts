import { Router } from 'express';
import axios from 'axios';

const router = Router();

router.get('/', async (req, res) => {
  const accessToken = req.headers.authorization?.split(' ')[1];

  const result = await axios.get('https://www.strava.com/api/v3/athlete/activities', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });

  res.json(result.data);
});

export default router;