import React from 'react';
import s from './RestClient.module.scss';

interface UrlInputProps {
  value: string;
  onChange: (url: string) => void;
}

const UrlInput: React.FC<UrlInputProps> = ({ value, onChange }) => {
  return (
    <div className={s.urlInputContainer}>
      <input
        type="text"
        className={s.urlInput}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Enter endpoint URL"
      />
    </div>
  );
};

export default UrlInput;
