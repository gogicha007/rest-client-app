'use client';

import React from 'react';
import { RestClient } from '@/components/rest-client';
import styles from './page.module.scss';

interface RestClientLayoutProps {
  params: {
    method: string;
  };
}

const RestClientLayout: React.FC<RestClientLayoutProps> = ({ params }) => {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>REST Client</h1>
      <RestClient initialMethod={params.method} />
    </div>
  );
};

export default RestClientLayout;
