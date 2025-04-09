'use client';
import dynamic from 'next/dynamic';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { auth } from '@/utils/firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import Loader from '@/components/loader/loader';

const LazyLoadedHistoryContent = dynamic(() => import('./HistoryContent'), {
  ssr: false,
  loading: () => <Loader />,
});

const History = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  useEffect(() => {
    const checkAuth = () => {
      setLoading(true);
      onAuthStateChanged(auth, (user) => {
        if (user) {
          setIsAuthenticated(true);
        } else {
          setError('User not authenticated');
        }
        setLoading(false);
      });
    };
    checkAuth();
  }, []);

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return (
      <div>
        <p>{error}</p>
        <button className="button" onClick={() => router.push('/')}>
          back to main
        </button>
      </div>
    );
  }

  return isAuthenticated ? <LazyLoadedHistoryContent /> : null;
};

export default History;
