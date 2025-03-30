import React from 'react';
import s from './RestClient.module.scss';

interface MethodSelectorProps {
  value: string;
  onChange: (method: string) => void;
}

const HTTP_METHODS = [
  'GET',
  'POST',
  'PUT',
  'DELETE',
  'PATCH',
  'HEAD',
  'OPTIONS',
  'TRACE',
];

const MethodSelector: React.FC<MethodSelectorProps> = ({ value, onChange }) => {
  const handleMethodChange = (method: string) => {
    onChange(method);
  };

  return (
    <select
      className={s.methodSelector}
      value={value}
      onChange={(e) => handleMethodChange(e.target.value)}
    >
      {HTTP_METHODS.map((method) => (
        <option key={method} value={method}>
          {method}
        </option>
      ))}
    </select>
  );
};

export default MethodSelector;
