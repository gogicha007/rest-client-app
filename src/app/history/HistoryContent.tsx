'use client';
import styles from './page.module.css';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getRequestHistory, auth } from '@/utils/firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import Loader from '@/components/loader/loader';
import { RequestDataWithLink } from '@/types/request';

const HistoryContent = () => {
  const [requestHistory, setRequestHistory] = useState<RequestDataWithLink[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  useEffect(() => {
    const fetchHistory = async (userId: string) => {
      setLoading(true);
      try {
        const history = await getRequestHistory(userId);
        setRequestHistory(history);
      } catch (err) {
        console.error(err);
        setError('Failed to fetch history');
      } finally {
        setLoading(false);
      }
    };

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        fetchHistory(user.uid);
      } else {
        setError('User not authenticated');
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div className={styles.history}>
      <h1>History</h1>
      {requestHistory.length === 0 ? (
        <div>
          <p>No request history found.</p>
        </div>
      ) : (
        <ul>
          {requestHistory.map((request, index) => (
            <li key={index}>
              <a href={request.link}>
                {request.url} <br />
              </a>
            </li>
          ))}
        </ul>
      )}
      <button className="button" onClick={() => router.push('/')}>
        back to main
      </button>
    </div>
  );
};

export default HistoryContent;
