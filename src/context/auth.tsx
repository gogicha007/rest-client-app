'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import { onAuthStateChanged, User } from 'firebase/auth';
import { auth } from '@/utils/firebaseConfig';
import { isTokenExpired } from '@/utils/authUtils';
import { useRouter, usePathname } from 'next/navigation';
import { logout } from '@/utils/firebaseConfig';
import { setCookie } from 'nookies';

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
  const [redirected, setRedirected] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const expired = await isTokenExpired(user);
        if (!expired) {
          setCurrentUser(user);
          const token = await user.getIdToken();
          setCookie(null, 'authToken', token, {
            path: '/',
            maxAge: 60 * 60 * 24,
          });
        } else {
          await logout();
          setCurrentUser(null);
          if (!redirected) {
            router.push('/');
            setRedirected(true);
          }
        }
      } else {
        setCurrentUser(null);
      }
      setLoading(false);
    });
    return () => unsubscribe();
  }, [router, redirected]);

  useEffect(() => {
    const checkTokenOnRouteChange = async () => {
      if (currentUser) {
        const expired = await isTokenExpired(currentUser);
        if (expired) {
          await logout();
          setCurrentUser(null);
          if (!redirected) {
            console.log('router.push("/") called in checkTokenOnRouteChange');
            router.push('/');
            setRedirected(true);
          }
        }
      }
    };
    checkTokenOnRouteChange();
  }, [pathname, currentUser, router, redirected]);

  return (
    <AuthContext.Provider value={{ currentUser, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
