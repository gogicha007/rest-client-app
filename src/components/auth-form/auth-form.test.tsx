import { jest } from '@jest/globals';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import AuthForm from './authForm';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { login } from '../../utils/firebaseConfig';

jest.mock('next/navigation', () => ({
  useRouter: jest.fn(),
}));

jest.mock('next-intl', () => ({
  useTranslations: jest.fn(),
}));

jest.mock('../loader/loader', () => {
  const MockLoader = () => <div data-testid="loader">Loader Component</div>;
  MockLoader.displayName = 'MockLoader';
  return MockLoader;
});

jest.mock('@/utils/firebaseConfig', () => ({
  register: jest.fn(),
  login: jest.fn(),
}));

describe('AuthForm Component', () => {
  const mockPush = jest.fn();
  const mockT = jest.fn((key) => key);

  beforeEach(() => {
    (useRouter as jest.Mock).mockReturnValue({ push: mockPush });
    (useTranslations as jest.Mock).mockReturnValue(mockT);
    jest.clearAllMocks();
  });

  it('renders the form with email and password fields', () => {
    render(<AuthForm authType="login" />);

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  });

  it('disables the submit button when the form is invalid', () => {
    render(<AuthForm authType="login" />);

    const submitButton = screen.getByRole('button', { name: /login/i });
    expect(submitButton).toBeDisabled();
  });

  it('enables the submit button when the form is valid', async () => {
    render(<AuthForm authType="login" />);

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'Password!23' },
    });

    const submitButton = screen.getByRole('button', { name: /login/i });
    await waitFor(() => {
      expect(submitButton).not.toBeDisabled();
    });
  });

  it('calls the appropriate auth function on form submission', async () => {
    const mockLogin = jest.fn<() => Promise<string>>();

    (login as jest.Mock).mockImplementation(mockLogin);
    mockLogin.mockResolvedValueOnce('loggedin');

    render(<AuthForm authType="login" />);

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'Password1?3' },
    });

    const submitButton = screen.getByRole('button', { name: /login/i });

    await waitFor(() => expect(submitButton).not.toBeDisabled());
    await waitFor(() => fireEvent.click(submitButton));
    await waitFor(() => {
      expect(mockLogin).toHaveBeenCalledWith('test@example.com', 'Password1?3');
    });
  });

  it('displays an error message when an error occurs', async () => {
    const mockLogin = jest
      .fn<() => Promise<never>>()
      .mockRejectedValue(new Error('Invalid credentials'));

    (login as jest.Mock).mockImplementation(mockLogin);
    mockLogin.mockRejectedValueOnce('error');

    render(<AuthForm authType="login" />);

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'Password1?3' },
    });

    const submitButton = screen.getByRole('button', { name: /login/i });
    await waitFor(() => expect(submitButton).not.toBeDisabled());
    await waitFor(() => fireEvent.click(submitButton));

    await waitFor(() => {
      expect(screen.getByText(/error/i)).toBeInTheDocument();
    });
  });

  it('renders the Loader component when loading is true', async () => {
    (login as jest.Mock).mockImplementation(
      () => new Promise((resolve) => setTimeout(() => resolve({}), 100))
    );

    render(<AuthForm authType="login" />);

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'Password1?3' },
    });

    const submitButton = screen.getByRole('button', { name: /login/i });
    await waitFor(() => expect(submitButton).not.toBeDisabled());
    await waitFor(() => fireEvent.click(submitButton));

    await waitFor(() => {
      expect(screen.getByTestId('loader')).toBeInTheDocument();
    });
  });
});
