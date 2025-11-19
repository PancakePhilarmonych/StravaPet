export interface StravaAthlete {
  id: number;
  username: string;
  firstname: string;
  lastname: string;
  email: string;
  profile: string;
  city: string;
  state: string;
  country: string;
  sex: string;
  created_at: string;
  updated_at: string;
}

export interface StravaTokenResponse {
  token_type: string;
  expires_at: number;
  expires_in: number;
  refresh_token: string;
  access_token: string;
  athlete: StravaAthlete;
}

// Типы для базы данных
export interface User {
  id: number;
  email: string;
  avatar_url: string;
  created_at: string;
  updated_at?: string;
  access_token: string;
  refresh_token: string;
  token_expires_at: string;
}

export interface Coins {
  total: number;
  updated_at: string;
  user_id: number;
}