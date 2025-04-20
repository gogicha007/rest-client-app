'use client';

import React, { useState, useEffect } from 'react';
import s from './RestClient.module.scss';
import { useTranslations } from 'next-intl';

interface RequestBodyEditorProps {
  value: string;
  onChange: (value: string) => void;
}

const RequestBodyEditor: React.FC<RequestBodyEditorProps> = ({
  value,
  onChange,
}) => {
  const [isValidJson, setIsValidJson] = useState(true);
  const [formattedValue, setFormattedValue] = useState(value);
  const t = useTranslations('RestClient.requestBody');

  useEffect(() => {
    setFormattedValue(value);
    try {
      if (value) {
        JSON.parse(value);
        setIsValidJson(true);
      } else {
        setIsValidJson(true);
      }
    } catch (error) {
      setIsValidJson(false);
      console.error('Error parsing JSON:', error);
    }
  }, [value]);

  const handleChange = (newValue: string) => {
    setFormattedValue(newValue);
    onChange(newValue);
  };

  const handleFormat = () => {
    try {
      const parsed = JSON.parse(formattedValue);
      const formatted = JSON.stringify(parsed, null, 2);
      setFormattedValue(formatted);
      onChange(formatted);
      setIsValidJson(true);
    } catch (error) {
      setIsValidJson(false);
      console.error('Error formatting JSON:', error);
    }
  };

  return (
    <div className={s.requestBodyEditor}>
      <div className={s.editorHeader}>
        <h3>{t('title')}</h3>
        <button onClick={handleFormat} className={`button ${s.formatBtn}`}>
          {t('format_button')}
        </button>
      </div>
      <textarea
        value={formattedValue}
        onChange={(e) => handleChange(e.target.value)}
        className={`${s.requestBody} ${!isValidJson ? s.invalidJson : ''}`}
        placeholder={t('placeholder')}
      />
      {!isValidJson && (
        <div className={s.errorMessage}>{t('error_message')}</div>
      )}
    </div>
  );
};

export default RequestBodyEditor;
