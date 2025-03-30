import { User, getIdTokenResult } from 'firebase/auth';

export const isTokenExpired = async (user: User | null): Promise<boolean> => {
  if (!user) return true;
  const tokenResult = await getIdTokenResult(user);
  const currentTime = Math.floor(Date.now() / 1000);
  return tokenResult.expirationTime
    ? currentTime >= new Date(tokenResult.expirationTime).getTime() / 1000
    : true;
};
