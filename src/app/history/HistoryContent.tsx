'use client';
import styles from './page.module.css';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { getRequestHistory, auth } from '@/utils/firebaseConfig';
import { onAuthStateChanged } from 'firebase/auth';
import Loader from '@/components/loader/loader';
import { RequestDataWithLink } from '@/types/request';
import { handleError } from '@/utils/errorHandler';
import { useTranslations } from 'next-intl';

const HistoryContent = () => {
  const [requestHistory, setRequestHistory] = useState<RequestDataWithLink[]>(
    []
  );
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const tHist = useTranslations('HistoryPage');
  const tBtn = useTranslations('Buttons');
  const router = useRouter();

  useEffect(() => {
    const fetchHistory = async (userId: string) => {
      // if (!loading) setLoading(true);
      try {
        const history = await getRequestHistory(userId);
        setRequestHistory(history);
      } catch (err) {
        const error = handleError(err);
        if (error.type === 'application') {
          setError(error.message);
        } else {
          setError(`HTTP Error: ${error.message}`);
        }
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

    return () => {
      if (typeof unsubscribe === 'function') {
        unsubscribe();
      }
    };
  }, []);

  if (loading) {
    return <Loader />;
  }

  if (error) {
    return (
      <div>
        <h2>{error}</h2>
        <button className="button" onClick={() => router.push('/')}>
          {tBtn('toMain')}
        </button>
      </div>
    );
  }

  return (
    <div className={styles.history}>
      <h1>{tHist('title')}</h1>
      {requestHistory.length === 0 ? (
        <div>
          <p>{tHist('noHistoryFound')}</p>
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
        {tBtn('toMain')}
      </button>
    </div>
  );
};

export default HistoryContent;
