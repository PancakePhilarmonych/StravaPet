import supabase from '../supabase/client';

export async function findUserById(userId: number) {
  const { data } = await supabase
    .from('users')
    .select('id')
    .eq('id', userId)
    .single();

  return data;
}

export async function createUser(data: {
  id: number;
  access_token: string;
  refresh_token: string;
  token_expires_at: string;
  session_token: string;
}) {
  const { error } = await supabase.from('users').insert({
    ...data,
    created_at: new Date().toISOString(),
  });

  if (error) throw error;
}

export async function updateUserTokens(
  userId: number,
  data: {
    access_token: string;
    refresh_token: string;
    token_expires_at: string;
    session_token: string;
  }
) {
  const { error } = await supabase
    .from('users')
    .update(data)
    .eq('id', userId);

  if (error) throw error;
}

export async function findUserBySessionToken(sessionToken: string) {
  const { data, error } = await supabase
    .from('users')
    .select('*')
    .eq('session_token', sessionToken)
    .single();

  if (error || !data) return null;
  return data;
}

export async function refreshUserTokens(
  userId: number,
  tokens: {
    access_token: string;
    refresh_token: string;
    expires_at: number;
  }
) {
  const { error } = await supabase
    .from('users')
    .update({
      access_token: tokens.access_token,
      refresh_token: tokens.refresh_token,
      token_expires_at: new Date(tokens.expires_at * 1000).toISOString(),
    })
    .eq('id', userId);

  if (error) throw error;
}
