import supabase from "../supabase";

function calculateCoins(distanceInMeters: number, timeInSeconds: number): number {
  const distanceKm = distanceInMeters / 1000;
  const timeMinutes = timeInSeconds / 60;

  const baseCoinPerKm = 10; 
  const timeBonusRate = 0.5;

  const coinsFromDistance = baseCoinPerKm * distanceKm;
  const coinsFromTime = timeBonusRate * timeMinutes;

  const totalCoins = Math.round(coinsFromDistance + coinsFromTime);
  return totalCoins;
}

export function fetchActivitiesFromStrava(access_token: number) {
  fetch(`https://www.strava.com/api/v3/athlete`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${access_token}`
    }
  })
    .then(response => response.json())
    .then(activities => {
      console.log('[activities]');
      });
}

export async function fetchUsers(): Promise<{
    id: any;
    email: any;
    avatar_url: any;
    access_token: any;
    refresh_token: any;
    token_expires_at: any;
}[] | null> {
  const data = await supabase.from('users')
    .select('id, email, avatar_url, access_token, refresh_token, token_expires_at');

  return data.data
}

export async function addCoins() {
  const users = await fetchUsers();

  users?.forEach(async (user) => {
    const activities = await supabase.from('activities')
      .select('distance, duration')
      .eq('user_id', user.id)
      .filter('date', 'gte', new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString());
    
      const totalDistance = activities.data?.reduce((sum, activity) => sum + activity.distance, 0) || 0;
      const totalDuration = activities.data?.reduce((sum, activity) => sum + activity.duration, 0) || 0;

    const currentCoins = await supabase.from('coins')
      .select('total, updated_at')
      .eq('user_id', user.id)
      .single();
    console.log('[currentCoins]', currentCoins.data?.total);
    
    if (currentCoins.data?.updated_at) {
      const lastUpdate = new Date(currentCoins.data.updated_at);
      const timeDiffInMinutes = (Date.now() - lastUpdate.getTime()) / (1000 * 30);
      
      if (timeDiffInMinutes < 1) {
        console.log(`Skipping user ${user.id} due to recent update.`);
        return;
      }
    }

    const newTotal = (currentCoins.data?.total || 0) + calculateCoins(totalDistance, totalDuration);
    console.log(`Updating coins for user ${user.id}: ${newTotal} coins`);

    await supabase.from('coins')
      .update({
        total: newTotal,
        updated_at: new Date().toISOString(),
      })
      .eq('user_id', user.id);
  })
}

export async function updateActivities() {
  const users = await fetchUsers();

  users?.forEach(async (user) => {
    fetchActivitiesFromStrava(user.access_token)
  });
}