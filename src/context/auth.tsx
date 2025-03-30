'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@/utils/firebaseConfig';
import { isTokenExpired } from '@/utils/authUtils';
import { useRouter } from 'next/navigation';
import { logout } from '@/utils/firebaseConfig';

export const AuthContext = createContext<{
  currentUser: User | null;
  loading: boolean;
}>({
  currentUser: null,
  loading: true,
});

export const useAuth = () => {
  return useContext(AuthContext);
};

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      console.log('context user', user);
      if (user) {
        const expired = await isTokenExpired(user);
        if (!expired) {
          setCurrentUser(user);
        } else {
          console.log('token expired');
          await logout();
          setCurrentUser(null);
          router.push('/');
        }
      } else {
        setCurrentUser(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [router]);

  return (
    <AuthContext.Provider value={{ currentUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
