'use client';

import React from 'react';

const RestClientLayout: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <div className="container">
      <h1 className="title">REST Client</h1>
      {children}
    </div>
  );
};

export default RestClientLayout;
