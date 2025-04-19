import { render, screen } from '@testing-library/react';
import ErrorPage from './error';
import { ErrorFallbackProps } from '@/components/ErrorFallback';
import '@testing-library/jest-dom';

jest.mock('@/components/ErrorFallback', () => ({
  __esModule: true,
  default: ({ error, reset, header }: ErrorFallbackProps) => (
    <div data-testid="error-fallback">
      <h1>{header}</h1>
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

describe('<ErrorPage />', () => {
  const mockError = new Error('Login failed');
  const mockReset = jest.fn();

  it('renders ErrorFallback with translated header and error message', () => {
    render(<ErrorPage error={mockError} reset={mockReset} />);

    expect(screen.getByTestId('error-fallback')).toBeInTheDocument();
    expect(screen.getByText('Something went wrong!')).toBeInTheDocument();
  });

  it('calls reset function when reset button is clicked', () => {
    render(<ErrorPage error={mockError} reset={mockReset} />);

    screen.getByText('Reset').click();

    expect(mockReset).toHaveBeenCalled();
  });
});
