import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import HeadersEditor from './HeadersEditor';
import '@testing-library/jest-dom';

describe('HeadersEditor', () => {
  const mockOnChange = jest.fn();
  const initialHeaders = {
    'Content-Type': 'application/json',
    Authorization: 'Bearer token123',
  };

  it('renders and handles headers', () => {
    render(<HeadersEditor headers={initialHeaders} onChange={mockOnChange} />);

    expect(screen.getByDisplayValue('Content-Type')).toBeInTheDocument();
    expect(screen.getByDisplayValue('application/json')).toBeInTheDocument();

    const keyInput = screen.getByPlaceholderText('Header name');
    const valueInput = screen.getByPlaceholderText('Header value');
    const addButton = screen.getByRole('button', { name: /add header/i });

    fireEvent.change(keyInput, { target: { value: 'X-Test' } });
    fireEvent.change(valueInput, { target: { value: 'test-value' } });
    fireEvent.click(addButton);

    expect(mockOnChange).toHaveBeenCalled();
  });

  it('handles header removal', () => {
    render(<HeadersEditor headers={initialHeaders} onChange={mockOnChange} />);

    const removeButtons = screen.getAllByRole('button', { name: /remove/i });
    fireEvent.click(removeButtons[0]);

    expect(mockOnChange).toHaveBeenCalled();
  });
});
