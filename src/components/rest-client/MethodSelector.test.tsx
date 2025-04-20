import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import MethodSelector from './MethodSelector';
import '@testing-library/jest-dom';

jest.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}));

describe('MethodSelector', () => {
  const mockOnChange = jest.fn();

  it('renders and handles method selection', () => {
    render(<MethodSelector value="GET" onChange={mockOnChange} />);

    const select = screen.getByRole('combobox');
    expect(select).toBeInTheDocument();

    fireEvent.change(select, { target: { value: 'POST' } });
    expect(mockOnChange).toHaveBeenCalledWith('POST');
  });

  it('displays all HTTP methods', () => {
    render(<MethodSelector value="GET" onChange={mockOnChange} />);

    const options = screen.getAllByRole('option');
    expect(options).toHaveLength(8);
    expect(screen.getByText('GET')).toBeInTheDocument();
    expect(screen.getByText('POST')).toBeInTheDocument();
  });
});
