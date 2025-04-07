import { jest } from '@jest/globals';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import AuthForm from './authForm';
import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { login } from '../../utils/firebaseConfig';
import { UserCredential } from 'firebase/auth';

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

  // it('renders the form with email and password fields', () => {
  //   render(<AuthForm authType="login" />);

  //   expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
  //   expect(screen.getByLabelText(/password/i)).toBeInTheDocument();
  //   expect(screen.getByRole('button', { name: /login/i })).toBeInTheDocument();
  // });

  // it('disables the submit button when the form is invalid', () => {
  //   render(<AuthForm authType="login" />);

  //   const submitButton = screen.getByRole('button', { name: /login/i });
  //   expect(submitButton).toBeDisabled();
  // });

  // it('enables the submit button when the form is valid', async () => {
  //   render(<AuthForm authType="login" />);

  //   fireEvent.change(screen.getByLabelText(/email/i), {
  //     target: { value: 'test@example.com' },
  //   });
  //   fireEvent.change(screen.getByLabelText(/password/i), {
  //     target: { value: 'Password!23' },
  //   });

  //   const submitButton = screen.getByRole('button', { name: /login/i });
  //   await waitFor(() => {
  //     expect(submitButton).not.toBeDisabled();
  //   });
  // });

  it('calls the appropriate auth function on form submission', async () => {
    const mockUserCredential: UserCredential = {
      user: {
        uid: '12345',
        email: 'test@example.com',
        displayName: 'Test User',
        photoURL: null,
        emailVerified: true,
        phoneNumber: null,
        isAnonymous: false,
        metadata: {},
        providerData: [],
        getIdToken: jest.fn(() => Promise.resolve('mocked-token')),
        // getIdTokenResult: jest.fn(() => Promise.resolve({} as any)),
        reload: jest.fn(() => Promise.resolve()),
        delete: jest.fn(() => Promise.resolve()),
        refreshToken: 'mocked-refresh-token',
        tenantId: 'mocked-tenant-id',
        toJSON: jest.fn(() => ({})),
        providerId: 'mocked-provider-id',
      },
      providerId: null,
      operationType: 'signIn',
    };
    (login as jest.Mock).mockResolvedValueOnce(mockUserCredential);

    render(<AuthForm authType="login" />);

    fireEvent.change(screen.getByLabelText(/email/i), {
      target: { value: 'test@example.com' },
    });
    fireEvent.change(screen.getByLabelText(/password/i), {
      target: { value: 'Password1?3' },
    });

    const submitButton = screen.getByRole('button', { name: /login/i });

    await waitFor(()=>expect(submitButton).not.toBeDisabled());
    await waitFor(() => fireEvent.click(submitButton));
    await waitFor(() => {
      expect(login).toHaveBeenCalledWith('test@example.com', 'Password1?3');
    });
  });

  // it('displays an error message when an error occurs', async () => {
  //   const mockLogin = jest.fn().mockRejectedValue(new Error('Invalid credentials'));
  //   jest.mocked(require('@/utils/firebaseConfig').login).mockImplementation(mockLogin);

  //   render(<AuthForm authType="login" />);

  //   fireEvent.change(screen.getByLabelText(/email/i), {
  //     target: { value: 'test@example.com' },
  //   });
  //   fireEvent.change(screen.getByLabelText(/password/i), {
  //     target: { value: 'password123' },
  //   });

  //   const submitButton = screen.getByRole('button', { name: /login/i });
  //   fireEvent.click(submitButton);

  //   await waitFor(() => {
  //     expect(screen.getByText(/error: invalid credentials/i)).toBeInTheDocument();
  //   });
  // });

  // it('renders the Loader component when loading is true', async () => {
  //   render(<AuthForm authType="login" />);

  //   fireEvent.change(screen.getByLabelText(/email/i), {
  //     target: { value: 'test@example.com' },
  //   });
  //   fireEvent.change(screen.getByLabelText(/password/i), {
  //     target: { value: 'password123' },
  //   });

  //   const submitButton = screen.getByRole('button', { name: /login/i });
  //   fireEvent.click(submitButton);

  //   expect(screen.getByTestId('loader')).toBeInTheDocument();
  // });
});
