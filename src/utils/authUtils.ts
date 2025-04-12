import { User, getIdTokenResult } from 'firebase/auth';
import { setCookie } from 'nookies';

export const isTokenExpired = async (user: User | null): Promise<boolean> => {
  if (!user) return true;
  const tokenResult = await getIdTokenResult(user);
  const currentTime = Math.floor(Date.now() / 1000);
  return tokenResult.expirationTime
    ? currentTime >= new Date(tokenResult.expirationTime).getTime() / 1000
    : true;
};

export const handleToken = async (user: User | null) => {
  if (!user) return { valid: false, token: null };

  const expired = await isTokenExpired(user);
  if (expired) {
    return { valid: false, token: null };
  }

  const token = await user.getIdToken();
  setCookie(null, 'authToken', token, {
    path: '/',
    maxAge: 60 * 60 * 24, // 1 day
  });

  return { valid: true, token };
};