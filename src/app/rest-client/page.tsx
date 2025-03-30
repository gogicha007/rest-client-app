'use client';

import React from 'react';
import { RestClient } from '@/components/rest-client';
import styles from './page.module.scss';

const RestClientPage: React.FC = () => {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>REST Client</h1>
      <RestClient />
    </div>
  );
};

export default RestClientPage;
