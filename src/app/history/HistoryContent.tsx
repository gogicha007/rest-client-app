'use client';
import styles from './page.module.css';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getRequestHistory, auth } from '@/utils/firebaseConfig';
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
    const fetchHistory = async () => {
      setLoading(true);
      try {
        const user = auth.currentUser;
        if (user) {
          const userId = user.uid;
          const history = await getRequestHistory(userId);
          setRequestHistory(history);
        } else {
          setError('User not authenticated');
        }
      } catch (err) {
        console.error(err);
        setError('Failed to fetch history');
      } finally {
        setLoading(false);
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
