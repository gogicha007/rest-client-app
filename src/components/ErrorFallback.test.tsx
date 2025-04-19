import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import ErrorFallback from './ErrorFallback';
import { useRouter } from 'next/navigation';
import { handleError } from '@/utils/errorHandler';

jest.mock('next-intl', () => ({
  useTranslations: jest.fn().mockImplementation(() => (key: string) => key),
}));

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

jest.mock('@/utils/errorHandler', () => ({
  handleError: jest.fn((err) => err),
}));

describe('ErrorFallback', () => {
  const error = new Error('Test error');

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders with reset function and calls reset on button click', () => {
    const reset = jest.fn();
    render(
      <ErrorFallback
        error={error}
        reset={reset}
        header="Something went wrong"
      />
    );

    expect(screen.getByText('Something went wrong')).toBeInTheDocument();
    expect(screen.getByText('Test error')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button'));
    expect(reset).toHaveBeenCalledTimes(1);
  });

  it('renders without reset function and redirects to home on button click', () => {
    const push = jest.fn();
    (useRouter as jest.Mock).mockReturnValue({ push });

    render(<ErrorFallback error={error} header="Oops" />);

    expect(screen.getByText('Oops')).toBeInTheDocument();
    expect(screen.getByText('Test error')).toBeInTheDocument();

    fireEvent.click(screen.getByRole('button'));
    expect(push).toHaveBeenCalledWith('/');
  });

  it('shows fallback message if handleError does not return message', () => {
    (handleError as jest.Mock).mockReturnValueOnce({});

    render(<ErrorFallback error={error} header="Oops again" />);
    expect(
      screen.getByText('An unexpectged error occurred.')
    ).toBeInTheDocument();
  });
});
