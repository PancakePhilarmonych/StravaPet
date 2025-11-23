import express from 'express';
import supabase from '../services/supabase/client';
import { getAthlete, getAthleteActivities } from '../services/strava';

const router = express.Router();

router.get('/', async (req, res) => {
  const accessToken = req.headers.authorization?.split(' ')[1];

  if (!accessToken) {
    return res.status(401).json({ error: 'No access token provided' });
  }

  try {
    const athlete = await getAthlete(accessToken);
    const after = Math.floor(Date.now() / 1000) - 90 * 24 * 60 * 60;
    const allActivities = await getAthleteActivities(accessToken, after);
    const activities = allActivities.filter((activity: any) => activity.sport_type === 'Run');

    for (const activity of activities) {
      const { error } = await supabase
        .from('activities')
        .upsert({
          id: Number(activity.id),
          user_id: athlete.id,
          distance: activity.distance,
          duration: activity.moving_time,
          date: activity.start_date,
        });

      if (error) {
        console.error(`Failed to save activity ${activity.id}`, error.message);
      }
    }

    res.json(activities);
  } catch (error) {
    console.log('Error fetching activities', error);
    res.status(500).json({ error: 'Failed to fetch activities' });
  }
});

export default router;
