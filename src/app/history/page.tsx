'use client';
import dynamic from 'next/dynamic';
import Loader from '@/components/loader/loader';

const LazyLoadedHistoryContent = dynamic(() => import('./HistoryContent'), {
  ssr: false,
  loading: () => <Loader />,
});

const History = () => {
  return <LazyLoadedHistoryContent />;
};

export default History;
