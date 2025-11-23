import { Request, Response, NextFunction } from 'express';
import { User } from '../types';
import { refreshStravaToken } from '../services/strava';
import { findUserBySessionToken, refreshUserTokens } from '../services/supabase/supabase';

export interface AuthRequest extends Request {
  user?: User;
}

export const authenticateSession = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction
) => {
  const sessionToken = req.headers.authorization?.replace('Bearer ', '');

  if (!sessionToken) {
    return res.status(401).json({ error: 'No session token provided' });
  }

  try {
    const user = await findUserBySessionToken(sessionToken);

    if (!user) {
      return res.status(401).json({ error: 'Invalid session token' });
    }

    const expiresAt = new Date(user.token_expires_at);
    const now = new Date();

    if (expiresAt.getTime() - now.getTime() < 5 * 60 * 1000) {
      const tokens = await refreshStravaToken(user.refresh_token);
      await refreshUserTokens(user.id, tokens);

      user.access_token = tokens.access_token;
      user.refresh_token = tokens.refresh_token;
      user.token_expires_at = new Date(tokens.expires_at * 1000).toISOString();
    }

    req.user = user as User;
    next();
  } catch (error) {
    return res.status(500).json({ error: 'Authentication failed' });
  }
};
