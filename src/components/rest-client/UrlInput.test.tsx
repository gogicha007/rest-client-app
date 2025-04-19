import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import UrlInput from './UrlInput';
import '@testing-library/jest-dom';

describe('UrlInput', () => {
  const mockOnChange = jest.fn();

  it('renders and handles URL input', () => {
    render(<UrlInput value="" onChange={mockOnChange} />);

    const input = screen.getByPlaceholderText('Enter endpoint URL');
    expect(input).toBeInTheDocument();

    fireEvent.change(input, { target: { value: 'https://api.example.com' } });
    expect(mockOnChange).toHaveBeenCalledWith('https://api.example.com');
  });

  it('displays initial value', () => {
    render(<UrlInput value="https://test.com" onChange={mockOnChange} />);
    expect(screen.getByDisplayValue('https://test.com')).toBeInTheDocument();
  });
});
