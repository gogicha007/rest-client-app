'use client';
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
      try {
        onAuthStateChanged(auth, async (user) => {
          console.log('history user', user?.uid);
          if (user) {
            const userId = user.uid;
            const history = await getRequestHistory(userId);
            console.log('history', history);
            setRequestHistory(history);
          } else {
            setError('User not authenticated');
          }
          setLoading(false);
        });
      } catch (err) {
        console.log(err);
        setError('Failed to fetch history');
      }
      setLoading(false);
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
    <>
      <div>History</div>
      {requestHistory.length === 0 ? (
        <div>No request history found</div>
      ) : (
        <ul>
          {requestHistory.map((request, index) => (
            <li key={index}>
              <strong>URL:</strong>
              {request.url} <br />
            </li>
          ))}
        </ul>
      )}
      <button onClick={() => router.push('/')}>back to main</button>
    </>
  );
};

export default History;
