import { User, getIdTokenResult } from 'firebase/auth';

export const isTokenExpired = async (user: User | null): Promise<boolean> => {
  if (!user) return true;
  const tokenResult = await getIdTokenResult(user);
  const currentTime = Math.floor(Date.now() / 1000);
  const theDate = new Date(Date.now()).toLocaleString('en-US', {
    timeZone: 'UTC', 
    hour12: false,
  });
  console.log(tokenResult.expirationTime, theDate);
  return tokenResult.expirationTime
    ? currentTime >= new Date(tokenResult.expirationTime).getTime() / 1000
    : true;
};
