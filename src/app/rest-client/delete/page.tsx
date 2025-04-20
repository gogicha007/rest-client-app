'use client';
import dynamic from 'next/dynamic';
import Loader from '@/components/loader/loader';

const LazyLoadedRestClient = dynamic(
  () =>
    import('@/components/rest-client/RestClient').then((mod) => mod.default),
  {
    ssr: false,
    loading: () => <Loader />,
  }
);

const DeletePage = () => {
  return <LazyLoadedRestClient />;
};

export default DeletePage;
