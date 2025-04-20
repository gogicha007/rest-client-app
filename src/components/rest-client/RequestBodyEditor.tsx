'use client';

import React, { useState, useEffect, useCallback } from 'react';
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
  const [showError, setShowError] = useState(false);
  const [formattedValue, setFormattedValue] = useState(value);
  const t = useTranslations('RestClient.requestBody');

  const validateJson = useCallback(
    (jsonString: string, shouldShowError: boolean) => {
      try {
        if (jsonString) {
          JSON.parse(jsonString);
          setIsValidJson(true);
        } else {
          setIsValidJson(true);
        }
      } catch (error) {
        setIsValidJson(false);
        console.error('Error parsing JSON:', error);
      }
      setShowError(shouldShowError && !isValidJson);
    },
    [isValidJson]
  );

  useEffect(() => {
    setFormattedValue(value);
    validateJson(value, false);
  }, [value, validateJson]);

  const handleChange = (newValue: string) => {
    setFormattedValue(newValue);
    onChange(newValue);
  };

  const handleBlur = () => {
    validateJson(formattedValue, true);
  };

  const handleFormat = () => {
    try {
      const parsed = JSON.parse(formattedValue);
      const formatted = JSON.stringify(parsed, null, 2);
      setFormattedValue(formatted);
      onChange(formatted);
      setIsValidJson(true);
      setShowError(false);
    } catch (error) {
      setIsValidJson(false);
      setShowError(true);
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
        onBlur={handleBlur}
        className={`${s.requestBody} ${showError ? s.invalidJson : ''}`}
        placeholder={t('placeholder')}
      />
      {showError && <div className={s.errorMessage}>{t('error_message')}</div>}
    </div>
  );
};

export default RequestBodyEditor;
