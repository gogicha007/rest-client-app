'use client';
import dynamic from 'next/dynamic';
import Loader from '@/components/loader/loader';

const LazyLoadedVariables = dynamic(
  () => import('@/components/variables/Variables'),
  {
    ssr: false,
    loading: () => <Loader />,
  }
);

const VariablesPage = () => {
  return <LazyLoadedVariables />;
};

export default VariablesPage;
