'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, User, getIdTokenResult } from 'firebase/auth';
import { auth } from '@/lib/firebaseConfig';

export const AuthContext = createContext<{
  currentUser: User | null;
}>({
  currentUser: null,
});

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const isTokenExpired = async (user: User | null): Promise<boolean> => {
    if (!user) return true;
    const tokenResult = await getIdTokenResult(user);
    const currentTime = Math.floor(Date.now() / 1000);
    return tokenResult.expirationTime
      ? currentTime >= new Date(tokenResult.expirationTime).getTime() / 1000
      : true;
  };

  useEffect(() => {
    onAuthStateChanged(auth, async (user) => {
      console.log('context user', user);
      if (user) {
        const expired = await isTokenExpired(user);
        if (!expired) {
          setCurrentUser(user);
        } else {
          console.log('Token expired');
          setCurrentUser(null);
        }
      } else {
        setCurrentUser(null);
      }
    });
  }, []);

  return (
    <AuthContext.Provider value={{ currentUser }}>
      {children}
    </AuthContext.Provider>
  );
};
