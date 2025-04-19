'use client';

import React, { useState } from 'react';
import s from './RestClient.module.scss';

interface HeadersEditorProps {
  headers: Record<string, string>;
  onChange: (headers: Record<string, string>) => void;
}

const HeadersEditor: React.FC<HeadersEditorProps> = ({ headers, onChange }) => {
  const [newKey, setNewKey] = useState('');
  const [newValue, setNewValue] = useState('');

  const handleAddHeader = () => {
    if (newKey && newValue) {
      onChange({
        ...headers,
        [newKey]: newValue,
      });
      setNewKey('');
      setNewValue('');
    }
  };

  const handleRemoveHeader = (key: string) => {
    const newHeaders = { ...headers };
    delete newHeaders[key];
    onChange(newHeaders);
  };

  const handleUpdateHeader = (
    oldKey: string,
    newKey: string,
    value: string
  ) => {
    const newHeaders = { ...headers };
    delete newHeaders[oldKey];
    newHeaders[newKey] = value;
    onChange(newHeaders);
  };

  return (
    <div className={s.headersEditor}>
      <h3>Headers</h3>
      <div className={s.headersList}>
        {Object.entries(headers).map(([key, value]) => (
          <div key={key} className={s.headerRow}>
            <input
              type="text"
              value={key}
              onChange={(e) => handleUpdateHeader(key, e.target.value, value)}
              className={s.headerKey}
            />
            <input
              type="text"
              value={value}
              onChange={(e) => handleUpdateHeader(key, key, e.target.value)}
              className={s.headerValue}
            />
            <button
              onClick={() => handleRemoveHeader(key)}
              className={`button ${s.removeHeader}`}
            >
              Remove
            </button>
          </div>
        ))}
      </div>
      <div className={s.addHeader}>
        <input
          type="text"
          value={newKey}
          onChange={(e) => setNewKey(e.target.value)}
          placeholder="Header name"
          className={s.headerKey}
        />
        <input
          type="text"
          value={newValue}
          onChange={(e) => setNewValue(e.target.value)}
          placeholder="Header value"
          className={s.headerValue}
        />
        <button
          onClick={handleAddHeader}
          className={`button ${s.addHeaderBtn}`}
        >
          Add Header
        </button>
      </div>
    </div>
  );
};

export default HeadersEditor;
