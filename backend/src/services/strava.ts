import axios from 'axios';
import { StravaTokenResponse } from '../types';

export async function getAthlete(accessToken: string) {
  const { data } = await axios.get('https://www.strava.com/api/v3/athlete', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return data;
}

export async function getAthleteActivities(accessToken: string, after?: number) {
  const { data } = await axios.get('https://www.strava.com/api/v3/athlete/activities', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    params: {
      after,
    },
  });
  return data;
}

export async function fetchActivitiesFromStrava(access_token: string) {
  const response = await fetch(`https://www.strava.com/api/v3/athlete/activities`, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${access_token}`
    }
  });
  
  const activities = await response.json();
  return activities;
}

export async function exchangeStravaCode(code: string): Promise<StravaTokenResponse> {
  const { data } = await axios.post<StravaTokenResponse>('https://www.strava.com/oauth/token', {
    client_id: process.env.STRAVA_CLIENT_ID,
    client_secret: process.env.STRAVA_CLIENT_SECRET,
    code,
    grant_type: 'authorization_code',
  });

  return data;
}

export async function refreshStravaToken(refreshToken: string): Promise<{
  access_token: string;
  refresh_token: string;
  expires_at: number;
}> {
  const { data } = await axios.post('https://www.strava.com/oauth/token', {
    client_id: process.env.STRAVA_CLIENT_ID,
    client_secret: process.env.STRAVA_CLIENT_SECRET,
    refresh_token: refreshToken,
    grant_type: 'refresh_token',
  });

  return {
    access_token: data.access_token,
    refresh_token: data.refresh_token,
    expires_at: data.expires_at,
  };
}
