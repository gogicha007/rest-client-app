'use client';

import React from 'react';
import { RestClient } from '@/components/rest-client';

const RestClientLayout: React.FC = () => {
  return (
    <div className="container">
      <h1 className="title">REST Client</h1>
      <RestClient />
    </div>
  );
};

export default RestClientLayout;
