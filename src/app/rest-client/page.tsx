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

const RestClientPage: React.FC = () => {
  return (
    <div className="container">
      <h1 className="title">REST Client</h1>
      <LazyLoadedRestClient />
    </div>
  );
};

export default RestClientPage;
