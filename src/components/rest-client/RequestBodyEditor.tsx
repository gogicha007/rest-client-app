import React, { useState, useEffect } from 'react';
import s from './RestClient.module.scss';

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
      console.log(error);
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
      console.log(error);
    }
  };

  return (
    <div className={s.requestBodyEditor}>
      <div className={s.editorHeader}>
        <h3>Request Body</h3>
        <button onClick={handleFormat} className={`button ${s.formatBtn}`}>
          Format JSON
        </button>
      </div>
      <textarea
        value={formattedValue}
        onChange={(e) => handleChange(e.target.value)}
        className={`${s.requestBody} ${!isValidJson ? s.invalidJson : ''}`}
        placeholder="Enter request body (JSON)"
      />
      {!isValidJson && (
        <div className={s.errorMessage}>Invalid JSON format</div>
      )}
    </div>
  );
};

export default RequestBodyEditor;
