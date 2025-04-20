import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import UrlInput from './UrlInput';
import '@testing-library/jest-dom';

jest.mock('next-intl', () => ({
  useTranslations: () => (key: string) => {
    const translations: Record<string, string> = {
      placeholder: 'placeholder',
    };
    return translations[key] || key;
  },
}));

describe('UrlInput', () => {
  const mockOnChange = jest.fn();

  it('renders and handles URL input', () => {
    render(<UrlInput value="" onChange={mockOnChange} />);

    const input = screen.getByPlaceholderText('placeholder');
    expect(input).toBeInTheDocument();

    fireEvent.change(input, { target: { value: 'https://api.example.com' } });
    expect(mockOnChange).toHaveBeenCalledWith('https://api.example.com');
  });

  it('displays initial value', () => {
    render(<UrlInput value="https://test.com" onChange={mockOnChange} />);
    expect(screen.getByDisplayValue('https://test.com')).toBeInTheDocument();
  });
});
