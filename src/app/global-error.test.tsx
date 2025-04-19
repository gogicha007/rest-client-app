import { render, screen } from '@testing-library/react';
import GlobalError from '@/app/global-error';
import { ErrorFallbackProps } from '@/components/ErrorFallback';
import '@testing-library/jest-dom';

jest.mock('@/components/ErrorFallback', () => ({
  __esModule: true,
  default: ({ error, reset, header }: ErrorFallbackProps) => (
    <div data-testid="error-fallback">
      <p>{header}</p>
      <p>{error.message}</p>
      <button onClick={reset}>Reset</button>
    </div>
  ),
}));

jest.mock('next-intl', () => ({
  useTranslations: () => (key: string) =>
    ({
      pageError: 'Something went wrong!',
    })[key] || key,
}));

describe('GlobalError', () => {
  const mockError = new Error('Test error');
  const mockReset = jest.fn();

  it('renders ErrorFallback with translated header and error', () => {
    render(<GlobalError error={mockError} reset={mockReset} />);

    expect(screen.getByTestId('error-fallback')).toBeInTheDocument();
    expect(screen.getByText('Something went wrong!')).toBeInTheDocument();
    expect(screen.getByText('Test error')).toBeInTheDocument();
  });

  it('calls reset function when Reset button is clicked', () => {
    render(<GlobalError error={mockError} reset={mockReset} />);

    const button = screen.getByText('Reset');
    button.click();

    expect(mockReset).toHaveBeenCalled();
  });
});
