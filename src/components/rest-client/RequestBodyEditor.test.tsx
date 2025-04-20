import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import RequestBodyEditor from './RequestBodyEditor';
import '@testing-library/jest-dom';

jest.mock('next-intl', () => ({
  useTranslations: () => (key: string) => key,
}));

describe('RequestBodyEditor', () => {
  const mockOnChange = jest.fn();
  const initialValue = '{"key": "value"}';

  it('renders and handles body input', () => {
    render(<RequestBodyEditor value={initialValue} onChange={mockOnChange} />);

    const textarea = screen.getByRole('textbox');
    expect(textarea).toBeInTheDocument();

    fireEvent.change(textarea, { target: { value: '{"new": "value"}' } });
    expect(mockOnChange).toHaveBeenCalledWith('{"new": "value"}');
  });

  it('handles JSON formatting', () => {
    render(<RequestBodyEditor value={initialValue} onChange={mockOnChange} />);

    const formatButton = screen.getByText('format_button');
    fireEvent.click(formatButton);

    expect(mockOnChange).toHaveBeenCalled();
  });

  it('does not show error for invalid JSON until blur', () => {
    render(
      <RequestBodyEditor value="{invalid json}" onChange={mockOnChange} />
    );
    expect(screen.queryByText('error_message')).not.toBeInTheDocument();

    const textarea = screen.getByRole('textbox');
    fireEvent.blur(textarea);
    expect(screen.getByText('error_message')).toBeInTheDocument();
  });

  it('shows error when format button is clicked with invalid JSON', () => {
    render(
      <RequestBodyEditor value="{invalid json}" onChange={mockOnChange} />
    );

    const formatButton = screen.getByText('format_button');
    fireEvent.click(formatButton);

    expect(screen.getByText('error_message')).toBeInTheDocument();
  });
});
