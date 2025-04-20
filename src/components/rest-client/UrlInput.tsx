import React from 'react';
import s from './RestClient.module.scss';
import { useTranslations } from 'next-intl';

interface UrlInputProps {
  value: string;
  onChange: (url: string) => void;
}

const UrlInput: React.FC<UrlInputProps> = ({ value, onChange }) => {
  const t = useTranslations('RestClient.url');

  return (
    <div className={s.urlInputContainer}>
      <input
        type="text"
        className={s.urlInput}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={t('placeholder')}
      />
    </div>
  );
};

export default UrlInput;
