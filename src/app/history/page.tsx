'use client';
import styles from './page.module.css';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getRequestHistory, auth } from '@/utils/firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import Loader from '@/components/loader/loader';
import { RequestData } from '@/types/request';

const History = () => {
  const [requestHistory, setRequestHistory] = useState<RequestData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();

  useEffect(() => {
    const fetchHistory = async () => {
      setLoading(true);
      try {
        onAuthStateChanged(auth, async (user) => {
          if (user) {
            const userId = user.uid;
            const history = await getRequestHistory(userId);
            setRequestHistory(history);
          } else {
            setError('User not authenticated');
          }
          setLoading(false);
        });
        return () => {
          const unsubscribeAuth = onAuthStateChanged(auth, () => {});
          unsubscribeAuth();
        };
      } catch (err) {
        console.log(err);
        setError('Failed to fetch history');
      }
    };
    fetchHistory();
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
              <a href="#">
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

export default History;
